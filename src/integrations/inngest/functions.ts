import prisma from "@/lib/db";
import { inngest } from "./client";
import {
  getPullRequestDifference,
  getRepositoryFileContents,
  postReviewComment,
} from "@/_module/repository/lib/github";
import { indexCodebase, retrieveContext } from "@/_module/ai/lib/rag";
import { getReviewPrompt } from "@/_module/ai/prompts/reviews";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export const inngestPing = inngest.createFunction(
  { id: "inngest-server-ping", triggers: [{ event: "test/hello.world" }] },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

// Repository Indexing Function

export const indexRepository = inngest.createFunction(
  {
    id: "index-repository",
    triggers: [{ event: "repository.connected" }],
  },
  async ({ event, step }) => {
    const { owner, repository, userId } = event.data;

    // Fetch repository files and index them in Pinecone
    const files = await step.run("fetch-files", async () => {
      const account = await prisma.account.findFirst({
        where: {
          userId,
          providerId: "github",
        },
      });

      if (!account?.accessToken) throw new Error("No Github access token found!");

      return await getRepositoryFileContents(account.accessToken, owner, repository);
    });
    await step.run("index-codebase", async () => {
      // Dynamically import the RAG module to avoid circular dependencies
      await indexCodebase(`${owner}/${repository}`, files);
    });

    return { success: true, indexCodebasedFiles: files.length };
  },
);

// Pull Request Review Function
export const reviewPullRequest = inngest.createFunction(
  {
    id: "review-pull-request",
    triggers: [{ event: "code_review_requested" }],
    concurrency: 5,
  },
  async ({ event, step }) => {
    const { owner, repository, pull_request_number } = event.data;

    const { pullRequestDiff, title, description, token } = await step.run(
      "fetch-pull-request-files",
      async () => {
        const account = await prisma.account.findFirst({
          where: {
            userId: event.data.userId,
            providerId: "github",
          },
        });

        if (!account?.accessToken) throw new Error("No Github access token found!");

        const data = await getPullRequestDifference(
          owner,
          repository,
          pull_request_number,
          account.accessToken,
        );

        return {
          ...data,
          token: account.accessToken,
        };
      },
    );

    const context = await step.run("fetch-repository-context", async () => {
      const query = `What files in the repository are relevant to this pull request based on the following title and description? Title: ${title} Description: ${description}`;

      // Retrieve top 5 relevant documents with a max token
      return await retrieveContext(`${owner}/${repository}`, query, 5);
    });

    const review = await step.run("generate-ai-review", async () => {
      const query = getReviewPrompt(title, description, pullRequestDiff, context);

      const { text } = await generateText({
        model: google("gemini-2.0-flash"),
        prompt: query,
      });

      return text;
    });

    await step.run("post-review-comment", async () => {
      await postReviewComment(owner, repository, pull_request_number, review, token);
    });

    await step.run("save-review", async () => {
      const repositoryInstance = await prisma.repository.findFirst({
        where: {
          owner,
          name: repository,
        },
      });

      if (!repositoryInstance) throw new Error("Repository not found in database");

      // Save the review in the database
      await prisma.review.create({
        data: {
          repositoryId: repositoryInstance.id,
          pullRequestNumber: pull_request_number,
          pullRequestTitle: title,
          pullRequestUrl: `https://github.com/${owner}/${repository}/pull/${pull_request_number}`,
          review,
          status: "completed",
        },
      });
    });

    return { success: true, review };
  },
);

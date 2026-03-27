import prisma from "@/lib/db";
import { inngest } from "./client";
import { getRepositoryFileContents } from "@/_module/repository/lib/github";
import { indexCodebase } from "@/_module/ai/lib/rag";

export const inggestPing = inngest.createFunction(
  { id: "inngest-server-ping", triggers: [{ event: "test/hello.world" }] },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

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

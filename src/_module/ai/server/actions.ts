"use server";

import { getPullRequestDifference } from "@/_module/repository/lib/github";
import { inngest } from "@/integrations/inngest/client";
import prisma from "@/lib/db";

export async function reviewPullRequest(owner: string, repository: string, pull_request_number: number) {
  try {
    const repositoryInstance = await prisma.repository.findFirst({
      where: {
        owner,
        name: repository,
      },
      include: {
        user: {
          include: {
            accounts: {
              where: {
                providerId: "github",
              },
            },
          },
        },
      },
    });

    if (!repositoryInstance) throw new Error("Repository not found");

    const githubAccount = repositoryInstance.user.accounts[0];

    if (!githubAccount?.accessToken) throw new Error("GitHub account access token not found for the user");

    const { title } = await getPullRequestDifference(owner, repository, pull_request_number, githubAccount.accessToken);

    await inngest.send({
      name: "code_review_requested",
      data: {
        owner,
        repository,
        pull_request_number,
        userId: repositoryInstance.userId,
      },
    });

    return {
      success: true,
      message: "Code review requested successfully",
      pull_request_title: title,
    };
  } catch (error) {
    try {
      const failedRepository = await prisma.repository.findFirst({
        where: {
          owner,
          name: repository,
        },
      });

      if (failedRepository) {
        await prisma.review.create({
          data: {
            repositoryId: failedRepository.id,
            pullRequestNumber: pull_request_number,
            pullRequestTitle: `Failed to review PR #${pull_request_number}`,
            pullRequestUrl: `https://github.com/${owner}/${repository}/pull/${pull_request_number}`,
            review: `An error occurred while trying to review this pull request: ${error instanceof Error ? error.message : "Unknown error"}`,
            status: "failed",
          },
        });
      }
    } catch (dbError) {
      console.error("Error logging failed review to database", dbError);
    }

    return {
      success: false,
      message: "Failed to request code review",
      error,
    };
  }
}

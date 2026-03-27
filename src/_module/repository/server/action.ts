"use server";

import { getAppSession } from "@/lib/sessions";
import { createWebhook, getRepositories } from "../lib/github";
import prisma from "@/lib/db";
import { inngest } from "@/integrations/inngest/client";

export const getAllRepositories = async (page: number = 1, perPage: number = 10) => {
  const session = await getAppSession();

  const githubRepos = await getRepositories(page, perPage);

  const dbRepositories = await prisma.repository.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const connectedRepositoriesIds = new Set(dbRepositories.map((repository) => repository.githubId));

  return githubRepos.map((repository) => ({
    ...repository,
    isConnected: connectedRepositoriesIds.has(BigInt(repository.id)),
  }));
};

export const connectRepository = async (owner: string, repository: string, githubId: number) => {
  const session = await getAppSession();

  //* TODO: CHECK IF USER CAN CONNECT MORE REPO
  const webhook = await createWebhook(owner, repository);

  if (webhook) {
    await prisma.repository.create({
      data: {
        githubId: BigInt(githubId),
        name: repository,
        owner,
        fullName: `${owner}/${repository}`,
        url: `https://github.com/${owner}/${repository}`,
        userId: session.user.id,
      },
    });
  }

  //* INCREMENT REPOSITORY COUND FOR USAGE TRACKING

  // TRIGGER REPOSITORY INDEXING FOR RAG (FIRE AND FORGET)
  try {
    await inngest.send({
      name: "repository.connected",
      data: {
        owner,
        repository,
        userId: session.user.id,
      },
    });
  } catch (error) {
    console.error("Failed to trigger repository indexing: ", error);
  }

  return webhook;
};

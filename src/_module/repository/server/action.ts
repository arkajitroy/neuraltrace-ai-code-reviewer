"use server";

import { getAppSession } from "@/lib/sessions";
import { createWebhook, getRepositories } from "../lib/github";
import prisma from "@/lib/db";

export const getAllRepositories = async (page: number = 1, perPage: number = 10) => {
  const session = await getAppSession();

  const githubRepos = await getRepositories(page, perPage);

  const dbRepositories = await prisma.repository.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const connectedRepositoriesIds = new Set(dbRepositories.map((repo) => repo.githubId));

  return githubRepos.map((repo) => ({
    ...repo,
    isConnected: connectedRepositoriesIds.has(BigInt(repo.id)),
  }));
};

export const connectRepository = async (owner: string, repo: string, githubId: number) => {
  const session = await getAppSession();

  //* TODO: CHECK IF USER CAN CONNECT MORE REPO
  const webhook = await createWebhook(owner, repo);

  if (webhook) {
    await prisma.repository.create({
      data: {
        githubId: BigInt(githubId),
        name: repo,
        owner,
        fullName: `${owner}/${repo}`,
        url: `https://github.com/${owner}/${repo}`,
        userId: session.user.id,
      },
    });
  }

  //* INCREMENT REPOSITORY COUND FOR USAGE TRACKING

  //* TRIGGER REPOSITORY INDEXING FOR RAG (FIRE AND FORGET)

  return webhook;
};

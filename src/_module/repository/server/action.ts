"use server";

import { auth } from "@/lib/auth";
import { getAppSession } from "@/lib/sessions";
import { getRepositories } from "../lib/github";
import prisma from "@/lib/db";

export const getAllRepositories = async (page: number = 1, perPage: number = 10) => {
  const session = await getAppSession();

  const githubRepos = await getRepositories(page, perPage);

  const dbRepositories = await prisma.repository.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const connectedRepoIds = new Set(dbRepositories.map((repo) => repo.githubId));

  return githubRepos.map((repo: any) => ({
    ...repo,
    isConnected: connectedRepoIds.has(BigInt(repo.id)),
  }));
};

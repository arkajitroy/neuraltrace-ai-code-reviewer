"use server";

import { deleteWebhook } from "@/_module/repository/lib/github";
import prisma from "@/lib/db";
import { getAppSession } from "@/lib/sessions";
import { revalidatePath } from "next/cache";

export async function getUserProfile() {
  try {
    const session = await getAppSession();

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user profile", error);
    return null;
  }
}

export async function updateUserProfile(data: { name?: string; email?: string }) {
  try {
    const session = await getAppSession();

    const updateUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: data.name,
        email: data.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    revalidatePath("/settings", "page");

    return {
      success: true,
      user: updateUser,
    };
  } catch (error) {
    console.log("Error while updating user", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function getConnectedRepos() {
  try {
    const session = await getAppSession();

    const repositories = await prisma.repository.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        fullName: true,
        url: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return repositories;
  } catch (error) {
    console.log("Error fetching connected repos", error);
    return [];
  }
}

export async function disconnectRepository(repositoryId: string) {
  try {
    const session = await getAppSession();

    const repository = await prisma.repository.findUnique({
      where: {
        id: repositoryId,
        userId: session.user.id,
      },
    });

    if (!repository) {
      throw new Error("Repository not found");
    }

    await deleteWebhook(repository.owner, repository.name);

    await prisma.repository.delete({
      where: {
        id: repositoryId,
        userId: session.user.id,
      },
    });

    revalidatePath("/settings", "page");
    revalidatePath("/repositories", "page");

    return {
      success: true,
    };
  } catch (error) {
    console.log("Error while disconnecting the webhook", error);
    return {
      success: false,
      error: "Failed to disconnect repository",
    };
  }
}

export async function disconnectAllRepository() {
  try {
    const session = await getAppSession();

    const repositories = await prisma.repository.findMany({
      where: {
        userId: session.user.id,
      },
    });

    await Promise.all(
      repositories.map(async (repo) => {
        await deleteWebhook(repo.owner, repo.name);
      }),
    );

    const result = await prisma.repository.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    revalidatePath("/settings");
    revalidatePath("/repositories", "page");

    return { success: true, count: result.count };
  } catch (error) {
    console.log("Error disconnecting repos: ", error);
    return { success: false, error: "Failed to disconnect repos" };
  }
}

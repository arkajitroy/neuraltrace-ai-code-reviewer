"use server";

import prisma from "@/lib/db";
import { getAppSession } from "@/lib/sessions";

export const getReviews = async () => {
  try {
    const session = await getAppSession();

    const reviews = await prisma.review.findMany({
      where: {
        repository: {
          userId: session.user.id,
        },
      },
      include: {
        repository: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return reviews;
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    throw error;
  }
};

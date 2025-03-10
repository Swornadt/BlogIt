"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const likeDislikeToggle = async (articleId: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be logged in!");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) {
    throw new Error("User does not exist.");
  }

  //checls if user already has liked an their id is there
  const existingLike = await prisma.like.findFirst({
    where: {
      articleId,
      userId: user.id,
    },
  });
  let updatedLikeCount: number;
  let newIsLiked: boolean;
  if (existingLike) {
    // User has liked before → Remove like
    await prisma.like.delete({ where: { id: existingLike.id } });
    newIsLiked = false;
  } else {
    // User hasn't liked before → Add like
    await prisma.like.create({
      data: { articleId, userId: user.id },
    });
    newIsLiked = true;
  }

  updatedLikeCount = await prisma.like.count({
    where:{
        articleId
    }
  });

  revalidatePath(`/articles/${articleId}`);

  return { likeCount: updatedLikeCount, isLiked: newIsLiked };

};

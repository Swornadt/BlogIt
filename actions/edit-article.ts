"use server"; //directive
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { prisma } from "@/lib/prisma";

//declaring the configurations from env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
//schema for the articles using Zod
const createArticleSchema = z.object({
  title: z.string().min(3).max(100),
  category: z.string().min(3).max(50),
  content: z.string().min(10),
});
//type-making the articles
type CreateArticlesFormState = {
  errors: {
    title?: string[];
    category?: string[];
    ftdImg?: string[];
    content?: string[];
    formErrors?: string[];
  };
};

export const editArticle = async (
  articleId: string,
  prevState: CreateArticlesFormState,
  formData: FormData
): Promise<CreateArticlesFormState> => {
  const result = createArticleSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    content: formData.get("content"),
  });

  if (!result.success) {
    console.log("Validation failed:", result.error.flatten().fieldErrors);
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { userId } = await auth();
  if (!userId) {
    console.log("User authentication failed");
    return {
      errors: {
        formErrors: ["You have to login first"],
      },
    };
  }

  //finding if the article exists
  const existingArticle = await prisma.article.findUnique({
    where: { id: articleId },
  });
  if (!existingArticle) {
    return {
      errors: { formErrors: ["Article Not Found"] },
    };
  }

  //checking if the user exists who is creating
  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!existingUser || existingArticle.authorId !== existingUser.id) {
    return {
      errors: {
        formErrors: ["User not found. Please register first."],
      },
    };
  }

  //editing article finally

  let imageUrl = existingArticle?.featuredImage;

  //image validation
  const imageFile = formData.get("ftdImg") as File | null;
  if (imageFile && imageFile.name !== "undefined") {
    try {
      //converting img to a buffer
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      //uploading to cloudinary
      const uploadResponse: UploadApiResponse | undefined = await new Promise(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(buffer);
        }
      );
      if (uploadResponse?.secure_url) {
        imageUrl = uploadResponse.secure_url;
      } else {
        return {
          errors: {
            ftdImg: ["Failed to upload image."],
          },
        };
      }
    } catch (error) {
      return {
        errors: {
          formErrors: ["Error uploading image"],
        },
      };
    }
  }

  if (!imageUrl) {
    console.log("Image upload failed");
    return {
      errors: {
        ftdImg: ["Failed to upload image. Please try again."],
      },
    };
  }

  try {
    await prisma.article.update({
      where: { id: articleId },
      data: {
        title: result.data.title,
        category: result.data.category,
        content: result.data.content,
        featuredImage: imageUrl,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Database error:", error);
      return {
        errors: {
          formErrors: [error.message],
        },
      };
    } else {
      return {
        errors: {
          formErrors: ["Some internal server error occured."],
        },
      };
    }
  }

  revalidatePath("/dashboard"); //refreshes and updates the data
  redirect("/dashboard");
};

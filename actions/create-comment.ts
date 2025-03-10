"use server"
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {z} from "zod";

const createCommentSchema = z.object({
    body:z.string().min(1)
})
type CreateCommentFormState = {
    errors:{
        body?: string[],
        formErrors?: string[]
    }
}
export const createComment = async (articleId: string, prevState:CreateCommentFormState, formData:FormData) : Promise<CreateCommentFormState> => {
    const result = createCommentSchema.safeParse({body:formData.get('body')});
    if(!result.success){
        return{
            errors: result.error.flatten().fieldErrors
        }
    }
    const {userId} = await auth();
    if (!userId) {
        return{
            errors:{
                formErrors:['You must login first!']
            }
        }
    }

    const existingUser = await prisma.user.findUnique({where:{clerkUserId:userId}});
    if(!existingUser) {
        return{
            errors:{
                formErrors:['User not found.']
            }
        }
    }

    //validation done, now create comment
    try {
        await prisma.comment.create({
            data:{
                body:result.data.body,
                authorId:existingUser.id,
                articleId
            }
        });
    } catch (error:unknown) {
        if(error instanceof Error) {
            return({
                errors:{
                    formErrors:['Internal server error.']
                }
            })
        }
    }

    revalidatePath(`article/${articleId}`)
    return {errors:{}}
}
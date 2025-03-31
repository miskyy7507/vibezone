import { z } from "zod";
import { Schema } from "mongoose";

export interface IPost {
    authorId: Schema.Types.ObjectId;
    content: string;
    imageUrl: string;
    usersWhoLiked: Schema.Types.ObjectId[];
}

export const postSchema: z.ZodType<IPost> = z.object({
    authorId: z.instanceof(Schema.Types.ObjectId),
    content: z
        .string()
        .nonempty("Post content cannot be empty")
        .max(280, "Post content cannot be more than 280 characters"),
    imageUrl: z.string().url("Invalid image URL"),
    usersWhoLiked: z.instanceof(Schema.Types.ObjectId).array(),
});

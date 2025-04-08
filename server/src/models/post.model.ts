import { Schema, model } from "mongoose";

import { IPost } from "../interfaces/post.interface.js";

export const PostModel = model<IPost>(
    "Post",
    new Schema(
        {
            authorId: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            content: { type: String, required: true },
            imageUrl: { type: String },
            usersWhoLiked: [{ type: Schema.Types.ObjectId, ref: "User" }],
        },
        {
            timestamps: true,
        }
    )
);

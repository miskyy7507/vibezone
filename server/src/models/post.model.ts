import { Schema, model } from "mongoose";

import type { IPost } from "../interfaces/post.interface.js";

export const PostModel = model<IPost>(
    "Post",
    new Schema<IPost>(
        {
            author: {
                type: Schema.Types.ObjectId,
                ref: "Profile",
                required: true,
                immutable: true,
            },
            content: { type: String, required: true },
            imageUrl: { type: String },
            usersWhoLiked: [{ type: Schema.Types.ObjectId, ref: "Profile", required: true }],
            commentCount: { type: Number, required: true, default: 0 }
        },
        {
            timestamps: true,
        }
    )
);

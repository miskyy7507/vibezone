import { Schema, model } from "mongoose";

import { IPost } from "../interfaces/post.interface.js";

const PostSchema = new Schema<IPost>(
    {
        authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        imageUrl: { type: String },
        usersWhoLiked: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    {
        timestamps: true,
    }
);

export default model<IPost>("Post", PostSchema);

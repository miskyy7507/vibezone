import { model, Schema } from "mongoose";

import type { IComment } from "../interfaces/comment.interface.js";

export const CommentModel = model<IComment>(
    "Comment",
    new Schema<IComment>({
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
            immutable: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
            immutable: true,
        },
        content: {
            type: String,
            required: true,
            max: 150
        },
        usersWhoLiked: [{ type: Schema.Types.ObjectId, ref: "Profile", required: true, default: [] }],
    })
);

import { CommentModel } from "../models/comment.model.js";

import type { IComment } from "../interfaces/comment.interface.js";
import type { Types } from "mongoose";

export class CommentService {
    public async createComment(comment: Omit<IComment, "usersWhoLiked">) {
        const model = new CommentModel(comment);
        const newComment = await model.save();
        return await newComment.populate(
            "user",
            "username displayName profilePictureUri"
        );
    }

    public async getAllPostsComments(postId: Types.ObjectId) {
        const comments1 = await CommentModel.find({ "post": postId }).populate(
            "user",
            "username displayName profilePictureUri"
        ).lean();

        return comments1;
    }
}

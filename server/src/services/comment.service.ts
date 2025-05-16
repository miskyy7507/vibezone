import { CommentModel } from "../models/comment.model.js";
import { PostModel } from "../models/post.model.js";

import type { IComment } from "../interfaces/comment.interface.js";
import type { Types } from "mongoose";
import type { IProfile } from "../interfaces/profile.interface.js";

type PopulatedComment = Omit<IComment, "user"> & {
    _id: Types.ObjectId;
    createdAt: string,
    user: Pick<
        IProfile,
        "username" | "displayName" | "profilePictureUri"
    > & {
        _id: Types.ObjectId;
    };
};

export class CommentService {
    private populatedCommentPipeline(profileId?: Types.ObjectId) {
        return [
            {
                $lookup: {
                    from: "profiles",
                    localField: "user",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $project: {
                                username: true,
                                displayName: true,
                                profilePictureUri: true,
                            },
                        },
                    ],
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $set: {
                    likeCount: { $size: "$usersWhoLiked" },
                    isLikedByUser: { $in: [profileId, "$usersWhoLiked"] },
                },
            },
            {
                $unset: ["usersWhoLiked"],
            },
        ]
    }

    public async createComment(comment: Omit<IComment, "usersWhoLiked">) {
        const model = new CommentModel(comment);
        const newComment = await model.save();

        await PostModel.findByIdAndUpdate(newComment.post, { $inc: { commentCount: 1 } });

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return (await this.getById(newComment._id))!;
    }

    public async getById(id: Types.ObjectId, profileId?: Types.ObjectId) {
        const comment = await CommentModel.aggregate<PopulatedComment>([
            { $match: { _id: id } },
            ...this.populatedCommentPipeline(profileId),
        ]);

        return comment[0] || null;
    }

    public async getAllPostsComments(
        postId: Types.ObjectId,
        profileId?: Types.ObjectId
    ) {
        return await CommentModel.aggregate<PopulatedComment>([
            { $match: { post: postId } },
            ...this.populatedCommentPipeline(profileId),
            { $sort: { createdAt: -1 } }
        ]);
    }

    // public async getPostCommentsCount(postId: Types.ObjectId) {
    //     return await CommentModel.countDocuments({ post: postId });
    // }

    public async removeCommentById(id: Types.ObjectId) {
        const removedComment = await CommentModel.findByIdAndDelete(id);
        if (!removedComment) return null;

        await PostModel.findByIdAndUpdate(removedComment.post, { $inc: { commentCount: -1 } });

        return removedComment;
    }

    // public async removeUserComments(userId: Types.ObjectId) {
    //     return await CommentModel.deleteMany({ user: userId });
    // }

    public async likeComment(id: Types.ObjectId, userId: Types.ObjectId) {
        await CommentModel.findByIdAndUpdate(id, {
            $addToSet: { usersWhoLiked: userId },
        });
    }

    public async unlikeComment(id: Types.ObjectId, userId: Types.ObjectId) {
        await CommentModel.findByIdAndUpdate(id, {
            $pull: { usersWhoLiked: userId },
        });
    }
}

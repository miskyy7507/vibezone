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
        const post = await PostModel.findById(comment.post);
        if (!post) return null;

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
        const post = await PostModel.findById(postId);
        if (!post) return null;

        return await CommentModel.aggregate<PopulatedComment>([
            { $match: { post: postId } },
            ...this.populatedCommentPipeline(profileId),
            { $sort: { createdAt: -1 } }
        ]);
    }

    public async removeCommentById(id: Types.ObjectId) {
        const removedComment = await CommentModel.findByIdAndDelete(id);
        if (!removedComment) return null;

        await PostModel.findByIdAndUpdate(removedComment.post, { $inc: { commentCount: -1 } });

        return removedComment;
    }

    public async removeUserComments(userId: Types.ObjectId) {
        // Remove all users comments while also keeping track of comment count in each post document.
        // 1. Use aggregation to calculate the user comments count for each post
        const userCommentsCount: {_id: Types.ObjectId, comments: number}[] = await CommentModel.aggregate([
            {
                $match: {
                    user: userId
                }
            },
            {
                $group: {
                    _id: "$post", // group by the post ID
                    comments: { $sum: 1 }
                }
            }
        ]);

        if (userCommentsCount.length === 0) {
            return { deletedCount: 0, updatedPosts: 0 };
        }

        // 2. Delete all comments by the user
        const deleteResult = await CommentModel.deleteMany({ user: userId });

        // 3. Update the commentCount for each affected post
        const updatePromises: Promise<unknown>[] = [];
        for (const d of userCommentsCount) {
            updatePromises.push(
                PostModel.findByIdAndUpdate(
                    d._id,
                    { $inc: { commentCount: -(d.comments) } }
                )
            );
        }

        await Promise.all(updatePromises);

        return {
            deletedCount: deleteResult.deletedCount,
            updatedPosts: updatePromises.length
        };
    }

    public async likeComment(id: Types.ObjectId, userId: Types.ObjectId) {
        return await CommentModel.findByIdAndUpdate(id, {
            $addToSet: { usersWhoLiked: userId },
        });
    }

    public async unlikeComment(id: Types.ObjectId, userId: Types.ObjectId) {
        return await CommentModel.findByIdAndUpdate(id, {
            $pull: { usersWhoLiked: userId },
        });
    }
}

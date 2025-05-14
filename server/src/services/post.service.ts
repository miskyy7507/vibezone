import { PostModel } from "../models/post.model.js";

import type { Types } from "mongoose";
import type { IPost } from "../interfaces/post.interface.js";
import type { IProfile } from "../interfaces/profile.interface.js";

type PopulatedPost = Omit<IPost, "author"> & {
    _id: Types.ObjectId;
    createdAt: string,
    author: Pick<
        IProfile,
        "username" | "displayName" | "profilePictureUri"
    > & {
        _id: Types.ObjectId;
    };
};

export class PostService {
    private populatedPostPipeline(profileId?: Types.ObjectId) {
        return [
            {
                $lookup: {
                    from: "profiles",
                    localField: "author",
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
                    as: "author",
                },
            },
            { $unwind: "$author" },
            {
                $set: {
                    likesCount: { $size: "$usersWhoLiked" },
                    likedByUser: { $in: [profileId, "$usersWhoLiked"] },
                },
            },
            {
                $unset: ["usersWhoLiked"],
            },
        ];
    }

    public async createPost(post: Omit<IPost, "usersWhoLiked">) {
        const postModel = new PostModel(post);
        const newPost = await postModel.save();
        return await newPost.populate(
            "author",
            "username displayName profilePictureUri"
        );
    }

    public async getById(id: Types.ObjectId, profileId?: Types.ObjectId) {
        const posts = await PostModel.aggregate<PopulatedPost>([
            { $match: { _id: id } },
            ...this.populatedPostPipeline(profileId),
        ]);

        return posts[0] || null;
    }

    public async getAllPosts(profileId?: Types.ObjectId) {
        return await PostModel.aggregate<PopulatedPost>([
            ...this.populatedPostPipeline(profileId),
        ]);
    }

    public async removePostId(id: Types.ObjectId) {
        return await PostModel.findByIdAndDelete(id);
    }

    public async removeUserPosts(id: Types.ObjectId) {
        return await PostModel.deleteMany({ author: id });
    }

    public async likePost(id: Types.ObjectId, userId: Types.ObjectId) {
        await PostModel.findByIdAndUpdate(id, {
            $addToSet: { usersWhoLiked: userId },
        });
    }

    public async unlikePost(id: Types.ObjectId, userId: Types.ObjectId) {
        await PostModel.findByIdAndUpdate(id, {
            $pull: { usersWhoLiked: userId },
        });
    }
}

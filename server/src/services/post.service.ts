import { PostModel } from "../models/post.model.js";

import type { Types } from "mongoose";
import type { IPost } from "../interfaces/post.interface.js";
import type { IProfile } from "../interfaces/profile.interface.js";

type PopulatedPost = Omit<IPost, "author"> & {
    _id: Types.ObjectId;
    author: Pick<
        IProfile,
        "username" | "displayName" | "profilePictureUri"
    > & {
        _id: Types.ObjectId;
    };
};

export class PostService {
    public async createPost(post: IPost) {
        const postModel = new PostModel(post);
        const newPost = await postModel.save();
        return await newPost.populate(
                "author",
                "username displayName profilePictureUri"
            );
    }

    public async getById(id: Types.ObjectId, profileId?: Types.ObjectId) {
        const post: PopulatedPost | null = await PostModel.findById(id)
            .populate<{ author: IProfile & { _id: Types.ObjectId } }>(
                "author",
                "username displayName profilePictureUri"
            )
            .sort({ createdAt: -1 })
            .lean();

        if (!post) {
            return null;
        }

        const result = {
            ...post,
            likeCount: post.usersWhoLiked.length,
            usersWhoLiked: undefined,
            isLikedByUser:
                profileId !== undefined &&
                post.usersWhoLiked.some((id) => id === profileId),
        };
        delete result.usersWhoLiked;

        return result;
    }

    public async getAllPosts(profileId?: Types.ObjectId) {
        const posts: PopulatedPost[] = await PostModel.find()
            .populate<{ author: IProfile & { _id: Types.ObjectId } }>(
                "author",
                "username displayName profilePictureUri"
            )
            .sort({ createdAt: -1 })
            .lean();

        const result = posts.map((post) => {
            const p = {
                ...post,
                likeCount: post.usersWhoLiked.length,
                usersWhoLiked: undefined,
                isLikedByUser:
                    profileId !== undefined &&
                    post.usersWhoLiked.some((id) => id.equals(profileId)),
            };

            delete p.usersWhoLiked;

            return p;
        });

        return result;
    }

    public async removePostId(id: Types.ObjectId) {
        return await PostModel.findByIdAndDelete(id);
    }

    public async removeUserPosts(id: Types.ObjectId) {
        return await PostModel.deleteMany({ author: id });
    }

    public async likePost(id: Types.ObjectId, userId?: Types.ObjectId) {
        if (!userId) {
            return;
        }
        await PostModel.findByIdAndUpdate(id, {
            $addToSet: { usersWhoLiked: userId },
        });
    }

    public async unlikePost(id: Types.ObjectId, userId?: Types.ObjectId) {
        if (!userId) {
            return;
        }
        await PostModel.findByIdAndUpdate(id, {
            $pull: { usersWhoLiked: userId },
        });
    }
}

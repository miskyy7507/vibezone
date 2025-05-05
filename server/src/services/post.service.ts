import { PostModel } from "../models/post.model.js";

import type { Types } from "mongoose";
import type { IPost } from "../interfaces/post.interface.js";
import type { IProfile } from "../interfaces/profile.interface.js";

type PopulatedPost = Omit<IPost, "authorId"> & {
    authorId: Pick<
        IProfile,
        "username" | "displayName" | "profilePictureUri"
    > & {
        _id: Types.ObjectId;
    };
};

export class PostService {
    public async createPost(post: IPost) {
        const postModel = new PostModel(post);
        return await postModel.save();
    }

    public async getById(id: Types.ObjectId) {
        const post = await PostModel.findById(id)
            .populate<{ authorId: IProfile & { _id: Types.ObjectId } }>(
                "authorId",
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
        };
        delete result.usersWhoLiked;

        return result;
    }

    public async getAllPosts() {
        const posts: PopulatedPost[] = await PostModel.find()
            .populate<{ authorId: IProfile & { _id: Types.ObjectId } }>(
                "authorId",
                "username displayName profilePictureUri"
            )
            .sort({ createdAt: -1 })
            .lean();

        const result = posts.map((post) => {
            const p = {
                ...post,
                likeCount: post.usersWhoLiked.length,
                usersWhoLiked: undefined,
            };

            delete p.usersWhoLiked;

            return p;
        });

        return result;
    }

    public async removePostId(id: Types.ObjectId) {
        return await PostModel.findByIdAndDelete(id);
    }
}

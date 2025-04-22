import { PostModel } from "../models/post.model.js";

import type { Types } from "mongoose";
import type { IPost } from "../interfaces/post.interface.js";

export class PostService {
    public async createPost(post: Omit<IPost, "usersWhoLiked">) {
        const postModel = new PostModel({
            usersWhoLiked: [],
            ...post
        });
        return await postModel.save();
    }

    public async getById(id: Types.ObjectId) {
        return await PostModel.findById(id);
    }

    public async getAllPosts() {
        return await PostModel.find();
    }

    public async removePostId(id: Types.ObjectId) {
        return await PostModel.findByIdAndDelete(id);
    }
}

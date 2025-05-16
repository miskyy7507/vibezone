import type { Types } from "mongoose";

export interface IPost {
    author: Types.ObjectId;
    content: string;
    imageUrl?: string;
    usersWhoLiked: Types.ObjectId[];
    commentCount: number;
}

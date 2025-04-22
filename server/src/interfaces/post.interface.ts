import type { Types } from "mongoose";

export interface IPost {
    authorId: Types.ObjectId;
    content: string;
    imageUrl?: string;
    usersWhoLiked: Types.ObjectId[];
}

import { User } from "./user.interface";

export interface Post {
    _id: string;
    author: Omit<User, "aboutDesc">;
    content: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
    likeCount: number;
    commentCount: number;
    isLikedByUser: boolean;
}

import { User } from "./user.interface";

export interface Comment {
    _id: string;
    user: User;
    content: string;
    likeCount: number;
    isLikedByUser: boolean;
    createdAt: string;
}

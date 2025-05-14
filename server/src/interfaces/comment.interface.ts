import type { Types } from "mongoose";

export interface IComment {
    post: Types.ObjectId;
    user: Types.ObjectId;
    content: string;
    usersWhoLiked: Types.ObjectId[];
}

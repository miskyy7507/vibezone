import { Schema } from "mongoose";

export interface IPost {
    authorId: Schema.Types.ObjectId;
    content: string;
    imageUrl: string;
    usersWhoLiked: Schema.Types.ObjectId[]; 
}

import type { Types } from "mongoose";

export interface IUser {
    username: string;
    profileId: Types.ObjectId;
    role: "moderator" | "user";
    active: boolean;
    passwordHash: string;
}

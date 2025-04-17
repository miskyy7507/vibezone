import type { Types } from "mongoose";

export interface IUser {
    profileId: Types.ObjectId;
    email: string;
    role: "admin" | "moderator" | "user";
    active: boolean;
    passwordHash: string;
}

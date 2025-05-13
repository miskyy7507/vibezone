import type { Types } from "mongoose";

export interface IUser {
    profileId: Types.ObjectId;
    role: "moderator" | "user";
    active: boolean;
    passwordHash: string;
}

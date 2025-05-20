import { Schema, model } from "mongoose";

import type { IUser } from "../interfaces/user.interface.js";

export const UserModel = model<IUser>(
    "User",
    new Schema<IUser>(
        {
            username: {
                type: String,
                required: true,
                unique: true,
                match: /^[a-zA-Z0-9._-]{3,32}$/,
                immutable: true
            },
            profileId: {
                type: Schema.Types.ObjectId,
                ref: "Profile",
                required: true,
                immutable: true,
            },
            role: {
                type: String,
                enum: ["moderator", "user"],
                default: "user",
                required: true,
            },
            active: { type: Boolean, required: true, default: true },
            passwordHash: { type: String, required: true },
        }
    )
);

import { Schema, model } from "mongoose";

import type { IUser } from "../interfaces/user.interface.js";

export const UserModel = model<IUser>(
    "User",
    new Schema<IUser>(
        {
            profileId: {
                type: Schema.Types.ObjectId,
                ref: "Profile",
                required: true,
                immutable: true,
            },
            email: {
                type: String,
                required: true,
                unique: true,
                match: /^(?!\.)(?!.*\.\.)[a-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}(?<!\.)@(?:(?!-)[a-z0-9-]{1,63}(?<!-)(?:\.|$))+(?<!\.)$/i,
            },
            role: {
                type: String,
                enum: ["moderator", "user"],
                default: "user",
                required: true,
            },
            active: {
                type: Boolean,
                required: true,
                default: true,
            },
            passwordHash: { type: String, required: true },
        },
        {
            timestamps: true,
        }
    )
);

import { Schema, model } from "mongoose";

import { IUser } from "../interfaces/user.interface.js";

export const UserModel = model<IUser>(
    "User",
    new Schema(
        {
            email: { type: String, required: true, unique: true },
            username: { type: String, required: true, unique: true },
            role: {
                type: String,
                enum: ["admin", "moderator", "user"],
                default: "user",
                required: true
            },
            passwordHash: { type: String, required: true },
        },
        {
            timestamps: true,
        }
    )
);

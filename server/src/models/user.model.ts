import { Schema, model } from "mongoose";

import { IUser } from "../interfaces/user.interface.js";

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        displayName: { type: String, required: true },
        role: {
            type: String,
            enum: ["admin", "moderator", "user"],
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

export default model<IUser>("User", UserSchema);

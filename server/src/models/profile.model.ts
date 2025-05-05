import { Schema, model } from "mongoose";

import type { IProfile } from "../interfaces/profile.interface.js";

export const ProfileModel = model<IProfile>(
    "Profile",
    new Schema<IProfile>(
        {
            username: {
                type: String,
                required: true,
                unique: true,
                match: /^[a-zA-Z0-9._-]{3,32}$/,
                immutable: true
            },
            displayName: {
                type: String,
                max: 32
            },
            profilePictureUri: {
                type: String,
            },
            aboutDesc: {
                type: String,
                max: 150
            }
        },
        {
            timestamps: true,
        }
    )
);

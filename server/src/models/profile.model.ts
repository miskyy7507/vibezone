import { Schema, model } from "mongoose";

import { IProfile } from "../interfaces/profile.interface.js";

export const ProfileModel = model<IProfile>(
    "Profile",
    new Schema<IProfile>(
        {
            username: {
                type: String,
                required: true,
                unique: true,
                match: /^[a-zA-Z0-9._-]{3,32}$/
            },
            displayName: {
                type: String,
                required: true,
                max: 40
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

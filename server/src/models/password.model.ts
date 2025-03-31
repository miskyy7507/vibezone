import { Schema, model } from "mongoose";

import { IPassword } from "../interfaces/password.interface.js";

const PasswordSchema = new Schema<IPassword>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true,
    },
    passwordHash: { type: String, required: true },
});

export default model<IPassword>("Password", PasswordSchema);

import { Schema, model } from "mongoose";

import { IToken } from "../interfaces/token.interface.js";

// const tokenTypes = [ tokenTypeEnum.authorization ];

const TokenSchema = new Schema<IToken>({
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    // type: { type: String, enum: tokenTypes, required: true },
    token: { type: String, required: true }
}, {
    timestamps: true
});

export default model<IToken>("Token", TokenSchema);

import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config({ path: process.env.NODE_ENV === "production" ? ".env.production" : ".env.development" });

export const config = {
    nodeEnv: process.env.NODE_ENV === "production" ? "production" : "development",
    serverPort: (process.env.PORT && parseInt(process.env.PORT)) || 5000, // default 5000 if PORT not set or NaN
    databaseUri: process.env.MONGO_URI ?? "",
    imageUploadPath: process.env.IMAGE_UPLOAD_PATH ?? "./uploads",
    sessionSecret: process.env.SESSION_SECRET ?? (() => {
        console.warn("SESSION_SECRET variable has not been set in .env file. Generating a random one for this run.");
        console.warn("Please set this variable to avoid invalidating session tokens every time a server is reset.")
        return crypto.randomBytes(64).toString("hex");
    })(),
} as const

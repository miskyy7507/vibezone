import "dotenv/config";
import crypto from "crypto";

export const config = {
    serverPort: (process.env.PORT && parseInt(process.env.PORT)) || 5000,
    databaseUri: process.env.MONGO_URI || "",
    jwtSecret: process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex")
}

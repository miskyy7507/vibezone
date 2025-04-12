import "dotenv/config";
import crypto from "crypto";

function warnNotSetSecret() {
    console.warn("SESSION_SECRET is not set in .env file. \
        \nGenerated a new secret in the fly, invalidating all previous sessions.");
    return crypto.randomBytes(64).toString("hex");
}

export const config = {
    serverPort: (process.env.PORT && parseInt(process.env.PORT)) || 5000,
    databaseUri: process.env.MONGO_URI || "",
    sessionSecret: process.env.SESSION_SECRET || warnNotSetSecret()
}

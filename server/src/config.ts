import "dotenv/config";
import crypto from "crypto";

function warnNotSetSecret() {
    console.warn("SESSION_SECRET variable has not been set in .env file. Generating a random one for this run.");
    console.warn("Please set this variable to avoid invalidating session tokens every time a server is reset.")
    return crypto.randomBytes(64).toString("hex");
}

export const config = {
    serverPort: (process.env.PORT && parseInt(process.env.PORT)) || 5000,
    databaseUri: process.env.MONGO_URI || "",
    sessionSecret: process.env.SESSION_SECRET || warnNotSetSecret()
}

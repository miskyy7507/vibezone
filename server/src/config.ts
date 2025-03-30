import "dotenv/config";

export const config = {
    serverPort: (process.env.PORT && parseInt(process.env.PORT)) || 5000,
    databaseUri: process.env.MONGO_URI || "",
}

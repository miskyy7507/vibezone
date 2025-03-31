import express from "express";
import mongoose from "mongoose";

import { App } from "./app.js";
import { config } from "./config.js";
import { logger } from "./middleware/logger.js";
import PostController from "./controllers/post.controller.js";
import { AuthController } from "./controllers/auth.controller.js";

// Database connection
try {
    await mongoose.connect(config.databaseUri);
    console.log("Connection with database established");

    mongoose.connection.on("disconnected", () => {
        console.log("MongoDB disconnected.");
    });

    mongoose.connection.on("error", (error) => {
        console.error("MongoDB connection error:", error);
    });
} catch (error) {
    console.error("There was an error trying to connect to the database.\nError message:");
    console.error(error);
    console.error("Exiting.");
    await mongoose.connection.destroy();
    process.exit(1);
}

// API server creation
const app = new App(
    [logger, express.json()],
    [
        new PostController(),
        new AuthController()
    ]
);

app.listen(config.serverPort);


process.on("SIGINT", async () => {
    await mongoose.connection.destroy();
    process.exit(0);
});

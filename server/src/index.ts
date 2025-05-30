import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";

import { App } from "./app.js";
import { config } from "./config.js";
import { PostController } from "./controllers/post.controller.js";
import { AuthController } from "./controllers/auth.controller.js";
import { ProfileController } from "./controllers/profile.controller.js";
import { CommentController } from "./controllers/comment.controller.js";
import { ApiDocsController } from "./controllers/apiDocs.controller.js";
import { errorHandler } from "./middleware/errorHandler.js";

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
    console.error(
        "There was an error trying to connect to the database.\nError message:"
    );
    console.error(error);
    console.error("Exiting.");
    await mongoose.connection.destroy();
    process.exit(1);
}

const sessionOptions: session.SessionOptions = {
    cookie: {
        httpOnly: true,
        // secure: config.nodeEnv === "production" ? true : false,
        maxAge:
            config.nodeEnv === "production"
                ? 7 * 24 * 60 * 60 * 1000
                : 30 * 60 * 1000, // 7 days in milliseconds (30 minutes for testing)
        sameSite: config.nodeEnv === "production" ? "strict" : undefined,
    },
    name: "session",
    unset: "destroy",
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        ttl:
            config.nodeEnv === "production"
                ? 7 * 24 * 60 * 60 * 1000
                : 30 * 60 * 1000,
    }),
};

const middleware = [
    session(sessionOptions),
    express.json(),
    errorHandler,
];

if (config.nodeEnv === "development") {
    const { logger } = await import("./middleware/logger.js");
    const { default: cors } = await import("cors");

    middleware.unshift(
        cors({
            origin: "http://localhost:5173",
            credentials: true,
        }),
        logger
    );
}

// API server creation
const app = new App(
    middleware,
    [
        new ApiDocsController(),
        new PostController(),
        new AuthController(),
        new ProfileController(),
        new CommentController(),
    ],
    { "trust proxy": 1 }
);

app.listen(config.serverPort);

function stopApp() {
    app.closeServer(() => {
        console.log("API server closed.");
        mongoose.connection.destroy().catch(() => {
            console.error("Failed to destroy database connection.");
            process.exit(1);
        });
    });
}

process.on("SIGINT", () => {
    console.log("SIGINT received, winding up!");
    stopApp();
});

process.on("SIGTERM", () => {
    console.log("SIGTERM received, winding up!");
    stopApp();
});

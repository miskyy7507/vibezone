import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";

import { App } from "./app.js";
import { config } from "./config.js";
import { logger } from "./middleware/logger.js";
import { PostController } from "./controllers/post.controller.js";
import { AuthController } from "./controllers/auth.controller.js";
import { ProfileController } from "./controllers/profile.controller.js";

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
        path: "/",
        httpOnly: true,
        secure: false,
        // maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days in milliseconds
        maxAge: 30 * 60 * 1000, // 30 minutes for testing
        sameSite: "strict",
    },
    name: "session",
    unset: "destroy",
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        ttl: 30 * 60, // 30 minutes for testing
    }),
};

/* TODO: do the proper configuration for production
 * when express.js is behind reverse proxy like nginx
 */
// if (app.get('env') === 'production') {
//     app.set('trust proxy', 1) // trust first proxy
//     sess.cookie.secure = true // serve secure cookies
// }

// API server creation
const app = new App(
    [logger, session(sessionOptions), express.json()],
    [new PostController(), new AuthController(), new ProfileController()]
);

app.listen(config.serverPort);

process.on("SIGINT", () => {
    console.log("SIGINT received, winding up!")
    app.closeServer(() => {
        console.log("API server closed.")
        mongoose.connection.destroy(true)
            .catch(() => {
                console.error("Failed to destroy database connection.")
                process.exit(1);
            });
    });
});

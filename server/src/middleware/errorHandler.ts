import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
    console.error("Something went wrong!\nError details:");
    console.error(error);
    return response
        .status(500)
        .json({ error: "Internal server error" });
};

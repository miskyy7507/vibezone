import { Router, RequestHandler } from "express";
import { Types } from "mongoose";

import { Controller } from "../interfaces/controller.interface.js";
import { PostService } from "../services/post.service.js";

export class PostController implements Controller {
    public path = "/api/post";
    public router = Router();
    private postService = new PostService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // this.router.post("/", this.addPost);

        // this.router.get("/all", this.getAllPosts);
        this.router.get("/:id", this.getPostById);

        this.router.delete("/:id", this.removePostById);
    }

    // private addPost: RequestHandler = async (request, response) => {
    //     /* TODO: */
    // };

    // private getAllPosts: RequestHandler = async (request, response) => {
    //     /* TODO: */
    // };

    private getPostById: RequestHandler = (request, response) => {
        const { id } = request.params;

        if (!Types.ObjectId.isValid(id)) {
            return response
                .status(400)
                .json({ success: false, message: "Malformed id" });
        }

        /* TODO: */
    };

    private removePostById: RequestHandler = (request, response) => {
        const { id } = request.params;

        if (!Types.ObjectId.isValid(id)) {
            return response
                .status(400)
                .json({ success: false, message: "Malformed id" });
        }

        /* TODO: */
    };
}

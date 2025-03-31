import {
    Request,
    Response,
    NextFunction,
    Router,
    RequestHandler,
} from "express";
import { Types } from "mongoose";

import Controller from "../interfaces/controller.interface.js";
import PostService from "../services/post.service.js";

export default class PostController implements Controller {
    public path = "/api/post";
    public router = Router();
    private postService = new PostService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/", this.addPost);

        this.router.get("/all", this.getAllPosts);
        this.router.get("/:id", this.getPostById);

        this.router.delete("/:id", this.removePostById);
    }

    private addPost: RequestHandler = async (request, response, next) => {
        /* TODO */
    };

    private getAllPosts = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        /* TODO */
    };

    private getPostById: RequestHandler = async (request, response, next) => {
        const { id } = request.params;

        if (!Types.ObjectId.isValid(id)) {
            return response
                .status(400)
                .json({ success: false, message: "Malformed id" });
        }
    };

    private removePostById = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const { id } = request.params;

        if (!Types.ObjectId.isValid(id)) {
            return response
                .status(400)
                .json({ success: false, message: "Malformed id" });
        }
    };
}

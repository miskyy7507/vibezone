import { Router } from "express";
import { Types } from "mongoose";
import { z } from "zod";

import { PostService } from "../services/post.service.js";
import { imageUpload } from "../middleware/imageUpload.js";
import { verifyImageRealType } from "../middleware/verifyImageRealType.js";
import { auth } from "../middleware/auth.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

import type { Controller } from "../interfaces/controller.interface.js";
import type { RequestHandler } from "express";

export class PostController implements Controller {
    public path = "/post";
    public router = Router();

    private postService = new PostService();

    constructor() {
        this.router.get("/all", this.getAllPosts);
        this.router.get("/:id", validateObjectId("id"), this.getPostById);

        this.router.post("/", auth, this.addPost);

        this.router.delete(
            "/:id",
            validateObjectId("id"),
            auth,
            this.removePostById
        );

        this.router.put(
            "/:id/like",
            validateObjectId("id"),
            auth,
            this.likePost
        );
        this.router.delete(
            "/:id/like",
            validateObjectId("id"),
            auth,
            this.unlikePost
        );

        this.router.post(
            "/image",
            auth,
            imageUpload.single("image"),
            verifyImageRealType,
            this.uploadImage
        );
    }

    private addPost: RequestHandler = async (request, response, next) => {
        try {
            const newPost = await z
                .object({
                    content: z
                        .string()
                        .nonempty("Post content cannot be empty.")
                        .max(
                            150,
                            "Post content cannot be more than 150 characters in length."
                        ),
                    imageUrl: z.string().optional(),
                })
                .parseAsync(request.body);

            const result = await this.postService.createPost({
                author: new Types.ObjectId(request.session.profileId),
                ...newPost,
            });
            return response.status(200).json(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return response.status(400).json({
                    error: error.errors[0]?.message,
                    item: error.errors[0]?.path.at(-1),
                });
            } else {
                next(error);
                return;
            }
        }
    };

    private getAllPosts: RequestHandler = async (request, response, next) => {
        const profileId = request.session.profileId
            ? new Types.ObjectId(request.session.profileId)
            : undefined;

        try {
            const result = await this.postService.getAllPosts(profileId);
            return response.status(200).json(result);
        } catch (error) {
            next(error);
            return;
        }
    };

    private getPostById: RequestHandler = async (request, response, next) => {
        const { id } = request.params;

        const profileId = request.session.profileId
            ? new Types.ObjectId(request.session.profileId)
            : undefined;

        try {
            const result = await this.postService.getById(
                new Types.ObjectId(id),
                profileId
            );
            if (!result) {
                return response.status(404).json({ error: "Not found" });
            }
            return response.status(200).json(result);
        } catch (error) {
            next(error);
            return;
        }
    };

    private removePostById: RequestHandler = async (
        request,
        response,
        next
    ) => {
        const { id } = request.params;

        try {
            const postToDelete = await this.postService.getById(
                new Types.ObjectId(id)
            );
            if (!postToDelete) {
                return response.status(404).json({ error: "Not found" });
            }
            if (
                postToDelete.author._id.toHexString() !==
                    request.session.profileId &&
                request.session.role !== "moderator"
            ) {
                return response.status(403).json({ error: "Forbidden" });
            }

            await this.postService.removePostId(postToDelete._id);

            return response.status(204).send();
        } catch (error) {
            next(error);
            return;
        }
    };

    private likePost: RequestHandler = async (request, response, next) => {
        const { id } = request.params;

        await this.postService.likePost(
            new Types.ObjectId(id),
            new Types.ObjectId(request.session.profileId)
        );

        return response.status(204).send();
    };

    private unlikePost: RequestHandler = async (request, response, next) => {
        const { id } = request.params;

        await this.postService.unlikePost(
            new Types.ObjectId(id),
            new Types.ObjectId(request.session.profileId)
        );

        return response.status(204).send();
    };

    private uploadImage: RequestHandler = (request, response, next) => {
        return response.status(200).json({
            imageUrl: request.file?.filename,
        });
    };
}

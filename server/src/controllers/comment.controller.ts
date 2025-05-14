import { Router } from "express";
import { Types } from "mongoose";
import { z } from "zod";

import { CommentService } from "../services/comment.service.js";
import { auth } from "../middleware/auth.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

import type { Controller } from "../interfaces/controller.interface.js";
import type { RequestHandler } from "express";

export class CommentController implements Controller {
    public path = "/api/comment";
    public router = Router();

    private commentService = new CommentService();

    constructor() {
        this.router.delete(
            "/:id",
            validateObjectId("id"),
            auth,
            this.removeComment
        );
        this.router.put(
            "/:id/like",
            validateObjectId("id"),
            auth,
            this.likeComment
        );
        this.router.delete(
            "/:id/like",
            validateObjectId("id"),
            auth,
            this.unlikeComment
        );

        this.router.post(
            "/:postId",
            validateObjectId("postId"),
            auth,
            this.createPostComment
        );
        this.router.get(
            "/post/:postId",
            validateObjectId("postId"),
            this.getPostComments
        );
    }

    private removeComment: RequestHandler = async (request, response, next) => {
        const { id } = request.params;

        try {
            const commentToDelete = await this.commentService.getById(
                new Types.ObjectId(id)
            );
            if (!commentToDelete) {
                return response.status(404).json({ error: "Not found" });
            }
            if (
                commentToDelete.user._id.toHexString() !==
                    request.session.profileId &&
                request.session.role !== "moderator"
            ) {
                return response.status(403).json({ error: "Forbidden" });
            }

            await this.commentService.removeCommentById(commentToDelete._id);

            return response.status(204).send();
        } catch (error) {
            next(error);
            return;
        }
    };

    private likeComment: RequestHandler = async (request, response, next) => {
        const { id } = request.params;

        await this.commentService.likeComment(
            new Types.ObjectId(id),
            new Types.ObjectId(request.session.profileId)
        );

        return response.status(204).send();
    };

    private unlikeComment: RequestHandler = async (request, response, next) => {
        const { id } = request.params;

        await this.commentService.unlikeComment(
            new Types.ObjectId(id),
            new Types.ObjectId(request.session.profileId)
        );

        return response.status(204).send();
    };

    private createPostComment: RequestHandler = async (
        request,
        response,
        next
    ) => {
        const { postId } = request.params;

        try {
            const newComment = await z
                .object({
                    content: z
                        .string()
                        .nonempty("Comment cannot be empty.")
                        .max(
                            150,
                            "Comment cannot be more than 150 characters in length."
                        ),
                })
                .parseAsync(request.body);

            const result = await this.commentService.createComment({
                post: new Types.ObjectId(postId),
                user: new Types.ObjectId(request.session.profileId),
                content: newComment.content,
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

    private getPostComments: RequestHandler = async (
        request,
        response,
        next
    ) => {
        const { postId } = request.params;

        const profileId = request.session.profileId
            ? new Types.ObjectId(request.session.profileId)
            : undefined;

        try {
            const result = await this.commentService.getAllPostsComments(
                new Types.ObjectId(postId),
                profileId
            );
            return response.status(200).json(result);
        } catch (error) {
            next(error);
            return;
        }
    };
}

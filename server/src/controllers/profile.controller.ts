import { Router } from "express";
import { Types } from "mongoose";
import { z } from "zod";

import { ProfileService } from "../services/profile.service.js";
import { PostService } from "../services/post.service.js";
import { UserService } from "../services/user.service.js";
import { imageUpload } from "../middleware/imageUpload.js";
import { auth } from "../middleware/auth.js";
import { verifyImageRealType } from "../middleware/verifyImageRealType.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

import type { Controller } from "../interfaces/controller.interface.js";
import type { RequestHandler } from "express";

export class ProfileController implements Controller {
    public path = "/profile";
    public router = Router();

    private profileService = new ProfileService();
    private postService = new PostService();
    private userService = new UserService();

    constructor() {
        this.router.get("/all", this.getAllProfiles);
        this.router.get("/:id", validateObjectId("id"), this.getProfile);
        this.router.get("/", auth, this.getAuthenticatedProfile);

        this.router.patch("/update", auth, this.updateProfile);

        this.router.post(
            "/picture",
            auth,
            imageUpload.single("avatar"),
            verifyImageRealType,
            this.uploadPicture
        );
        this.router.delete("/picture", auth, this.removePicture);

        this.router.post("/:id/ban", validateObjectId("id"), auth, this.banUser);

        this.router.get("/:id/posts", validateObjectId("id"), this.getUserPosts);
    }

    private getAllProfiles: RequestHandler = async (request, response, next) => {
        try {
            const result = await this.profileService.getAllProfiles();
            return response.status(200).json(result);
        } catch (error) {
            next(error);
            return;
        }
    }

    private getProfile: RequestHandler = async (request, response, next) => {
        const { id } = request.params;

        try {
            const profile = await this.profileService.getById(
                new Types.ObjectId(id)
            );
            if (!profile) {
                return response.status(404).json({ error: "Not found" });
            }
            return response.status(200).json(profile);
        } catch (error) {
            next(error);
            return;
        }
    };

    private getAuthenticatedProfile: RequestHandler = async (request, response, next) => {
        if (!request.session.profileId) {
            return response.status(401).json({ error: "Unauthorized" });
        }

        try {
            const profile = await this.profileService.getById(
                new Types.ObjectId(request.session.profileId)
            );
            return response.status(200).json(profile);
        } catch (error) {
            next(error);
            return;
        }
    }

    private updateProfile: RequestHandler = async (request, response, next) => {
        let validatedUpdate;
        try {
            validatedUpdate = await z
                .object({
                    displayName: z
                        .string()
                        .nonempty("Display name must not be empty.")
                        .max(32, "Display name must not exceed 32 characters.")
                        .optional()
                        .nullable(),
                    aboutDesc: z
                        .string()
                        .max(150, "Description cannot exceed 150 characters.")
                        .optional()
                        .nullable(),
                })
                .parseAsync(request.body);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return response.status(400).json({
                    error: error.errors[0]?.message,
                    item: error.errors[0]?.path.at(-1),
                });
            }
            next(error);
            return;
        }

        try {
            const result = await this.profileService.updateProfile(
                new Types.ObjectId(request.session.profileId),
                validatedUpdate
            );
            return response.status(200).json(result);
        } catch (error) {
            next(error);
            return;
        }
    };

    private uploadPicture: RequestHandler = async (request, response, next) => {
        try {
            const file = request.file;
            if (!file) {
                return response.status(400).json({ error: "No proper file uploaded." });
            }

            const result = await this.profileService.updateProfile(
                new Types.ObjectId(request.session.profileId),
                { profilePictureUri: file.filename }
            );
            return response.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    private removePicture: RequestHandler = async (request, response, next) => {
        try {
            await this.profileService.updateProfile(
                new Types.ObjectId(request.session.profileId),
                { profilePictureUri: null }
            );
            return response.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    private banUser: RequestHandler = async (request, response, next) => {
        const { id } = request.params;

        if (request.session.role !== "moderator") {
            return response.status(403).json({ error: "Forbidden" })
        }

        try {
            const _id = new Types.ObjectId(id);
            const result = await this.profileService.removeProfile(_id);
            if (!result) {
                return response.status(404).json({ error: "Not found" });
            }
            await this.postService.removeUserPosts(_id);
            await this.userService.deactivateAccount(_id);
            return response.status(204).send();
        } catch (error) {
            next(error);
            return;
        }
    }

    private getUserPosts: RequestHandler = async (request, response, next) => {
        const { id } = request.params;

        const profileId = request.session.profileId
            ? new Types.ObjectId(request.session.profileId)
            : undefined;

        try {
            const author = await this.profileService.getById(
                new Types.ObjectId(id)
            );
            if (!author) {
                return response.status(404).json({ error: "Not found" });
            }
            const posts = await this.postService.getUserPosts(author._id, profileId);
            return response.status(200).json(posts);
        } catch (error) {
            next(error);
            return;
        }
    }
}

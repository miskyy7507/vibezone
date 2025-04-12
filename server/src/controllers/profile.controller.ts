import { RequestHandler, Router } from "express";
import { Types } from "mongoose";
import { z } from "zod";

import { Controller } from "../interfaces/controller.interface.js";
import { ProfileService } from "../services/profile.service.js";

export class ProfileController implements Controller {
    public path = "/api/profile";
    public router = Router();

    private profileService = new ProfileService();

    constructor() {
        this.router.get("/:id", this.getProfile);

        this.router.patch("/update", this.updateProfile);

        // this.router.post("/pfp", this.updatePfp);
        // this.router.delete("/pfp", this.removePfp);
    }

    private getProfile: RequestHandler = async (request, response, next) => {
        const { id } = request.params;

        if (!Types.ObjectId.isValid(id)) {
            return response
                .status(400)
                .json({ success: false, message: "Malformed id" });
        }

        try {
            const profile = await this.profileService.getById(
                new Types.ObjectId(id)
            );
            if (!profile) {
                return response.status(404).json({ error: "Not found" });
            }
            return response.status(200).json(profile);
        } catch (error) {
            console.error("Unknown error:", error);
            return response
                .status(500)
                .json({ error: "Internal server error" });
        }
    };

    private updateProfile: RequestHandler = async (
        request,
        response,
        next
    ) => {
        if (!request.session.profileId) {
            return response.status(401).json({ error: "Unauthorized" });
        }

        const update = request.body;

        let validatedUpdate;
        try {
            validatedUpdate = await z
                .object({
                    displayName: z
                        .string()
                        .nonempty("Display name cannot be empty")
                        .max(32, "Display name too long")
                        .optional(),
                    aboutDesc: z
                        .string()
                        .max(150, "Description too long")
                        .optional()
                        .nullable(),
                })
                .parseAsync(update);
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Validation error:", error);
                return response.status(400).json({
                    error: error.errors[0].message,
                    item: error.errors[0].path.at(-1),
                });
            }
            console.error("Unknown error:", error);
            return response
                .status(500)
                .json({ error: "Internal server error" });
        }

        try {
            const result = await this.profileService.updateProfile(
                new Types.ObjectId(request.session.profileId),
                validatedUpdate
            );
            return response.status(200).json(result);
        } catch (error) {
            console.error("Unknown error:", error);
            return response
                .status(500)
                .json({ error: "Internal server error" });
        }
    };
}

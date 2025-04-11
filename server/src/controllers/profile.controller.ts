import { RequestHandler, Router } from "express";
import { Controller } from "../interfaces/controller.interface.js";
import { ProfileService } from "../services/profile.service.js";
import { Types } from "mongoose";

export class ProfileController implements Controller {
    public path = "/api/profile";
    public router = Router();

    private profileService = new ProfileService();

    constructor() {
        this.router.get("/:id", this.getProfile);

        // this.router.post("/pfp", this.updatePfp);
        // this.router.delete("/pfp", this.removePfp);

        // this.router.patch("/settings", this.updateSettings);
    }

    private getProfile: RequestHandler = async (request, response, next) => {
        const { id } = request.params;

        if (!Types.ObjectId.isValid(id)) {
            return response
                .status(400)
                .json({ success: false, message: "Malformed id" });
        }

        try {
            const profile = await this.profileService.getById(new Types.ObjectId(id));
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
}

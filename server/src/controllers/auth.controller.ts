import { Router } from "express";
import { z } from "zod";
import { UserService } from "../services/user.service.js";
import { ProfileService } from "../services/profile.service.js";
import { auth } from "../middleware/auth.js";

import type { Controller } from "../interfaces/controller.interface.js";
import type { RequestHandler } from "express";

export class AuthController implements Controller {
    public path = "/auth";
    public router = Router();

    private userService = new UserService();
    private profileService = new ProfileService();

    constructor() {
        this.router.post("/login", this.loginUser);
        this.router.post("/logout", auth ,this.logoutUser);
        this.router.post("/register", this.registerUser);
    }

    private loginUser: RequestHandler = async (request, response, next) => {
        let login, password;
        try {
            ({ login, password } = await z.object({
                login: z.string(),
                password: z.string().max(2048, "Password is too long (>2048 characters)")
            }).parseAsync(request.body));
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

        const user = await this.userService.authenticate(login, password);

        if (!user) {
            return response.status(401).json({ error: "Unauthorized" });
        }

        if (!user.active) {
            return response.status(403).json({ error: "Forbidden" })
        }

        const profile = await this.profileService.getById(user.profileId);

        request.session.regenerate((err) => {
            if (err) next(err);

            request.session.profileId = user.profileId.toHexString();
            request.session.role = user.role;

            request.session.save((err) => {
                if (err) {
                    next(err);
                    return;
                }
                return response.status(200).json({ ...profile, role: request.session.role });
            });
        });
    };

    private logoutUser: RequestHandler = (request, response, next) => {
        delete request.session.profileId;

        request.session.destroy((err) => {
            if (err) next(err);

            response.status(204).send();
        });
    };

    private registerUser: RequestHandler = async (request, response, next) => {
        let validatedForm;

        try {
            validatedForm = await z.object({
                username: z
                    .string()
                    .nonempty("Required")
                    .min(3, "Username must be at least 3 characters.")
                    .max(32, "Username must not exceed 32 characters.")
                    .regex(/^[a-zA-Z0-9._-]{3,32}$/, "Invalid characters. Allowed characters are: `a-zA-Z0-9._-`"),
                displayName: z
                    .string()
                    .nonempty("Display name must not be empty.")
                    .max(32, "Display name must not exceed 32 characters.")
                    .optional(),
                password: z
                    .string()
                    .nonempty("Required")
                    .max(2048, "Password is too long (>2048 characters)")
            }).parseAsync(request.body);
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

        if (await this.userService.getByLogin(validatedForm.username)) {
            return response.status(400).json({
                error: "This username is already in use. Please choose another one.",
                item: "username"
            });
        }

        try {
            const profile = await this.profileService.createProfile(
                validatedForm.username,
                validatedForm.displayName
            );
            await this.userService.createUser(
                validatedForm.username,
                profile._id,
                validatedForm.password
            );
            response.status(200).json(profile);
        } catch (error) {
            next(error);
            return;
        }
    };
}

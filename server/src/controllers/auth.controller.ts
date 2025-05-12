import { Router } from "express";
import { z } from "zod";
import { UserService } from "../services/user.service.js";
import { ProfileService } from "../services/profile.service.js";
import { auth } from "../middleware/auth.js";

import type { Controller } from "../interfaces/controller.interface.js";
import type { RequestHandler } from "express";

export class AuthController implements Controller {
    public path = "/api/auth";
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
                password: z.string()
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
                response.status(200).json(profile)
            });
        });
    };

    private logoutUser: RequestHandler = (request, response, next) => {
        delete request.session.profileId;

        request.session.destroy((err) => {
            if (err) next(err);

            response.status(200).send();
        });
    };

    private registerUser: RequestHandler = async (request, response, next) => {
        let validatedForm;

        try {
            validatedForm = await z.object({
                email: z
                    .string()
                    .nonempty("Required")
                    .regex(
                        /^(?!\.)(?!.*\.\.)[a-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}(?<!\.)@(?:(?!-)[a-z0-9-]{1,63}(?<!-)(?:\.|$))+(?<!\.)$/i,
                        "Invalid email address."
                    ),
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

        if (await this.userService.getByLogin(validatedForm.email)) {
            return response.status(422).json({
                error: "This email is already in use.",
                item: "email"
            });
        }
        if (await this.profileService.getByUsername(validatedForm.username)) {
            return response.status(422).json({
                error: "This username is not available. Use another one.",
                item: "username"
            });
        }

        try {
            const profile = await this.profileService.createProfile(
                validatedForm.username,
                validatedForm.displayName
            );
            const user = await this.userService.createUser(
                profile._id,
                validatedForm.email,
                "user",
                true,
                validatedForm.password
            );
            response.status(200).json(user);
        } catch (error) {
            next(error);
            return;
        }
    };
}

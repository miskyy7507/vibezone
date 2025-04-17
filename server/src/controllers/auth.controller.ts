import { Router } from "express";
import { z } from "zod";
import { MongoServerError } from "mongodb";
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
                console.error("Validation error:", error);
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

        request.session.regenerate((err) => {
            if (err) next(err);

            request.session.profileId = user.profileId.toString();
            request.session.role = user.role;

            request.session.save((err) => {
                if (err) {
                    next(err);
                    return;
                }
                response.status(200).send();
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
                    .regex(
                        /^(?!\.)(?!.*\.\.)[a-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}(?<!\.)@(?:(?!-)[a-z0-9-]{1,63}(?<!-)(?:\.|$))+(?<!\.)$/i,
                        "Invalid email"
                    ),
                username: z
                    .string()
                    .min(3, "Username too short")
                    .max(32, "Username too long"),
                displayName: z
                    .string()
                    .nonempty("Display name cannot be empty")
                    .max(32, "Display name too long"),
                password: z
                    .string()
                    .nonempty("Missing password")
                    .max(256, "Password too long"),
            }).parseAsync(request.body);
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Validation error:", error);
                return response.status(400).json({
                    error: error.errors[0]?.message,
                    item: error.errors[0]?.path.at(-1),
                });
            }
            next(error);
            return;
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
                true, // TODO: add email verification or smth
                validatedForm.password
            );
            response.status(200).json(user);
        } catch (error) {
            if (error instanceof MongoServerError && error.code === 11000) {
                return response.status(422).json({
                    error: "User already exists",
                    item: error,
                });
            }
            next(error);
            return;
        }
    };

    // TODO: implement updating email address
}

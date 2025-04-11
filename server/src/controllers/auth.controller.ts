import { Router, RequestHandler } from "express";
import { z, ZodError } from "zod";
import { MongoServerError } from "mongodb";

import { Controller } from "../interfaces/controller.interface.js";
import { UserService } from "../services/user.service.js";
import { ProfileService } from "../services/profile.service.js";

export class AuthController implements Controller {
    public path = "/api/auth";
    public router = Router();

    private userService = new UserService();
    private profileService = new ProfileService();

    constructor() {
        this.router.post("/login", this.loginUser);
        this.router.post("/logout", this.logoutUser);
        this.router.post("/register", this.registerUser);
    }

    private loginUser: RequestHandler = async (request, response, next) => {
        const { login, password } = request.body;

        if (typeof login !== "string" || typeof password !== "string") {
            return response.status(401).json({ error: "Unauthorized" });
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
                if (err) return next(err);
                response.status(200).send();
            });
        });
    };

    private logoutUser: RequestHandler = async (request, response, next) => {
        if (!request.session.profileId) {
            return response.status(401).json({ error: "Unauthorized" });
        }

        delete request.session.profileId;

        request.session.destroy((err) => {
            if (err) next(err);

            response.status(200).send();
        });
    };

    private registerUser: RequestHandler = async (request, response, next) => {
        const userRegisterForm = request.body;

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
            }).parseAsync(userRegisterForm);
        } catch (error) {
            if (error instanceof ZodError) {
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
            if (error instanceof MongoServerError && error.code == 11000) {
                return response.status(422).json({
                    error: "User already exists",
                    item: error.keyValue,
                });
            }
            console.error("Unknown error:", error);
            return response
                .status(500)
                .json({ error: "Internal server error" });
        }
    };
}

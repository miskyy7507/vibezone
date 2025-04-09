import { Router, RequestHandler } from "express";
import { z } from "zod";
import { MongoServerError } from "mongodb";

import { Controller } from "../interfaces/controller.interface.js";
import { UserService } from "../services/user.service.js";
import { IUser, userRegisterFormSchema } from "../interfaces/user.interface.js";

export class AuthController implements Controller {
    public path = "/api/auth";
    public router = Router();
    private userService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
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

        request.session.regenerate(function (err) {
            if (err) next(err);

            request.session.user = {
                id: user._id.toString(),
                role: user.role,
            };

            request.session.save(function (err) {
                if (err) return next(err);
                response.status(200).send();
            });
        });
    };

    private logoutUser: RequestHandler = async (request, response, next) => {
        if (!request.session.user) {
            return response.status(401).json({ error: "Unauthorized" });
        }

        delete request.session.user;

        request.session.destroy(function (err) {
            if (err) next(err);

            response.status(200).send();
        });
    };

    private registerUser: RequestHandler = async (request, response, next) => {
        const userRegisterForm = request.body;

        let validatedForm;

        try {
            validatedForm = userRegisterFormSchema.parse(userRegisterForm);
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
            const user = await this.userService.createUser(
                validatedForm
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

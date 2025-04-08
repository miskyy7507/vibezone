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
        // this.router.post("/logout", this.logoutUser);
        this.router.post("/register", this.registerUser);
    }

    private loginUser: RequestHandler = async (request, response) => {
        const { login, password } = request.body;

        const user = await this.userService.getByLogin(login);

        if (
            !user ||
            !(await this.userService.authenticate(user._id, password))
        ) {
            return response.status(401).json({ error: "Unauthorized" });
        }

        return response.status(200).json({ user });
        // TODO: auth
    };

    private registerUser: RequestHandler = async (request, response) => {
        const { userRegisterForm } = request.body;

        let validatedUserRegisterForm;

        try {
            validatedUserRegisterForm = await userRegisterFormSchema.parseAsync(userRegisterForm);
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Validation error:", error);
                return response
                    .status(400)
                    .json({ error: error.errors[0].message });
            }
            console.error("Unknown error:", error);
            return response
                .status(500)
                .json({ error: "Internal server error" });
        }

        try {
            const user = await this.userService.createUser(validatedUserRegisterForm);
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

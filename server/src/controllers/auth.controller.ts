import {
    Request,
    Response,
    NextFunction,
    Router,
    RequestHandler,
} from "express";
import { MongoServerError } from "mongodb";
import z from "zod";

import Controller from "../interfaces/controller.interface.js";
import UserService from "../services/user.service.js";
import { IUser, userSchema } from "../interfaces/user.interface.js";
import PasswordService from "../services/password.service.js";

export class AuthController implements Controller {
    public path = "/api/auth";
    public router = Router();
    private userService = new UserService();
    private passwordService = new PasswordService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/login", this.loginUser);
        // this.router.post("/logout", this.logoutUser);
        this.router.post("/register", this.registerUser);
    }

    private loginUser: RequestHandler = async (request, response, next) => {
        const { login, password } = request.body;

        const user = await this.userService.getByLogin(login);

        if (
            !user ||
            !(await this.passwordService.authenticate(user._id, password))
        ) {
            return response.status(401).json({ error: "Unauthorized" });
        }

        return response.status(200).json({ user });
    };

    private registerUser = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const { password, ...userData } = request.body;

        let validatedUserData: IUser;
        let validatedPassword: string;

        const clearPasswordSchema = z
            .string()
            .nonempty("Missing password")
            .max(256, "Password too long");

        try {
            validatedUserData = await userSchema.parseAsync(userData);
            validatedPassword = await clearPasswordSchema.parseAsync(password);
        } catch (error) {
            if (!(error instanceof z.ZodError)) {
                console.error("Unknown error:", error);
                return response
                    .status(500)
                    .json({ error: "Internal server error" });
            }
            console.error("Validation error:", error);
            return response
                .status(400)
                .json({ error: error.errors[0].message });
        }

        try {
            const user = await this.userService.createUser(validatedUserData);
            await this.passwordService.createOrUpdateUserPassword(
                user._id,
                validatedPassword
            );
            response.status(200).json(user);
        } catch (error) {
            if (error instanceof MongoServerError && error.code == 11000) {
                return response
                    .status(422)
                    .json({
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

import {
    Request,
    Response,
    NextFunction,
    Router,
    RequestHandler,
} from "express";

import Controller from "../interfaces/controller.interface.js";
import UserService from "../services/user.service.js";

export class AuthController implements Controller {
    public path = "/api/auth";
    public router = Router();
    private userService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // this.router.post("/login", this.loginUser);
        // this.router.post("/logout", this.logoutUser);

        // this.router.post("/register", this.registerUser);
    }

    private loginUser: RequestHandler = async (request, response, next) => {
        const { login, password } = request.body;

        const user = this.userService.getByLogin(login);

        if (!user) {
            return response.status(401).json({ error: "Unauthorized" });
        }
    };
}

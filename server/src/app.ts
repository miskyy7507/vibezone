import express from "express";
import { Controller } from "./interfaces/controller.interface.js";

export class App {
    private app: express.Application;

    constructor(middleware: express.RequestHandler[], controllers: Controller[]) {
        this.app = express();
        this.initializeMiddleware(middleware);
        this.initializeControllers(controllers);
    }

    private initializeMiddleware(middleware: express.RequestHandler[]) {
        for (const mw of middleware) {
            this.app.use(mw);
        }
    }

    private initializeControllers(controllers: Controller[]) {
        for (const controller of controllers) {
            this.app.use(controller.path, controller.router);
        }
    }

    public listen(port: number) {
        this.app.listen(port, () => {
            console.log(`App listening on the port ${port}`);
        });
    }
}

import express from "express";
import { Controller } from "./interfaces/controller.interface.js";
import { Server } from "http";

export class App {
    private app: express.Application;
    private server: Server | null = null;

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
        this.server = this.app.listen(port, () => {
            console.log(`App listening on the port ${port.toString()}`);
        });
    }

    public closeServer(callback: () => void) {
        this.server?.close(callback);
    }
}

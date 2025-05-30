import express from "express";

import type { Server } from "http";
import type { Application, RequestHandler, ErrorRequestHandler } from "express";
import type { Controller } from "./interfaces/controller.interface.js";
import { config } from "./config.js";

export class App {
    private app: Application;
    private server: Server | null = null;

    constructor(middleware: (RequestHandler | ErrorRequestHandler)[], controllers: Controller[], settings: Record<string, unknown>) {
        this.app = express();
        this.initializeMiddleware(middleware);
        this.initializeControllers(controllers);
        if (config.nodeEnv === "development") {
            this.app.use('/uploads', express.static(config.imageUploadPath));
        }
        for (const [name, value] of Object.entries(settings)) {
            this.app.set(name, value);
        }
    }

    private initializeMiddleware(middleware: (RequestHandler | ErrorRequestHandler)[]) {
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

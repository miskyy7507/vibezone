import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from '../api_documentation.json' with { type: 'json' };
import type { Controller } from "../interfaces/controller.interface.js";

export class ApiDocsController implements Controller {
    public path = "/";
    public router = Router();

    constructor() {
        this.router.use("/", swaggerUi.serve);
        //eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.router.get("/", swaggerUi.setup(swaggerDocument));
    }
}

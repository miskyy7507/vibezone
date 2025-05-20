import { Router } from "express";
import swaggerUi from "swagger-ui-express";

import yaml from "js-yaml";
import fs from "node:fs";

import type { Controller } from "../interfaces/controller.interface.js";


export class ApiDocsController implements Controller {
    public path = "/";
    public router = Router();

    constructor() {
        const swaggerDocument = yaml.load(fs.readFileSync("swagger.yaml", "utf8"));
        if (!swaggerDocument || typeof swaggerDocument !== "object") {
            throw new Error("Could not load swagger.yaml file in this server project directory.");
        }
        this.router.use("/", swaggerUi.serve);
        this.router.get("/", swaggerUi.setup(swaggerDocument));
    }
}

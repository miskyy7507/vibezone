import express from "express";
import { config } from "./config.js";

const app = express();

app.listen(config.serverPort, () => {
    console.log(`Listening on port ${config.serverPort}`);
});

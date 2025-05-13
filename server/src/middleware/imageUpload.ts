import multer from "multer";
import crypto from "crypto";
import { config } from "../config.js";

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, config.imageUploadPath);
    },
    filename: (request, file, callback) => {
        const uniqueSuffix = crypto.randomBytes(16).toString("hex");

        callback(
            null,
            `${file.fieldname}-${uniqueSuffix}`
        );
    },
});

export const imageUpload = multer({
    storage: storage,
    fileFilter: (request, file, callback) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
            callback(null, false);
            return;
        }
        callback(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
        // files: 1
    },
});

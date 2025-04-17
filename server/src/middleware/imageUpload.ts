import multer from "multer";
import crypto from "crypto";

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, "/tmp/uploads");
    },
    filename: (request, file, callback) => {
        const uniqueSuffix = crypto.randomBytes(16).toString("hex");
        const fileExtension = file.mimetype.split("/")[1];
        // callback(null, file.fieldname + '-' + uniqueSuffix)
        callback(
            null,
            `${file.fieldname}-${uniqueSuffix}${
                fileExtension ? "." + fileExtension : ""
            }`
        );
    },
});

export const imageUpload = multer({
    storage: storage,
    fileFilter: (request, file, callback) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
            callback(null, false);
        } else {
            callback(null, true);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
        // files: 1
    },
});

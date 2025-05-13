import fs from 'node:fs/promises';
import { fileTypeFromFile } from "file-type";

import type { RequestHandler } from "express";

// eslint-disable-next-line @typescript-eslint/no-misused-promises
export const verifyImageRealType: RequestHandler = async (request, response, next) => {
    if (!request.file) {
        return response.status(400).json({ error: "No proper file uploaded." });
    }

    try {
        const filePath = request.file.path;
        const fileType = await fileTypeFromFile(filePath);

        if (!fileType?.mime.match(/^image\/(jpeg|png|gif|webp)$/)) {
            await fs.unlink(filePath); // clean up the wrong type uploaded file
            return response.status(400).json({error: "No proper file uploaded."});
        }

        // rename the file to include the correct extension for proper type
        // resolution on future file requests
        const newFilePath = `${filePath}.${fileType.ext}`;
        await fs.rename(filePath, newFilePath);
        request.file.path = newFilePath; // update file path in request object
        request.file.filename = `${request.file.filename}.${fileType.ext}`;

        next();
        return
    } catch (error) {
        // Clean up the file if an error occurred after upload
        await fs.unlink(request.file.path)
        next(error);
        return
    }
}

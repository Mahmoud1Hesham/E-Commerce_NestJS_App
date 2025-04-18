import { BadRequestException } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { Request } from "express";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { resolve } from "path";

export const validationFile = {
    image: ['image/jpeg', 'image/png', 'image/gif'],
    file: ['plain/text', 'application/json']
}

interface LocalMulterOptions {
    path?: string;
    validation?: string[];
    filesize?: number;
}

export const localMulterOptions = ({
    path = 'public',
    validation = [],
    filesize = 1024,
}: LocalMulterOptions): MulterOptions => {
    let basePath = `uploads/${path}`;
    return {
        storage: diskStorage({
            destination: (req: Request, file: Express.Multer.File, callback: Function) => {
                let fullPath = resolve(`./${basePath}`);
                if (!existsSync(fullPath)) {
                    mkdirSync(fullPath, { recursive: true });
                }
                callback(null, fullPath);
            },
            filename: (req: Request, file: Express.Multer.File, callback: Function) => {
                const originalPath =  Date.now() + '_' + file.originalname;
                file['finalPath'] = `${basePath}/${req['user']._id}/${originalPath}`
                callback(null,originalPath);
            },
        }),
        fileFilter: (req: Request, file: Express.Multer.File, callback: Function) => {
            if (!validation.includes(file.mimetype)) {
                return callback(new BadRequestException('Invalid file format!'), false);
            }
            return callback(null, true);
        },
        limits: {
            fileSize: filesize,
        },
    };
};

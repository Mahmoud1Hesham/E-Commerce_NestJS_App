import { BadRequestException } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { Request } from "express";
import { diskStorage } from "multer";

export const validationFile = {
    image: ['image/jpeg', 'image/png', 'image/gif'],
    file: ['plain/text', 'application/json']
}

interface CloudMulterOptions {
    validation?: string[];
    filesize?: number;
}

export const CloudMulterOptions = ({
    validation = [],
    filesize = 1024,
}: CloudMulterOptions): MulterOptions => {
    return {
        storage: diskStorage({}),
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

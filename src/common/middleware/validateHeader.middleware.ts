
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
@Injectable()
export class ValidateHeaderMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: (error?: Error | any) => void) {
        console.log('Hi Middleware');
        if (req.headers.authorization?.split(' ')?.length != 2) {
            
            return res.status(400).json({ message: 'In-valid authorization header' });
        }
        return next();
    }
}
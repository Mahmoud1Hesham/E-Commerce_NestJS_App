import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';


@Injectable()
export class MulterValidationInterceptor implements NestInterceptor {
  // constructor(private readonly checkRequired:boolean = true){}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    // if (this.checkRequired) {
      if (!req.file) {
        throw new BadRequestException("Missing file!")
      }
    // }
    return next.handle();
  }
}
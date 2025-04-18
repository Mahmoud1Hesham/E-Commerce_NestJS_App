import { TokenService } from 'src/common/service/token.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserDocument } from 'src/DB/model/User.model';

export interface IAuthReq extends Request{
  user:UserDocument
}

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const { authorization } = context.switchToHttp().getRequest().headers;
    context.switchToHttp().getRequest().user = await this.tokenService.verifyToken({ authorization })
    return true;
  }
}

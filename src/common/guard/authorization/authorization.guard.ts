import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { rolesKey } from 'src/common/decorators/roles.decorator';
import { roleTypes } from 'src/DB/model/User.model';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector:Reflector){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<roleTypes[]>(rolesKey,[context.getHandler(),context.getClass()])
    const {user} = context.switchToHttp().getRequest();
    if (!requiredRoles?.includes(user.role)) {
      throw new ForbiddenException("not authorized account !")
    }
    
    return true;
  }
}

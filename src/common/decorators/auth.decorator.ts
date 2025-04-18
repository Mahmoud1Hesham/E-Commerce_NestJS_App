import { Roles } from 'src/common/decorators/roles.decorator';

import { applyDecorators, UseGuards } from '@nestjs/common';
import { roleTypes } from 'src/DB/model/User.model';
import { AuthenticationGuard } from '../guard/authentication/authentication.guard';
import { AuthorizationGuard } from '../guard/authorization/authorization.guard';

export function Auth(roles: roleTypes[]) {
    return applyDecorators(
        Roles(roles),
        UseGuards(AuthenticationGuard, AuthorizationGuard),
    );
}

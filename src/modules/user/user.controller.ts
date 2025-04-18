import { Controller, Get} from '@nestjs/common';
import { UserService } from './user.service';
import { roleTypes, UserDocument } from 'src/DB/model/User.model';
import { User } from 'src/common/decorators/user.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Auth([roleTypes.User])
    @Get('profile')
  profile(@User() user: UserDocument) {

    return this.userService.profile(user)
  }
}

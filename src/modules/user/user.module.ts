import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthenticationModule } from '../auth/auth.module';
import { ValidateHeaderMiddleware } from 'src/common/middleware/validateHeader.middleware';

@Module({
  imports:[AuthenticationModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(ValidateHeaderMiddleware)
    .forRoutes(UserController);
    }
}

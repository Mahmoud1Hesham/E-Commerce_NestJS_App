import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: resolve('./config/.env.dev'), isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URI as unknown as any)
    , AuthenticationModule , UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

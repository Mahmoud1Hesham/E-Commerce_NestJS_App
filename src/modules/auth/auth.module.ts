import { Module } from "@nestjs/common";
import { AuthenticationController } from "./auth.controller";
import { AuthenticationService } from "./auth.service";
import { UserModel } from "src/DB/model/User.model";
import { UserRepositoryService } from "src/DB/repository/User.repository";
import { TokenService } from "src/common/service/token.service";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports:[UserModel],
    controllers:[AuthenticationController],
    providers:[AuthenticationService,UserRepositoryService,JwtService,TokenService],
    exports:[UserModel,UserRepositoryService,JwtService,TokenService]
})

export class AuthenticationModule {}
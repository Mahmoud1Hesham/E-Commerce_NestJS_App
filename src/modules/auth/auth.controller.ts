import { Body, Controller, Get, Headers, HttpCode, Param, Patch, Post, Query, ValidationPipe } from "@nestjs/common";
import { AuthenticationService } from "./auth.service";
import { ConfirmEmailDTO, CreateAccountDto, LoginDTO } from "./dto/auth.dto";

@Controller()

export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService) { }
    @Post("/auth/signup")
    @HttpCode(200)
    signup(@Body(new ValidationPipe({whitelist:true ,forbidNonWhitelisted:true})) body: CreateAccountDto) {
        return this.authenticationService.signup(body);
    }
    @Patch("/auth/confirm-email")
    @HttpCode(200)
    confirmEmail(@Body() body: ConfirmEmailDTO,):any {
        console.log({controller:body})
        return this.authenticationService.confirmEmail(body);
    }
    @Post("/auth/login")
    @HttpCode(200)
    login(@Body() body:LoginDTO):any{
        return this.authenticationService.login(body);
    }
}


import { BadGatewayException, BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfirmEmailDTO, CreateAccountDto, LoginDTO } from "./dto/auth.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "src/DB/model/User.model";
import { Model } from "mongoose";
import { UserRepositoryService } from "src/DB/repository/User.repository";
import { sendEmail } from "src/common/email/send.email";
import { verificationEmailTemplate } from "src/common/email/templates/verification.template";
import { compareHash } from "src/common/security/hash.security";
import { JwtService } from "@nestjs/jwt";
import { TokenService, tokenTypes } from "src/common/service/token.service";

@Injectable()
export class AuthenticationService {
    private users: any[] = [];
    constructor(
        // @InjectModel(User.name) private readonly userModel: Model<UserDocument>
        private readonly TokenService: TokenService,
        private readonly userRepositoryService: UserRepositoryService<UserDocument>
    ) { }

    async signup(body: CreateAccountDto) {
        const { email, password, userName } = body;

        await this.userRepositoryService.checkDuplicateAccount({ email })
        const otp = this.generateOTP();
        const user = await this.userRepositoryService.create({ userName, email, password, confirmEmailOTP: `${otp}` })
        sendEmail({ to: email, subject: 'confirm-Email', html: verificationEmailTemplate(otp) })
        return { message: 'DONE', users: user };
    }
    async login(body: LoginDTO): Promise<{ message: string, data: { token: { accessToken: string, refreshToken: string } } }> {
        const { email, password } = body;
        const user = await this.userRepositoryService.findOne({
            filter: { email }
        });

        if (!user) {
            throw new NotFoundException("not a registered account")
        }
        if (!user.confirmEmail) {
            throw new BadGatewayException("sorry your account have to be verified first !")
        }
        if (!compareHash(password, user.password)) {
            throw new BadRequestException("in-valid login data")
        }

        const accessToken = this.TokenService.sign(
            {
                payload:
                    { id: user._id },
                role: user.role

            })

        const refreshToken = this.TokenService.sign(
            {
                payload:
                    { id: user._id },
                role: user.role,
                type: tokenTypes.Refresh

            }
        )

        return { message: 'DONE', data: { token: { accessToken, refreshToken } } };
    }

    async confirmEmail(body: ConfirmEmailDTO): Promise<{ message: string }> {
        const { email, otp } = body;
        console.log({ confirm: email, confirm2: otp })
        const user = await this.userRepositoryService.findOne({
            filter: { email, confirmEmail: { $exists: false } },
        });
        if (!user) {
            throw new BadRequestException('Not found or already confirm')
        }
        if (!compareHash(otp, user.confirmEmailOTP)) {
            throw new BadRequestException('in-valid OTP')
        }
        await this.userRepositoryService.updateOne({
            filter: { _id: user._id },
            data: {
                confirmEmail: Date.now(),
                $unset: {
                    confirmEmailOTP: ""
                }
            }
        })
        return { message: 'DONE!' }
    }

    async

    private generateOTP(): number {
        return Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
    }
}

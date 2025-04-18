import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Types } from "mongoose";
import { JwtPayload } from 'jsonwebtoken';
import { roleTypes, UserDocument } from "src/DB/model/User.model";
import { UserRepositoryService } from "src/DB/repository/User.repository";

interface ITokenPayload extends JwtPayload {
    id: Types.ObjectId;
}
export enum tokenTypes {
    Access = "access",
    Refresh = "refresh"
}
export enum BearerTypes {
    System = "system",
    Bearer = "bearer"
}
interface IGenerateToken {
    role?: roleTypes
    payload: ITokenPayload;
    type?: tokenTypes
    expiresIN: number
};
interface IVerifyToken {
    authorization: string
    type?: tokenTypes
};

@Injectable()

export class TokenService {
    constructor(
        private readonly userRepositoryService: UserRepositoryService<UserDocument>,        
        private readonly jwtService: JwtService
    ) { }
    sign({
        payload,
        type = tokenTypes.Access,
        role = roleTypes.User,
        expiresIn = parseInt(process.env.EXPIRES_IN ?? '454875')
    }) {

        const { accessSignature, refreshSignature } = this.getSignature(role)
        return this.jwtService.sign(payload, {
            secret: type == tokenTypes.Access ? accessSignature : refreshSignature,
            expiresIn: type == tokenTypes.Access ? expiresIn : parseInt(process.env.EXPIRES_IN_REFRESH as string)
        })
    }
    async verifyToken({ authorization, type = tokenTypes.Access, }: IVerifyToken) {

        try {
            const [bearer, token] = authorization.split(" ") || [];
        if (!bearer || !token) {
            throw new BadRequestException("missing token")
        }

        const { accessSignature, refreshSignature } = this.getSignature(bearer === BearerTypes.System ? roleTypes.Admin : roleTypes.User)
        const decoded = this.jwtService.verify(token, { secret: type === tokenTypes.Access ? accessSignature : refreshSignature })
        if (!decoded?.id) {
            throw new UnauthorizedException("unauthenticated user !")
        }
        const user = await this.userRepositoryService.findOne({ filter: { _id: decoded.id } })
        if (!user) {
            throw new NotFoundException("Not registered account !")
        }
        if (user.changeCredentialTime?.getTime()>= decoded.iat * 1000) {
            throw new BadRequestException("Expired Login Credentials !")
        }
        return user;
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
    private getSignature(role: roleTypes) {
        let accessSignature: string
        let refreshSignature: string
        switch (role) {
            case roleTypes.Admin:
                accessSignature = process.env.ADMIN_ACCESS_SIGNATURE as string;
                refreshSignature = process.env.ADMIN_REFRESH_SIGNATURE as string;
                break;

            default:
                accessSignature = process.env.USER_ACCESS_SIGNATURE as string;
                refreshSignature = process.env.USER_REFRESH_SIGNATURE as string;
                break;
        }
        return { accessSignature, refreshSignature }
    }
}
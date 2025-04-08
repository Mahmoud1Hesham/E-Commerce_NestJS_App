import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Types } from "mongoose";
import { JwtPayload } from 'jsonwebtoken';
import { roleTypes } from "src/DB/model/User.model";

interface ITokenPayload extends JwtPayload {
    id: Types.ObjectId;
}
export enum tokenTypes {
    Access = "access",
    Refresh = "refresh"
}
interface IGenerateToken {
    role?: roleTypes
    payload: ITokenPayload;
    type?: tokenTypes
    expiresIN: number
};
interface IVerifyToken {
    authorization:string
    type?: tokenTypes
};

@Injectable()

export class TokenService {
    constructor(private readonly jwtService: JwtService) { }
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
    verifyToken({
        authorization,
        type = tokenTypes.Access,
    }) {

        const { accessSignature, refreshSignature } = this.getSignature(role)
        return this.jwtService.sign(payload, {
            secret: type == tokenTypes.Access ? accessSignature : refreshSignature,
            expiresIn: type == tokenTypes.Access ? expiresIn : parseInt(process.env.EXPIRES_IN_REFRESH as string)
        })
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
import { ConflictException, Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./DB.repository";
import { User, UserDocument, UserModel } from "../model/User.model";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";


@Injectable()
export class UserRepositoryService<TDocument> extends DataBaseRepository<TDocument> {
    constructor(
        @InjectModel(User.name) readonly userModel: Model<TDocument>) {
        super(userModel)
    }

    async checkDuplicateAccount(data: FilterQuery<TDocument>): Promise<null>{
        const checkUser = await this.findOne({filter : data })
        if (checkUser) {
            throw new ConflictException("Sorry this email already exists !")
        }
        return null

    }
}
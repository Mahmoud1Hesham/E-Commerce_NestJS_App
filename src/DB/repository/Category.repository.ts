import { Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./DB.repository";
import { Category } from "../model/Category.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


@Injectable()
export class CategoryRepositoryService<TDocument> extends DataBaseRepository<TDocument> {
    constructor(
        @InjectModel(Category.name) readonly CategoryModel: Model<TDocument>) {
        super(CategoryModel)
    }


}
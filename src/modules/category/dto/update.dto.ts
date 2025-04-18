import { PartialType } from "@nestjs/mapped-types";
import { CreateCategoryDTO } from "./create.dto";
import { IsMongoId, IsOptional, IsString, MinLength } from "class-validator";
import { Types } from "mongoose";
import { QueryFilterDTO } from "src/common/dto/query.filter.dto";

export class updateCategoryDTO extends PartialType(CreateCategoryDTO){}

export  class CategoryIdDTO{
    @IsMongoId()
    categoryId:Types.ObjectId
}

export class CategoryQueryFilterDTO extends QueryFilterDTO {
    @IsString()
    @IsOptional()
    @MinLength(1)
    name?: string
}  


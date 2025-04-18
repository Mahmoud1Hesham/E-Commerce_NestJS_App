import { Types } from "mongoose";
import { IAttachment } from "src/common/multer/cloud.service";

export interface ICategory{
    _id?:Types.ObjectId;
    name:string;
    slug:string;
    logo:IAttachment;
    folderId:string;
    createdBy:Types.ObjectId;
}
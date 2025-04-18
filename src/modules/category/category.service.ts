import { ICategory } from 'src/modules/category/category.interface';
import { CategoryRepositoryService } from '../../DB/repository/Category.repository';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CloudService, IAttachment } from 'src/common/multer/cloud.service';
import { CategoryDocument } from 'src/DB/model/Category.model';
import { UserDocument } from 'src/DB/model/User.model';
import { CreateCategoryDTO } from './dto/create.dto';
import { FilterQuery, Types } from 'mongoose';
import { CategoryQueryFilterDTO, updateCategoryDTO } from './dto/update.dto';
import { IPaginate } from 'src/DB/repository/DB.repository';

@Injectable()
export class CategoryService {
    constructor(
        private readonly cloudService: CloudService,
        private readonly categoryRepositoryService: CategoryRepositoryService<CategoryDocument>
    ) { }
    async create(user: UserDocument, body: CreateCategoryDTO, file: Express.Multer.File) {


        if (await this.categoryRepositoryService.findOne({ filter: { name: body.name } })) {
            throw new ConflictException('category name e exists !')
        }
        const folderId = String(Math.floor(Math.random() * 999999 - 100000 + 1) + 100000)
        const { secure_url, public_id } = await this.cloudService.uploadFile(file, { folder: `${process.env.APP_NAME}/category` })
        const category = await this.categoryRepositoryService.create({
            name: body.name,
            logo: { secure_url, public_id },
            folderId,
            createdBy: user._id
        }
        )
        return { message: 'DONE' };
    }
    async update(
        categoryId: Types.ObjectId,
        body?: updateCategoryDTO,
        file?: Express.Multer.File
    ) {

        const category = await this.categoryRepositoryService.findOne({ filter: { _id: categoryId } })
        if (!category) {
            throw new NotFoundException("invalid category id")
        }

        if (
            body?.name &&
            await this.categoryRepositoryService.findOne({ filter: { name: body.name, _id: { $ne: categoryId } } })) {
            throw new ConflictException('category name exists !')
        }
        // const folderId = String(Math.floor(Math.random() * 999999 - 100000 + 1) + 100000)
        let logo: IAttachment | null = null;
        if (file) {
            const { secure_url, public_id } = await this.cloudService.uploadFile(file, { folder: `${process.env.APP_NAME}/category/${category.folderId}` })
            logo = { secure_url, public_id }
        }
        const updatedCategory = await this.categoryRepositoryService.updateOne({
            filter: {
                _id: categoryId
            },
            data: {
                name: body?.name,
                logo: logo,
            }

        }
        )
        if (updatedCategory.modifiedCount && file) {
            await this.cloudService.destroyFile(category.logo.public_id)
        }
        return { message: 'DONE' };
    }


    async findOne(
        categoryId: Types.ObjectId,
    ): Promise<{ message: string, data: { category: ICategory } }> {

        const category = await this.categoryRepositoryService.findOne({ filter: { _id: categoryId }, populate: [{ path: 'createdBy' }] })
        if (!category) {
            throw new NotFoundException("invalid category id")
        }

        return { message: 'DONE', data: { category } };
    }


    async find(
        query: CategoryQueryFilterDTO
    ): Promise<{ message: string, data: { categories: ICategory[] | [] |IPaginate<ICategory>} }> {
        let filter: FilterQuery<CategoryDocument> = {}
        if (query?.name) {
            filter = {
                $or: [
                    { name: { $regex: `${query.name}`, $options: 'i' } },
                    { slug: { $regex: `${query.name}`, $options: 'i' } },
                ]
            }
        }
        console.log(filter)
        const categories = await this.categoryRepositoryService.find({
            filter,
            select: query.select,
            sort: query.sort,
            page: query.page,
            populate:[{path:"createdBy"}]
        })
        if (!categories) {
            throw new NotFoundException("invalid category id")
        }

        return { message: 'DONE', data: { categories } };
    }

}

import { FilterQuery, Model, PopulateOptions, UpdateQuery, UpdateWriteOpResult } from "mongoose";

export interface IPaginate<T>{
    
        count:number,
        pageSize:number,
        pages:number,
        page:number,
        documents:T[] |[];
    
}


export abstract class DataBaseRepository<TDocument> {

    protected constructor(protected readonly model: Model<TDocument>) { }
    async findOne({
        filter,
        populate
    }: {
        filter?: FilterQuery<TDocument>;
        populate?: PopulateOptions[];
    }): Promise<TDocument | null> {
        return await this.model.findOne(filter || {}).populate(populate || []);
    }
    async find({
        filter,
        select,
        sort,
        page = 0,
        populate
    }: {
        filter?: FilterQuery<TDocument>;
        select?: string;
        sort?: string;
        page?: number;
        populate?: PopulateOptions[];
    }): Promise<TDocument[] | [] |IPaginate<TDocument>> {
        const query = this.model.find(filter || {});
        if (select) {
            select = select.replaceAll(",", " ")
            query.select(select)
        }
        if (sort) {
            sort = sort.replaceAll(",", " ")
            query.sort(sort)
        }
        if (populate) {
            query.populate(populate);
        }
        if (!page) {
            return await query.exec()
        }
        const limit = 10
        const skip = (page - 1) * limit;
        const count = await this.model.countDocuments(filter || {});
        const pages = Math.ceil(count / limit)
        const documents = await query.skip(skip).limit(limit).exec();
        console.log(page)
        return {
            count,
            pageSize:limit,
            pages,
            page,
            documents,
        }
    }
    async updateOne({
        filter,
        data
    }: {
        filter: FilterQuery<TDocument>;
        data: UpdateQuery<TDocument>
    }): Promise<UpdateWriteOpResult> {
        return await this.model.updateOne(filter, data);
    }

    async create(data: Partial<TDocument>): Promise<TDocument> {
        return await this.model.create(data);
    }



}
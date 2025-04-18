import { MongooseModule, Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { IAttachment } from "src/common/multer/cloud.service";
import { ICategory } from "src/modules/category/category.interface";
import slugify from "slugify";
@Schema({ timestamps: true })
export class Category implements ICategory {

    @Prop({ required: true, minLength: 2, maxLength: 50 })
    name: string;
    @Prop({
        required: true, minLength: 2, maxLength: 75, default: function (this: Category) {
            return slugify(this.name, { trim: true })
        }
    })
    slug: string;
    @Prop(raw({
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true }
    }))
    logo: IAttachment;
    @Prop({ required: true })
    folderId: string;
    @Prop({ required: true, ref: 'User', type: Types.ObjectId })
    createdBy: Types.ObjectId;

}


export type CategoryDocument = HydratedDocument<Category>

export const CategorySchema = SchemaFactory.createForClass(Category)

export const CategoryModel = MongooseModule.forFeatureAsync(
    [{
        name: Category.name,
        useFactory() {

            CategorySchema.pre('updateOne', function (next) {
                console.log(this);
                console.log(this.getQuery());
                console.log(this.getUpdate());

                let update = this.getUpdate();

                if (update && update['name']) { 
                    update['slug'] = slugify(update['name'], { trim: true });
                    this.setUpdate(update);
                }

                next();
            });

            return CategorySchema;
        }
    }],
);

import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { generateHash } from "src/common/security/hash.security";

export enum genderTypes {
    Male = "male",
    Female = "female"
}
export enum roleTypes {
    User = "user",
    Admin = "admin"
}

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {

    // @Virtual({
    //     get(this:User){
    //         return this.firstName + " " + this.lastName;
    //     },
    //     set(value:string){
    //         const [firstName,lastName] = value.split(" ")
    //         this.firstName = firstName ; 
    //         this.lastName = lastName;
    //     }
    // })

    @Prop({ type: String, required: true, minlength: 2, maxlength: 50, trim: true })
    userName: string;
    @Prop({ type: String, required: true, unique: true })
    email: string;
    @Prop({ required: true })
    password: string;
    @Prop({})
    phone: string;
    @Prop({ type: String, enum: genderTypes, default: genderTypes.Male })
    gender: genderTypes;
    @Prop({ type: String, enum: roleTypes, default: roleTypes.User })
    role: roleTypes;
    @Prop({ type: Date })
    DOB: Date;
    @Prop({ type: Date })
    confirmEmail: Date;
    @Prop({})
    confirmEmailOTP: string;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);



export const UserModel = MongooseModule.forFeatureAsync([{ name: User.name,useFactory(){
    UserSchema.pre('save', function (next) {
        if (this.isModified('password')) {
            this.password = generateHash(this.password)
        }
        if (this.isModified('confirmEmailOTP')) {
            this.confirmEmailOTP = generateHash(this.confirmEmailOTP)
        }
        return next();
    })
    return UserSchema;
} }]);


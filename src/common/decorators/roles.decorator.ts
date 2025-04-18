import { SetMetadata } from "@nestjs/common";
import { roleTypes } from "src/DB/model/User.model";
export const rolesKey = 'roles';
export const Roles = (roles : roleTypes[])=>{
    return SetMetadata('roles',roles);
}
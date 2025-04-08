import { BadRequestException } from "@nestjs/common";
import { IsEmail, isEmail, IsNotEmpty, isNotEmpty, IsString, isString, IsStrongPassword, isStrongPassword, Matches, MaxLength, maxLength, MinLength, minLength, registerDecorator, Validate, validate, ValidateIf, ValidationOptions } from "class-validator";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";

@ValidatorConstraint({ name: "match-password", async: false })
export class IsMatchPasswordConstraint implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
        return args.object[args.constraints[0]] == value;
    }

    defaultMessage(args: ValidationArguments) {
        return "Passwords do not match!";
    }
}
export function IsMatchPassword(
    matchWith: string,
    validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [matchWith],
            validator: IsMatchPasswordConstraint,
        });
    };
}

export class LoginDTO {
    @IsEmail()
    email:string;
    @IsStrongPassword()
    password: string;
}

export class ConfirmEmailDTO{
    @IsEmail()
    email: string;
    @Matches(/^\d{6}$/)
    otp:string;
}

export class CreateAccountDto {
    @IsString({ message: "string is required" })
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    userName: string;
    @IsEmail()
    email: string;
    @IsStrongPassword()
    password: string;
    @ValidateIf((o: CreateAccountDto) => {
        return o.password ? true : false;
    })
    // @Validate(IsMatchPasswordConstraint)
    @IsMatchPassword('password')
    @IsStrongPassword()
    confirmationPassword: string;
}
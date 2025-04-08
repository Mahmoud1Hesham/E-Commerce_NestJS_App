import { compareSync, hashSync } from "bcrypt"


export const generateHash = (plainText: string, salt: number = parseInt(process.env.SALT ?? "10")): string => {
    return hashSync(plainText, salt)
}


export const compareHash = (plainText: string, hashedValue: string): boolean => {
    console.log(plainText , hashedValue)
    if (!plainText || !hashedValue) {
        throw new Error("compareHash: both plainText and hashedValue are required");
    }
    return compareSync(plainText, hashedValue);
};

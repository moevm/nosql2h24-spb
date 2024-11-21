import {IsEmail, IsIn, IsString, MaxLength, MinLength} from "class-validator";

export class CreateUserDto {
    @IsString()
    @MinLength(4)
    @MaxLength(50)
    name: string

    @IsString()
    @IsEmail()
    email: string

    @IsString()
    @MinLength(6)
    @MaxLength(64)
    password: string

    @IsString()
    @IsIn(['USER', 'ADMIN'])
    role: "USER" | "ADMIN"
}

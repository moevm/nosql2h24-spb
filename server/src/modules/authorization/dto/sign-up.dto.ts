import {IsEmail, IsString, MaxLength, MinLength} from "class-validator";

export class SignUpDto {
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
}

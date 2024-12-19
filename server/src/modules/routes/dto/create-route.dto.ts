import {IsObject, IsString, IsNumber, MaxLength, MinLength, ValidateNested} from "class-validator";

export class CreateRouteDto {
    @IsString()
    @MinLength(4)
    @MaxLength(50)
    name: string;

    @IsString()
    @MaxLength(2000)
    description: string;

    @IsNumber()
    length: number;

    @IsNumber()
    duration: number;
}

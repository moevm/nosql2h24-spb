import { IsString, MaxLength, MinLength, IsArray, ArrayMinSize } from "class-validator";

export class CreateRouteDto {
    @IsString()
    @MinLength(4)
    @MaxLength(50)
    name: string;

    @IsString()
    @MaxLength(2000)
    description: string;

    @IsArray()
    @ArrayMinSize(2)
    points: string[];
}

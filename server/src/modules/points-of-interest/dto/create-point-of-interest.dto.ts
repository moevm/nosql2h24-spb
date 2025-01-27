import Point from "./point";
import {IsObject, IsString, MaxLength, MinLength, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class CreatePointOfInterestDto {
    @IsString()
    @MinLength(4)
    @MaxLength(50)
    name: string;

    description: string[];
    
    @IsObject()
    @ValidateNested()
    @Type(() => Point)
    location: Point;
}

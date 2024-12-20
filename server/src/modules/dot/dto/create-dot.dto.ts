import Point from "./point";
import {IsObject} from "class-validator";
import {Type} from "class-transformer";

export class CreateDotDto {
    @IsObject()
    // @ValidateNested()
    @Type(() => Point)
    location: Point;
}

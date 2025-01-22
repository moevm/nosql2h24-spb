import Point from "./point";
import {IsObject, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class CreateIntersectionDto {
    @IsNumber()
    count_streets: number;

    @IsObject()
    @Type(() => Point)
    location: Point;
}

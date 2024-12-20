import Point from "./point";
import {IsObject} from "class-validator";
import {Type} from "class-transformer";

export class CreateDotDto {
    @IsObject()
    @Type(() => Point)
    location: Point;
}

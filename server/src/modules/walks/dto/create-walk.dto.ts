import {IsNumber} from "class-validator";

export class CreateWalkDto {
    @IsNumber()
    length: number;
}

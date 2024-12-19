import {IsNumber} from "class-validator";

export default class Point {

    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: number;
}
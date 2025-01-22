import Point from "../dto/point";

export default class Intersection {
    id: string;
    location: Point;
    streets_count: number;

    constructor(id: string, location: Point, streets_count: number) {
        this.id = id;
        this.location = location;
        this.streets_count = this.streets_count;
    }

}

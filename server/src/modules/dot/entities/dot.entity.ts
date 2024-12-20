import Point from "../dto/point";

export default class Dot {
    id: string;
    time: string;
    location: Point;

    constructor(id: string, location: Point, time: string) {
        this.id = id;
        this.location = location;
        this.time = time;
    }

}

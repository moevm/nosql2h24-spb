import PointOfInterest from "src/modules/points-of-interest/entities/point-of-interest.entity";

export default class Route {
    id: string;
    name: string;
    description: string;
    length: number;
    duration: number;
    createdAt: string;
    points: PointOfInterest[]

    constructor(id: string, name: string, description: string, length: number, duration: number, createdAt: string, points: PointOfInterest[]) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.length = length;
        this.duration = duration;
        this.createdAt = createdAt;
        this.points = points
    }

}

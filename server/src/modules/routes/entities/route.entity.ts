import PointOfInterest from "src/modules/points-of-interest/entities/point-of-interest.entity";
import { User } from "src/modules/users/entities/user.entity";

export default class Route {
    id: string;
    name: string;
    description: string;
    length: number;
    duration: number;
    createdAt: string;
    points: PointOfInterest[];
    author: User;

    constructor(id: string, name: string, description: string, length: number, duration: number, createdAt: string, points: PointOfInterest[], author: User) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.length = length;
        this.duration = duration;
        this.createdAt = createdAt;
        this.points = points;
        this.author = author;
    }

}

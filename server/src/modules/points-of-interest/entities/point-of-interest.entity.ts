import Point from "../dto/point";

export default class PointOfInterest {
    id: string;
    name: string;
    description: string[];
    images: string[];
    location: Point;
    createdAt: string;

    constructor(id: string, name: string, description: string[], images: string[], location: Point, createdAt: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.images = images;
        this.location = location;
        this.createdAt = createdAt;
    }

}

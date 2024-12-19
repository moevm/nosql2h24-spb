
export default class Route {
    id: string;
    name: string;
    description: string;
    length: number;
    duration: number;
    createdAt: string;

    constructor(id: string, name: string, description: string, length: number, duration: number, createdAt: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.length = length;
        this.duration = duration;
        this.createdAt = createdAt;
    }

}

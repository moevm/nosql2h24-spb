import {Exclude} from "class-transformer";

export class User {
    constructor(elementId: string, name: string, email: string, password: string, role: string, createdAt: string) {
        this.id = elementId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
    }

    id: string;
    name: string;
    email: string;

    @Exclude()
    password: string;

    role: string;
    createdAt: string;
}

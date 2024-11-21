export class User {
    constructor(elementId: string, name: string, email: string, role: string, createdAt: string) {
        this.id = elementId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
    }

    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

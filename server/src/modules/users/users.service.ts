import {Injectable, NotFoundException, OnModuleInit} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {Neo4jService} from "../neo4j/neo4j.service";
import {User} from "./entities/user.entity";

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(private readonly neo4jService: Neo4jService) {
    }

    async onModuleInit() {
        const session = this.neo4jService.getWriteSession();
        try {
            await session.run("CREATE CONSTRAINT user_email IF NOT EXISTS FOR (user :User) REQUIRE user.email IS UNIQUE");
            await this.create({name: "admin", email: "admin@example.com", password: "password", role: "ADMIN"});
            await this.create({name: "user", email: "user@example.com", password: "password", role: "USER"});
        } finally {
            await session.close()
        }
    }

    async create(createUserDto: CreateUserDto) {
        const session = this.neo4jService.getWriteSession();
        try {
            const result = await session.run(
                `CREATE (user :User {
                    name: "${createUserDto.name}", 
                    email: "${createUserDto.email}", 
                    password: "${createUserDto.password}",
                    role: "${createUserDto.role}",
                    created_at: Datetime()
                }) RETURN user`);
            const node = result.records.at(0).get('user');
            return new User(
                node.elementId,
                node.properties.name,
                node.properties.email,
                node.properties.role,
                node.properties.created_at.toString(),
            );
        } finally {
            await session.close();
        }
    }

    async findAll() {
        const session = this.neo4jService.getReadSession();
        try {
            const result = await session.run(
                `MATCH (user :User) RETURN user`
            )
            return result.records.map(record => {
                const node = record.get('user');
                return new User(
                    node.elementId,
                    node.properties.name,
                    node.properties.email,
                    node.properties.role,
                    node.properties.created_at.toString(),
                );
            });
        } finally {
            await session.close();
        }
    }


    async findOne(id: string) {
        const session = this.neo4jService.getReadSession();
        try {
            const result = await session.run(
                `MATCH (user :User WHERE elementId(user) = "${id}") RETURN user`
            )
            const node = result.records.at(0)?.get('user');
            if (!node) {
                throw new NotFoundException(`User with id: ${id} not found`);
            }
            return new User(
                node.elementId,
                node.properties.name,
                node.properties.email,
                node.properties.role,
                node.properties.created_at.toString(),
            );
        } finally {
            await session.close();
        }
    }
}

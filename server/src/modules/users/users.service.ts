import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {Neo4jService} from "../neo4j/neo4j.service";
import {User} from "./entities/user.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly neo4jService: Neo4jService) {
    }

    async create(createUserDto: CreateUserDto) {
        const session = this.neo4jService.getWriteSession();
        try {
            const passwordHash = await bcrypt.hash(createUserDto.password, 10);
            const result = await session.run(
                `CREATE (user :User {
                    name: "${createUserDto.name}", 
                    email: "${createUserDto.email}", 
                    password: "${passwordHash}",
                    role: "${createUserDto.role}",
                    created_at: Datetime()
                }) RETURN user`);
            const node = result.records.at(0).get('user');
            return new User(
                node.elementId,
                node.properties.name,
                node.properties.email,
                node.properties.password,
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
                    node.properties.password,
                    node.properties.role,
                    node.properties.created_at.toString(),
                );
            });
        } finally {
            await session.close();
        }
    }

    async findAllFiltr(filtr: any) {
        const session = this.neo4jService.getReadSession();
        try {
            const queryParams: any = {};
            const conditions: string[] = [];
            if (filtr.name) {
                conditions.push('LOWER(user.name) =~ LOWER($name)');
                queryParams.name = `(?i).*${filtr.name}.*`;
            }
            if (filtr.email) {
                conditions.push('LOWER(user.email) =~ LOWER($email)');
                queryParams.email = `(?i).*${filtr.email}.*`;
            }
            if (filtr.fromDate) {
                conditions.push('user.created_at >= datetime($fromDate)');
                queryParams.fromDate = filtr.fromDate;
            }
            if (filtr.toDate) {
                conditions.push('user.created_at <= datetime($toDate)');
                queryParams.toDate = filtr.toDate;
            }
            let query = 'MATCH (user:User)';
            if (conditions.length > 0) {
                query += '\nWHERE ' + conditions.join('\nAND ');
            }
            query += '\nRETURN user';

            const result = await session.run(query, queryParams);
            return result.records.map(record => {
                const node = record.get('user');
                return new User(
                    node.elementId,
                    node.properties.name,
                    node.properties.email,
                    node.properties.password,
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
            );
            const node = result.records.at(0)?.get('user');
            if (!node) {
                throw new NotFoundException(`User with id: ${id} not found`);
            }
            return new User(
                node.elementId,
                node.properties.name,
                node.properties.email,
                node.properties.password,
                node.properties.role,
                node.properties.created_at.toString(),
            );
        } finally {
            await session.close();
        }
    }

    async findOneByEmail(email: string) {
        const session = this.neo4jService.getReadSession();
        try {
            const result = await session.run(
                `MATCH (user :User WHERE user.email = "${email}") RETURN user`
            );
            const node = result.records.at(0)?.get('user');
            if (!node) {
                throw new NotFoundException(`User with email: ${email} not found`);
            }
            return new User(
                node.elementId,
                node.properties.name,
                node.properties.email,
                node.properties.password,
                node.properties.role,
                node.properties.created_at.toString()
            );
        } finally {
            await session.close();
        }
    }
}

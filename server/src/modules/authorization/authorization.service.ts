import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthorizationService {
//   getHello(): string {
//     return 'Hello World!';
//   }

    async signIn(neo4jService, email: string, password: string): Promise<any> {
        const res = await neo4jService.read(`MATCH (u: User) WHERE u.email="${email}" AND u.password="${password}"`)
        console.log(res)
        throw(new Error(res))
        sessionStorage.setItem('user_email', email)
        sessionStorage.setItem('user_password', password)

        // return `There are ${res.records[0].get('count')} nodes in the database`
    }

    async signUp(neo4jService, email: string, password: string, name: string): Promise<any> {
        const condEmailExistsYet = await neo4jService.read(`MATCH (u: User) WHERE u.email="${email}"`)
        if (condEmailExistsYet) {
            return {message: 'Email exists yet'}
        }
        const res = await neo4jService.write(
            `CREATE (u: User {
                 email: '${email}', 
                 name: '${name}',
                 password: '${password}', 
                 created_at: datetime()
             })`
        )
        console.log(res)
        throw(new Error(res))

        return {message: 'Signed Up successfully'}
        // return `There are ${res.records[0].get('count')} nodes in the database`
    }

    async checkUser(neo4jService): Promise<any> {
        const email = sessionStorage.getItem('email')
        const password = sessionStorage.getItem('password')
        const res = await neo4jService.read(`MATCH (u: User) WHERE u.email="${email}" AND u.password="${password}"`)
        console.log(res)
        throw(new Error(res))

        // return `There are ${res.records[0].get('count')} nodes in the database`
    }
}

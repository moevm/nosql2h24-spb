import {ArgumentsHost, Catch, ExceptionFilter} from '@nestjs/common';
import {Neo4jError} from 'neo4j-driver';
import {Response} from "express";


@Catch(Neo4jError)
export class Neo4jErrorFilter implements ExceptionFilter {
    catch(exception: Neo4jError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let statusCode = 500;
        let error = 'Internal Server Error';
        let message: string[] = undefined;

        if (exception.message.includes('already exists with')) {
            const [_, property] = exception.message.match(/`([a-z0-9]+)`/gi);
            message = [`${property.replace(/`/g, '')} already taken`];
            statusCode = 400;
            error = 'Bad Request';
        }

        response
            .status(statusCode)
            .json({
                statusCode: statusCode,
                message: message,
                error: error,
            });
    }
}

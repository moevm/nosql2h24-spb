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
        let message: string[] = [exception.message];

        // Neo.ClientError.Schema.ConstraintValidationFailed
        // Node already exists with label `...` and property `...`' 
        if (exception.message.includes('already exists with')) {
            const [_, property] = exception.message.match(/`([a-z0-9]+)`/gi);
            message = [`${property.replace(/`/g, '')} already taken`];
            statusCode = 409;
            error = 'Conflict';
        }

        // Neo.ClientError.Procedure.ProcedureCallFailed
        // Failed to invoke procedure `apoc.util.validate`: Caused by: java.lang.RuntimeException: Point of interest with id ... not found
        if (exception.message.includes('not found')) {
            const messagePosition = exception.message.lastIndexOf(': ')
            message = [exception.message.substring(messagePosition + 2)];
            statusCode = 404;
            error = 'Not Found';
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

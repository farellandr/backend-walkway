import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { cleanErrorMessage } from './clean-error-message';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = exception.message || 'An unexpected error occurred.';
    let error = 'Internal server error';
    let statusCode = status;

    if (exception instanceof EntityNotFoundError) {
      statusCode = HttpStatus.NOT_FOUND;
      error = 'Data not found';
      message = cleanErrorMessage(exception.message) || 'Requested data could not be found.';
    } 
    
    else if (exception instanceof QueryFailedError) {
      statusCode = HttpStatus.BAD_REQUEST;
      error = 'Database query failed';
      message = exception.message || 'A database query error occurred.';
    } 
    
    else if (exception instanceof HttpException) {
      const response = exception.getResponse() as any;
      statusCode = response.statusCode || status;
      error = response.error || 'Internal server error';
      message = response.message || 'An unexpected error occurred.';
    }

    response.status(statusCode).json({
      statusCode,
      error,
      message,
    });
  }
}

import { HttpException, HttpStatus } from "@nestjs/common";
import { EntityNotFoundError, QueryFailedError } from "typeorm";
import { cleanErrorMessage } from "./clean-error-message";

export function CommonErrorHandler(error: any) {
  if (error instanceof EntityNotFoundError) {
    throw new HttpException(
      {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Data not found.',
        message: cleanErrorMessage(error.message) || 'Requested data could not be found.',
      },
      HttpStatus.NOT_FOUND,
    );
  } else if (error instanceof QueryFailedError) {
    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Database query failed.',
        message: error.message || 'A database query error occurred.',
      },
      HttpStatus.BAD_REQUEST,
    );
  } else {
    throw new HttpException(
      {
        statusCode: error?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        error: error?.response?.error || 'Internal server error.',
        message: error?.response?.message || 'An unexpected error occurred.',
      },
      error?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
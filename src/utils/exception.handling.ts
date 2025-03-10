import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    BadRequestException,
  } from '@nestjs/common';
  import { Prisma } from '@prisma/client';
  import { Response } from 'express';
  
  interface ErrorResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: any; // Adding data field
  }
  
  @Catch()
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      let status = 500;
      let message:any = 'Internal server error';
      let data = null; // Default value for error case
  
      // Handle HttpException
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
  
        if (
          typeof exceptionResponse === 'object' &&
          'message' in exceptionResponse
        ) {
          message = (exceptionResponse as { message: string }).message;
        } else if (typeof exceptionResponse === 'string') {
          message = exceptionResponse;
        }
      }
  
      //Handle BadException
      if (exception instanceof BadRequestException) {
        const responseObj = exception.getResponse();
        if (typeof responseObj === 'object' && 'message' in responseObj) {
          const detailedErrors = (responseObj as any).message;
          message = Array.isArray(detailedErrors)
            ? detailedErrors.join(', ')
            : detailedErrors;
        }
      }
  
      // Handle Prisma Known Errors
      else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
        switch (exception.code) {
          case 'P2000': // Unique constraint failed
            status = 400;
            message = `The provided value for the column is too long for the column's type. Column: ${exception?.meta?.target[0] || ""}`;
            break;
         
          case 'P2002': // Unique constraint failed
            status = 409;
            message = `A record with the unique field(s): "${exception?.meta?.target[0] || ""}" already exists.`
            break;
  
          case 'P2003': 
            status = 400;
            const rawFieldName = exception?.meta?.field_name;
            const fieldName = typeof rawFieldName === 'string' ? rawFieldName.replace(/_fkey.*/, '') : 'the related record';
            message = `The required ${fieldName?.replace(/_fkey.*/, '')} does not exist. Please create it before proceeding.`;
            break;  
  
          case 'P2006': 
            status = 400;
            message = 'The data provided for a field is invalid for the database type';
            break;
  
          case 'P2007': 
            status = 400;
            message = 'The data provided does not match the expected format or constraints in the database schema';
            break;
            
          case 'P2025': // Record not found
            status = 404;
            message = exception?.meta?.cause || 'The requested resource was not found.';
            break;
            
          default:
            message = `Prisma error: ${exception.message}`;
            break;
        }
      } else if (exception instanceof Prisma.PrismaClientUnknownRequestError) {
        message = 'An unknown database error occurred. Please try again later.';
      }
  
      // Handle Prisma Initialization Errors
      else if (exception instanceof Prisma.PrismaClientInitializationError) {
        message =
          'Database connection failed. Please check the database configuration.';
      }
  
      // Handle Prisma Rust Errors
      else if (exception instanceof Prisma.PrismaClientRustPanicError) {
        message = 'An internal database error occurred. Please contact support.';
      }
  
      // Handle general JavaScript Error
      else if (exception instanceof Error) {
        message = exception.message;
      }
  
      // Prepare error response
      const errorResponse: ErrorResponse = {
        statusCode: status,
        success: status < 400,
        message: message,
        data: data, // null in case of error
      };
      response.status(status).json(errorResponse);
    }
  }
  
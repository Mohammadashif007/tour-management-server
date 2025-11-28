/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVers } from "../config/env";
import { AppError } from "../errorHelpers/AppError";
import mongoose from "mongoose";
import {
    TErrorSources,
    TGenericErrorResponse,
} from "../interfaces/error.types";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleValidationError } from "../helpers/handleValidationError";
import { handleZodError } from "../helpers/handleZodError";

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let errorSources: { path: string; message: string }[] = [];
    let statusCode = 500;
    let message = `Something went wrong`;

    if (err.code === 11000) {
        const simplifiedError = handleDuplicateError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    } else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    } else if (err.name === "ValidationError") {
        // const errors = Object.values(err.errors) as {
        //     path: string;
        //     message: string;
        // }[];
        // errors.forEach((errObject) =>
        //     errorSources.push({
        //         path: errObject.path,
        //         message: errObject.message,
        //     })
        // );
        const simplifiedError = handleValidationError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources ?? [];
    } else if (err.name === "ZodError") {
        // statusCode = 400;
        // message = "Zod Error";
        // console.log(err.issues);
        // err.issues.forEach((issue: any) =>
        //     errorSources.push({
        //         path: issue.path[issue.path.length - 1],
        //         message: issue.message,
        //     })
        // );

        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources ?? [];
    } else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        errorSource: errorSources,
        err: envVers.NODE_ENV === "development" ? err : null,
        stack: envVers.NODE_ENV === "development" ? err.stack : null,
    });
};

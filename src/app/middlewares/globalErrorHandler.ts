/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVers } from "../config/env";
import { AppError } from "../errorHelpers/AppError";

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errorSource: { path: string; message: string }[] = [];
    let statusCode = 500;
    let message = `Something went wrong`;

    if (err.code === 11000) {
        const matchedArray = err.message.match(/email:\s*"([^"]+)"/);
        statusCode = 400;
        message = `${matchedArray[1]} already exist!!`;
    } else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid mongodb objectId, please provide a valid ID";
    } else if (err.name === "ValidationError") {
        const errors = Object.values(err.errors) as {
            path: string;
            message: string;
        }[];
        errors.forEach((errObject) =>
            errorSource.push({
                path: errObject.path,
                message: errObject.message,
            })
        );
        console.log(errorSource);
        statusCode = 400;
        message = err.message;
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
        errorSource,
        // err,
        stack: envVers.NODE_ENV === "development" ? err.stack : "",
    });
};

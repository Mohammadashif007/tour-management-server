/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVers } from "../config/env";

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = 500;
    const message = `Something went wrong !! ${err}`;

    res.status(statusCode).json({
        success: false,
        message: message,
        err,
        stack: envVers.NODE_ENV === "development" ? err.stack : "",
    });
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVers } from "../config/env";

type asyncHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>;

export const catchAsync =
    (fn: asyncHandler) => (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err: any) => {
            if (envVers.NODE_ENV === "development") {
                console.log(err);
            }
            next(err);
        });
    };

import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import { envVers } from "../config/env";

export const validateRequest = (schema: ZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (envVers.NODE_ENV === "development") {
                console.log("error from middleware:", error);
            }
            next(error);
        }
    };
};

import { NextFunction, Request, Response } from "express";
import { AppError } from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth =
    (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.headers.authorization;
            if (!accessToken) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    "Access token not found"
                );
            }

            const verifiedToken = verifyToken(accessToken) as JwtPayload;
            if (!authRoles.includes(verifiedToken.role)) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    "You are not permitted to access this route"
                );
            }
            req.user = verifiedToken;
            next();
        } catch (error) {
            next(error);
        }
    };

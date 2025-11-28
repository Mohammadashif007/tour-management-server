import { NextFunction, Request, Response } from "express";
import { AppError } from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { envVers } from "../config/env";
import { User } from "../models/user/user.model";
import { IsActive } from "../models/user/user.interface";

export const checkAuth =
    (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.cookies.accessToken;
            if (!accessToken) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    "Access token not found"
                );
            }

            const verifiedToken = verifyToken(
                accessToken,
                envVers.JWT_ACCESS_SECRET
            ) as JwtPayload;

            // ! check user

            const isUserExist = await User.findOne({
                email: verifiedToken.email,
            });

            if (!isUserExist) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    "User dose not exist"
                );
            }

            if (
                isUserExist.isActive === IsActive.BLOCKED ||
                isUserExist.isActive === IsActive.INACTIVE
            ) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    "User is blocked or inactive"
                );
            }
            if (isUserExist.isDeleted) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    `User is ${isUserExist.isActive}`
                );
            }

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

import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import { AppError } from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "./user.interface";

const router = express.Router();

router.post(
    "/register",
    validateRequest(UserValidations.createUserZodSchema),
    UserControllers.createUser
);
router.get(
    "/",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.headers.authorization;
            if (!accessToken) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    "Access token not found"
                );
            }

            const verifiedToken = jwt.verify(accessToken, "secret");
            if (
                (verifiedToken as JwtPayload).role !== Role.ADMIN ||
                (verifiedToken as JwtPayload).role !== Role.SUPER_ADMIN
            ) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    "You are not permitted to access this route"
                );
            }
            next();
        } catch (error) {
            next(error);
        }
    },
    UserControllers.getAllUsers
);

export const UserRoutes = router;

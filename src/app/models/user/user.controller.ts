import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import httpStatus from "http-status-codes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserServices.createUserIntoDB(req.body);
        res.status(httpStatus.CREATED).json({
            success: true,
            message: "User created successfully",
            data: result,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const UserControllers = {
    createUser,
};

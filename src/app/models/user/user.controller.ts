import { Request, Response } from "express";
import { UserServices } from "./user.service";
import httpStatus from "http-status-codes";

const createUser = async (req: Request, res: Response) => {
    try {
        const userInfo = req.body;
        const result = await UserServices.createUserIntoDB(userInfo);
        res.status(httpStatus.CREATED).json({
            success: true,
            message: "User created successfully",
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "Something went wrong",
            error: error,
        });
    }
};

export const UserControllers = {
    createUser,
};

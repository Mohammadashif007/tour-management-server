import { Request, Response } from "express";
import { UserServices } from "./user.service";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.createUserIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User created successfully",
        data: result,
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.getAllUsersFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All User retrieve successfully",
        data: result,
    });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const verifiedToken = req.user as JwtPayload;
    const result = await UserServices.updateUser(
        userId,
        req.body,
        verifiedToken
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User updated successfully",
        data: result,
    });
});

export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser,
};

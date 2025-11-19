import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import httpStatus from "http-status-codes";

const credentialLogin = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.credentialsLogin(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User login successfully",
        data: result,
    });
});

export const AuthControllers = {
    credentialLogin,
};

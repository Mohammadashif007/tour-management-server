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

const newAccessToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const result = await AuthServices.getNewAccessToken(refreshToken);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "new access token created",
        data: result,
    });
});

export const AuthControllers = {
    credentialLogin,
    newAccessToken,
};

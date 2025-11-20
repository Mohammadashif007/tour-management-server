import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import httpStatus from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";

// ! login with email and password
const credentialLogin = catchAsync(async (req: Request, res: Response) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);
    res.cookie("accessToken", loginInfo.accessToken, {
        httpOnly: true,
        secure: false,
    });
    res.cookie("refreshToken", loginInfo.refreshToken, {
        httpOnly: true,
        secure: false,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User login successfully",
        data: loginInfo,
    });
});

// ! get new access token with refresh token
const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "Refresh token not found");
    }
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
    getNewAccessToken,
};

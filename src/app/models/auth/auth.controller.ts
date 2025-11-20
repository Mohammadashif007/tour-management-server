import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import httpStatus from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";
import { setAuthToken } from "../../utils/setCookies";
import { JwtPayload } from "jsonwebtoken";

// ! login with email and password
const credentialLogin = catchAsync(async (req: Request, res: Response) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);
    // res.cookie("accessToken", loginInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false,
    // });
    setAuthToken(res, loginInfo);
    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //     httpOnly: true,
    //     secure: false,
    // });
    // setAuthToken(res, loginInfo);

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
    const tokenInfo = await AuthServices.getNewAccessToken(
        refreshToken as string
    );
    // res.cookie("accessToken", tokenInfo, {
    //     httpOnly: true,
    //     secure: false,
    // });
    setAuthToken(res, tokenInfo);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "new access token retrieve successfully",
        data: tokenInfo,
    });
});

// ! log out
const logOut = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logout successfully",
        data: null,
    });
});

// ! reset password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user as JwtPayload;
    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password changed successfully",
        data: null,
    });
});

export const AuthControllers = {
    credentialLogin,
    getNewAccessToken,
    logOut,
    resetPassword,
};

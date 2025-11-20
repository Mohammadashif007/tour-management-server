import { JwtPayload } from "jsonwebtoken";
import { envVers } from "../config/env";
import { AppError } from "../errorHelpers/AppError";
import { IsActive, IUser } from "../models/user/user.interface";
import { User } from "../models/user/user.model";
import { generateToken, verifyToken } from "./jwt";
import httpStatus from "http-status-codes";

export const createUserToken = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };

    const accessToken = generateToken(
        jwtPayload,
        envVers.JWT_ACCESS_SECRET,
        envVers.JWT_ACCESS_EXPIRES
    );

    const refreshToken = generateToken(
        jwtPayload,
        envVers.JWT_REFRESH_SECRET,
        envVers.JWT_REFRESH_EXPIRES
    );

    return {
        accessToken,
        refreshToken,
    };
};

export const createNewAccessTokenWithRefreshToken = async (
    refreshToken: string
) => {
    // ! verify token
    const verifiedRefreshToken = verifyToken(
        refreshToken,
        envVers.JWT_REFRESH_SECRET
    ) as JwtPayload;

    // ! check user and user status
    const isUserExist = await User.findOne({
        email: verifiedRefreshToken.email,
    });

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User dose not exist");
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

    // ! get new access token
    const payload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };

    const accessToken = generateToken(
        payload,
        envVers.JWT_ACCESS_SECRET,
        envVers.JWT_ACCESS_EXPIRES
    );

    return accessToken;
};

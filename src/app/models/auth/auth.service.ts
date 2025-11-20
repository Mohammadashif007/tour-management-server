import { AppError } from "../../errorHelpers/AppError";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcrypt";
import { createUserToken } from "../../utils/userTokens";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVers } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

// ! login user
const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    // ! check user exist or not
    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User dose not exist");
    }

    // ! check password match or not
    const isPasswordMatch = await bcrypt.compare(
        password as string,
        isUserExist.password as string
    );
    if (!isPasswordMatch) {
        throw new AppError(httpStatus.BAD_REQUEST, "Password dose not match");
    }

    // ! create access and refresh token
    const userToken = createUserToken(payload);

    // ! password exclusion
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject();

    return {
        user: rest,
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
    };
};

// ! generate new access token with refresh token
const getNewAccessToken = async (refreshToken: string) => {
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

export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
};

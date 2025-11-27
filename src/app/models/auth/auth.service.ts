import { AppError } from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcrypt";
import {
    createNewAccessTokenWithRefreshToken,
    createUserToken,
} from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVers } from "../../config/env";

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
    const userToken = createUserToken(isUserExist);

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
    const newAccessToken = await createNewAccessTokenWithRefreshToken(
        refreshToken
    );
    return { accessToken: newAccessToken };
};

// ! reset password
const resetPassword = async (
    oldPassword: string,
    newPassword: string,
    decodedToken: JwtPayload
) => {
    const user = await User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
    }

    const isOldPasswordMatched = await bcrypt.compare(
        oldPassword,
        user.password as string
    );

    if (!isOldPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Password dose not match");
    }

    user.password = await bcrypt.hash(
        newPassword,
        Number(envVers.BCRYPT_SAULT_ROUND)
    );

    await user.save();
};

export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword,
};

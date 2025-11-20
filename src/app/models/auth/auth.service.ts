import { AppError } from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt";
import { envVers } from "../../config/env";

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;
    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User dose not exist");
    }

    const isPasswordMatch = await bcrypt.compare(
        password as string,
        isUserExist.password as string
    );

    if (!isPasswordMatch) {
        throw new AppError(httpStatus.BAD_REQUEST, "Password dose not match");
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
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
        email: isUserExist.email,
        accessToken,
        refreshToken,
    };
};

export const AuthServices = {
    credentialsLogin,
};

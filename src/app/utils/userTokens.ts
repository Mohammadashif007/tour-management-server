import { envVers } from "../config/env";
import { IUser } from "../models/user/user.interface";
import { generateToken } from "./jwt";

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

import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { envVers } from "../config/env";

export const generateToken = (payload: JwtPayload) => {
    const accessToken = jwt.sign(payload, envVers.JWT_ACCESS_SECRET, {
        expiresIn: envVers.JWT_ACCESS_EXPIRES,
    } as SignOptions);
    return accessToken;
};

export const verifyToken = (token: string) => {
    const accessToken = jwt.verify(token, envVers.JWT_ACCESS_SECRET);
    return accessToken;
};

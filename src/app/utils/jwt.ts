import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";


export const generateToken = (
    payload: JwtPayload,
    secret: string,
    expiresIn: string
) => {
    const accessToken = jwt.sign(payload, secret, {
        expiresIn,
    } as SignOptions);
    return accessToken;
};

export const verifyToken = (token: string, secret: string) => {
    const accessToken = jwt.verify(token, secret);
    return accessToken;
};

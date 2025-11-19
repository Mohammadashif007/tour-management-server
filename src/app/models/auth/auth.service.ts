import { AppError } from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    const accessToken = jwt.sign(jwtPayload, "secret", { expiresIn: "1d" });

    return {
        email: isUserExist.email,
        accessToken,
    };
};

export const AuthServices = {
    credentialsLogin,
};

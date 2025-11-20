import { AppError } from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcrypt";
import { envVers } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

// ! create user
const createUserIntoDB = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already exist");
    }

    const hashedPassword = await bcrypt.hash(
        password as string,
        Number(envVers.BCRYPT_SAULT_ROUND)
    );

    const authsProvider: IAuthProvider = {
        provider: "credentials",
        providerId: email as string,
    };

    const result = await User.create({
        email,
        password: hashedPassword,
        auths: [authsProvider],
        ...rest,
    });
    return result;
};

// ! get all user
const getAllUsersFromDB = async () => {
    const users = await User.find({});
    const totalUser = await User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUser,
        },
    };
};

// ! update user
const updateUser = async (
    userId: string,
    payload: Partial<IUser>,
    decodedToken: JwtPayload
) => {
    
    const isUserExist = await User.findOne({ email: payload.email });
    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User dose not exist");
    }

    if (payload.role) {
        if (
            decodedToken.role === Role.USER ||
            decodedToken.role === Role.GUIDE
        ) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
        }

        if (
            payload.role === Role.SUPER_ADMIN &&
            decodedToken.role === Role.ADMIN
        ) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (
            decodedToken.role === Role.USER ||
            decodedToken.role === Role.GUIDE
        ) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
        }
    }

    if (payload.password) {
        payload.password = await bcrypt.hash(
            payload.password,
            Number(envVers.BCRYPT_SAULT_ROUND)
        );
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return newUpdatedUser;
};

export const UserServices = {
    createUserIntoDB,
    getAllUsersFromDB,
    updateUser,
};

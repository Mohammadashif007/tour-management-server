import { AppError } from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import statusCode from "http-status-codes";
import bcrypt from "bcrypt";

const createUserIntoDB = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        throw new AppError(statusCode.BAD_REQUEST, "User Already exist");
    }

    const hashedPassword = await bcrypt.hash(password as string, 10);

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

export const UserServices = {
    createUserIntoDB,
    getAllUsersFromDB,
};

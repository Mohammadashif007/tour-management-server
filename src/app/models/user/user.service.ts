import { AppError } from "../../errorHelpers/appError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import statusCode from "http-status-codes";

const createUserIntoDB = async (payload: Partial<IUser>) => {
    const user = await User.findOne({ email: payload.email });
    if (user) {
        throw new AppError(statusCode.BAD_REQUEST, "User Already exist");
    }
    const result = await User.create(payload);
    return result;
};

export const UserServices = {
    createUserIntoDB,
};

import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUserIntoDB = async (payload: Partial<IUser>) => {
    const result = await User.create(payload);
    return result;
};

export const UserServices = {
    createUserIntoDB,
};

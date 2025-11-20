import { AppError } from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcrypt";
import { createUserToken } from "../../utils/userTokens";

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

    const userToken = createUserToken(payload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject();

    return {
        user: rest,
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
    };
};

export const AuthServices = {
    credentialsLogin,
};

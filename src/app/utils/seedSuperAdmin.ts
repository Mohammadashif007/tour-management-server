import { envVers } from "../config/env";
import { AppError } from "../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "../models/user/user.interface";
import { User } from "../models/user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcrypt";

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({
            email: envVers.SUPER_ADMIN_EMAIL,
        });
        if (isSuperAdminExist) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Super admin already exist"
            );
        }

        console.log("Trying to create super admin");

        const hashedPassword = await bcrypt.hash(
            envVers.SUPER_ADMIN_PASSWORD,
            Number(envVers.BCRYPT_SAULT_ROUND)
        );

        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: envVers.SUPER_ADMIN_EMAIL,
        };

        const payload: IUser = {
            name: "Super Admin",
            email: envVers.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
            isVerified: true,
            auths: [authProvider],
        };

        const superAdmin = await User.create(payload);
        console.log("Super Admin Created Successfully");
        console.log(superAdmin);
    } catch (error) {
        console.log(error);
    }
};

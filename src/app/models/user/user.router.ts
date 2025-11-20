import express from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";

import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = express.Router();

router.post(
    "/register",
    validateRequest(UserValidations.createUserZodSchema),
    UserControllers.createUser
);
router.get(
    "/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    UserControllers.getAllUsers
);
router.patch(
    "/:id",
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.USER, Role.GUIDE),
    checkAuth(...Object.values(Role)),
    UserControllers.updateUser
);

export const UserRoutes = router;

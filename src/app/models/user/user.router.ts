import express from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";

const router = express.Router();

router.post(
    "/register",
    validateRequest(UserValidations.createUserZodSchema),
    UserControllers.createUser
);
router.get("/", UserControllers.getAllUsers);

export const UserRoutes = router;

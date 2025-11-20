import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AuthControllers } from "./auth.controller";
import express from "express";

const router = express.Router();

router.post("/login", AuthControllers.credentialLogin);
router.post("/refresh-Token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logOut);
router.post(
    "/reset-password",
    checkAuth(...Object.values(Role)),
    AuthControllers.resetPassword
);

export const AuthRoutes = router;

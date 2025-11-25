import passport from "passport";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AuthControllers } from "./auth.controller";
import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.post("/login", AuthControllers.credentialLogin);
router.post("/refresh-Token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logOut);
router.post(
    "/reset-password",
    checkAuth(...Object.values(Role)),
    AuthControllers.resetPassword
);
router.get(
    "/google",
    async (req: Request, res: Response, next: NextFunction) => {
        const redirect = req.query.redirect || "/";
        passport.authenticate("google", {
            scope: ["profile", "email"],
            state: redirect as string,
        })(req, res, next);
    }
);
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    AuthControllers.googleCallbackController
);

export const AuthRoutes = router;

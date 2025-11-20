import { AuthControllers } from "./auth.controller";
import express from "express";

const router = express.Router();

router.post("/login", AuthControllers.credentialLogin);
router.post("/refresh-Token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logOut);

export const AuthRoutes = router;

import { AuthControllers } from "./auth.controller";
import express from "express";

const router = express.Router();

router.post("/login", AuthControllers.credentialLogin);
router.post("/refreshToken", AuthControllers.newAccessToken);

export const AuthRoutes = router;

import express from "express";
import { UserRoutes } from "../models/user/user.router";
import { AuthRoutes } from "../models/auth/auth.router";

export const router = express.Router();

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes,
    },
    {
        path: "/auth",
        route: AuthRoutes,
    },
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

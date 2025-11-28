import express from "express";
import { UserRoutes } from "../models/user/user.router";
import { AuthRoutes } from "../models/auth/auth.router";
import { DivisionRoutes } from "../models/division/division.router";


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
    {
        path: "/division",
        route: DivisionRoutes,
    },
    // {
    //     path: "/tour",
    //     route: TourRoutes,
    // },
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.use((req: Request, res: Response) => {
    res.send("Welcome to fair haven");
});

app.use(globalErrorHandler);

export default app;

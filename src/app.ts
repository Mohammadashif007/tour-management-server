import express, { Request, Response } from "express";
import { UserRoutes } from "./app/models/user/user.router";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/user", UserRoutes);

app.use((req: Request, res: Response) => {
    res.send("Welcome to fair haven");
});

export default app;

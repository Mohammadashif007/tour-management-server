import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";


const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.use((req: Request, res: Response) => {
    res.send("Welcome to fair haven");
});

export default app;

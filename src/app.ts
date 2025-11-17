import express, { Request, Response } from "express";

const app = express();

app.use((req: Request, res: Response) => {
    res.send("Welcome to fair haven");
});

export default app;

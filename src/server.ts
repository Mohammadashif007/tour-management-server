/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVers } from "./app/config/env";

let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVers.DB_URL);
        console.log("💀 Connected to db");

        server = app.listen(envVers.PORT, () => {
            console.log(`🏃‍♀️🏃‍♀️ Server is listening at port ${envVers.PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};

startServer();

// ! unhandled rejection
process.on("unhandledRejection", (error) => {
    console.log(
        "Unhandled rejection error detected... server shutting down",
        error
    );
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});

// ! uncaught Exception
process.on("uncaughtException", (error) => {
    console.log("Uncaught exception detected... server shutting down", error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});

// ! signal termination
process.on("SIGTERM", (error) => {
    console.log("SIGINT signal detected... server shutting down", error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});

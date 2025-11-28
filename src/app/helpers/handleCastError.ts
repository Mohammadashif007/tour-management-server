import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interfaces/error.types";
import { envVers } from "../config/env";

export const handleCastError = (
    err: mongoose.Error.CastError
): TGenericErrorResponse => {
    if (envVers.NODE_ENV === "development") {
        console.log(err);
    }
    return {
        statusCode: 400,
        message: "Invalid mongodb objectId, please provide a valid ID",
    };
};

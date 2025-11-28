import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";

export const handleValidationError = (
    err: mongoose.Error.ValidationError
): TGenericErrorResponse => {
    const errorSources: TErrorSources[] = [];

    const errors = Object.values(err.errors) as {
        path: string;
        message: string;
    }[];
    errors.forEach((errObject) =>
        errorSources.push({
            path: errObject.path,
            message: errObject.message,
        })
    );

    return {
        statusCode: 400,
        message: "Validation error",
        errorSources,
    };
};
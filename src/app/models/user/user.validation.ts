import z from "zod";
import { IsActive, Role } from "./user.interface";

const createUserZodSchema = z.object({
    name: z
        .string({ error: "Name is required" })
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50, { message: "Name is too long" }),
    email: z.email({ error: "Email is required" }),
    password: z
        .string()
        .min(8, {
            message: "Password must be at least 8 characters long",
        })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter",
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter",
        })
        .regex(/[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/, {
            message: "Password must contain at least one special character",
        }),
    phone: z
        .string()
        .regex(/^01\d{9}$/, {
            message:
                "Phone number must be a valid Bangladeshi number (11 digits, starts with 01)",
        })
        .optional(),

    address: z
        .string({ message: "Address must be a string" })
        .max(200)
        .optional(),
});

const updateUserZodSchema = z.object({
    name: z
        .string({ error: "Name is required" })
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50, { message: "Name is too long" })
        .optional(),
    password: z
        .string()
        .min(8, {
            message: "Password must be at least 8 characters long",
        })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter",
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter",
        })
        .regex(/[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/, {
            message: "Password must contain at least one special character",
        })
        .optional(),
    phone: z
        .string()
        .regex(/^01\d{9}$/, {
            message:
                "Phone number must be a valid Bangladeshi number (11 digits, starts with 01)",
        })
        .optional(),

    role: z.enum(Object.values(Role) as [string]).optional(),
    isActive: z.enum(Object.values(IsActive) as [string]).optional(),
    isDeleted: z
        .boolean({ error: "isDeleted must be true of false" })
        .optional(),
    isVerified: z
        .boolean({ error: "isVerified must be true of false" })
        .optional(),

    address: z
        .string({ message: "Address must be a string" })
        .max(200)
        .optional(),
});

export const UserValidations = {
    createUserZodSchema,
    updateUserZodSchema,
};

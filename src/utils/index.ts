import { Prisma } from "@prisma/client";
import argon2 from "argon2";
import { sign, verify } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export async function hashPassword(password: string) {
    const updatedPassword = await argon2.hash(password);
    return updatedPassword
}

export async function verifyPassword(password: string, hashedPassword: string) {
    return await argon2.verify(hashedPassword, password);
}

export function generateToken(user: Prisma.UserMaxAggregateOutputType): string {
    // Ensure environment variables are defined
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

    if (!jwtSecret || !jwtExpiresIn) {
        throw new Error('JWT_SECRET or JWT_EXPIRES_IN is not defined in .env');
    }

    // Validate `expiresIn` format
    const validExpiresIn = /^[0-9]+(s|m|h|d|w|y)?$/i.test(jwtExpiresIn);
    if (!validExpiresIn) {
        throw new Error(`Invalid JWT_EXPIRES_IN format: ${jwtExpiresIn}. Expected formats: "60", "10m", "1h", "7d", "1w".`);
    }

    const { password, ...payload } = user

    // Generate the token
    const token = sign(payload, jwtSecret, {
        expiresIn: jwtExpiresIn as `${number}${"s" | "m" | "h" | "d" | "w" | "y"}`, // Explicit type
    });

    return token;
}

export function validateToken(token: string) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in .env');
    }
    const decoded = verify(token, jwtSecret);
    return decoded;
}
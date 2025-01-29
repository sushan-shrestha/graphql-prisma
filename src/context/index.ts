import { PrismaClient } from "@prisma/client";
import { validateToken } from "../utils";
import { unAuthorizedError } from "../utils/errorHandler";

const prisma = new PrismaClient();

export const createContext = ({ req, res }: { req: any; res: any }) => {
    const token = req.headers?.authorization?.replace('Bearer ', '') || '';
    let user = null;

    // Get the operation name from the request body (if available)
    const operationName = req.body?.operationName;  // Can be used to determine if the route is public

    const requiresAuth = isPublicRoute(operationName) // Public routes are defined here

    // Check if token is available and validate
    if (requiresAuth) {
        if (token) {
            try {
                // Verify the token using your secret key
                user = validateToken(token);
            } catch (err) {
                console.error("Invalid or expired token", err);
                throw unAuthorizedError("Invalid or expired token");
            }
        } else {
            throw unAuthorizedError("Invalid or expired token");
        }
    }
    return { prisma, user }; // Return user if valid, or null if not valid
};

// Helper function to check if the route is public
const isPublicRoute = (operationName: string): boolean => {
    const publicRoutes = ['Login'];  // Define public routes
    return !publicRoutes.includes(operationName);
};

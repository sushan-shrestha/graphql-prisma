import { Prisma, PrismaClient, User } from "@prisma/client";
import { generateToken, hashPassword, verifyPassword } from "../utils";
import { conflictError, notFoundError, unAuthorizedError } from "../utils/errorHandler";
import { Resolvers } from "../generated/schema";
import { UserEntity } from "../types";


// Define the types for resolver arguments
export const resolvers: Resolvers = {
    Query: {
        users: async (_: any, args: any, context: { prisma: PrismaClient, user: UserEntity }) => {
            return await context.prisma.user.findMany()
        },
        user: async (_: any, { id }, context: { prisma: PrismaClient }) => {
            const user = await context.prisma.user.findFirst({ where: { id: Number(id) } });
            if (!user) {
                throw notFoundError("User not found")
            }
            return user
        }
    },
    Mutation: {
        createUser: async (_: unknown, args: Prisma.UserCreateInput, context: { prisma: PrismaClient }) => {
            const checkUserExists = await context.prisma.user.findUnique({ where: { email: args.email } })

            if (checkUserExists) {
                throw conflictError("User already exists")
            }

            const hashedPassword = await hashPassword(args.password)

            const user = await context.prisma.user.create({
                data: {
                    ...args,
                    password: hashedPassword
                }
            });
            return user;
        },
        login: async (_: unknown, args: { email: string, password: string }, context: { prisma: PrismaClient }) => {
            const { email, password } = args;

            const user = await context.prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw unAuthorizedError("Email or password does not match")
            }
            const isPasswordValid = await verifyPassword(password, user.password)
            if (!isPasswordValid) {
                throw unAuthorizedError("Email or password does not match")
            }

            const token = generateToken(user)

            return { ...user, token }
        }
    },
};  
import { Prisma, PrismaClient } from "@prisma/client";


// console.log('Initializing Prisma Client...');
const prisma = new PrismaClient();
// console.log('Prisma Client initialized.');

// Define the types for resolver arguments
export const resolvers = {
    Query: {
        users: async () => {
            const users = await prisma.user.findMany();
            return users;
        },
    },
    Mutation: {
        createUser: async (_: unknown, args: Prisma.UserCreateInput) => {
            const user = await prisma.user.create({
                data: args
            });
            return user;
        },
    },
};  
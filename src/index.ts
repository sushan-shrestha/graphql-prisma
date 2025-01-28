import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { resolvers } from "./graphql/resolvers";
import dotenv from "dotenv";

dotenv.config();

console.log("Database URL:", process.env.DATABASE_URL);
const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
}).catch((error) => {
    console.error("Error starting server:", error);
});

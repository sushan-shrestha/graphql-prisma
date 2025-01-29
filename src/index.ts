import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { resolvers } from "./graphql/resolvers";
import { createContext } from "./context";



const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: createContext
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
}).catch((error) => {
    console.error("Error starting server:", error);
});

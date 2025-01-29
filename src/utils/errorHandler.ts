import { GraphQLError } from "graphql"

export function unAuthorizedError(message: string) {
    return new GraphQLError(message, {
        extensions: {
            code: "UNAUTHENTICATED",
        }
    })
}

export function notFoundError(message: string) {
    return new GraphQLError(message, {
        extensions: {
            code: "NOT_FOUND",
        }
    })
}

export function conflictError(message: string) {
    return new GraphQLError(message, {
        extensions: {
            code: "CONFLICT",
        }
    })
}


export function badRequestError(message: string) {
    return new GraphQLError(message, {
        extensions: {
            code: "BAD_REQUEST",
        }
    })
}


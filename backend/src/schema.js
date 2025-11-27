import { makeExecutableSchema } from '@graphql-tools/schema';
import resolvers from './resolvers.js';

const typeDefs = `
    type User {
        id: ID!
        name: String!
        email: String!
        createdAt: String!
    }

    type Post {
        id: ID!
        title: String!
        content: String!
        author: User!
        createdAt: String!
    }

    type AutoPayload {
        token: String!
        user: User!
    }

    type Query {
        me: User
        posts: [Post!]!
        post(id: ID!): Post
    }

    type Mutation {
        register(name: String!, email: String!, password: String!): AutoPayload!
        login(email: String!, password: String!): AutoPayload!
        createPost(title: String!, content: String!): Post!
    }

    type Subscription {
        postCreated: Post!
    }
`;

export const schema = makeExecutableSchema({ typeDefs, resolvers });
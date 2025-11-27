
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, split} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
});

const authLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem("token");
    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : "",
        },
    }));
    return forward(operation);
});

// websocket link for subscriptions
const wsLink = new GraphQLWsLink(
    createClient({
        url: 'ws://localhost:4000/graphql',
        connectionParams: () => {
            // set token dynamically from localStorage
            try {
                const token = localStorage.getItem('token');
                return token ? { Authorization: `Bearer ${token}`} : {};
            } catch {
                return {};
            }
        },
    })
);

// split links
const splitLink = split(
    ({ query }) => {
      const def = getMainDefinition(query);
      return def.kind === "OperationDefinition" && def.operation === "subscription";
    },
    wsLink,
    authLink.concat(httpLink)
);

export const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
})

import ApolloClient from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';

const headers = { 'x-hasura-admin-secret': 'pepper12' }

const client = new ApolloClient({
    link: new WebSocketLink({
        uri: 'wss://instagram-clone-cobiejoe.herokuapp.com/v1/graphql',
        options: {
            reconnet: true,
            connectionParams: {
                headers
            }
        }
    }),
    cache: new InMemoryCache()
})

export default client;
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri:" https://query.graph.lazarus.network/subgraphs/name/MyriadFlow",
    cache: new InMemoryCache(),
});

export default client;
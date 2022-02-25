import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    // uri: "https://api.thegraph.com/subgraphs/name/thisisommore/market-place-subgraph",
    uri:"https://api.thegraph.com/subgraphs/name/thisisommore/myriad-flow",
    cache: new InMemoryCache(),
});

export default client;
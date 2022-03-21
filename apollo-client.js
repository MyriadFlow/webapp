import { ApolloClient, InMemoryCache } from "@apollo/client";
const GRAPHQL_API=process.env.NEXT_PUBLIC_GRAPHQL_API;

const client = new ApolloClient({
    uri:GRAPHQL_API,
    cache: new InMemoryCache(),
});

export default client;
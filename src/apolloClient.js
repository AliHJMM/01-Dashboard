import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const token = localStorage.getItem("token"); // Get the token from localStorage

const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_API, // Use environment variable
    headers: {
      Authorization: token ? `Bearer ${token}` : "", // Ensure Bearer token format
    },
  }),
  cache: new InMemoryCache(),
});

export default client;

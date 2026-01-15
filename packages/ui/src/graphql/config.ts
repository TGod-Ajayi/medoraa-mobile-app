import {
  ApolloClient,
  ApolloLink,
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { getItemAsync } from "expo-secure-store";
import { createClient } from "graphql-ws";

// import errorToast from "./error-toast";

const getToken = async () => {
  const token = await getItemAsync("token");
  if (token) {
    return token;
  }
  return "";
};

const errorLink = new ErrorLink(({ error, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path, extensions }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      if (typeof window !== "undefined") {
        // errorToast(message, extensions);
      }
    });
  } else if (CombinedProtocolErrors.is(error)) {
    error.errors.forEach(({ message, extensions }) => {
      console.log(
        `[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(
          extensions
        )}`
      );
    });
  } else {
    console.error(`[Network error]: ${error}`);
  }
});

const gqlClientConnect = async (ctx?: string) => {
  const cache = new InMemoryCache();
  const token = await getToken();

  const wsLink = new GraphQLWsLink(
    createClient({
      url: process.env.EXPO_PUBLIC_WGQL ?? "",
      connectionParams: {
        authorization: `Bearer ${token}`,
      },
    })
  );

  const httpLink = new HttpLink({
    uri: process.env.EXPO_PUBLIC_GQL,
    useGETForQueries: true,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const splitLink = ApolloLink.split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

  const apolloClient: ApolloClient = new ApolloClient({
    ssrMode: typeof window === "undefined",
    cache,
    link: ApolloLink.from([errorLink, splitLink]),
  });

  return apolloClient;
};

export default gqlClientConnect;

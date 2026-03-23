import {
  ApolloClient,
  ApolloLink,
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { getItemAsync } from 'expo-secure-store';
import { createClient } from 'graphql-ws';
import { showMessage } from 'react-native-flash-message';

// import errorToast from "./error-toast";

const getToken = async () => {
  const token = await getItemAsync('token');
  if (token) {
    return token;
  }
  return '';
};

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      if (typeof window !== 'undefined') {
        // errorToast(message, extensions);
        showMessage({
          message,
          type: 'danger',
          duration: 4000,
        });
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

const authLink = new SetContextLink(async (prevContext) => {
  const token = await getToken();

  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const gqlClientConnect = () => {
  const cache = new InMemoryCache();

  const wsLink = new GraphQLWsLink(
    createClient({
      url: process.env.EXPO_PUBLIC_WGQL ?? '',
      connectionParams: async () => {
        const token = await getToken();
        return {
          authorization: `Bearer ${token}`,
        };
      },
    })
  );

  const httpLink = new HttpLink({
    uri: process.env.EXPO_PUBLIC_GQL,
    useGETForQueries: true,
    // headers: {
    //   authorization: `Bearer ${token}`,
    // },
  });

  const splitLink = ApolloLink.split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );

  const apolloClient: ApolloClient = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    cache,
    link: ApolloLink.from([errorLink, authLink, splitLink]),
    defaultOptions: {
      // watchQuery: {
      //   fetchPolicy: 'no-cache',
      //   nextFetchPolicy: 'no-cache',
      // },
      // query: {
      //   fetchPolicy: 'no-cache',
      // },
      mutate: {
        fetchPolicy: 'no-cache',
      },
    },
  });

  return apolloClient;
};

export default gqlClientConnect;

import type { ApolloClient } from '@apollo/client';
import { onUserSignOut } from '@repo/ui/graphql';

/** Clears stored tokens and Apollo cache. */
export async function clearAuthSession(client: ApolloClient) {
  await onUserSignOut();
  await client.clearStore();
}

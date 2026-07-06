import * as Hooks from './modules/hooks';
import type {
  CreatorContentFilterInput,
  GetCreatorContentsQuery,
} from './modules/types';

/** Creator content list fetched via `getCreatorContents`. */
export type CreatorContentsPage = GetCreatorContentsQuery['getCreatorContents'];

/** Single creator content item from `getCreatorContents.items`. */
export type CreatorContentListItem = NonNullable<
  CreatorContentsPage['items']
>[number];

const defaultFetchOptions = {
  fetchPolicy: 'cache-and-network' as const,
  nextFetchPolicy: 'cache-first' as const,
};

type UseCreatorContentsOptions = {
  skip?: boolean;
  limit?: number;
  page?: number;
  filter?: CreatorContentFilterInput;
};

/**
 * Loads paginated creator content via `getCreatorContents(filter, paginationArgs)`.
 */
export function useCreatorContents(options?: UseCreatorContentsOptions) {
  const result = Hooks.useGetCreatorContentsQuery({
    skip: options?.skip,
    variables: {
      filter: options?.filter,
      paginationArgs: {
        limit: options?.limit ?? 20,
        page: options?.page ?? 1,
      },
    },
    ...defaultFetchOptions,
  });

  return {
    creatorContents: result.data?.getCreatorContents.items ?? [],
    pageInfo: result.data?.getCreatorContents.pageInfo ?? null,
    metaData: result.data?.getCreatorContents.metaData ?? null,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
    data: result.data,
  };
}

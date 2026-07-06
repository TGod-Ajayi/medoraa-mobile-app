import { getItemAsync } from "expo-secure-store";
import { print } from "graphql";
import { RefreshAccessTokenDocument } from "./modules/types";
import {
  SECURE_STORE_ACCESS_KEY,
  SECURE_STORE_REFRESH_KEY,
  isTokenExpired,
  setSessionTokens,
} from "./utils";

const gqlHttpUri = () => process.env.EXPO_PUBLIC_GQL ?? "";

let refreshInFlight: Promise<boolean> | null = null;

/**
 * Calls refresh mutation via HTTP POST (bypasses Apollo link chain).
 * Serialized concurrent callers on a single in-flight refresh.
 */
export async function refreshTokensWithStoredRefresh(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const uri = gqlHttpUri();
      if (!uri) return false;

      const refreshToken = await getItemAsync(SECURE_STORE_REFRESH_KEY);
      if (!refreshToken) return false;

      const res = await fetch(uri, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: print(RefreshAccessTokenDocument),
          variables: { refreshToken },
        }),
      });

      const json = (await res.json()) as {
        data?: {
          refreshAccessToken?: {
            accessToken?: string;
            refreshToken?: string;
          };
        };
        errors?: unknown[];
      };

      if (!res.ok || (json.errors && json.errors.length > 0)) return false;

      const payload = json.data?.refreshAccessToken;
      if (!payload?.accessToken) return false;

      const nextRefresh = payload.refreshToken ?? refreshToken;
      await setSessionTokens(payload.accessToken, nextRefresh);
      return true;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

/** If access JWT is expired (or missing), attempt refresh when a refresh token exists. */
export async function ensureFreshAccessToken(): Promise<void> {
  const access = await getItemAsync(SECURE_STORE_ACCESS_KEY);
  if (access && !isTokenExpired(access)) return;
  await refreshTokensWithStoredRefresh();
}

/**
 * True when the user has a non-expired access token, or refresh succeeds.
 * Use on cold start before routing.
 */
export async function tryRestoreSessionWithRefresh(): Promise<boolean> {
  const access = await getItemAsync(SECURE_STORE_ACCESS_KEY);
  if (access && !isTokenExpired(access)) return true;
  return refreshTokensWithStoredRefresh();
}

import {
  deleteItemAsync,
  getItemAsync,
  setItemAsync,
} from "expo-secure-store";

export const SECURE_STORE_ACCESS_KEY = "token";
export const SECURE_STORE_REFRESH_KEY = "refreshToken";

export const getStoredAccessToken = async (): Promise<string> => {
  const token = await getItemAsync(SECURE_STORE_ACCESS_KEY);
  return token ?? "";
};

export const getStoredRefreshToken = async (): Promise<string> => {
  const token = await getItemAsync(SECURE_STORE_REFRESH_KEY);
  return token ?? "";
};

/** Persist access + optional refresh token (rotation). */
export const setSessionTokens = async (
  accessToken: string,
  refreshToken: string | null | undefined
) => {
  await setItemAsync(SECURE_STORE_ACCESS_KEY, accessToken);
  if (refreshToken) {
    await setItemAsync(SECURE_STORE_REFRESH_KEY, refreshToken);
  }
};

/** Persist access token only (e.g. legacy callers). */
export const setLogInHandler = async (token: string) => {
  await setItemAsync(SECURE_STORE_ACCESS_KEY, token);
};

/** function to get user auth details client side as hooks will cause race conditions */

const decodeBase64Url = (value: string): string => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  const padded =
    padding === 0 ? normalized : normalized + "=".repeat(4 - padding);

  if (typeof globalThis.atob === "function") {
    return globalThis.atob(padded);
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf-8");
  }

  throw new Error("No base64 decoder available");
};

export const isTokenExpired = (token?: string | null) => {
  if (!token || typeof token !== "string") return true;
  try {
    console.log("[jwt] now(ms):", Date.now());
    const parts = token.split(".");
    const payloadB64Url = parts[1];
    if (parts.length < 2 || !payloadB64Url) return true;
    console.log("[jwt] payloadB64Url:", payloadB64Url);
    const decoded = decodeBase64Url(payloadB64Url);
    console.log("[jwt] decoded payload:", decoded);
    const payload = JSON.parse(decoded) as {
      exp?: number;
    };
    console.log("[jwt] exp:", payload.exp, "expMs:", Number(payload.exp) * 1000);
    const expired = Date.now() >= Number(payload.exp) * 1000;
    console.log("[jwt] expired result:", expired);
    if (payload.exp == null) return true;
    return expired;
  } catch (error) {
    console.log("[jwt] parse error:", error);
    return true;
  }
};

async function safeDeleteKey(key: string) {
  try {
    await deleteItemAsync(key);
  } catch {
    /* key may be absent */
  }
}

export const onUserSignOut = async () => {
  await safeDeleteKey(SECURE_STORE_ACCESS_KEY);
  await safeDeleteKey(SECURE_STORE_REFRESH_KEY);
};

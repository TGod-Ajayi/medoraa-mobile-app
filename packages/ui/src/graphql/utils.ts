import { deleteItemAsync, setItemAsync } from "expo-secure-store";

/** Persist access token before navigating away so cold start reads a stored value. */
export const setLogInHandler = async (token: string) => {
  await setItemAsync("token", token);
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

export const onUserSignOut = async () => {
  await deleteItemAsync("token");
};

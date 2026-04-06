import { deleteItemAsync, setItemAsync } from "expo-secure-store";

/** Persist access token before navigating away so cold start reads a stored value. */
export const setLogInHandler = async (token: string) => {
  await setItemAsync("token", token);
};

/** function to get user auth details client side as hooks will cause race conditions */

export const isTokenExpired = (token?: string | null) => {
  if (!token || typeof token !== "string") return true;
  try {
    const parts = token.split(".");
    const payloadB64 = parts[1];
    if (parts.length < 2 || !payloadB64) return true;
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64").toString(),
    ) as { exp?: number };
    if (payload.exp == null) return true;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

export const onUserSignOut = async () => {
  await deleteItemAsync("token");
};

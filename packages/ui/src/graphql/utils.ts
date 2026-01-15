import { deleteItemAsync, setItem } from "expo-secure-store";

export const setLogInHandler = (token: string) => {
  setItem("token", token);
};

/** function to get user auth details client side as hooks will cause race conditions */

export const isTokenExpired = (token?: any) => {
  if (token) {
    return (
      Date.now() >=
      JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).exp *
        1000
    );
  }
  return true;
};

export const onUserSignOut = async () => {
  await deleteItemAsync("token");
};

// auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";

const KEYS = ["spotify_tokens", "access_token", "refresh_token"];

export async function saveTokens(tokens) {
  await AsyncStorage.setItem("spotify_tokens", JSON.stringify(tokens));
  await AsyncStorage.setItem("access_token", tokens.access_token);
  if (tokens.refresh_token) {
    await AsyncStorage.setItem("refresh_token", tokens.refresh_token);
  }
}

export async function getAccessToken() {
  return AsyncStorage.getItem("access_token");
}

export async function logout() {
  await Promise.all(KEYS.map(k => AsyncStorage.removeItem(k)));
  await WebBrowser.clearBrowserCookiesAsync();
}
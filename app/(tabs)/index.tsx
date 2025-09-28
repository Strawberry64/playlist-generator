import { Image, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";

type SpotifyImage = { url: string; height?: number; width?: number };
type User = {
  display_name?: string;
  email?: string;
  country?: string;
  images?: SpotifyImage[];
};


export default function AccountScreen() {

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  const getToken = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) throw new Error("No access_token in storage");
    return token;
  };

  const fetchJson = async (url: string, token: string) => {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    let data: any = {};
    try {
      data = await res.json();
    } catch (_) { }
    if (!res.ok) {
      const msg = data?.error?.message ||
        `${res.status} ${res.statusText || "Request failed"}`;
      throw new Error(msg);
    }
    return data;
  };

  const loadDetails = async () => {
    try {
      const token = await getToken();
      const data = await fetchJson("https://api.spotify.com/v1/me", token);
      setUser(data);
      //see whats going on with the data
      console.log("Actual Data:", data);
    } catch (e: any) {
      setError(`User fetch failed: ${e.message}`);
       router.replace("/");
    }
  };

  useEffect(() => {
  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      return;
    }
    loadDetails();
  };
  checkAuth();
}, []);

  // console.log(user);

  //logout function
  /*
  const handleLogout = async () => {
  try {
    console.log("Logout pressed");
    await AsyncStorage.multiRemove([
      "access_token",
      "refresh_token",
      "spotify_tokens",
    ]);
    console.log("Tokens removed, redirecting…");
    //router.dismissAll();
    console.log("Redirecting to /")
    //router.replace("/");
  } catch (err) {
    console.error("Logout error:", err);
  }
};
*/

//logout from the app and spotify
const handleLogout = async () => {
  try {
    console.log("Logout pressed");

    const refreshToken = await AsyncStorage.getItem("refresh_token");

    // Attempt server-side revoke (best effort)
    if (refreshToken) {
      try {
        await fetch("https://accounts.spotify.com/api/revoke", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              btoa(
                (process.env.EXPO_PUBLIC_CLIENT_ID || "") +
                  ":" +
                  (process.env.EXPO_PUBLIC_CLIENT_SECRET || "")
              ),
          },
          body: new URLSearchParams({
            token: refreshToken,
            token_type_hint: "refresh_token",
          }).toString(),
        });
        console.log("Spotify refresh token revoked");
      } catch (err) {
        console.warn("Failed to revoke token:", err);
      }
    }

    // Clear local storage
    await AsyncStorage.multiRemove([
      "access_token",
      "refresh_token",
      "spotify_tokens",
    ]);

    console.log("Tokens removed, redirecting…");

    // Optionally force logout from Spotify web session
    // await WebBrowser.openBrowserAsync("https://accounts.spotify.com/logout");

  } catch (err) {
    console.error("Logout error:", err);
  }
};
  
  return (
    <View style={styles.container}>
    {error ? <Text style={styles.error}>{error}</Text> : null}

    {/* Profile Section */}
    {user?.images?.[0]?.url ? (
      <Image
        source={{ uri: user.images[0].url }}
        style={styles.avatar}
      />
    ) : (
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>
          {user?.display_name?.[0] ?? "?"}
        </Text>
      </View>
    )}

    <Text style={styles.name}>{user?.display_name || "Guest"}</Text>
    <Text style={styles.email}>{user?.email || "N/A"}</Text>
    <Text style={styles.country}>🌍 {user?.country || "N/A"}</Text>

    {/* Logout Button */}
    <TouchableOpacity style={styles.logoutBtn} onPress={() => {
    console.log("Touchable pressed");
    handleLogout();
    }}>
    <Text style={styles.logoutText}>Log Out</Text>
    </TouchableOpacity>
  </View>
  );
}

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#121212", // Spotify dark background
    padding: 20,
  },
  error: { color: "red", marginBottom: 12 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  email: { color: "#bbb", marginBottom: 4 },
  country: { color: "#bbb", marginBottom: 20 },
  logoutBtn: {
    backgroundColor: "#1DB954", // Spotify green
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
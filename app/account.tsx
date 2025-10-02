import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, ActivityIndicator, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; 
import { addSong, addSongToPlaylist, createOrGetPlaylistId, initDb } from '../database/db.js';
import { getAccessToken } from "../lib/auth.js";

type User = {
  display_name?: string;
  email?: string;
  country?: string;
};

type SpotifyImage = {
  url: string;
  height?: number;
  width?: number
};

type Playlist = {
  id: string;
  name: string;
  images: SpotifyImage[];
};

export default function AccountScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); 

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
      const token = await getAccessToken();
      if (!token) throw new Error("No access token found");
      const data = await fetchJson("https://api.spotify.com/v1/me", token);
      setUser(data);
    } catch (e: any) {
      setError(`User fetch failed: ${e.message}`);
    }
  };
// this is the part that after loadings a playlist it will add it to playlist tables then to songs table
  const loadPlaylists = async () => {
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("No access token found");
      const data = await fetchJson(
        "https://api.spotify.com/v1/me/playlists?limit=50",
        token
      );
      setPlaylists(Array.isArray(data.items) ? data.items : []);
      let count = 0;
      for (const playlist of data.items) {
        console.log(playlist)
        await createOrGetPlaylistId(playlist.id, playlist.name, playlist.tracks?.total || 0);
//get tracks from the playlist just made or fetched
        const tracks = await getAllTracksFromPlaylist(playlist.id);
        // console.log("TRACKS: ", tracks);

        if (count > 5) {
          console.log("Stopping after 5 playlists for demo purposes.");
          break;
        }

        if (playlist.tracks.total > 0) {
          for (const track of tracks) {
            // console.log(`Fetched ${track.name} tracks for playlist:`, playlist.name);
            await addSong(track.id, track.name, track.artist);
            await addSongToPlaylist(playlist.id, track.id);
          }
        }
        count++;
      }
    } catch (e: any) {
      setError(`Playlists fetch failed: ${e.message}`);
    }
  };

  useEffect(() => {
    const run = async () => {
      console.log("AccountScreen: starting populate");
      
      await initDb();
      await loadDetails();
      await loadPlaylists();
      console.log("AccountScreen: done → tabs");
      setLoading(false); //  stop loading
      router.replace("/(tabs)");
    };
    run();
  }, []);

  const getAllTracksFromPlaylist = async (playlistId: string) => {
    const token = await getAccessToken();
    if (!token) throw new Error("No access token found");
    const items: any[] = [];
    let url: string | null =
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;

    while (url) {
      const page = await fetchJson(url, await token);
      if (Array.isArray(page.items)) {
        items.push(...page.items);
        url = page?.next || null;
      }
    }
    return items
      .map((it) => it.track)
      .filter((t) => t && t.type === "track" && t.id)
      .map((t) => ({
        id: t.id,
        name: t.name,
        artist: t?.artists?.[0]?.name ?? "Unknown",
      }));
  };

  // Loading screen
  if (loading) {
    return (
      <LinearGradient
        colors={['#1DB954', '#121212']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.loadingContainer}
      >
        <Text style={styles.loadingTitle}>Loading your account…</Text>
        <Text style={styles.loadingSub}>Fetching Spotify data</Text>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>Your account page</Text>
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 }}>
        Welcome, {user?.display_name || "Guest"}!
      </Text>
      <Text style={{ marginBottom: 8 }}>Email: {user?.email || "N/A"}</Text>
      <Text style={{ marginBottom: 16 }}>Country: {user?.country || "N/A"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  loadingSub: {
    color: "#E0E0E0",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
});

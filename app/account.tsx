import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { addSong, addSongToPlaylist, createOrGetPlaylistId, initDb } from '../database/db.js';

initDb();
type User = {
  display_name?: string;
  email?: string;
  country?: string;
};

type SpotifyImage = { url: string; height?: number; width?: number };
type Playlist = {
  id: string;
  name: string;
  images: SpotifyImage[];
};

export default function AccountScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [error, setError] = useState<string | null>(null);

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
    }
  };
// this is the part that after loadings a playlist it will add it to playlist tables then to songs table
  const loadPlaylists = async () => {
    try {
      const token = await getToken();
      // Start with first page
      const data = await fetchJson(
        "https://api.spotify.com/v1/me/playlists?limit=50",
        token
      );
      setPlaylists(Array.isArray(data.items) ? data.items : []);
      let count = 0;
      for (const playlist of data.items) {

        console.log(JSON.stringify(playlist, null, 2));
        //create or get playlist in the database
        await createOrGetPlaylistId(playlist.id, playlist.name, playlist.tracks?.total || 0);
//get tracks from the playlist just made or fetched
        const tracks = await getAllTracksFromPlaylist(playlist.id);
        // this is only for getting the first 5 playlists for demo purposes
        console.log("TRACKS: ", tracks);
        if (count > 5) {
          console.log("Stopping after 5 playlists for demo purposes.");
          break;
        }
        if (playlist.tracks.total > 0) {
          for (const track of tracks) {
            console.log(`Fetched ${track.name} tracks for playlist:`, playlist.name);
            console.log(track);
            //add song to songs table, and then add to playlist_songs table
            await addSong(track.id, track.name, track.artist);
            await addSongToPlaylist(playlist.id, track.id);
          }
        }
        console.log(`Fetched '${tracks}' tracks for playlist:`, playlist.name);
        count++;
      }

    } catch (e: any) {
      setError(`Playlists fetch failed: ${e.message}`);
    }
  };

  useEffect(() => {
    loadDetails();
    loadPlaylists();
  }, []);
  // console.log(user);

  const getAllTracksFromPlaylist = async (playlistId: string) => {
    const token = await getToken();
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

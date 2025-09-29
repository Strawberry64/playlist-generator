// import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';


import { useEffect, useState } from "react";
// import { Text, View, TouchableOpacity, FlatList, Image} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { addSong, addSongToPlaylist, createOrGetPlaylistId, initDb } from '../database/db.js';

// Initialize database
initDb();

const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID;
const CLIENT_SECRET = process.env.EXPO_PUBLIC_CLIENT_SECRET;

const SCOPES = [
  "user-read-private", "user-read-email",
  "user-library-modify", "user-library-read",
  "playlist-read-private", "playlist-read-collaborative",
  "playlist-modify-private", "playlist-modify-public",
];

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const redirectUri = AuthSession.makeRedirectUri({
  scheme: "myapp"
});

const TOKENS_KEY = "spotify_tokens";


export default function HomeScreen() {

  //iniciating tokens
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  //this a hook and makes request to spotify for authorization
  //returns (code)
  const [request, response, promptAsync] = useAuthRequest({
    responseType: ResponseType.Code,
    clientId: CLIENT_ID || "",
    scopes: SCOPES,
    usePKCE: false,
    redirectUri: redirectUri,
  }, discovery);
   
  // Starts the auth flow
  const startAuth = async () => {
    setIsLoading(true);
    console.log('Starting Spotify authentication');
    //runs hook
    await promptAsync();
  };

  // function to exchange (code) from authorization to access token
  const exchangeCodeForToken = async (code:string) => {
    try {
      setIsLoading(true);
      const data = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: CLIENT_ID || '',
        client_secret: CLIENT_SECRET || '',
      });
      const response = await fetch(discovery.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:(data).toString(),
      });
      const tokenData = await response.json();
      
      if (tokenData.access_token) {
        //sets tokens for universal use
        await AsyncStorage.setItem(TOKENS_KEY, JSON.stringify(tokenData));
        await AsyncStorage.setItem('access_token', tokenData.access_token);
        await AsyncStorage.setItem('refresh_token', tokenData.refresh_token);

        setAccessToken(tokenData.access_token);
        setRefreshToken(tokenData.refresh_token);
        console.log('Access token received successfully');
        return tokenData;
      } else {
        console.error('Token exchange failed:', tokenData);
        console.log(tokenData)
        throw new Error(tokenData.error_description || 'Token exchange failed');
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get token from storage
  const getToken = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) throw new Error("No access_token in storage");
    return token;
  };

  // Helper function to make authenticated API requests
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

  // Load user details from Spotify
  const loadDetails = async () => {
    try {
      const token = await getToken();
      const data = await fetchJson("https://api.spotify.com/v1/me", token);
      setUser(data);
      console.log("User data loaded:", data.display_name);
    } catch (e: any) {
      console.error(`User fetch failed: ${e.message}`);
      throw e;
    }
  };

  // Get all tracks from a specific playlist
  const getAllTracksFromPlaylist = async (playlistId: string) => {
    const token = await getToken();
    const items: any[] = [];
    let url: string | null =
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;

    while (url) {
      const page = await fetchJson(url, token);
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

  // Load playlists and populate database
  const loadPlaylists = async () => {
    setDataLoading(true);
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
        
        // Create or get playlist in the database
        await createOrGetPlaylistId(playlist.id, playlist.name, playlist.tracks?.total || 0);

        
        // Get tracks from the playlist
        const tracks = await getAllTracksFromPlaylist(playlist.id);

        
        // Limit to first 5 playlists for demo purposes
        if (count >= 5) {
          break;
        }
        
        if (playlist.tracks.total > 0) {
          for (const track of tracks) {
            // Add song to songs table, and then add to playlist_songs table
            await addSong(track.id, track.name, track.artist);
            await addSongToPlaylist(playlist.id, track.id);
          }
        }
      
        count++;
      }
      
    } catch (e: any) {
      throw e;
    } finally {
      setDataLoading(false);
    }
  };

  // Complete data loading process
  const loadAllData = async () => {
    try {
      await loadDetails();
      await loadPlaylists();
    } catch (error) {
      // Continue to tabs even if data loading fails
    } finally {
      router.replace("/(tabs)");
    }
  };


  // Handle authentication response
  useEffect(() => {
    const handleAuthResponse = async () => {
      if (response?.type === 'success') {
        const { code } = response.params;

        try {
          await exchangeCodeForToken(code);
          // Start data loading process after successful token exchange
          await loadAllData();
        } catch (error) {
          // Navigate to tabs even if data loading fails
          router.replace("/(tabs)");
        }
      } else if (response?.type === 'error') {
        setIsLoading(false);
      }
    };
    handleAuthResponse();
  }, [response]);

  
  const router = useRouter();
  return (
    <LinearGradient
      colors={['#1DB954', '#121212']} // Spotify green fading into dark
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* Spotify Logo
      <Image
        source={require('@/assets/images/spotify-logo.png')} // make sure logo is in assets
        style={styles.logo}
        contentFit="contain"
      />*/}

      {/* Title */}
      <Text style={styles.title}>Playlist Generator</Text>
      <Text style={styles.subtitle}>
        Create personalized playlists powered by Spotify
      </Text>

      {/* Buttons */}
      <TouchableOpacity
        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
        onPress={startAuth}
        disabled={isLoading}
      >
        <Text style={styles.loginButtonText}>
          {isLoading ? 'Authenticating...' : 'Log in with Spotify'}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 40,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#1DB954', // Spotify green
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3, // subtle shadow on Android
    shadowColor: '#000', // subtle shadow on iOS
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#888',
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

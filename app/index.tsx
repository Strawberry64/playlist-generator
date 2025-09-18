// import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import React, { useEffect, useState } from "react";
// import { Text, View, TouchableOpacity, FlatList, Image} from "react-native";
import { ResponseType, useAuthRequest, makeRedirectUri } from "expo-auth-session";
import * as AuthSession from "expo-auth-session";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  //  // Function to start authentication
  // useEffect(() => {
  //   if (!accessToken && request && !isLoading) {
  //     console.log('Auto-starting authentication...');
  //     startAuth();
  //   }
  // }, [request, accessToken]);

  // Handle authentication response
  useEffect(() => {
    const handleAuthResponse = async () => {
      if (response?.type === 'success') {
        const { code } = response.params;
        console.log('Authorization code received');
        await exchangeCodeForToken(code);
        router.replace("/(tabs)")
      } else if (response?.type === 'error') {
        console.error('Authorization error:', response.error);
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
        style={styles.loginButton}
        onPress={startAuth}
      >
        <Text style={styles.loginButtonText}>Log in with Spotify</Text>
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
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

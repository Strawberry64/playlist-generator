import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
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
  scheme: "playlistgenerator"
});

const TOKENS_KEY = "spotify_tokens";

export default function LoginScreen() {
  //iniciating tokens
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //this a hook and makes request to spotify for authorization
  //returns (code)
  const [request, response, promptAsync] = useAuthRequest({
    responseType: ResponseType.Code,
    clientId: CLIENT_ID,
    scopes: SCOPES,
    usePKCE: false,
    redirectUri,
  }, discovery);
   
  // Starts the auth flow
  const startAuth = async () => {
    setIsLoading(true);
    console.log('Starting Spotify authentication');
    //runs hook
    await promptAsync();
  };

  // function to exchange (code) from authorization to access token
  const exchangeCodeForToken = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(discovery.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: await AsyncStorage.getItem('account_code'),
          redirect_uri: redirectUri,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }).toString(),
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

   // Function to start authentication
  useEffect(() => {
    if (!accessToken && request && !isLoading) {
      
      console.log('Auto-starting authentication...');
      startAuth();
    }
  }, [request, accessToken]);

  // Handle authentication response
  useEffect(() => {
    const handleAuthResponse = async () => {
      if (response?.type === 'success') {
        await AsyncStorage.setItem('account_code', response.params.code);
        console.log('Authorization code received');
        await exchangeCodeForToken();
        router.replace("/account");
      } else if (response?.type === 'error') {
        console.error('Authorization error:', response.error);
        setIsLoading(false);
      }
    };
    handleAuthResponse();
  }, [response]);  
  
  //funtion to logout user
  const logout = async () => {
    await AsyncStorage.removeItem(TOKENS_KEY);
    setAccessToken(null);
    console.log('Logged out successfully');
  };

  //funtion to redirect to account page
  const accountPage = () => {
    router.replace("/account");
  }

  return (
    <View>
      <Text>Spotify Authentication page</Text>
      
      {isLoading && (
        <View>
          <Text >Authenticating...</Text>
          <Text>Please complete login in browser</Text>
        </View>
      )}
      {accessToken ? (
        <View>
          <Text>Successfully Authenticated!</Text>
          <Text>
            Token: {accessToken}
          </Text>
          <TouchableOpacity onPress={logout}>
            <Text>logout</Text>
          </TouchableOpacity>
        </View>
      ) : !isLoading && (
        <View>
          <Text>
            Ready to connect with Spotify
          </Text>
          <TouchableOpacity  onPress={startAuth}>
            <Text>Login with Spotify</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
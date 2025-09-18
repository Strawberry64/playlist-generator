import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function HomeScreen() {
  const router = useRouter();
  const [user,setUser] = useState([]);
    const [playlists, setplaylists] = useState([]);
    const loadDetails = async () => {
        const access_token = await AsyncStorage.getItem('access_token');
        const currUri = 'https://api.spotify.com/v1/me';
        try{
            const body = await fetch(currUri, {
                headers:{
                    Authorization: `Bearer ${access_token}`
                }
            })
            const data = await body.json();
            setUser(data)
            console.log(data)
        }catch{
            console.log('yo code no work');
        }
        
    }
    const loadPlaylists = async () => {
        const access_token = await AsyncStorage.getItem('access_token');
        const uri = 'https://api.spotify.com/v1/me/playlists'
        try{
            const body = await fetch(uri, {
                headers:{
                    Authorization: `Bearer ${access_token}`
                }
            })
            const data = await body.json();
            setplaylists(data)
            console.log(data)
            
        }catch{
            console.log('yo playlists no work')
        }

    }

    useEffect(() =>{
        loadDetails()
        loadPlaylists()
    },[]);
  return (
    <View style={styles.container}>
      <Text>Construction Area, check in next time!</Text>
    </View>
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

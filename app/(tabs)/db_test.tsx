import { Image } from 'expo-image';
import { Button, StyleSheet, TextInput, View, TouchableOpacity, Text} from 'react-native';
import React, { useState } from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { addSongToPlaylist, getAllSongs,getAllPlaylists, createOrGetPlaylistId, addSong,initDb } from '../../database/db.js';


export default function DatabaseScreen() {
  const [playlistName, setplaylistName] = useState('');
  const [song, setSongName] = useState('');
  const [artist, setArtistName] = useState('');


  return (
  <ParallaxScrollView
    headerBackgroundColor={{ light: "#121212", dark: "#121212" }}
    style={{ flex: 1, backgroundColor: "#121212" }}
    >
    <ThemedView style={{ flex: 1, backgroundColor: "#121212" }}>
      <ThemedText type="title" style={styles.title}>Database</ThemedText>
    </ThemedView>

    {/* Action Buttons */}
    <View style={styles.buttonGroup}>
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          await initDb();
          console.log("SONGS: ", await getAllSongs());
        }}
      >
        <Text style={styles.buttonText}>Get Songs</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          await initDb();
          console.log("Playlists:", await getAllPlaylists());
        }}
      >
        <Text style={styles.buttonText}>Get Playlists</Text>
      </TouchableOpacity>
    </View>
  </ParallaxScrollView>
);
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff", // white for Spotify dark
  },
  buttonGroup: {
    marginTop: 30,
    paddingHorizontal: 20,
    gap: 16,
    backgroundColor: "#121212", // 👈 dark background for the whole section
  paddingVertical: 20,
  borderRadius: 10,
  },
  button: {
    backgroundColor: "#1DB954", // Spotify green
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logo: {
    height: 120,
    width: 120,
    position: "absolute",
    bottom: 10,
    left: "40%",
  },
});

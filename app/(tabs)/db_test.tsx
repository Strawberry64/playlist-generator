import { Image } from 'expo-image';
import { Button, StyleSheet, TextInput, View } from 'react-native';
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
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />

      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Database</ThemedText>
      </ThemedView>

      <ThemedView>

        <Button
          onPress={async () => {
            // await createSong(song, artist);
            await initDb();

            console.log('SONGS: ',await getAllSongs());
          }}
          title="Get Song"
        />

        <View style={{ marginVertical: 6 }} />

        <Button
          onPress={async () => {
            // await createOrGetPlaylistId(playlistName); 
            await initDb();

            console.log("Playlist:",await getAllPlaylists());
          }}
          title="Get Playlist"
        />

        <View style={{ marginVertical: 6 }} />




      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

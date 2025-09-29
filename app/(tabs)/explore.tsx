import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getAllPlaylists, getSongsForPlaylist } from '@/database/db';
import { useRouter } from 'expo-router';
import { Button } from 'react-native';

type PlaylistItemProps = {
  id: string;
  name: string;
  track_total: number;
};

type SongType = {
  id: string;
  name: string;
  artist: string;
};

const PlaylistItem = ({ id, name, track_total }: PlaylistItemProps) => {
  const [songs, setSongs] = useState<SongType[]>([]);
  const [songsLoaded, setSongsLoaded] = useState(false);

  useEffect(() => {
    loadSongs();
  }, [id]);

  const loadSongs = async () => {
    if (!songsLoaded) {
      try {
        const songData = await getSongsForPlaylist(id);
        setSongs(songData || []);
        setSongsLoaded(true);
      } catch (error) {
        console.error('Error loading songs for playlist:', error);
      }
    }
  };

  return (
    <View style={styles.playlistItem}>
      <Text style={styles.playlistName}>{name}</Text>
      <Text style={styles.songCount}>{track_total} songs</Text>
      
      <Collapsible title="View Songs">
        {songsLoaded ? (
          songs.length === 0 ? (
            <Text style={styles.emptySongs}>No songs found in this playlist</Text>
          ) : (
            <View style={styles.songsContainer}>
              {songs.map((song, index) => (
                <View key={song.id} style={styles.songItem}>
                  <Text style={styles.songName}>{song.name}</Text>
                  <Text style={styles.artistName}>by {song.artist}</Text>
                </View>
              ))}
            </View>
          )
        ) : (
          <Text style={styles.loadingSongs}>Loading songs...</Text>
        )}
      </Collapsible>
    </View>
  );
};

export default function TabTwoScreen() {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<PlaylistItemProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const playlistData = await getAllPlaylists();
      setPlaylists(playlistData || []);
    } catch (error) {
      console.error('Error loading playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>

        {/* <Button
          title="Go to Playlists"
          onPress={() => router.push('/playlists')}
        /> */}
        <Button
          title='Go to generate'
          onPress={() => router.push('/generate')}
        />

        <ThemedView style={styles.playlistContainer}>
          <ThemedText type="title">Your Playlists</ThemedText>
          {loading ? (
            <ThemedText>Loading playlists...</ThemedText>
          ) : playlists.length === 0 ? (
            <ThemedText>No playlists found. Try logging in again to sync your Spotify playlists.</ThemedText>
          ) : (
            <FlatList
              data={playlists}
              renderItem={({ item }) => (
                <PlaylistItem
                  id={item.id}
                  name={item.name}
                  track_total={item.track_total}
                />
              )}
              keyExtractor={item => item.id}
              style={styles.flatList}
            />
          )}
        </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  playlistContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  playlistItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  songsContainer: {
    marginTop: 8,
  },
  songItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    marginVertical: 2,
    borderRadius: 4,
  },
  songName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  artistName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  emptySongs: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
  loadingSongs: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 8,
  },
  playlistName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  songCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  playlistId: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  flatList: {
    maxHeight: 400,
    marginTop: 12,
  },
});

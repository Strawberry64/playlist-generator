import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ThemedText } from '@/components/ThemedText';
import { getAllPlaylists, getSongsForPlaylist } from '@/database/db';
import { useRouter } from 'expo-router';

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

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.generateButton}
        onPress={() => router.push('/generate')}
        activeOpacity={0.8}
      >
        <Text style={styles.generateButtonText}>Generate Playlist</Text>
      </TouchableOpacity>
    
      {loading && <ThemedText style={styles.loadingText}>Loading playlists...</ThemedText>}
      {!loading && playlists.length === 0 && (
        <ThemedText style={styles.emptyText}>No playlists found. Try logging in again to sync your Spotify playlists.</ThemedText>
      )}
    </View>
  );

  if (loading || playlists.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
      </View>
    );
  }

  return (
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
      ListHeaderComponent={renderHeader}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Spotify dark mode
  },
  contentContainer: {
    paddingBottom: 20,
  },
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  generateButton: {
    backgroundColor: '#1DB954', // Spotify green
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginBottom: 20,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#B3B3B3',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#B3B3B3',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  playlistItem: {
    backgroundColor: '#181818', // subtle dark gray
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 10,
  },
  playlistName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  songCount: {
    fontSize: 13,
    color: '#B3B3B3',
    marginBottom: 8,
  },
  songsContainer: {
    marginTop: 8,
    backgroundColor: "#181818",
    borderRadius: 6,
    paddingVertical: 4,
  },
  songItem: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  songName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  artistName: {
    fontSize: 12,
    color: '#B3B3B3',
    marginTop: 2,
  },
  emptySongs: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
  loadingSongs: {
    fontSize: 12,
    color: '#B3B3B3',
    textAlign: 'center',
    paddingVertical: 8,
  },
});

import { Collapsible } from '@/components/Collapsible';
import { FlatList, Image, StatusBar, StyleSheet, Text, View } from 'react-native';

// Sample data matching Spotify API structure for Current User's Playlists
const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'My Favorite Hits',
    description: 'A collection of my all-time favorite songs',
    collaborative: false,
    public: false,
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228',
        height: 300,
        width: 300
      }
    ],
    owner: {
      display_name: 'John Doe',
      id: 'johndoe123'
    },
    tracks: {
      total: 25
    },
    external_urls: {
      spotify: 'https://open.spotify.com/playlist/bd7acbea-c1b1-46c2-aed5-3ad53abb28ba'
    }
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    name: 'Chill Vibes',
    description: 'Perfect for relaxing evenings',
    collaborative: true,
    public: true,
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228',
        height: 300,
        width: 300
      }
    ],
    owner: {
      display_name: 'Jane Smith',
      id: 'janesmith456'
    },
    tracks: {
      total: 18
    },
    external_urls: {
      spotify: 'https://open.spotify.com/playlist/3ac68afc-c605-48d3-a4f8-fbd91aa97f63'
    }
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    name: 'Workout Mix',
    description: 'High energy songs to keep you moving',
    collaborative: false,
    public: false,
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228',
        height: 300,
        width: 300
      }
    ],
    owner: {
      display_name: 'Mike Johnson',
      id: 'mikejohnson789'
    },
    tracks: {
      total: 32
    },
    external_urls: {
      spotify: 'https://open.spotify.com/playlist/58694a0f-3da1-471f-bd96-145571e29d72'
    }
  },
];

type PlaylistItemProps = {
  name: string;
  imageUrl: string;
  trackCount: number;
};

// This is the component that renders the main playlist item (non-collapsible part)
const PlaylistItem = ({ name, imageUrl, trackCount }: PlaylistItemProps) => (
  <View style={styles.playlistItem}>
    <Image source={{ uri: imageUrl }} style={styles.playlistImage} />
    <View style={styles.playlistInfo}>
      <Text style={styles.playlistName}>{name}</Text>
      <Text style={styles.trackCount}>{trackCount} tracks</Text>
    </View>
  </View>
);

export default function Playlists() {
  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={({ item }) => 
          <View style={styles.listItem}>
            <PlaylistItem 
              name={item.name}
              imageUrl={item.images[0]?.url || 'https://via.placeholder.com/300'}
              trackCount={item.tracks.total}
            />
            
            <Collapsible title="More Info">
              <View style={styles.collapsibleContent}>
                <Text style={styles.detailLabel}>Description:</Text>
                <Text style={styles.detailText}>{item.description}</Text>
                
                <Text style={styles.detailLabel}>Owner:</Text>
                <Text style={styles.detailText}>{item.owner.display_name}</Text>
                
                <Text style={styles.detailLabel}>Collaborative:</Text>
                <Text style={styles.detailText}>{item.collaborative ? 'Yes' : 'No'}</Text>
                
                <Text style={styles.detailLabel}>Public:</Text>
                <Text style={styles.detailText}>{item.public ? 'Yes' : 'No'}</Text>
                
                <Text style={styles.detailLabel}>Spotify URL:</Text>
                <Text style={styles.linkText}>{item.external_urls.spotify}</Text>
              </View>
            </Collapsible>
          </View>
        }
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#f5f5f5',
  },
  listItem: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playlistItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  playlistImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  trackCount: {
    fontSize: 14,
    color: '#666',
  },
  collapsibleContent: {
    padding: 16,
    paddingTop: 0,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 2,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  linkText: {
    fontSize: 14,
    color: '#1DB954', // Spotify green
    textDecorationLine: 'underline',
  },
});


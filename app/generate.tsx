import React, { useEffect, useState } from "react";
import { Text, View, Button,  TouchableOpacity, FlatList, Image, TextInput, Switch, StyleSheet} from "react-native";
import * as AuthSession from "expo-auth-session";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from '@react-native-picker/picker';




export default function GeneratePage(){
    const [isCreating, setIsCreating] = useState(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [track, setTrack] = useState<string>("");
    const [tracks, setTracks] = useState<string[]>([]);
    const [artists, setArtists] = useState<string[]>([]);
    const [genre, setGenre] = useState<string[]>([]);
    const [value, setValue] = React.useState<string>('java');
    

    const genParams = async (
        userInput: string
    ) => {
        const access_token = await AsyncStorage.getItem('access_token');

        try{
            const input = userInput
            const query = `remaster track:${input}`
            const encoded = encodeURIComponent(query)

            const Uri = `https://api.spotify.com/v1/search?q=${encoded}&type=track&limit=5&offset=1`
            const res = await fetch(Uri, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })
            const data = await res.json();
            console.log(data.tracks.items[4].name)
        }catch{
            console.log('fix yo shiiii')
        }


    }



    const generate = async (
        playlistName: string,
        playlistDesc: string
    ): Promise<void> => {
    if (isCreating) return; 
    setIsCreating(true);
    try {
        const access_token = await AsyncStorage.getItem('access_token');

        const Uri = 'https://api.spotify.com/v1/me/playlists';
        const res = await fetch(Uri, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: playlistName,
            description: playlistDesc,
            public: true,
        }),
        });
        const data = await res.json();
        console.log("Playlist created:", data);
    } catch (e) {
        console.log("Yo generate no work:", e);
    } finally {
        setIsCreating(false);
    }};
    
    return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a Playlist</Text>

      <Text style={styles.label}>Playlist Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Type name..."
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Type description..."
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Search Track</Text>
      <TextInput
        style={styles.input}
        placeholder="Track..."
        placeholderTextColor="#888"
        value={track}
        onChangeText={setTrack}
      />

      <TouchableOpacity style={styles.button} onPress={() => genParams(track)}>
        <Text style={styles.buttonText}>Try Search</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, isCreating && { backgroundColor: "#333" }]}
        onPress={() => generate(name, description)}
        disabled={isCreating}
      >
        <Text style={styles.buttonText}>
          {isCreating ? "Creating..." : "Create Playlist"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Spotify dark
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#f2f2f2",
    color: "#000",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#1DB954",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
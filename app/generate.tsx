import React, { useEffect, useState } from "react";
import { Text, View, Button,  TouchableOpacity, FlatList, Image, TextInput, Switch} from "react-native";
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
    
    return(
        <View>
            <Text>Playlist Name</Text>
            <TextInput
                placeholder="Type name..."
                value={name}
                onChangeText={setName}
            />

            <Text>Description</Text>
            <TextInput
                placeholder="Type description..."
                value={description}
                onChangeText={setDescription}
            />

            <Text>Search Track</Text>
            <TextInput
                placeholder="Track.."
                value={track}
                onChangeText={setTrack}></TextInput>
            <Button 
            title="try out search"
            onPress={() => genParams(track)}></Button>
            
            <Button 
            title={isCreating ? "Creating..." : "Create Plalist"} 
            onPress={() => generate(name, description)}/>
        </View>
    );
}
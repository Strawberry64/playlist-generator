
import React, { useEffect, useState } from "react";
import { StatusBar, Text, Alert, Button,  TouchableOpacity, FlatList, TextInput, StyleSheet} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import * as AuthSession from "expo-auth-session";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from '@react-native-picker/picker';

export default function GeneratePage(){
    const [isCreating, setIsCreating] = useState(false);
    const [name, setName] = useState<string>("");

    const [results, setResults] = useState<any[]>([]);
    const [trackSearch, setTrackSearch] = useState('');
    const [artistSearch, setArtistSearch] = useState('');
    const [selTracks, setselTracks] = useState<any[]>([]);

    const genParams = async ( trackInput: string, artistInput: string ) => {
        const access_token = await AsyncStorage.getItem('access_token');

        try{
            let query = '';
            if (trackInput) {
                query += `track:${trackInput} `;
            }
            const encoded = encodeURIComponent(query.trim())

            const Uri = `https://api.spotify.com/v1/search?q=${encoded}&type=track&limit=5&offset=0`
            const res = await fetch(Uri, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })
            const data = await res.json();
            setResults(data.tracks?.items ?? []);
        }catch{
            console.log('fix yo shiiii')
        }
    }
    const generatePlaylist = async ( playlistName: string) => {
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
                    description: 'woow_super_cool_playlist',
                    public: true,
                }),
            });
            const data = await res.json();
            console.log("Playlist created:", data);
            const populateUri = `https://api.spotify.com/v1/playlists/${data.id}/tracks`
            const uris: string[] = (selTracks || [])
                .map((t: any) => t?.uri ?? (t?.id ? `spotify:track:${t.id}` : null))
                .filter(Boolean);
            const resplaylist = await fetch(populateUri, {
                method: 'POST',
                headers:{
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uris
                }),
            })
            const populatedata = await resplaylist.json()
            Alert.alert("Success", "Playlist successfully created!");
            router.replace("/explore")
            console.log('playlist populated:', populatedata)
        } catch {
            console.log("Yo generate no work:");
        } finally {
            setIsCreating(false);
        }};

    const handleAdd = (track: any) => {
        setselTracks((prev) => {const exists = prev.some((t) => t.id === track.id);
            if (exists) {
                return prev;
            }
            return [...prev, track];
        })
    };
    const handlePop = (track: any) => {
        console.log("Track to removed:", track.id);
        setselTracks((prev) => prev.filter((t) => t.id !== track.id));
    };

    useEffect(() => {
        if (trackSearch || artistSearch) {
            genParams(trackSearch, artistSearch);
        } else {
            setResults([]);
        }
    }, [trackSearch, artistSearch]);

    return (
        <>
        <StatusBar
            barStyle="light-content"   // makes icons white
            backgroundColor="#1DB954"  // Spotify green background
        />
        
        <LinearGradient
            colors={["#1DB954", "#121212"]} // Spotify green → dark
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            
            <Text style={styles.label}>Playlist Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Type name..."
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
            />
            <TouchableOpacity
                style={styles.Button}
                onPress={() => generatePlaylist(name)}
                disabled={isCreating}
            >
                <Text style={styles.buttonText}>
                {isCreating ? "Creating..." : "Create Playlist"}
                </Text>
            </TouchableOpacity>
            <Text style={styles.label}>Search Track</Text>
            <TextInput
                style={styles.input}
                placeholder="Track name"
                placeholderTextColor="#999"
                value={trackSearch}
                onChangeText={setTrackSearch}
            />
            <TextInput
                style={styles.input}
                placeholder="Artist name"
                placeholderTextColor="#999"
                value={artistSearch}
                onChangeText={setArtistSearch}
            />
            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleAdd(item)} style={styles.trackCard}>
                    <Text style={styles.trackText}>
                    {item.name} – {item.artists[0].name}
                    </Text>
                </TouchableOpacity>
                )}
            />
            <Text style={[styles.label, { marginTop: 20 }]}>
                Selected tracks (tap to remove)
            </Text>
            <FlatList
                data={selTracks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handlePop(item)} style={styles.trackCardSelected}>
                    <Text style={styles.trackText}>
                    {item.name} – {item.artists[0].name}
                    </Text>
                </TouchableOpacity>
            )}
            />
        
            
        </LinearGradient>
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 0,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        marginTop: 15,
        marginBottom: 5,
    },
    input: {
        backgroundColor: "#222",
        color: "#fff",
        fontSize: 14,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    trackCard: {
        backgroundColor: "#1c1c1c",
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#1DB954",
    },
    trackCardSelected: {
        backgroundColor: "#1DB95420", // subtle green tint
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#1DB954",
    },
    trackText: {
        color: "#fff",
        fontWeight: "bold",
    },
    Button: {
        backgroundColor: "#1DB954",
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        alignSelf: "center",
        marginTop: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});
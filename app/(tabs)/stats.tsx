import React, { useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

type TimeRange = "short_term" | "medium_term" | "long_term";
type TopType = "tracks" | "artists";

export default function StatsPage() {
    const [topType, setTopType] = useState<TopType>("tracks");
    const [timeRange, setTimeRange] = useState<TimeRange>("short_term");
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchTop = async () => {
    try {
        setIsLoading(true);
        const access_token = await AsyncStorage.getItem("access_token");

        const url = `https://api.spotify.com/v1/me/top/${topType}?time_range=${timeRange}&limit=10`;
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        const json = await res.json();
        setResults(Array.isArray(json.items) ? json.items : []);

        } catch (e) {
        Alert.alert("Error", "Something went wrong fetching your stats.");
        } finally {
        setIsLoading(false);
        }
    };

    const renderItem = ({ item, index }: { item: any; index: number }) => {
        if (topType === "tracks") {
            const title = item?.name ?? "Unknown Track";
            const artist = item?.artists?.[0]?.name ?? "Unknown Artist";
            return (
                <TouchableOpacity style={styles.card}>
                <Text style={styles.cardTitle}>
                    {index + 1}. {title}
                </Text>
                <Text style={styles.cardSub}>{artist}</Text>
                </TouchableOpacity>
            );
        } else {
            // artists
            const name = item?.name ?? "Unknown Artist";
            return (
                <TouchableOpacity style={styles.card}>
                <Text style={styles.cardTitle}>
                    {index + 1}. {name}
                </Text>
                
                </TouchableOpacity>
            );
        }
    };

    return (
        <LinearGradient
            colors={["#1DB954", "#121212"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
        <Text style={styles.header}>Spotify Stats</Text>

        <Text style={styles.label}>Type</Text>
        <View style={styles.pickerWrap}>
            <Picker
                selectedValue={topType}
                onValueChange={(v) => setTopType(v)}
                dropdownIconColor="#fff"
                style={styles.picker}
            >
            <Picker.Item label="Top Tracks" value="tracks" color="black" />
            <Picker.Item label="Top Artists" value="artists" color="black" />
            </Picker>
        </View>

        <Text style={styles.label}>Time Range</Text>
        <View style={styles.pickerWrap}>
            <Picker
                selectedValue={timeRange}
                onValueChange={(v) => setTimeRange(v)}
                dropdownIconColor="#fff"
                style={styles.picker}
            >
            <Picker.Item label="4 weeks" value="short_term" color="black" />
            <Picker.Item label="6 months" value="medium_term" color="black" />
            <Picker.Item label="year" value="long_term" color="black" />
            </Picker>
        </View>

        <TouchableOpacity style={styles.Button} onPress={fetchTop} disabled={isLoading}>
            <Text style={styles.buttonText}>
            {isLoading ? "Loading..." : "Fetch"}
            </Text>
        </TouchableOpacity>

        <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={{ marginTop: 20 }}
            contentContainerStyle={{ paddingBottom: 80 }}
        />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 40,
    },
    header: {
        fontSize: 24,
        fontWeight: "800",
        color: "#fff",
        marginBottom: 10,
    },
    label: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        marginTop: 12,
        marginBottom: 6,
    },
    pickerWrap: {
        backgroundColor: "#222",
        borderRadius: 10,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#1DB95455"
    },
    picker: {
        color: "#fff",
        height: 60,
    },
    card: {
        backgroundColor: "#1c1c1c",
        padding: 12,
        marginVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#1DB954",
    },
    cardTitle: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    cardSub: {
        color: "#E0E0E0",
        marginTop: 2,
    },
    Button: {
        backgroundColor: "#1DB954",
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 30,
        alignSelf: "flex-start",
        marginTop: 16,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    buttonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold",
    },
});
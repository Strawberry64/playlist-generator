import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, FlatList, Image} from "react-native";
import * as AuthSession from "expo-auth-session";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AccountScreen() {
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
            
        }catch{
            console.log('yo playlists no work')
        }

    }

    useEffect(() =>{
        loadDetails()
        loadPlaylists()
    },[]);
    

    return(
        <View>
            <Text>your acount page</Text>
            <Text>Profile name: {user.display_name} </Text>
            <Text>Email: {user.email}</Text>
            <Text>Region: {user.country}</Text>


            <Text>PLAYLISTS</Text>
            <FlatList
                data={playlists.items}
                renderItem={({ item }) => (
                    <TouchableOpacity>
                        <Text>{item.name}</Text>
                        <Image source={{uri: item.images[0].url}}
                            style={{ width: 150, height: 150, borderRadius: 10 }}></Image>
                        <Text></Text>
                    </TouchableOpacity>
                )}
                />
            
        </View>
    )
}
import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import * as AuthSession from "expo-auth-session";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AccountScreen() {
    const [user,setUser] = useState([]);
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
    useEffect(() =>{
        loadDetails()
    },[]);
    

    return(
        <View>
            <Text>your acount page</Text>
            <Text>Profile name: {user.display_name} </Text>
            <Text>Email: {user.email}</Text>
            <Text>Region: {user.country}</Text>
        </View>
    )
}
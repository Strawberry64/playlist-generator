import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Tabs, useRouter  } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

<FontAwesome5 name="database" size={24} color="black" />

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  //outomatic redirect 
   useFocusEffect(
    useCallback(() => {
      const verify = async () => {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          console.log("No token found, redirecting to /");
          router.replace("/"); // force back to login
        }
      };
      verify();
    }, [])
 );

 // if (!checked) return null;

  return (
     <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#121212", // Spotify dark background
          borderTopWidth: 0,          // remove default border
          height: 70,
        },
        tabBarActiveTintColor: "#1DB954", // Spotify green
        tabBarInactiveTintColor: "#B3B3B3", // gray inactive
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-circle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Playlists',
          tabBarIcon: ({ color }) =>  <FontAwesome5 name="list" size={24} color={color} />,
        }}
      />
      
      
      <Tabs.Screen
        name="stats"
        options={{
          title: 'stats',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="db_test"
        options={{
          title: 'Database',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="database" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

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
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Generate/Playlists',
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

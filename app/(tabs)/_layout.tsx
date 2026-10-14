import { Tabs } from "expo-router";
import { Map, User, Bookmark, CircleDot } from "lucide-react-native";
import React from "react";
import Colors from "@/constants/colors";
import { palette } from '@/constants/design';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 64 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom || 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600' as const,
        },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: "Canchas",
          tabBarActiveTintColor: palette.orange,
          tabBarIcon: ({ color }) => <Map color={color} size={24} />,
        }}
      />
      <Tabs.Screen name="my-courts" options={{ title: 'Mis canchas', tabBarActiveTintColor: palette.orange,
        tabBarIcon: ({ color }) => <Bookmark color={color} size={24} /> }} />
      <Tabs.Screen name="play" options={{ title: 'Jugar', tabBarActiveTintColor: palette.orange,
        tabBarIcon: ({ color }) => <CircleDot color={color} size={24} /> }} />
      <Tabs.Protected guard={false}>
        <Tabs.Screen name="teams" />
      </Tabs.Protected>
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarActiveTintColor: palette.orange,
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}

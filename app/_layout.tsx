import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/contexts/AuthContext";
import AccountDataProvider from "@/contexts/AccountDataContext";
import { useFonts } from "expo-font";
import { fontAssets } from "@/constants/font-assets";
import AuthGate from '@/components/AuthGate';
import { PresentationProvider } from '@/components/foundation/PresentationProvider';

SplashScreen.preventAutoHideAsync();


function RootLayoutNav() {
  return (
    <Stack initialRouteName="splash" screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="court/[id]" options={{ headerShown: true, title: "Court Details" }} />
      <Stack.Screen name="organize/create" options={{ headerShown: true }} />
      <Stack.Screen name="organize/quick" options={{ headerShown: true }} />
      <Stack.Screen name="pickup/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="pickup/mine" options={{ headerShown: true }} />
      <Stack.Screen name="matches/mine" options={{ headerShown: true }} />
      <Stack.Screen name="matches/create" options={{ headerShown: true }} />
      <Stack.Screen name="matches/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="organize/[id]" options={{ headerShown: true }} />
      {/* Retain legacy code without exposing unfinished flows in the MVP. */}
      <Stack.Protected guard={false}>
        <Stack.Screen name="team/[id]" />
        <Stack.Screen name="player/[id]" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="create-team" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
      <AuthProvider>
        <AccountDataProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <PresentationProvider>
              <RootLayoutNav />
              <AuthGate />
            </PresentationProvider>
          </GestureHandlerRootView>
        </AccountDataProvider>
      </AuthProvider>
  );
}

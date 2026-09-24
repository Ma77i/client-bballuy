import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/contexts/AuthContext";
import AccountDataProvider from "@/contexts/AccountDataContext";
import { useFonts } from "expo-font";
import AuthGate from '@/components/AuthGate';

SplashScreen.preventAutoHideAsync();


function RootLayoutNav() {
  return (
    <Stack initialRouteName="splash" screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="court/[id]" options={{ headerShown: true, title: "Court Details" }} />
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
  const [fontsLoaded, fontError] = useFonts({
    "Lexend-Regular": require("../assets/fonts/Lexend-Regular.ttf"),
    // "Lexend-Thin": require("../assets/fonts/Lexend-Thin.ttf"),
    // "Lexend-ExtraLight": require("../assets/fonts/Lexend-ExtraLight.ttf"),
    // "Lexend-Light": require("../assets/fonts/Lexend-Light.ttf"),
    "Lexend-Medium": require("../assets/fonts/Lexend-Medium.ttf"),
    "Lexend-SemiBold": require("../assets/fonts/Lexend-SemiBold.ttf"),
    "Lexend-Bold": require("../assets/fonts/Lexend-Bold.ttf"),
    // "Lexend-ExtraBold": require("../assets/fonts/Lexend-ExtraBold.ttf"),
    // "Lexend-Black": require("../assets/fonts/Lexend-Black.ttf"),
  });

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
            <RootLayoutNav />
            <AuthGate />
          </GestureHandlerRootView>
        </AccountDataProvider>
      </AuthProvider>
  );
}

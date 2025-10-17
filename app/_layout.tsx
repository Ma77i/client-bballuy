import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { useFonts } from "expo-font";
import { Text } from "react-native";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack initialRouteName="splash" screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="court/[id]" options={{ headerShown: true, title: "Court Details" }} />
      <Stack.Screen name="team/[id]" options={{ headerShown: true, title: "Team" }} />
      <Stack.Screen name="player/[id]" options={{ headerShown: true, title: "Player Profile" }} />
      <Stack.Screen name="match/[id]" options={{ headerShown: true, title: "Match" }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="create-team" options={{ headerShown: false }} />
    </Stack>
  );
}

// Set default font for all Text components
const originalTextRender = (Text as any).render;
(Text as any).render = function render(props: any, ref: any) {
  const mergedProps = {
    ...props,
    style: [{ fontFamily: "Lexend-Regular" }, props.style],
  };
  return originalTextRender.call(this, mergedProps, ref);
};

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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

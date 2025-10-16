import { useEffect, useState } from "react";
import { View, Image, ActivityIndicator } from "react-native";
import { useRootNavigationState, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";

export default function SplashScreen() {
  const router = useRouter();
  const rootState = useRootNavigationState();
  const { isAuthenticated, isLoading } = useAuth();
  const [checked, setChecked] = useState(false);
  const [hasSeen, setHasSeen] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const v = await AsyncStorage.getItem('hasSeenOnboarding');
      setHasSeen(v === 'true');
      setChecked(true);
    })();
  }, []);

  useEffect(() => {
    if (!rootState?.key || isLoading || !checked) return;
    if (!hasSeen) {
      router.replace('/onboarding');
    } else {
      router.replace(isAuthenticated ? '/(tabs)/map' : '/(auth)/age-gate');
    }
  }, [rootState?.key, isLoading, checked, hasSeen, isAuthenticated, router]);


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={require("@/assets/logo.png")}
        style={{
          width: 140,
          height: 140,
          resizeMode: "contain",
          marginBottom: 20,
        }}
      />
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

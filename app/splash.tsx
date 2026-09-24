import { useEffect, useState } from "react";
import { View, Image, ActivityIndicator } from "react-native";
import { useRootNavigationState, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { authDestination } from '@/lib/auth/controller';

export default function SplashScreen() {
  const router = useRouter();
  const rootState = useRootNavigationState();
  const auth = useAuth();
  const destination = authDestination(auth);
  const [checked, setChecked] = useState(false);
  const [hasSeen, setHasSeen] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem('hasSeenOnboarding');
        setHasSeen(v === 'true');
      } catch { setHasSeen(true); }
      finally { setChecked(true); }
    })();
  }, []);

  useEffect(() => {
    if (!rootState?.key || !destination || !checked) return;
    if (auth.session) {
      router.replace(destination);
    } else if (!hasSeen) {
      router.replace('/onboarding');
    } else {
      router.replace('/(auth)/signin');
    }
  }, [rootState?.key, destination, checked, hasSeen, auth.session, router]);


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

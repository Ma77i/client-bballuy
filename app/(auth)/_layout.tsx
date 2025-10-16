import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="onboarding/index" />
      <Stack.Screen name="onboarding/step2" />
      <Stack.Screen name="onboarding/step3" />
      <Stack.Screen name="onboarding/step4" />
      {/* <Stack.Screen name="welcome" /> */}
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="age-gate" />
      <Stack.Screen name="consent" />
      <Stack.Screen name="profile-setup" />
    </Stack>
  );
}
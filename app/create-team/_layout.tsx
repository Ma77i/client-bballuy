import { Stack } from 'expo-router';
import { TeamCreationProvider } from '@/contexts/TeamCreationContext';
import Colors from '@/constants/colors';

export default function CreateTeamLayout() {
  return (
    <TeamCreationProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="step1" />
        <Stack.Screen name="step2" />
        <Stack.Screen name="step3" />
      </Stack>
    </TeamCreationProvider>
  );
}

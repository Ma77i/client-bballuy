import { ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Text from '@/components/AppText';
import SignOutButton from '@/components/SignOutButton';
import { Button, Panel } from '@/components/foundation/Primitives';
import { GenericMedia } from '@/components/foundation/GenericMedia';
import { palette, spacing } from '@/constants/design';
import { useAuth } from '@/contexts/AuthContext';
import ReportProblem from '@/components/ReportProblem';

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  return <>
    <Stack.Screen options={{ headerShown: true, title: 'Perfil', headerStyle: { backgroundColor: palette.navy }, headerTintColor: palette.text }} />
    <ScrollView style={{ flex: 1, backgroundColor: palette.navy }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.section }}>
      <Text variant="display" style={{ color: palette.orange }} accessibilityRole="header">TU PERFIL</Text>
      <Panel tone="light" style={{ borderLeftWidth: 5, borderLeftColor: palette.orange, gap: spacing.sm }}>
        <Text variant="caption" tone="light">Nombre de la cuenta</Text>
        <Text variant="display" tone="light">{user?.display_name ?? 'Nombre no disponible'}</Text>
        <GenericMedia compact asset="player" size={48} />
      </Panel>
      <Button label="Mis canchas" onPress={() => router.navigate('/(tabs)/my-courts')} />
      <SignOutButton arcade />
      <ReportProblem arcade />
    </ScrollView>
  </>;
}

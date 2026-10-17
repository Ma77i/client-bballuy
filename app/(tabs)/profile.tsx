import { ScrollView, View, useWindowDimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Text from '@/components/AppText';
import SignOutButton from '@/components/SignOutButton';
import { Button, Panel } from '@/components/foundation/Primitives';
import { GenericMedia } from '@/components/foundation/GenericMedia';
import { palette, spacing } from '@/constants/design';
import { useAuth } from '@/contexts/AuthContext';
import ReportProblem from '@/components/ReportProblem';

export default function ProfileScreen() {
  const { user, session } = useAuth();
  const router = useRouter();
  const { width, fontScale } = useWindowDimensions();
  const stacked = width < 390 || fontScale >= 1.25;
  const email = session?.user.email?.trim();
  return <>
    <Stack.Screen options={{ headerShown: true, title: 'Perfil', headerStyle: { backgroundColor: palette.navy }, headerTintColor: palette.text }} />
    <ScrollView style={{ flex: 1, backgroundColor: palette.navy }} contentContainerStyle={{ padding: spacing.md, gap: spacing.md, paddingBottom: spacing.section, maxWidth: 680, width: '100%', alignSelf: 'center' }}>
      <Panel tone="light" style={{ borderTopWidth: 4, borderTopColor: palette.orange, gap: spacing.md,
        flexDirection: stacked ? 'column' : 'row', alignItems: 'center' }}>
        <GenericMedia asset="player" size={Math.min(stacked ? 180 : 150, width - 64)} height={190}
          showCaption={false} imageBackground="transparent" />
        <View style={{ flex: stacked ? undefined : 1, width: stacked ? '100%' : undefined, minWidth: 0, gap: spacing.sm }}>
          <Text variant="caption" tone="light">Cuenta</Text>
          <Text variant="display" tone="light" accessibilityRole="header">{user?.display_name?.trim() || 'Nombre no disponible'}</Text>
          {Boolean(email) && <Text variant="caption" tone="light" selectable style={{ flexShrink: 1 }}>{email}</Text>}
        </View>
      </Panel>
      <Panel style={{ gap: spacing.md }}>
        <Button secondary label="Mis canchas" onPress={() => router.navigate('/(tabs)/my-courts')} />
        <ReportProblem arcade />
        <View style={{ borderTopWidth: 1, borderTopColor: palette.separator, paddingTop: spacing.md }}>
          <SignOutButton arcade />
        </View>
      </Panel>
    </ScrollView>
  </>;
}

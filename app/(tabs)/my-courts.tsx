import { ScrollView, RefreshControl, View } from 'react-native';
import { RefreshCw } from 'lucide-react-native';
import { Stack, useRouter } from 'expo-router';
import Text from '@/components/AppText';
import { Button, StateView } from '@/components/foundation/Primitives';
import CourtCard from '@/components/courts/CourtCard';
import { palette, spacing } from '@/constants/design';
import { useMyCourts } from '@/hooks/courts';
import { GenericMedia } from '@/components/foundation/GenericMedia';
export default function MyCourtsScreen() {
  const router = useRouter(); const membership = useMyCourts();
  return <>
    <Stack.Screen options={{ title: 'Mis canchas', headerShown: true, headerStyle: { backgroundColor: palette.navy }, headerTintColor: palette.text,
      headerTitle: () => <Text variant="display" tone="dark" accessibilityRole="header" style={{ fontSize: 28, lineHeight: 34 }}>Mis canchas</Text>,
      headerRight: () => <Button quiet iconOnly style={{ marginRight: spacing.sm }} label="Actualizar Mis canchas" busy={membership.isFetching && !membership.isPending}
        icon={<RefreshCw size={22} color={palette.text} />} onPress={() => void membership.refetch()} /> }} />
    <ScrollView style={{ flex: 1, backgroundColor: palette.navy }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.section }}
      refreshControl={<RefreshControl refreshing={membership.isFetching && !membership.isPending} onRefresh={() => void membership.refetch()} tintColor={palette.orange} colors={[palette.orange]} />}>
      {membership.isPending ? <StateView title="Cargando tus canchas" loading /> : membership.isError ?
        <StateView title="No pudimos cargar tus canchas" kind="error" action={<Button label="Reintentar" onPress={() => void membership.refetch()} />} />
        : !membership.data?.length ? <View style={{ alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.xl }}>
          <GenericMedia asset="player" size={220} showCaption={false} imageBackground={palette.navy} />
          <Text variant="display" tone="dark" accessibilityRole="header" style={{ textAlign: 'center', fontSize: 28, lineHeight: 34 }}>Tu próxima cancha te espera</Text>
          <Text variant="body" tone="dark" style={{ textAlign: 'center', color: palette.muted }}>Guardá tus canchas favoritas para encontrarlas acá</Text>
          <Button label="Explorar canchas" foregroundColor={palette.navy} style={{ alignSelf: 'stretch', backgroundColor: palette.orange, borderColor: palette.orange }} onPress={() => router.navigate('/(tabs)/map')} />
        </View>
          : membership.data.map(row => <CourtCard illustrated key={row.court_id} showFacts={false}
            court={{ id: row.court_id, name: row.court_catalog?.name ?? 'Detalle no disponible' }}
            onPress={() => router.push({ pathname: '/court/[id]', params: { id: row.court_id } })} />)}
    </ScrollView>
  </>;
}

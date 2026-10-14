import { ScrollView, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Text from '@/components/AppText';
import { Button, StateView } from '@/components/foundation/Primitives';
import CourtCard from '@/components/courts/CourtCard';
import { palette, spacing } from '@/constants/design';
import { useMyCourts } from '@/hooks/courts';
export default function MyCourtsScreen() {
  const router = useRouter(); const membership = useMyCourts();
  return <>
    <Stack.Screen options={{ title: 'Mis canchas', headerShown: true, headerStyle: { backgroundColor: palette.navy }, headerTintColor: palette.text }} />
    <ScrollView style={{ flex: 1, backgroundColor: palette.navy }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.section }}
      refreshControl={<RefreshControl refreshing={membership.isFetching && !membership.isPending} onRefresh={() => void membership.refetch()} tintColor={palette.orange} colors={[palette.orange]} />}>
      <Text variant="display" style={{ color: palette.orange }} accessibilityRole="header">MIS CANCHAS</Text>
      <Text variant="body" tone="dark">Las canchas que agregaste, a mano para volver a jugar.</Text>
      <Button secondary label="Actualizar" busy={membership.isFetching && !membership.isPending} onPress={() => void membership.refetch()} />
      {membership.isPending ? <StateView title="Cargando tus canchas" loading /> : membership.isError ?
        <StateView title="No pudimos cargar tus canchas" kind="error" action={<Button label="Reintentar" onPress={() => void membership.refetch()} />} />
        : !membership.data?.length ? <StateView title="Todavía no agregaste canchas" message="Explorá y agregá las canchas donde querés jugar."
          action={<Button label="Explorar canchas" onPress={() => router.navigate('/(tabs)/map')} />} />
          : membership.data.map(row => <CourtCard key={row.court_id} showFacts={false}
            court={{ id: row.court_id, name: row.court_catalog?.name ?? 'Detalle no disponible' }}
            onPress={() => router.push({ pathname: '/court/[id]', params: { id: row.court_id } })} />)}
    </ScrollView>
  </>;
}

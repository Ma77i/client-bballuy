import { useState } from 'react';
import { RefreshControl, ScrollView, View, useWindowDimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlayHeader } from '@/components/pickup/PlayArt';
import { Button } from '@/components/foundation/Primitives';
import { palette } from '@/constants/design';
import DiscoverGames from '@/components/pickup/DiscoverGames';
import { usePublicSessions } from '@/hooks/pickup';

export default function PlayScreen() {
  const router = useRouter();
  const discovery = usePublicSessions();
  const [courtId, setCourt] = useState('');
  const [format, setFormat] = useState('');
  const { fontScale, width } = useWindowDimensions();
  const params = { ...(courtId ? { courtId } : {}), ...(format ? { format } : {}) };
  return <SafeAreaView style={{ flex: 1, backgroundColor: palette.navy }} edges={['top', 'left', 'right']}>
    <Stack.Screen options={{ headerBackTitle: 'Volver', title: 'Jugar', headerShown: false }} />
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12, gap: 8, width: '100%', maxWidth: 680, alignSelf: 'center' }}
      refreshControl={<RefreshControl refreshing={discovery.isFetching && !discovery.isPending} onRefresh={() => void discovery.refetch()} tintColor={palette.orange} />}>
      <PlayHeader />
      <DiscoverGames games={discovery} courtId={courtId} format={format} onCourtChange={setCourt} onFormatChange={setFormat} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Button quiet label="Mis partidos" onPress={() => router.push('/pickup/mine')} />
        <Button quiet label="Historial" onPress={() => router.push('/matches/mine')} />
      </View>
    </ScrollView>
    <View style={{ borderTopWidth: 1, borderTopColor: palette.raised, backgroundColor: palette.navy }}>
      <View style={{ padding: 12, gap: 12, flexDirection: fontScale >= 1.5 || width < 350 ? 'column' : 'row', width: '100%', maxWidth: 680, alignSelf: 'center' }}>
        <Button label="Armar partido" foregroundColor={palette.navy} style={{ flex: 1, backgroundColor: palette.orange }} onPress={() => router.push({ pathname: '/organize/create', params })} />
        <Button secondary label="Jugar ahora" style={{ flex: 1, borderColor: palette.orange }} onPress={() => router.push({ pathname: '/organize/quick', params })} />
      </View>
    </View>
  </SafeAreaView>;
}


import { Animated, Pressable, View } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowUpRight, Radio } from 'lucide-react-native';
import Text from '@/components/AppText';
import { GamePanel, gameColors, kit } from './Kit';
import { scheduledLabel, type PublicSession } from '@/lib/pickup/discovery';
import { usePressMotion } from '@/components/foundation/useDecorativeMotion';
import { palette, surfaces } from '@/constants/design';
import { scheduleText, sessionStatus } from './presentation';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SessionCard({ game, courtName, arcade = false }: { game: PublicSession; courtName: string; arcade?: boolean }) {
  const router = useRouter();
  const motion = usePressMotion(false);
  const [focused, setFocused] = useState(false);
  const playing = game.state === 'started';
  const badge = game.state === 'cancelled' ? { backgroundColor: palette.lightError, color: palette.cream } :
    game.state === 'completed' ? { backgroundColor: palette.lightSuccess, color: palette.cream } :
      playing ? { backgroundColor: palette.navy, color: palette.cream } : { backgroundColor: palette.orange, color: palette.navy };
  if (arcade) return <AnimatedPressable accessibilityRole="button" accessibilityLabel={`Ver convocatoria ${game.format} en ${courtName}: ${sessionStatus(game)}`}
    onPress={() => router.push({ pathname: '/pickup/[id]', params: { id: game.id } })}
    onPressIn={motion.onPressIn} onPressOut={motion.onPressOut}
    onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); motion.onBlur(); }}
    style={[focused && { outlineWidth: 3, outlineColor: palette.orange, outlineOffset: 3 }, motion.style]}>
    <GamePanel tone="light" style={{ borderLeftWidth: 5, borderLeftColor: palette.orange, gap: 8 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <Text variant="display" tone="light" style={{ fontSize: 42, lineHeight: 46 }}>{game.format}</Text>
        <Text variant="label" style={[badge, { padding: 8, borderRadius: 8 }]}>{sessionStatus(game)}</Text>
      </View>
      <Text variant="display" tone="light" style={{ fontSize: 26, lineHeight: 30 }}>{courtName}</Text>
      <Text variant="body" tone="light">{scheduleText(game)}</Text>
      <Text variant="caption" style={{ color: surfaces.light.muted }}>Organiza: {game.organizer_name}</Text>
      <Text variant="label" tone="light">{game.occupied_places}/{game.capacity} lugares ocupados{game.state === 'open' ? ` · ${game.available_places} disponibles` : ''}</Text>
      <Text variant="caption" style={{ color: surfaces.light.muted }}>{playing ? 'Inicio reportado por quien organiza; no confirma asistencia.' : game.state !== 'open' ? 'Cambios de inscripción cerrados.' : 'No necesitás un equipo ni agregar la cancha.'}</Text>
      <Text variant="label" tone="light">Ver convocatoria →</Text>
    </GamePanel>
  </AnimatedPressable>;
  return <Pressable accessibilityRole="button" accessibilityLabel={`View ${game.format} at ${courtName}`}
    onPress={() => router.push({ pathname: '/pickup/[id]', params: { id: game.id } })}>
    <GamePanel style={playing ? { borderColor: '#98552e' } : undefined}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={kit.row}>{playing && <Radio color={gameColors.orange} size={16} />}<Text style={kit.badge}>
          {playing ? 'PLAYING · REPORTED' : game.state === 'cancelled' ? 'CANCELLED' : game.state === 'completed' ? 'CLOSED' : game.available_places === 0 ? 'FULL INVITATION' : `${game.available_places} OPEN PLACES`}
        </Text></View><ArrowUpRight color={gameColors.muted} size={20} />
      </View>
      <Text style={[kit.section, { fontSize: 22 }]}>{game.format} · {courtName}</Text>
      <Text style={kit.body}>{scheduledLabel(game)}</Text>
      <Text style={kit.help}>Organized by {game.organizer_name}</Text>
      <Text style={kit.help}>{playing ? 'Started by the organizer. Physical attendance is not verified.' : game.state !== 'open' ? 'Registration changes are closed.' : `${game.occupied_places}/${game.capacity} player places · No team or court membership needed.`}</Text>
    </GamePanel>
  </Pressable>;
}

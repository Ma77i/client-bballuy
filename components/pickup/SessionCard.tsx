import { Animated, Pressable, View, useWindowDimensions } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowUpRight, Radio, CalendarDays, Users, UserRound } from 'lucide-react-native';
import Text from '@/components/AppText';
import { GamePanel, gameColors, kit } from './Kit';
import { scheduledLabel, type PublicSession } from '@/lib/pickup/discovery';
import { usePressMotion } from '@/components/foundation/useDecorativeMotion';
import { palette, surfaces } from '@/constants/design';
import { scheduleText, sessionStatus } from './presentation';
import { PlayArt } from './PlayArt';
import { sportsSessionStatus } from './play-presentation';
import { foundationStyles } from '@/components/foundation/styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SessionCard({ game, courtName, arcade = false, sports = false }: { game: PublicSession; courtName: string; arcade?: boolean; sports?: boolean }) {
  const router = useRouter();
  const motion = usePressMotion(false);
  const [focused, setFocused] = useState(false);
  const { fontScale, width } = useWindowDimensions();
  const playing = game.state === 'started';
  const badge = game.state === 'cancelled' ? { backgroundColor: palette.lightError, color: palette.cream } :
    game.state === 'completed' ? { backgroundColor: palette.lightSuccess, color: palette.cream } :
      playing ? { backgroundColor: palette.navy, color: palette.cream } : { backgroundColor: palette.orange, color: palette.navy };
  const sportsBadge = sportsSessionStatus(game);
  const stacked = fontScale >= 1.5 || width < 350;
  if (sports) return <AnimatedPressable accessibilityRole="button" accessibilityLabel={`Ver partido ${game.format} en ${courtName}: ${sportsBadge.label}. ${scheduleText(game)}.${game.organizer_name && game.organizer_name !== 'Organizer' ? ` Organiza: ${game.organizer_name}.` : ''} ${game.state === 'open' ? `${game.available_places} de ${game.capacity} lugares disponibles.` : 'Inscripción cerrada.'}${playing ? ' Inicio reportado; no confirma asistencia.' : ''}`}
    accessibilityHint="Arte deportivo genérico de R02. Abrir el partido no realiza una inscripción."
    onPress={() => router.push({ pathname: '/pickup/[id]', params: { id: game.id } })}
    onPressIn={motion.onPressIn} onPressOut={motion.onPressOut} onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); motion.onBlur(); }}
    style={[focused && { outlineWidth: 3, outlineColor: palette.orange, outlineOffset: 3 }, motion.style]}>
    <GamePanel tone="light" style={{ borderColor: palette.cream, padding: 8, borderRadius: 16 }}>
      <View style={{ flexDirection: stacked ? 'column' : 'row', gap: 12, minHeight: 152 }}>
        <View style={{ backgroundColor: palette.navy, borderRadius: 12, overflow: 'hidden', width: stacked ? '100%' : 110, minHeight: stacked ? 128 : 152 }}>
          <PlayArt kind={game.format} style={{ position: 'absolute', inset: 0 }} />
          <Text variant="display" style={{ position: 'absolute', top: 6, left: 8, color: palette.cream, fontSize: 56, lineHeight: 64,
            transform: [{ rotate: '-7deg' }], textShadowColor: palette.navy, textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 3 }}>{game.format}</Text>
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
            <Text variant="display" tone="light" style={{ flexGrow: 1, flexShrink: 1, fontSize: 24, lineHeight: 28 }}>{courtName}</Text>
            <Text variant="caption" style={{ backgroundColor: sportsBadge.backgroundColor, color: sportsBadge.color, fontSize: 12, lineHeight: 18, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>{sportsBadge.label}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><CalendarDays size={16} color={palette.navy} aria-hidden /><Text variant="caption" tone="light" style={{ flex: 1, fontSize: 13, lineHeight: 18 }}>{scheduleText(game)}</Text></View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Users size={16} color={palette.navy} aria-hidden /><Text variant="caption" tone="light" style={{ flex: 1, fontSize: 13, lineHeight: 18 }}>{game.state === 'open' ? `${game.available_places}/${game.capacity} lugares disponibles` : 'Inscripción cerrada'}</Text></View>
          {game.organizer_name && game.organizer_name !== 'Organizer' && <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><UserRound size={16} color={palette.navy} aria-hidden /><Text variant="caption" tone="light" style={{ flex: 1, fontSize: 13, lineHeight: 18 }}>{game.organizer_name}</Text></View>}
          {playing && <Text variant="caption" style={{ color: surfaces.light.muted, fontSize: 12, lineHeight: 17 }}>Inicio reportado; no confirma asistencia.</Text>}
          <View style={[foundationStyles.button, { backgroundColor: palette.orange, padding: 6, marginTop: 'auto', minHeight: 48, borderRadius: 10 }]}><Text variant="label" style={{ color: palette.navy, fontSize: 15, lineHeight: 20 }}>Ver partido</Text></View>
        </View>
      </View>
    </GamePanel>
  </AnimatedPressable>;
  if (arcade) return <AnimatedPressable accessibilityRole="button" accessibilityLabel={`Ver partido ${game.format} en ${courtName}: ${sessionStatus(game)}`}
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
      <Text variant="label" tone="light">Ver partido →</Text>
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

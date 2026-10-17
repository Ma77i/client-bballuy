import { Animated, Pressable, View, useWindowDimensions } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import Text from '@/components/AppText';
import { GenericMedia } from '@/components/foundation/GenericMedia';
import { Panel } from '@/components/foundation/Primitives';
import { palette, spacing } from '@/constants/design';
import type { Court } from '@/lib/courts/catalog';
import { usePressMotion } from '@/components/foundation/useDecorativeMotion';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CourtFacts({ court }: { court: Court }) {
  return <Text variant="caption" tone="light">{court.surface || 'Superficie sin registrar'} · {court.half_court === null ? 'Tamaño sin registrar' : court.half_court ? 'Media cancha' : 'Cancha completa'}</Text>;
}
type CardProps = ({ court: Court; showFacts?: true } | { court: Pick<Court, 'id' | 'name'>; showFacts: false }) & {
  playing?: boolean; stale?: boolean; illustrated?: boolean; onPress(): void;
};
export default function CourtCard(props: CardProps) {
  const { court, playing = false, stale = false, onPress } = props;
  const [focused, setFocused] = useState(false);
  const feedback = usePressMotion(false);
  const { fontScale, width } = useWindowDimensions();
  const stacked = fontScale >= 1.5 || width < 350;
  return <AnimatedPressable accessibilityRole="button" accessibilityLabel={`Ver cancha: ${court.name}`}
    accessibilityHint={props.illustrated ? 'Ilustración genérica de básquet; no es una fotografía ni representa esta cancha.' : undefined}
    onPress={onPress} onPressIn={feedback.onPressIn} onPressOut={feedback.onPressOut}
    onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); feedback.onBlur(); }}
    style={[{ opacity: feedback.pressed ? .9 : 1, borderRadius: 20 }, focused && {
      outlineColor: palette.orange, outlineWidth: 3, outlineOffset: 3, outlineStyle: 'solid' }, feedback.style]}>
    <Panel tone="light" style={props.illustrated ? { padding: spacing.md, borderColor: palette.cream, gap: spacing.sm } : { borderLeftWidth: 5, borderLeftColor: palette.orange, padding: spacing.md, gap: spacing.xs }}>
      {props.illustrated ? <View style={{ flexDirection: stacked ? 'column' : 'row', gap: spacing.md, alignItems: stacked ? 'stretch' : 'center' }}>
        <GenericMedia size={116} showCaption={false} imageBackground={palette.navy} style={{ alignSelf: stacked ? 'center' : 'flex-start' }} />
        <View style={{ flex: 1, minWidth: 0, gap: spacing.xs }}>
          <Text variant="display" tone="light" style={{ fontSize: 26, lineHeight: 30 }}>{court.name}</Text>
          {props.showFacts !== false && <CourtFacts court={props.court} />}
          {playing && <Text variant="caption" style={{ color: palette.raised, marginTop: spacing.xs }}>Actividad reportada: jugando{stale ? ' · Comprobación fallida' : ''}</Text>}
          <View style={{ minHeight: 48, backgroundColor: palette.cream, borderColor: palette.orangeInk, borderWidth: 1.5, borderRadius: 12, padding: spacing.sm,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs }}>
            <Text variant="label" style={{ color: palette.orangeInk, flexShrink: 1 }}>Ver cancha</Text>
            <ChevronRight size={18} color={palette.orangeInk} aria-hidden />
          </View>
        </View>
      </View> : <>
          <Text variant="display" tone="light" style={{ fontSize: 26, lineHeight: 30 }}>{court.name}</Text>
          {props.showFacts !== false && <CourtFacts court={props.court} />}
          {playing && <Text variant="caption" tone="light">Jugando · Reportado por organizador{stale ? ' · Comprobación fallida' : ''}</Text>}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, alignItems: 'center', justifyContent: 'space-between' }}>
        <GenericMedia compact size={28} style={{ flexGrow: 1, flexBasis: 212 }} />
        <Text variant="caption" tone="light">Ver cancha →</Text>
      </View>
      </>}
    </Panel>
  </AnimatedPressable>;
}

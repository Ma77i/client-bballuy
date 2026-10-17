import { Choice, ChoiceGroup } from '@/components/foundation/Primitives';
import { capacities, pickupFormats, type PickupFormat } from '@/lib/pickup/organizer';
import { Animated, Platform, Pressable, View, useWindowDimensions } from 'react-native';
import { useState, type KeyboardEvent } from 'react';
import { Check, Circle } from 'lucide-react-native';
import Text from '@/components/AppText';
import { useDecorativeFeedback } from '@/components/foundation/useDecorativeMotion';
import { PlayArt } from './PlayArt';
import { palette } from '@/constants/design';

function IllustratedFormat({ format, selected, disabled, onPress }: { format: PickupFormat; selected: boolean; disabled: boolean; onPress(): void }) {
  const [focused, setFocused] = useState(false);
  const { fontScale } = useWindowDimensions();
  return <Pressable accessibilityRole="radio" accessibilityLabel={format} accessibilityHint={`${capacities[format]} participantes totales`}
    accessibilityState={{ checked: selected, disabled }} aria-checked={selected} disabled={disabled}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onPress={onPress}
    style={({ pressed }) => ({ flex: 1, minWidth: fontScale >= 1.4 ? '100%' : 96, backgroundColor: palette.cream, borderRadius: 12,
      borderWidth: 2, borderColor: selected ? palette.orange : palette.cream, overflow: 'hidden', opacity: disabled ? .65 : pressed ? .85 : 1,
      ...(focused ? { outlineColor: palette.orange, outlineWidth: 3, outlineOffset: 2, outlineStyle: 'solid' as const } : {}) })}>
    <PlayArt kind={format} style={{ height: 52, margin: 6, borderRadius: 8, overflow: 'hidden' }} />
    <Text variant="display" tone="light" style={{ fontSize: 36, lineHeight: 38, textAlign: 'center' }}>{format}</Text>
    <Text variant="caption" tone="light" style={{ fontSize: 12, lineHeight: 18, textAlign: 'center' }}>{capacities[format]} lugares</Text>
    <View style={{ minHeight: 30, padding: 4, marginTop: 4, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: selected ? palette.orange : palette.cream }}>
      {selected ? <Check size={16} color={palette.navy} aria-hidden /> : <Circle size={16} color={palette.separator} aria-hidden />}
      {selected && <Text variant="caption" tone="light" style={{ fontSize: 11, lineHeight: 17 }}>Seleccionado</Text>}
    </View>
  </Pressable>;
}

export default function FormatChoices({ value, disabled = false, illustrated = false, onChange }: {
  value: PickupFormat; disabled?: boolean; illustrated?: boolean; onChange(value: PickupFormat): void;
}) {
  const feedback = useDecorativeFeedback(value, !disabled, 'selection');
  // Selection updates immediately; motion only observes the selected format.
  const keyboard = Platform.OS === 'web' ? { onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== ' ' || !(event.target instanceof HTMLElement)) return;
    const label = event.target.closest('[role="radio"]')?.getAttribute('aria-label');
    const format = pickupFormats.find(format => format === label);
    if (format) { event.preventDefault(); if (!disabled && (!illustrated || !event.repeat)) onChange(format); }
  } } : {};
  return <Animated.View {...keyboard} style={feedback}><ChoiceGroup label="Formato de juego" style={illustrated ? { gap: 8, alignItems: 'stretch' } : undefined}>
    {pickupFormats.map(format => illustrated ? <IllustratedFormat key={format} format={format} selected={value === format} disabled={disabled} onPress={() => onChange(format)} /> : <Choice key={format} tone="light" emphasis="format"
      label={format} detail={`${capacities[format]} participantes totales`} selected={value === format}
      style={value === format ? { borderColor: palette.orange } : undefined}
      disabled={disabled} onPress={() => onChange(format)} />)}
  </ChoiceGroup></Animated.View>;
}


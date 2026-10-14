import { Choice, ChoiceGroup } from '@/components/foundation/Primitives';
import { capacities, pickupFormats, type PickupFormat } from '@/lib/pickup/organizer';
import { Animated, Platform } from 'react-native';
import type { KeyboardEvent } from 'react';
import { useDecorativeFeedback } from '@/components/foundation/useDecorativeMotion';
import { palette } from '@/constants/design';

export default function FormatChoices({ value, disabled = false, onChange }: {
  value: PickupFormat; disabled?: boolean; onChange(value: PickupFormat): void;
}) {
  const feedback = useDecorativeFeedback(value, !disabled, 'selection');
  // RN Web's radio press responder supports Enter; also handle the standard Space key.
  const keyboard = Platform.OS === 'web' ? { onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== ' ' || !(event.target instanceof HTMLElement)) return;
    const label = event.target.closest('[role="radio"]')?.getAttribute('aria-label');
    const format = pickupFormats.find(format => format === label);
    if (format) { event.preventDefault(); if (!disabled) onChange(format); }
  } } : {};
  return <Animated.View {...keyboard} style={feedback}><ChoiceGroup label="Formato de juego">
    {pickupFormats.map(format => <Choice key={format} tone="light" emphasis="format"
      label={format} detail={`${capacities[format]} participantes totales`} selected={value === format}
      style={value === format ? { borderColor: palette.orange } : undefined}
      disabled={disabled} onPress={() => onChange(format)} />)}
  </ChoiceGroup></Animated.View>;
}

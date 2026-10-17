import { useId, useState } from 'react';
import { View } from 'react-native';
import Text from '@/components/AppText';
import { palette, surfaces, fonts } from '@/constants/design';
import { errorText } from './error-copy';
import { localDateField, localSchedule, localTimeField, nextMinute, scheduleDateLabel, scheduleSelection, scheduleTimezoneLabel, type SchedulePart } from './schedule-policy';
import type { PlannedScheduleProps } from './PlannedSchedule.types';

// Browser-native controls keep the mobile module out of the web bundle.
export default function PlannedSchedule({ value, disabled, expanded, errors, onChange }: PlannedScheduleProps) {
  const id = useId();
  const [issue, setIssue] = useState<string>();
  function apply(part: SchedulePart, raw: string) {
    if (disabled) return;
    const selected = localSchedule(part === 'date' ? { date: raw, time: '12:00' } : { date: value.date, time: raw });
    if (!selected) { setIssue('Elegí una fecha y hora válidas.'); return; }
    const result = scheduleSelection(value, part, selected);
    setIssue(result.error);
    if (result.accepted) onChange(result.fields);
  }
  return <View style={{ gap: 8 }}>
    <View style={{ flexDirection: expanded ? 'column' : 'row', gap: 12 }}>
      {(['date', 'time'] as const).map(part => <View key={part} style={{ flex: 1, minWidth: 0, gap: 4 }}>
        <label htmlFor={`${id}-${part}`} style={{ color: palette.navy, fontFamily: fonts.body, fontSize: 14 }}>{part === 'date' ? 'Fecha' : 'Hora'}</label>
        <input id={`${id}-${part}`} type={part} lang="es-UY" aria-label={part === 'date' ? 'Fecha' : 'Hora'} aria-invalid={Boolean(errors[part])}
          disabled={disabled} value={value[part]} step={part === 'time' ? 60 : undefined}
          min={part === 'date' ? localDateField(new Date()) : value.date === localDateField(new Date()) ? localTimeField(nextMinute()) : undefined}
          onChange={event => apply(part, event.target.value)}
          style={{ boxSizing: 'border-box', width: '100%', minWidth: 0, minHeight: 48, padding: 8, borderRadius: 12,
            background: palette.cream, color: palette.navy, border: `1px solid ${palette.separator}`, font: 'inherit', fontFamily: fonts.body, fontSize: 14 }} />
        {part === 'date' && <Text variant="caption" tone="light">{scheduleDateLabel(value)}</Text>}
        {errors[part] && <Text variant="caption" accessibilityRole="alert" style={{ color: surfaces.light.error }}>{errorText(errors[part])}</Text>}
      </View>)}
    </View>
    <Text variant="caption" style={{ color: surfaces.light.muted }}>{scheduleTimezoneLabel()}</Text>
    {issue && <Text variant="caption" accessibilityRole="alert" style={{ color: surfaces.light.error }}>{issue}</Text>}
  </View>;
}

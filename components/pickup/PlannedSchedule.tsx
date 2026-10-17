import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Keyboard, Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarDays, Clock } from 'lucide-react-native';
import Text from '@/components/AppText';
import { Button } from '@/components/foundation/Primitives';
import { usePresentationMotion } from '@/components/foundation/PresentationProvider';
import { palette, surfaces } from '@/constants/design';
import { foundationStyles } from '@/components/foundation/styles';
import { errorText } from './error-copy';
import { nextMinute, pickerValue, scheduleDateLabel, scheduleSelection, scheduleTimezoneLabel, todayMinimum, type SchedulePart } from './schedule-policy';
import type { PlannedScheduleProps } from './PlannedSchedule.types';

export default function PlannedSchedule({ value, disabled, expanded, errors, onChange }: PlannedScheduleProps) {
  const [open, setOpen] = useState<SchedulePart | null>(null);
  const [candidate, setCandidate] = useState(new Date());
  const [issue, setIssue] = useState<string>();
  const dateTrigger = useRef<View>(null), timeTrigger = useRef<View>(null), heading = useRef<View>(null);
  const returnTo = useRef<SchedulePart>('date'), androidMode = useRef<SchedulePart | null>(null);
  const { reduced } = usePresentationMotion();
  useEffect(() => () => { if (Platform.OS === 'android' && androidMode.current) void DateTimePickerAndroid.dismiss(androidMode.current); }, []);
  function restoreFocus() {
    const target = returnTo.current === 'date' ? dateTrigger.current : timeTrigger.current;
    if (target) AccessibilityInfo.sendAccessibilityEvent(target, 'focus');
  }
  function apply(part: SchedulePart, selected: Date) {
    if (disabled) return false;
    const result = scheduleSelection(value, part, selected);
    setIssue(result.error);
    if (result.accepted) onChange(result.fields);
    return result.accepted;
  }
  function show(part: SchedulePart) {
    if (disabled) return;
    Keyboard.dismiss(); setIssue(undefined); returnTo.current = part;
    const initial = pickerValue(value);
    if (Platform.OS === 'android') {
      androidMode.current = part;
      DateTimePickerAndroid.open({ value: initial, mode: part, is24Hour: true,
        ...(part === 'date' ? { minimumDate: todayMinimum() } : {}),
        positiveButton: { label: 'Listo', textColor: palette.orangeInk }, negativeButton: { label: 'Cancelar' },
        onValueChange: (_event, selected) => { androidMode.current = null; apply(part, selected); restoreFocus(); },
        onDismiss: () => { androidMode.current = null; restoreFocus(); },
      });
    } else { setCandidate(initial); setOpen(part); }
  }
  return <View style={{ gap: 8 }}>
    <View style={{ flexDirection: expanded ? 'column' : 'row', gap: 12 }}>
      {(['date', 'time'] as const).map(part => <View key={part} style={{ flex: 1, gap: 4 }}>
        <Text variant="caption" tone="light">{part === 'date' ? 'Fecha' : 'Hora'}</Text>
        <Pressable ref={part === 'date' ? dateTrigger : timeTrigger} accessibilityRole="button" disabled={disabled}
          accessibilityLabel={`${part === 'date' ? 'Fecha' : 'Hora'}: ${part === 'date' ? scheduleDateLabel(value) : value.time}`}
          accessibilityState={{ disabled }} onPress={() => show(part)}
          style={({ pressed }) => [foundationStyles.button, { justifyContent: 'flex-start', backgroundColor: palette.cream, borderColor: palette.separator, padding: 10, opacity: disabled ? .6 : pressed ? .85 : 1 }]}>
          {part === 'date' ? <CalendarDays size={18} color={palette.navy} aria-hidden /> : <Clock size={18} color={palette.navy} aria-hidden />}
          <Text variant="caption" tone="light" style={{ flex: 1 }}>{part === 'date' ? scheduleDateLabel(value) : value.time}</Text>
        </Pressable>
        {errors[part] && <Text variant="caption" accessibilityRole="alert" style={{ color: surfaces.light.error }}>{errorText(errors[part])}</Text>}
      </View>)}
    </View>
    <Text variant="caption" style={{ color: surfaces.light.muted }}>{scheduleTimezoneLabel()}</Text>
    {issue && <Text variant="caption" accessibilityRole="alert" style={{ color: surfaces.light.error }}>{issue}</Text>}
    <Modal visible={Boolean(open) && !disabled} transparent animationType={reduced ? 'none' : 'fade'} onRequestClose={() => setOpen(null)} onDismiss={restoreFocus}
      onShow={() => { if (heading.current) AccessibilityInfo.sendAccessibilityEvent(heading.current, 'focus'); }}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000088' }} accessibilityViewIsModal>
        <SafeAreaView edges={['bottom', 'left', 'right']} style={{ backgroundColor: palette.navy, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' }}>
          <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
            <View ref={heading} accessible accessibilityRole="header"><Text variant="section" tone="dark">{open === 'date' ? 'Elegí la fecha' : 'Elegí la hora'}</Text></View>
            {open && <DateTimePicker value={candidate} mode={open} display="spinner" locale="es-UY" themeVariant="dark" textColor={palette.cream}
              minimumDate={open === 'date' ? todayMinimum() : nextMinute()} onValueChange={(_event, selected) => setCandidate(selected)} style={{ height: 190, width: '100%' }} />}
            {issue && <Text variant="caption" accessibilityRole="alert" style={{ color: palette.error }}>{issue}</Text>}
            <View style={{ flexDirection: expanded ? 'column' : 'row', gap: 12 }}>
              <Button secondary label="Cancelar" style={{ flex: 1 }} onPress={() => setOpen(null)} />
              <Button label="Listo" foregroundColor={palette.navy} style={{ flex: 1, backgroundColor: palette.orange }} onPress={() => { if (open && apply(open, candidate)) setOpen(null); }} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  </View>;
}


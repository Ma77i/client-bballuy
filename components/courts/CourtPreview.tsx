import { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, BackHandler, Platform, ScrollView, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Text from '@/components/AppText';
import { Button, Panel } from '@/components/foundation/Primitives';
import { GenericMedia } from '@/components/foundation/GenericMedia';
import { usePresentationMotion } from '@/components/foundation/PresentationProvider';
import { motion, palette, radii, spacing } from '@/constants/design';
import type { Court } from '@/lib/courts/catalog';
import { CourtFacts } from './CourtCard';
import { sheetGesture } from './discovery-state';
import { X } from 'lucide-react-native';

export default function CourtPreview({ court, expanded, onExpandedChange, onDragChange, onClose, onOpen, bottomInset, focused, availableHeight }: {
  court: Court; expanded: boolean; onExpandedChange(value: boolean): void; onDragChange(value: boolean): void; onClose(): void; onOpen(): void; bottomInset: number; focused: boolean; availableHeight: number;
}) {
  const { fontScale } = useWindowDimensions();
  const { reduced, active } = usePresentationMotion();
  const heading = useRef<View>(null);
  const [entrance] = useState(() => new Animated.Value(1));
  useEffect(() => {
    entrance.stopAnimation(); entrance.setValue(1);
    if (!focused) return;
    const focus = requestAnimationFrame(() => {
      if (Platform.OS === 'web') heading.current?.focus();
      else if (heading.current) AccessibilityInfo.sendAccessibilityEvent(heading.current, 'focus');
    });
    if (reduced || !active) return () => cancelAnimationFrame(focus);
    entrance.setValue(0);
    const animation = Animated.timing(entrance, { toValue: 1, duration: motion.sheet, useNativeDriver: true });
    animation.start();
    return () => { cancelAnimationFrame(focus); animation.stop(); };
  }, [court.id, entrance, reduced, active, focused]);
  useEffect(() => {
    if (!focused) return;
    const handler = BackHandler.addEventListener('hardwareBackPress', () => { onClose(); return true; });
    return () => handler.remove();
  }, [focused, onClose]);
  // Keep the recognizer stable when parent state changes during touch ownership.
  useEffect(() => () => onDragChange(false), [onDragChange]);
  const pan = useMemo(() => Gesture.Pan()
    .runOnJS(true)
    .activeOffsetY([-12, 12])
    .failOffsetX([-24, 24])
    .shouldCancelWhenOutside(false)
    .onBegin(() => onDragChange(true))
    .onEnd(event => {
      const action = sheetGesture(event.translationY, event.translationX);
      if (action) onExpandedChange(action === 'expand');
    })
    .onFinalize(() => onDragChange(false)), [onDragChange, onExpandedChange]);
  const large = fontScale >= 1.5;
  return <Animated.View accessibilityViewIsModal onAccessibilityEscape={onClose}
    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, maxHeight: availableHeight * .9,
      opacity: entrance, transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }] }}>
    <Panel tone="light" style={{ borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet,
      padding: spacing.sm, paddingBottom: spacing.sm + bottomInset, gap: spacing.xs, flexShrink: 1 }}>
      <GestureDetector gesture={pan}>
        <View collapsable={false} testID="court-preview-handle" accessible={false}
          style={{ minHeight: 44, justifyContent: 'center', touchAction: 'none' }}>
          <View style={{ height: 4, width: 32, borderRadius: 4, backgroundColor: palette.separator, alignSelf: 'center' }} />
        </View>
      </GestureDetector>
      <ScrollView style={{ flexGrow: 0, flexShrink: 1, maxHeight: Math.max(48, availableHeight * .9 - 64 - bottomInset) }}
        contentContainerStyle={{ gap: spacing.xs }}>
        <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }}>
          {!large && <GenericMedia size={56} showCaption={false} imageBackground={palette.navy} />}
          <View style={{ flex: 1, minWidth: 0, gap: spacing.xs }}>
            <View ref={heading} accessible accessibilityRole="header" accessibilityLabel={court.name}>
              <Text variant="display" tone="light" style={{ fontSize: 26, lineHeight: 30 }}>{court.name}</Text>
            </View>
            <CourtFacts court={court} />
          </View>
          <Button quiet iconOnly tone="light" label="Cerrar" icon={<X size={24} color={palette.navy} />} onPress={onClose} />
        </View>
        {(expanded || large) && <>
          <Text variant="body" tone="light">Iluminación: {court.lighting || 'Sin registrar'}</Text>
          {court.notes && <Text variant="body" tone="light">{court.notes}</Text>}
        </>}
        <View style={{ flexDirection: large ? 'column' : 'row', gap: spacing.sm, alignItems: 'stretch' }}>
          <Button tone="light" label="Ver cancha" foregroundColor={palette.navy}
            style={{ backgroundColor: palette.orange, borderColor: palette.orange, flex: large ? undefined : 1 }} onPress={onOpen} />
          <Button quiet expanded={expanded} tone="light" label={expanded ? 'Contraer' : 'Ampliar'} onPress={() => onExpandedChange(!expanded)} />
        </View>
      </ScrollView>
    </Panel>
  </Animated.View>;
}

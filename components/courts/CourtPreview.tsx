import { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, BackHandler, PanResponder, Platform, ScrollView, View, useWindowDimensions } from 'react-native';
import Text from '@/components/AppText';
import { Button, Panel } from '@/components/foundation/Primitives';
import { GenericMedia } from '@/components/foundation/GenericMedia';
import { usePresentationMotion } from '@/components/foundation/PresentationProvider';
import { motion, palette, radii, spacing } from '@/constants/design';
import type { Court } from '@/lib/courts/catalog';
import { CourtFacts } from './CourtCard';
import { sheetGesture } from './discovery-state';
import { X } from 'lucide-react-native';

export default function CourtPreview({ court, expanded, onExpand, onClose, onOpen, bottomInset, focused, availableHeight }: {
  court: Court; expanded: boolean; onExpand(): void; onClose(): void; onOpen(): void; bottomInset: number; focused: boolean; availableHeight: number;
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
  const pan = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 12 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
    onPanResponderRelease: (_, gesture) => {
      const action = sheetGesture(gesture.dy, gesture.dx);
      if (action === 'close') onClose();
      if (action === 'expand' && !expanded) onExpand();
    },
  }), [expanded, onClose, onExpand]);
  const large = fontScale >= 1.5;
  return <Animated.View accessibilityViewIsModal onAccessibilityEscape={onClose}
    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, maxHeight: availableHeight * .9,
      opacity: entrance, transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }] }}>
    <Panel tone="light" style={{ borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet,
      padding: spacing.sm, paddingBottom: spacing.sm + bottomInset, gap: spacing.xs, flexShrink: 1 }}>
      <ScrollView style={{ flexGrow: 0, flexShrink: 1, maxHeight: Math.max(48, availableHeight * .9 - 20 - bottomInset) }}
        contentContainerStyle={{ gap: spacing.xs }}>
        <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' }}>
          <View {...pan.panHandlers} style={{ flex: 1, minHeight: 48, gap: spacing.xs }}>
            <View accessible={false} style={{ height: 4, width: 32, borderRadius: 4, backgroundColor: palette.separator, alignSelf: 'center' }} />
            <View ref={heading} accessible accessibilityRole="header" accessibilityLabel={court.name}>
              <Text variant="display" tone="light" style={{ fontSize: 26, lineHeight: 30 }}>{court.name}</Text>
            </View>
          </View>
          <Button quiet iconOnly tone="light" label="Cerrar" icon={<X size={24} color={palette.navy} />} onPress={onClose} />
        </View>
        <CourtFacts court={court} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, alignItems: 'center', justifyContent: 'space-between' }}>
          {!large ? <GenericMedia compact size={28} style={{ flexBasis: 200, flexGrow: 1 }} />
            : <Text variant="caption" tone="light">Ilustración · No es una foto</Text>}
          {!large && <Button quiet expanded={expanded} tone="light" label={expanded ? 'Ver menos' : 'Ampliar'} onPress={onExpand} />}
        </View>
        {(expanded || large) && <>
          <Text variant="body" tone="light">Iluminación: {court.lighting || 'Sin registrar'}</Text>
          {court.notes && <Text variant="body" tone="light">{court.notes}</Text>}
        </>}
        <Button tone="light" label="Ver cancha" onPress={onOpen} />
      </ScrollView>
    </Panel>
  </Animated.View>;
}

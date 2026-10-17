import { useEffect, useImperativeHandle, useRef, useState, type ComponentRef } from 'react';
import { AccessibilityInfo, Animated, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Svg, { Circle, Path } from 'react-native-svg';
import type { CourtMapProps } from './types';
import { catalogRegion } from '@/lib/courts/catalog';
import { motion, palette } from '@/constants/design';
import { usePresentationMotion } from '@/components/foundation/PresentationProvider';

function BasketballMarker({ selected, focused, name, onSelect, onHost }: {
  selected: boolean; focused: boolean; name: string; onSelect(): void; onHost(host: View | null): void;
}) {
  const { reduced, active } = usePresentationMotion();
  const [scale] = useState(() => new Animated.Value(1));
  useEffect(() => {
    scale.stopAnimation(); scale.setValue(1);
    if (!selected || reduced || !active || !focused) return;
    const animation = Animated.sequence([
      Animated.timing(scale, { toValue: 1.06, duration: motion.selection / 2, useNativeDriver: false }),
      Animated.timing(scale, { toValue: 1, duration: motion.selection / 2, useNativeDriver: false }),
    ]);
    animation.start(); return () => animation.stop();
  }, [selected, reduced, active, scale, focused]);
  return <Animated.View ref={onHost} accessible accessibilityRole="button" accessibilityLabel={`Seleccionar ${name}`}
    accessibilityState={{ selected }} onAccessibilityTap={onSelect} accessibilityActions={[{ name: 'activate' }]}
    onAccessibilityAction={event => { if (event.nativeEvent.actionName === 'activate') onSelect(); }}
    style={{ width: 48, height: 48, transform: [{ scale }] }}>
    <Svg accessible={false} accessibilityElementsHidden width={48} height={48} viewBox="0 0 48 48">
      <Circle cx={24} cy={24} r={22} fill={selected ? palette.cream : palette.navy} stroke={palette.navy} strokeWidth={selected ? 3 : 1} />
      <Circle cx={24} cy={24} r={17} fill={palette.orange} stroke={palette.navy} strokeWidth={2} />
      <Path d="M7 24h34M24 7v34M13 11q22 13 0 26M35 11q-22 13 0 26" fill="none" stroke={palette.navy} strokeWidth={2} />
    </Svg>
  </Animated.View>;
}
function CourtMarker({ court, selected, onSelect, focused, onHost }: {
  court: CourtMapProps['courts'][number]; selected: boolean; onSelect(id: string): void; focused: boolean; onHost(host: View | null): void;
}) {
  // Bound native snapshot tracking to mount/selection, never a continuous map loop.
  const [snapshot, setSnapshot] = useState<{ selected: boolean; settled: boolean }>({ selected, settled: false });
  const tracking = snapshot.selected !== selected || !snapshot.settled;
  const marker = useRef<ComponentRef<typeof Marker>>(null);
  useEffect(() => {
    const timer = setTimeout(() => { marker.current?.redraw(); setSnapshot({ selected, settled: true }); }, motion.selection + 32);
    return () => clearTimeout(timer);
  }, [selected]);
  return <Marker ref={marker} identifier={court.id} coordinate={court} tracksViewChanges={tracking}
    stopPropagation accessible={false}
    onPress={event => { event.stopPropagation(); onSelect(court.id); }}>
    <BasketballMarker selected={selected} focused={focused} name={court.name} onSelect={() => onSelect(court.id)} onHost={onHost} />
  </Marker>;
}
export default function CourtMap({ courts, location, onSelect, selectedId, camera, onCamera, onDismiss, focused = true, interactionEnabled = true, focusRef, focusRegion, onFocusRegionApplied }: CourtMapProps) {
  const map = useRef<MapView>(null);
  const ready = useRef(false);
  const markerHosts = useRef(new Map<string, View>());
  useImperativeHandle(focusRef, () => ({ focusMarker(id) {
    const host = markerHosts.current.get(id);
    if (!host) return false;
    AccessibilityInfo.sendAccessibilityEvent(host, 'focus'); return true;
  } }), []);
  const lastLocation = useRef<CourtMapProps['location']>(camera ? location : null);
  const { reduced } = usePresentationMotion();
  useEffect(() => {
    if (ready.current && focusRegion) {
      map.current?.animateToRegion(focusRegion, reduced ? 0 : motion.switch);
      onFocusRegionApplied?.();
    }
  }, [focusRegion, reduced, onFocusRegionApplied]);
  useEffect(() => {
    if (location && location !== lastLocation.current) {
      lastLocation.current = location;
      map.current?.animateToRegion({ ...location, latitudeDelta: .015, longitudeDelta: .015 }, reduced ? 0 : motion.switch);
    }
  }, [location, reduced]);
  return <View style={{ flex: 1, minHeight: 280 }} accessibilityElementsHidden={Boolean(selectedId)}
    importantForAccessibility={selectedId ? 'no-hide-descendants' : 'auto'}>
    <MapView scrollEnabled={interactionEnabled} zoomEnabled={interactionEnabled} rotateEnabled={interactionEnabled} pitchEnabled={interactionEnabled} ref={map} style={{ flex: 1 }} initialRegion={camera ?? (location ? { ...location, latitudeDelta: .015, longitudeDelta: .015 } : catalogRegion(courts))}
      onMapReady={() => {
        ready.current = true;
        if (focusRegion) { map.current?.animateToRegion(focusRegion, reduced ? 0 : motion.switch); onFocusRegionApplied?.(); }
        else if (!camera && location) map.current?.animateToRegion({ ...location, latitudeDelta: .015, longitudeDelta: .015 }, 0);
      }}
      accessibilityLabel="Mapa de canchas" onRegionChangeComplete={onCamera} onPress={event => {
        if (interactionEnabled && event.nativeEvent.action !== 'marker-press') onDismiss();
      }}>
      {courts.map(court => <CourtMarker key={court.id} court={court} selected={court.id === selectedId} onSelect={onSelect} focused={focused}
        onHost={host => { if (host) markerHosts.current.set(court.id, host); else markerHosts.current.delete(court.id); }} />)}
      {location && <Marker coordinate={location} title="Tu ubicación" pinColor={palette.legacyPrimary} />}
    </MapView>
  </View>;
}

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Keyboard, Platform, ScrollView, View } from 'react-native';
import Text from '@/components/AppText';
import { Button, Choice, ChoiceGroup, Field, Notice, StateView } from '@/components/foundation/Primitives';
import { usePresentationMotion } from '@/components/foundation/PresentationProvider';
import { motion, palette, spacing } from '@/constants/design';
import { filterCourts, type Coordinate, type Court } from '@/lib/courts/catalog';
import CourtCard from './CourtCard';
import CourtMap from './CourtMap';
import CourtPreview from './CourtPreview';
import { discoveryReducer, initialDiscovery } from './discovery-state';
import type { MapFocusHandle, MapRegion } from './types';
import { List, Map as MapIcon, LocateFixed, Search } from 'lucide-react-native';

type ReadState = { pending: boolean; error: boolean; retry(): void };
export type CourtDiscoveryProps = {
  courts: Court[]; catalog: ReadState; activity: ReadState & { playingCourtIds: string[]; checkedAt: string | null };
  location: Coordinate | null; locating: boolean; locationMessage: string | null; onLocate(): void;
  onOpen(id: string): void; focused: boolean; bottomInset: number;
  focusCourtId?: string; focusCourtRequest?: string; onFocusHandled?(): void;
};
export default function CourtDiscovery(props: CourtDiscoveryProps) {
  const { focusCourtId, focusCourtRequest, onFocusHandled } = props;
  const [state, dispatch] = useReducer(discoveryReducer, initialDiscovery);
  const setSheetExpanded = useCallback((expanded: boolean) => dispatch({ type: 'set-expanded', expanded }), []);
  const [sheetDragging, setSheetDragging] = useState(false);
  const [camera, setCamera] = useState<MapRegion | null>(null);
  const handledTarget = useRef<string | null>(null);
  const [cameraLocation, setCameraLocation] = useState<Coordinate | null>(null);
  const [viewportHeight, setViewportHeight] = useState(600);
  const [opacity] = useState(() => new Animated.Value(1));
  const { reduced, active } = usePresentationMotion();
  const results = filterCourts(props.courts, state.search);
  const selected = !props.catalog.error && !props.catalog.pending && state.mode === 'map'
    ? results.find(court => court.id === state.selectedId) : undefined;
  const control = useRef<View>(null);
  const lastSheetId = useRef<string | null>(null);
  const mapFocus = useRef<MapFocusHandle>(null);
  const list = useRef<ScrollView>(null);
  const listOffset = useRef(0);
  const ids = results.map(court => court.id).join('|');
  useEffect(() => { dispatch({ type: 'reconcile', ids: props.catalog.error || props.catalog.pending ? [] : ids.split('|') }); },
    [ids, props.catalog.error, props.catalog.pending]);
  useEffect(() => {
    if (!focusCourtId) { handledTarget.current = null; return; }
    const requestKey = `${focusCourtId}:${focusCourtRequest ?? ''}`;
    if (!props.focused || props.catalog.pending || props.catalog.error || handledTarget.current === requestKey) return;
    handledTarget.current = requestKey;
    const target = props.courts.find(court => court.id === focusCourtId);
    if (target) {
      Keyboard.dismiss();
      const region = { latitude: target.latitude, longitude: target.longitude, latitudeDelta: .015, longitudeDelta: .015 };
      dispatch({ type: 'focus', id: target.id, region, clearSearch: !filterCourts(props.courts, state.search).some(court => court.id === target.id) });
    }
    onFocusHandled?.();
  }, [focusCourtId, focusCourtRequest, props.focused, props.catalog.pending, props.catalog.error, props.courts, onFocusHandled, state.search]);
  useEffect(() => {
    const previous = lastSheetId.current;
    lastSheetId.current = selected?.id ?? null;
    if (previous && !selected && props.focused && Platform.OS !== 'web') {
      const frame = requestAnimationFrame(() => {
        if (!mapFocus.current?.focusMarker(previous) && control.current) AccessibilityInfo.sendAccessibilityEvent(control.current, 'focus');
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [selected, props.focused]);
  useEffect(() => {
    if (state.mode === 'list' && props.focused) list.current?.scrollTo({ y: listOffset.current, animated: false });
  }, [state.mode, props.focused]);
  useEffect(() => {
    opacity.stopAnimation(); opacity.setValue(1);
    if (reduced || !active || !props.focused) return;
    opacity.setValue(.75);
    const animation = Animated.timing(opacity, { toValue: 1, duration: motion.switch, useNativeDriver: Platform.OS !== 'web' });
    animation.start(); return () => animation.stop();
  }, [state.mode, opacity, reduced, active, props.focused]);
  const close = () => { Keyboard.dismiss(); dispatch({ type: 'close' }); };
  const changeMode = (mode: 'list' | 'map') => { Keyboard.dismiss(); dispatch({ type: 'mode', mode }); };
  const openCourt = (id: string) => { Keyboard.dismiss(); props.onOpen(id); };
  const mapVisible = state.mode === 'map' && Platform.OS !== 'web';
  return <View onLayout={event => setViewportHeight(event.nativeEvent.layout.height)} style={{ flex: 1, backgroundColor: palette.navy }}>
    <ScrollView keyboardShouldPersistTaps="handled" accessibilityElementsHidden={Boolean(selected)} importantForAccessibility={selected ? 'no-hide-descendants' : 'auto'}
      style={{ flexGrow: 0, maxHeight: '50%' }} contentContainerStyle={{ paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm }}>
      <Text variant="display" tone="dark" style={{ fontSize: 28, lineHeight: 32 }}>ENCONTRÁ TU CANCHA</Text>
      <Field compact hideLabel tone="light" leadingIcon={<Search size={22} color={palette.navy} />} label="Buscar canchas" placeholder="Buscar cancha" value={state.search}
        onChangeText={search => dispatch({ type: 'search', search })} returnKeyType="search" />
        <ChoiceGroup label="Vista de canchas" style={{ gap: spacing.sm }}>
          <Choice compact tone="light" icon={<List size={20} color={palette.navy} />} style={{ flexBasis: 0, minWidth: 0, backgroundColor: state.mode === 'list' ? palette.orange : palette.cream, borderColor: state.mode === 'list' ? palette.orange : palette.cream }}
            focusRef={state.mode === 'list' ? control : undefined} label="Listado" selected={state.mode === 'list'} onPress={() => changeMode('list')} />
          <Choice compact tone="light" icon={<MapIcon size={20} color={palette.navy} />} style={{ flexBasis: 0, minWidth: 0, backgroundColor: state.mode === 'map' ? palette.orange : palette.cream, borderColor: state.mode === 'map' ? palette.orange : palette.cream }}
            focusRef={state.mode === 'map' ? control : undefined} label="Mapa" selected={state.mode === 'map'} onPress={() => changeMode('map')} />
        </ChoiceGroup>
    </ScrollView>
    <Animated.View style={{ flex: 1, opacity }}>
      {props.catalog.pending ? <StateView title="Cargando canchas" message="Consultando el catálogo." loading />
        : props.catalog.error ? <StateView title="No pudimos cargar las canchas" message="Volvé a intentar." kind="error"
          action={<Button label="Reintentar" onPress={props.catalog.retry} />} />
        : <>
          {mapVisible && <CourtMap interactionEnabled={!sheetDragging} focusRef={mapFocus} courts={results} location={props.location} selectedId={selected?.id ?? null}
            focused={props.focused} camera={state.focusRegion ?? (props.location && cameraLocation !== props.location ? null : camera)}
            focusRegion={state.focusRegion} onFocusRegionApplied={() => {
              if (state.focusRegion) { setCamera(state.focusRegion); setCameraLocation(props.location); }
              dispatch({ type: 'focus-applied' });
            }}
            onCamera={region => { setCamera(region); setCameraLocation(props.location); }} onDismiss={close}
            onSelect={id => { Keyboard.dismiss(); dispatch({ type: 'select', id }); }} />}
          {!mapVisible && <ScrollView ref={list} testID="court-results" keyboardShouldPersistTaps="handled" scrollEventThrottle={100}
            onScroll={event => { if (!mapVisible) listOffset.current = event.nativeEvent.contentOffset.y; }}
            accessibilityElementsHidden={Boolean(selected)} importantForAccessibility={selected ? 'no-hide-descendants' : 'auto'}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm, paddingBottom: spacing.xl }}>
            {state.mode === 'map' && Platform.OS === 'web' && <CourtMap courts={results} location={null} selectedId={null}
              camera={null} onCamera={setCamera} onDismiss={close} onSelect={() => undefined} />}
            {Platform.OS !== 'web' && !mapVisible && <View style={{ alignItems: 'flex-end' }}><Button quiet label={props.locating ? 'Buscando ubicación' : 'Mi ubicación'}
              icon={<LocateFixed size={20} color={palette.text} />} busy={props.locating} onPress={props.onLocate} /></View>}
            {props.locationMessage && <Text variant="caption" tone="dark" accessibilityLiveRegion="polite" style={{ backgroundColor: palette.navy, padding: spacing.sm, borderRadius: 8 }}>{props.locationMessage}</Text>}
            <Text variant="label" tone="dark" accessibilityLiveRegion="polite">{results.length} {results.length === 1 ? 'cancha' : 'canchas'}</Text>
            {props.activity.pending && <Text variant="caption" accessibilityState={{ busy: true }} style={{ color: palette.muted }}>Consultando actividad…</Text>}
            {props.activity.error && <Notice>No pudimos comprobar la actividad. Los reportes anteriores pueden estar desactualizados.</Notice>}
            {props.activity.error && <Button secondary label="Reintentar actividad" onPress={props.activity.retry} />}
            {props.activity.checkedAt && <Text variant="caption" style={{ color: palette.muted }}>Actividad comprobada: {props.activity.checkedAt}</Text>}
            {!results.length && <StateView title={props.courts.length ? 'Sin coincidencias' : 'Sin canchas disponibles'}
              message={props.courts.length ? 'Probá con otro nombre.' : 'El catálogo todavía no tiene canchas.'} />}
            {!mapVisible && results.map(court => <CourtCard illustrated key={court.id} court={court}
              playing={props.activity.playingCourtIds.includes(court.id)} stale={props.activity.error} onPress={() => openCourt(court.id)} />)}
          </ScrollView>}
          {mapVisible && (props.locationMessage || props.activity.error || !results.length) && <ScrollView
            accessibilityElementsHidden={Boolean(selected)} importantForAccessibility={selected ? 'no-hide-descendants' : 'auto'}
            style={{ position: 'absolute', top: spacing.sm, left: spacing.md, right: 76, maxHeight: '45%' }}
            contentContainerStyle={{ gap: spacing.sm }}>
            {props.locationMessage && <Text variant="caption" tone="dark" accessibilityLiveRegion="polite" style={{ backgroundColor: palette.navy, padding: spacing.sm, borderRadius: 8 }}>{props.locationMessage}</Text>}
            {props.activity.error && <Notice>No pudimos comprobar la actividad. Los reportes anteriores pueden estar desactualizados.</Notice>}
            {props.activity.error && <Button secondary label="Reintentar actividad" onPress={props.activity.retry} />}
            {!results.length && <StateView title={props.courts.length ? 'Sin coincidencias' : 'Sin canchas disponibles'}
              message={props.courts.length ? 'Probá con otro nombre.' : 'El catálogo todavía no tiene canchas.'} />}
          </ScrollView>}
          {mapVisible && <View accessibilityElementsHidden={Boolean(selected)} importantForAccessibility={selected ? 'no-hide-descendants' : 'auto'}
            style={{ position: 'absolute', top: spacing.sm, right: spacing.md }}>
            <Button quiet iconOnly tone="light" label={props.locating ? 'Buscando ubicación' : 'Mi ubicación'}
              style={{ backgroundColor: palette.cream, borderRadius: 24 }} icon={<LocateFixed size={24} color={palette.navy} />}
              busy={props.locating} onPress={props.onLocate} />
          </View>}
        </>}
    </Animated.View>
    {selected && <CourtPreview key={selected.id} court={selected} expanded={state.expanded} focused={props.focused}
      onClose={close} onDragChange={setSheetDragging} onExpandedChange={setSheetExpanded} onOpen={() => openCourt(selected.id)} bottomInset={props.bottomInset} availableHeight={viewportHeight} />}
  </View>;
}

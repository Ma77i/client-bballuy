import { useEffect, useReducer, useRef, useState } from 'react';
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
      style={{ flexGrow: 0, maxHeight: '50%' }} contentContainerStyle={{ paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.xs }}>
      <Text variant="display" style={{ color: palette.orange, fontSize: 28, lineHeight: 32 }}>ENCONTRÁ CANCHA</Text>
      <Field compact label="Buscar canchas" placeholder="Nombre de la cancha" value={state.search}
        onChangeText={search => dispatch({ type: 'search', search })} returnKeyType="search" />
        <ChoiceGroup label="Vista de canchas">
          <Choice compact focusRef={state.mode === 'list' ? control : undefined} label="Listado" selected={state.mode === 'list'} onPress={() => changeMode('list')} />
          <Choice compact focusRef={state.mode === 'map' ? control : undefined} label="Mapa" selected={state.mode === 'map'} onPress={() => changeMode('map')} />
        </ChoiceGroup>
    </ScrollView>
    <Animated.View style={{ flex: 1, opacity }}>
      {props.catalog.pending ? <StateView title="Cargando canchas" message="Consultando el catálogo." loading />
        : props.catalog.error ? <StateView title="No pudimos cargar las canchas" message="Volvé a intentar." kind="error"
          action={<Button label="Reintentar" onPress={props.catalog.retry} />} />
        : <>
          {mapVisible && <CourtMap focusRef={mapFocus} courts={results} location={props.location} selectedId={selected?.id ?? null}
            focused={props.focused} camera={state.focusRegion ?? (props.location && cameraLocation !== props.location ? null : camera)}
            focusRegion={state.focusRegion} onFocusRegionApplied={() => {
              if (state.focusRegion) { setCamera(state.focusRegion); setCameraLocation(props.location); }
              dispatch({ type: 'focus-applied' });
            }}
            onCamera={region => { setCamera(region); setCameraLocation(props.location); }} onDismiss={close}
            onSelect={id => { Keyboard.dismiss(); dispatch({ type: 'select', id }); }} />}
          <ScrollView ref={list} testID="court-results" keyboardShouldPersistTaps="handled" scrollEventThrottle={100}
            onScroll={event => { if (!mapVisible) listOffset.current = event.nativeEvent.contentOffset.y; }}
            accessibilityElementsHidden={Boolean(selected)} importantForAccessibility={selected ? 'no-hide-descendants' : 'auto'}
            style={mapVisible ? { flexGrow: 0, maxHeight: '30%' } : { flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm, paddingBottom: spacing.xl }}>
            {state.mode === 'map' && Platform.OS === 'web' && <CourtMap courts={results} location={null} selectedId={null}
              camera={null} onCamera={setCamera} onDismiss={close} onSelect={() => undefined} />}
            {Platform.OS !== 'web' && <Button secondary label={props.locating ? 'Buscando ubicación' : 'Usar mi ubicación'}
              busy={props.locating} onPress={props.onLocate} />}
            {props.locationMessage && <Notice kind="info">{props.locationMessage}</Notice>}
            <Text variant="label" tone="dark" accessibilityLiveRegion="polite">{results.length} {results.length === 1 ? 'cancha' : 'canchas'}</Text>
            {props.activity.pending && <StateView title="Consultando actividad" message="Buscando partidos reportados." loading />}
            {props.activity.error && <Notice>No pudimos comprobar la actividad. Los reportes anteriores pueden estar desactualizados.</Notice>}
            {props.activity.error && <Button secondary label="Reintentar actividad" onPress={props.activity.retry} />}
            {props.activity.checkedAt && <Text variant="caption" style={{ color: palette.muted }}>Actividad comprobada: {props.activity.checkedAt}</Text>}
            {!results.length && <StateView title={props.courts.length ? 'Sin coincidencias' : 'Sin canchas disponibles'}
              message={props.courts.length ? 'Probá con otro nombre.' : 'El catálogo todavía no tiene canchas.'} />}
            {!mapVisible && results.map(court => <CourtCard key={court.id} court={court}
              playing={props.activity.playingCourtIds.includes(court.id)} stale={props.activity.error} onPress={() => openCourt(court.id)} />)}
          </ScrollView>
        </>}
    </Animated.View>
    {selected && <CourtPreview court={selected} expanded={state.expanded} focused={props.focused}
      onClose={close} onExpand={() => dispatch({ type: 'expand' })} onOpen={() => openCourt(selected.id)} bottomInset={props.bottomInset} availableHeight={viewportHeight} />}
  </View>;
}

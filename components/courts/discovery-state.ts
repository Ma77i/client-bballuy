// Presentation state only: never mutate the catalog or delay actions for motion.
export type DiscoveryState = { mode: 'list' | 'map'; search: string; selectedId: string | null; expanded: boolean;
  focusRegion?: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } | null };
export const initialDiscovery: DiscoveryState = { mode: 'list', search: '', selectedId: null, expanded: false };
export type DiscoveryAction =
  | { type: 'mode'; mode: DiscoveryState['mode'] }
  | { type: 'search'; search: string }
  | { type: 'select'; id: string }
  | { type: 'focus'; id: string; clearSearch: boolean; region?: DiscoveryState['focusRegion'] }
  | { type: 'focus-applied' }
  | { type: 'close' }
  | { type: 'expand' }
  | { type: 'reconcile'; ids: string[] };
export function discoveryReducer(state: DiscoveryState, action: DiscoveryAction): DiscoveryState {
  switch (action.type) {
    case 'mode': return action.mode === state.mode ? state : { ...state, mode: action.mode, selectedId: null, expanded: false };
    case 'search': return { ...state, search: action.search };
    case 'select': return state.mode === 'map' ? { ...state, selectedId: action.id, expanded: false } : state;
    case 'focus': return { ...state, mode: 'map', search: action.clearSearch ? '' : state.search, selectedId: action.id, expanded: false,
      ...(action.region ? { focusRegion: action.region } : {}) };
    case 'focus-applied': return { ...state, focusRegion: null };
    case 'close': return { ...state, selectedId: null, expanded: false };
    case 'expand': return state.selectedId ? { ...state, expanded: !state.expanded } : state;
    case 'reconcile': return state.selectedId && !action.ids.includes(state.selectedId)
      ? { ...state, selectedId: null, expanded: false } : state;
  }
}
export function sheetGesture(dy: number, dx: number): 'close' | 'expand' | null {
  if (Math.abs(dx) > Math.abs(dy)) return null;
  return dy > 70 ? 'close' : dy < -40 ? 'expand' : null;
}

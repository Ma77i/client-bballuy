import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AccessibilityInfo, AppState } from 'react-native';
import { observeMotionPreference } from './motion-policy';
const MotionContext = createContext({ reduced: true, active: false, interactionEpoch: 0 });

// One platform subscription per app, not one listener per list item.
export function PresentationProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(true);
  const [active, setActive] = useState(AppState.currentState === 'active');
  const [interactionEpoch, setInteractionEpoch] = useState(0);
  useEffect(() => observeMotionPreference(() => AccessibilityInfo.isReduceMotionEnabled(), listener => {
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', listener);
    return () => subscription?.remove();
  }, setReduced), []);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      setActive(state === 'active');
      setInteractionEpoch(epoch => epoch + 1);
    });
    return () => subscription.remove();
  }, []);
  const value = useMemo(() => ({ reduced, active, interactionEpoch }), [reduced, active, interactionEpoch]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}
export function usePresentationMotion() { return useContext(MotionContext); }
export function useReducedMotion() { return usePresentationMotion().reduced; }

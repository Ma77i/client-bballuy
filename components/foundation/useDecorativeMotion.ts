import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform } from 'react-native';
import { pressPresentation } from './motion-policy';
import { usePresentationMotion } from './PresentationProvider';
import { motion } from '@/constants/design';

export function usePressMotion(blocked: boolean) {
  const { reduced, active, interactionEpoch } = usePresentationMotion();
  const [gesture, setGesture] = useState({ pressed: false, epoch: interactionEpoch });
  const pressed = gesture.pressed && gesture.epoch === interactionEpoch && active && !blocked;
  const [scale] = useState(() => new Animated.Value(1));
  useEffect(() => {
    const target = pressPresentation(pressed, blocked, reduced, active);
    scale.stopAnimation();
    if (!target.duration) { scale.setValue(target.scale); return; }
    const animation = Animated.timing(scale, { toValue: target.scale, duration: target.duration,
      easing: Easing.out(Easing.quad), useNativeDriver: Platform.OS !== 'web' });
    animation.start();
    return () => animation.stop();
  }, [pressed, blocked, reduced, active, scale]);
  return { style: { transform: [{ scale }] }, pressed,
    onPressIn: () => setGesture({ pressed: true, epoch: interactionEpoch }),
    onPressOut: () => setGesture({ pressed: false, epoch: interactionEpoch }),
    onBlur: () => setGesture({ pressed: false, epoch: interactionEpoch }) };
}

// Observe a caller-owned signal; never expose a completion callback or mutate it.
export function useDecorativeFeedback(signal: string | number | boolean | null, enabled = true,
  preset: 'confirmed' | 'selection' = 'confirmed') {
  const { reduced, active } = usePresentationMotion();
  const [opacity] = useState(() => new Animated.Value(1));
  const previous = useRef(signal);
  useEffect(() => {
    const changed = previous.current !== signal;
    previous.current = signal;
    opacity.stopAnimation(); opacity.setValue(1);
    if (!changed || !enabled || reduced || !active) return;
    opacity.setValue(0.75);
    const animation = Animated.timing(opacity, { toValue: 1, duration: motion[preset], useNativeDriver: Platform.OS !== 'web' });
    animation.start();
    return () => animation.stop();
  }, [signal, enabled, reduced, active, opacity, preset]);
  return { opacity };
}

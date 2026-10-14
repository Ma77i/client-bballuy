import { Animated, Pressable, type PressableProps } from 'react-native';
import { useState } from 'react';
import { usePressMotion } from '@/components/foundation/useDecorativeMotion';
import { palette } from '@/constants/design';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export default function MotionLink({ children, ...props }: Omit<PressableProps, 'style' | 'children'> & { children: React.ReactNode }) {
  const motion = usePressMotion(Boolean(props.disabled));
  const [focused, setFocused] = useState(false);
  return <AnimatedPressable {...props} onPressIn={motion.onPressIn} onPressOut={motion.onPressOut}
    onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); motion.onBlur(); }}
    style={[{ minHeight: 48 }, focused && { outlineWidth: 3, outlineOffset: 3, outlineColor: palette.orange }, motion.style]}>{children}</AnimatedPressable>;
}

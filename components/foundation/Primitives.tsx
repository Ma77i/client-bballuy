import { createContext, useContext, useId, useState, type ReactNode, type Ref } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, TextInput, View,
  type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { Check } from 'lucide-react-native';
import Text from '@/components/AppText';
import { fonts, palette, spacing, surfaces, type SurfaceTone } from '@/constants/design';
import { isLoaded } from 'expo-font';
import { presentationFont } from './font-policy';
import { foundationStyles as styles } from './styles';
import { usePressMotion } from './useDecorativeMotion';
import { usePresentationMotion } from './PresentationProvider';

const SurfaceContext = createContext<SurfaceTone>('dark');
export function useSurfaceTone() { return useContext(SurfaceContext); }
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({ label, onPress, disabled = false, busy = false, secondary = false,
  danger = false, icon, tone: explicitTone, testID, style, expanded, quiet = false, iconOnly = false }: {
  label: string; onPress(): void; disabled?: boolean; busy?: boolean; secondary?: boolean;
  danger?: boolean; icon?: ReactNode; tone?: SurfaceTone; testID?: string; style?: StyleProp<ViewStyle>; expanded?: boolean;
  quiet?: boolean; iconOnly?: boolean;
}) {
  const inheritedTone = useSurfaceTone();
  const colors = surfaces[explicitTone ?? inheritedTone];
  const blocked = disabled || busy;
  const motion = usePressMotion(blocked);
  const [focused, setFocused] = useState(false);
  const foreground = danger ? colors.error : secondary || quiet ? colors.text : palette.navy;
  return <AnimatedPressable accessibilityRole="button" accessibilityLabel={label}
    accessibilityState={{ disabled: blocked, busy, expanded }} aria-disabled={blocked} aria-busy={busy} aria-expanded={expanded}
    disabled={blocked} testID={testID}
    onPress={() => { if (!blocked) onPress(); }} onPressIn={motion.onPressIn} onPressOut={motion.onPressOut}
    onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); motion.onBlur(); }}
    style={[styles.button, secondary && { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.boundary },
      danger && { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.error },
      quiet && { backgroundColor: 'transparent', borderColor: 'transparent', padding: spacing.sm, gap: spacing.xs },
      blocked && { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.boundary },
      motion.pressed && !blocked && { opacity: 0.85 },
      style, focused && { outlineColor: colors.focus, outlineWidth: 3, outlineOffset: 3, outlineStyle: 'solid' }, motion.style]}>
    <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {busy ? <ProgressIndicator color={blocked ? colors.muted : foreground} /> : icon}
    </View>
    {!iconOnly && <Text variant="label" style={[styles.buttonLabel, { color: blocked ? colors.muted : foreground }]}>{label}</Text>}
  </AnimatedPressable>;
}

export function Choice({ label, detail, selected, disabled = false, onPress, tone: explicitTone, testID, emphasis = 'label', focusRef, compact = false, style }: {
  label: string; detail?: string; selected: boolean; disabled?: boolean; onPress(): void;
  tone?: SurfaceTone; testID?: string; emphasis?: 'label' | 'format'; focusRef?: Ref<View>; compact?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const inheritedTone = useSurfaceTone();
  const colors = surfaces[explicitTone ?? inheritedTone];
  const [focused, setFocused] = useState(false);
  return <Pressable ref={focusRef} accessibilityRole="radio" accessibilityLabel={label} accessibilityHint={detail}
    accessibilityState={{ checked: selected, disabled }} aria-checked={selected} aria-disabled={disabled}
    disabled={disabled} testID={testID}
    onPress={() => { if (!disabled) onPress(); }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [styles.choice, compact && { minHeight: 48, paddingVertical: spacing.sm }, { backgroundColor: colors.panel, borderColor: selected ? colors.focus : colors.boundary },
      pressed && !disabled && { opacity: 0.85 }, style, focused && { outlineWidth: 3, outlineOffset: 3, outlineStyle: 'solid', outlineColor: colors.focus }]}>
    <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }}>
      <Text variant={emphasis === 'format' ? 'display' : 'label'} style={{ color: disabled ? colors.muted : colors.text, flexShrink: 1 }}>{label}</Text>
      {selected && <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Check size={20} color={colors.focus} />
      </View>}
    </View>
    {detail && <Text variant="caption" style={{ color: colors.muted }}>{detail}</Text>}
  </Pressable>;
}

export function ChoiceGroup({ label, children, style }: {
  label: string; children: ReactNode; style?: StyleProp<ViewStyle>;
}) {
  return <View accessibilityRole="radiogroup" accessibilityLabel={label} style={[styles.row, style]}>
    {children}
  </View>;
}

export function Field({ label, help, error, tone: explicitTone, style, onFocus, onBlur, compact = false, ...props }:
  TextInputProps & { label: string; help?: string; error?: string; tone?: SurfaceTone; compact?: boolean }) {
  const inheritedTone = useSurfaceTone();
  const colors = surfaces[explicitTone ?? inheritedTone];
  const [focused, setFocused] = useState(false);
  const labelId = useId();
  const descriptionId = `${labelId}-description`;
  return <View style={{ gap: compact ? spacing.xs : spacing.sm }}>
    <Text nativeID={labelId} variant={compact ? 'caption' : 'label'} style={{ color: colors.text }}>{label}</Text>
    <TextInput {...props} accessibilityLabel={label} accessibilityLabelledBy={labelId} aria-invalid={Boolean(error)}
      aria-describedby={error || help ? descriptionId : undefined}
      accessibilityHint={error ?? help} accessibilityState={{ disabled: props.editable === false }}
      placeholderTextColor={colors.muted} onFocus={event => { setFocused(true); onFocus?.(event); }}
      onBlur={event => { setFocused(false); onBlur?.(event); }}
      style={[styles.input, { color: colors.text, backgroundColor: colors.background,
        borderColor: error ? colors.error : focused ? colors.focus : colors.boundary },
        compact && { paddingVertical: spacing.sm }, props.multiline && { minHeight: 96, textAlignVertical: 'top' }, style,
        { fontFamily: presentationFont(StyleSheet.flatten(style)?.fontFamily ?? fonts.body, isLoaded) }]} />
    {error ? <Text nativeID={descriptionId} variant="caption" accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text>
      : help ? <Text nativeID={descriptionId} variant="caption" style={{ color: colors.muted }}>{help}</Text> : null}
  </View>;
}

export function Panel({ children, style, tone = 'dark' }: {
  children: ReactNode; style?: StyleProp<ViewStyle>; tone?: SurfaceTone;
}) {
  const colors = surfaces[tone];
  return <SurfaceContext.Provider value={tone}>
    <View style={[styles.panel, { backgroundColor: colors.panel, borderColor: colors.boundary }, style]}>{children}</View>
  </SurfaceContext.Provider>;
}

export function Notice({ children, kind = 'error' }: {
  children: ReactNode; kind?: 'error' | 'success' | 'warning' | 'info';
}) {
  const colors = surfaces[useSurfaceTone()];
  const color = kind === 'info' ? colors.text : colors[kind];
  return <View style={[styles.notice, { backgroundColor: colors.panel, borderColor: color }]}>
    <Text variant="body" accessibilityRole={kind === 'error' ? 'alert' : undefined}
      accessibilityLiveRegion={kind === 'error' ? 'assertive' : 'polite'} style={{ color: colors.text }}>{children}</Text>
  </View>;
}

function ProgressIndicator({ color }: { color: string }) {
  const { reduced, active } = usePresentationMotion();
  return reduced || !active ? <View style={{ width: 18, height: 18, borderWidth: 2, borderRadius: 9, borderColor: color }} />
    : <ActivityIndicator color={color} />;
}

export function StateView({ title, message, kind = 'info', loading = false, action }: {
  title: string; message?: string; kind?: 'info' | 'error' | 'success'; loading?: boolean; action?: ReactNode;
}) {
  const colors = surfaces[useSurfaceTone()];
  return <View style={{ gap: spacing.md }} accessibilityState={{ busy: loading }} aria-busy={loading}>
    <Text variant="section" accessibilityRole={kind === 'error' ? 'alert' : 'header'}
      accessibilityLiveRegion={kind === 'info' ? undefined : 'polite'} style={{ color: colors.text }}>{title}</Text>
    {loading && <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <ProgressIndicator color={colors.text} />
    </View>}
    {message && <Text variant="body" style={{ color: colors.muted }}>{message}</Text>}
    {action}
  </View>;
}

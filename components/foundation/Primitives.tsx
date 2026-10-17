import { cloneElement, createContext, isValidElement, useContext, useId, useRef, useState, type ReactNode, type Ref } from 'react';
import { ActivityIndicator, Animated, Platform, Pressable, StyleSheet, TextInput, View,
  type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react-native';
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
  danger = false, icon, tone: explicitTone, testID, style, expanded, quiet = false, iconOnly = false, accessibilityHint, foregroundColor }: {
  label: string; onPress(): void; disabled?: boolean; busy?: boolean; secondary?: boolean;
  danger?: boolean; icon?: ReactNode; tone?: SurfaceTone; testID?: string; style?: StyleProp<ViewStyle>; expanded?: boolean;
  quiet?: boolean; iconOnly?: boolean; accessibilityHint?: string; foregroundColor?: string;
}) {
  const inheritedTone = useSurfaceTone();
  const colors = surfaces[explicitTone ?? inheritedTone];
  const blocked = disabled || busy;
  const motion = usePressMotion(blocked);
  const [focused, setFocused] = useState(false);
  const brightBrand = StyleSheet.flatten(style)?.backgroundColor === palette.orange;
  const foreground = foregroundColor ?? (danger ? colors.error : secondary || quiet ? colors.text : brightBrand ? palette.navy : palette.white);
  const contentColor = blocked && !brightBrand ? colors.muted : foreground;
  const backOnly = /^(Volver(?:\s|$)|Back$)/i.test(label);
  const renderedIcon = backOnly ? <ArrowLeft size={24} color={foreground} aria-hidden />
    : isValidElement<{ color?: string }>(icon) ? cloneElement(icon, { color: foreground }) : icon;
  return <AnimatedPressable accessibilityRole="button" accessibilityLabel={label} accessibilityHint={accessibilityHint}
    accessibilityState={{ disabled: blocked, busy, expanded }} aria-disabled={blocked} aria-busy={busy} aria-expanded={expanded}
    disabled={blocked} testID={testID}
    onPress={() => { if (!blocked) onPress(); }} onPressIn={motion.onPressIn} onPressOut={motion.onPressOut}
    onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); motion.onBlur(); }}
    style={[styles.button, secondary && { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.boundary },
      danger && { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.error },
      quiet && { backgroundColor: 'transparent', borderColor: 'transparent', padding: spacing.sm, gap: spacing.xs },
      backOnly && { alignSelf: 'flex-start', paddingHorizontal: spacing.sm },
      blocked && { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.boundary },
      motion.pressed && !blocked && { opacity: 0.85 },
      style, focused && { outlineColor: colors.focus, outlineWidth: 3, outlineOffset: 3, outlineStyle: 'solid' }, motion.style]}>
    <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {busy ? <ProgressIndicator color={contentColor} /> : renderedIcon}
    </View>
    {!iconOnly && !backOnly && <Text variant="label" style={[styles.buttonLabel, { color: contentColor }]}>{label}</Text>}
  </AnimatedPressable>;
}

export function Choice({ label, detail, selected, disabled = false, onPress, tone: explicitTone, testID, emphasis = 'label', focusRef, compact = false, style, icon }: {
  label: string; detail?: string; selected: boolean; disabled?: boolean; onPress(): void;
  tone?: SurfaceTone; testID?: string; emphasis?: 'label' | 'format'; focusRef?: Ref<View>; compact?: boolean;
  style?: StyleProp<ViewStyle>; icon?: ReactNode;
}) {
  const inheritedTone = useSurfaceTone();
  const colors = surfaces[explicitTone ?? inheritedTone];
  const [focused, setFocused] = useState(false);
  const orangeFill = StyleSheet.flatten(style)?.backgroundColor === palette.orange;
  const choiceText = orangeFill ? palette.white : disabled ? colors.muted : colors.text;
  return <Pressable ref={focusRef} accessibilityRole="radio" accessibilityLabel={label} accessibilityHint={detail}
    accessibilityState={{ checked: selected, disabled }} aria-checked={selected} aria-disabled={disabled}
    disabled={disabled} testID={testID}
    onPress={() => { if (!disabled) onPress(); }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [styles.choice, compact && { minHeight: 48, paddingVertical: spacing.sm }, { backgroundColor: colors.panel, borderColor: selected ? colors.focus : colors.boundary },
      pressed && !disabled && { opacity: 0.85 }, style, orangeFill && { backgroundColor: palette.orangeAction, borderColor: palette.orangeAction }, focused && { outlineWidth: 3, outlineOffset: 3, outlineStyle: 'solid', outlineColor: colors.focus }]}>
    <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }}>
      {icon && <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{isValidElement<{ color?: string }>(icon) ? cloneElement(icon, { color: choiceText }) : icon}</View>}
      <Text variant={emphasis === 'format' ? 'display' : 'label'} style={{ color: choiceText, flexShrink: 1 }}>{label}</Text>
      {selected && <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Check size={20} color={orangeFill ? palette.white : colors.focus} />
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

export function Field({ label, help, error, tone: explicitTone, style, onFocus, onBlur, compact = false, leadingIcon, hideLabel = false, passwordVisibility, ...props }:
  TextInputProps & { label: string; help?: string; error?: string; tone?: SurfaceTone; compact?: boolean; leadingIcon?: ReactNode; hideLabel?: boolean;
    passwordVisibility?: { visible: boolean; onToggle(): void; label?: string } }) {
  const inheritedTone = useSurfaceTone();
  const colors = surfaces[explicitTone ?? inheritedTone];
  const [focused, setFocused] = useState(false);
  const labelId = useId();
  const descriptionId = `${labelId}-description`;
  const inputRef = useRef<TextInput>(null);
  const [actionFocused, setActionFocused] = useState(false);
  const input = <TextInput {...props} ref={inputRef} accessibilityLabel={label} accessibilityLabelledBy={hideLabel ? undefined : labelId} aria-invalid={Boolean(error)}
      aria-describedby={error || help ? descriptionId : undefined}
      accessibilityHint={error ?? help} accessibilityState={{ disabled: props.editable === false }}
      placeholderTextColor={colors.muted} onFocus={event => { setFocused(true); onFocus?.(event); }}
      onBlur={event => { setFocused(false); onBlur?.(event); }}
      style={[styles.input, { color: colors.text, backgroundColor: colors.background,
        borderColor: error ? colors.error : focused ? colors.focus : colors.boundary },
        compact && { paddingVertical: spacing.sm }, props.multiline && { minHeight: 96, textAlignVertical: 'top' }, style,
        Boolean(leadingIcon) && { paddingLeft: 44 },
        Boolean(passwordVisibility) && { paddingRight: 56 },
        { fontFamily: presentationFont(StyleSheet.flatten(style)?.fontFamily ?? fonts.body, isLoaded) }]} />;
  return <View style={{ gap: compact ? spacing.xs : spacing.sm }}>
    {!hideLabel && <Text nativeID={labelId} variant={compact ? 'caption' : 'label'} style={{ color: colors.text }}>{label}</Text>}
    {leadingIcon || passwordVisibility ? <View>{input}{leadingIcon && <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
      style={{ position: 'absolute', left: 12, top: 0, bottom: 0, justifyContent: 'center' }}>{leadingIcon}</View>}
      {passwordVisibility && <Pressable accessibilityRole="button" accessibilityLabel={`${passwordVisibility.visible ? 'Ocultar' : 'Mostrar'} ${passwordVisibility.label ?? label.toLocaleLowerCase('es')}`}
        accessibilityHint={passwordVisibility.visible ? 'La contraseña está visible.' : 'La contraseña está oculta.'}
        onPointerDown={event => { if (Platform.OS === 'web') event.preventDefault(); }}
        onPress={() => { const restore = inputRef.current?.isFocused(); passwordVisibility.onToggle(); if (restore) requestAnimationFrame(() => inputRef.current?.focus()); }}
        onFocus={() => setActionFocused(true)} onBlur={() => setActionFocused(false)}
        style={{ position: 'absolute', right: 2, top: 0, bottom: 0, minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center',
          borderRadius: 10, ...(actionFocused ? { outlineColor: colors.focus, outlineWidth: 3, outlineStyle: 'solid' as const } : {}) }}>
        {passwordVisibility.visible ? <EyeOff size={22} color={colors.text} aria-hidden /> : <Eye size={22} color={colors.text} aria-hidden />}
      </Pressable>}
    </View> : input}
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

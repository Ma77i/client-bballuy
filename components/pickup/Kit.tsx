import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import Text from '@/components/AppText';
import Colors from '@/constants/colors';

export const gameColors = { ink: '#0c1220', panel: '#171f30', muted: '#a9b4c7', orange: '#ff8a43', border: '#2b354a' };
export function GameButton({ label, onPress, disabled = false, busy = false, secondary = false, danger = false, icon }: {
  label: string; onPress(): void; disabled?: boolean; busy?: boolean; secondary?: boolean; danger?: boolean; icon?: ReactNode;
}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: disabled || busy, busy }}
    disabled={disabled || busy} onPress={onPress}
    style={({ pressed }) => [kit.button, secondary && kit.secondary, danger && kit.danger, (disabled || busy) && { opacity: 0.45 }, pressed && { opacity: 0.8 }]}>
    {busy ? <ActivityIndicator color={secondary ? Colors.text : gameColors.ink} /> : icon}
    <Text style={[kit.buttonLabel, (secondary || danger) && { color: Colors.text }]}>{label}</Text>
  </Pressable>;
}
export function GameChoice({ label, detail, selected, disabled = false, onPress }: {
  label: string; detail?: string; selected: boolean; disabled?: boolean; onPress(): void;
}) {
  return <Pressable accessibilityRole="radio" accessibilityState={{ checked: selected, disabled }} disabled={disabled} onPress={onPress}
    style={[kit.choice, selected && kit.selected, disabled && { opacity: 0.5 }]}>
    <Text style={[kit.choiceLabel, selected && { color: gameColors.orange }]}>{label}</Text>
    {detail && <Text style={kit.help}>{detail}</Text>}
  </Pressable>;
}
export function GameField({ label, help, error, ...props }: TextInputProps & { label: string; help?: string; error?: string }) {
  return <View style={{ gap: 8 }}>
    <Text style={kit.fieldLabel}>{label}</Text>
    <TextInput {...props} accessibilityLabel={label} placeholderTextColor={Colors.textMuted}
      style={[kit.input, props.multiline && { minHeight: 96, textAlignVertical: 'top' }, error && { borderColor: Colors.error }, props.style]} />
    {error ? <Text accessibilityRole="alert" style={kit.error}>{error}</Text> : help ? <Text style={kit.help}>{help}</Text> : null}
  </View>;
}
export function GamePanel({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[kit.panel, style]}>{children}</View>;
}
export function GameNotice({ children }: { children: ReactNode }) {
  return <View style={kit.notice}><Text accessibilityRole="alert" style={{ color: Colors.text, lineHeight: 22 }}>{children}</Text></View>;
}
export const kit = StyleSheet.create({
  page: { flex: 1, backgroundColor: gameColors.ink },
  content: { padding: 22, paddingBottom: 40, gap: 22, maxWidth: 680, width: '100%', alignSelf: 'center' },
  kicker: { color: gameColors.orange, fontFamily: 'Lexend-SemiBold', letterSpacing: 2, fontSize: 11 },
  title: { color: Colors.text, fontFamily: 'Lexend-Bold', fontSize: 32, lineHeight: 40 },
  section: { color: Colors.text, fontFamily: 'Lexend-SemiBold', fontSize: 18 },
  body: { color: gameColors.muted, fontSize: 14, lineHeight: 23 },
  panel: { backgroundColor: gameColors.panel, borderWidth: 1, borderColor: gameColors.border, borderRadius: 20, padding: 20, gap: 16 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  button: { minHeight: 54, borderRadius: 14, paddingHorizontal: 18, paddingVertical: 14, backgroundColor: gameColors.orange,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  secondary: { backgroundColor: gameColors.panel, borderWidth: 1, borderColor: gameColors.border },
  danger: { backgroundColor: '#532831', borderWidth: 1, borderColor: '#894452' },
  buttonLabel: { color: gameColors.ink, fontFamily: 'Lexend-SemiBold', fontSize: 15 },
  choice: { flex: 1, minHeight: 66, padding: 14, borderWidth: 1, borderColor: gameColors.border, borderRadius: 14, justifyContent: 'center', gap: 4 },
  selected: { borderColor: gameColors.orange, backgroundColor: '#30251f' },
  choiceLabel: { color: Colors.text, fontFamily: 'Lexend-SemiBold', fontSize: 16 },
  fieldLabel: { color: Colors.text, fontFamily: 'Lexend-Medium', fontSize: 13 },
  input: { backgroundColor: gameColors.ink, color: Colors.text, fontFamily: 'Lexend-Regular', fontSize: 16,
    borderWidth: 1, borderColor: gameColors.border, borderRadius: 12, minHeight: 52, padding: 14 },
  help: { color: gameColors.muted, fontSize: 12, lineHeight: 19 },
  error: { color: '#ffadb5', fontSize: 13, lineHeight: 20 },
  notice: { backgroundColor: '#3e2530', borderWidth: 1, borderColor: '#824356', borderRadius: 14, padding: 16 },
  badge: { color: gameColors.orange, fontFamily: 'Lexend-SemiBold', fontSize: 12 },
});

import { Text as NativeText, type TextProps } from 'react-native';

// Preserve the app font through public props instead of patching Text internals.
export default function AppText({ style, ...props }: TextProps) {
  return <NativeText {...props} style={[{ fontFamily: 'Lexend-Regular' }, style]} />;
}

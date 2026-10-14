import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '@/components/AppText';
import { GenericMedia } from '@/components/foundation/GenericMedia';
import { foundationStyles } from '@/components/foundation/styles';
import { palette } from '@/constants/design';

export default function EntryFrame({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <SafeAreaView style={foundationStyles.page} edges={['top', 'left', 'right', 'bottom']}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={foundationStyles.content}>
        <Text variant="display" style={{ color: palette.orange }}>bballuy</Text>
        <GenericMedia compact asset="player" size={48} />
        <Text variant="display" tone="dark" accessibilityRole="header">{title}</Text>
        {description && <Text variant="body" tone="dark">{description}</Text>}
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}

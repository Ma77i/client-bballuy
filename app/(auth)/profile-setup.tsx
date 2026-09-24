import Text from '@/components/AppText';
import { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/backend/supabase';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { validateDisplayName } from '@/lib/utils/validation';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { session, user, refreshUser } = useAuth();
  const [editedName, setDisplayName] = useState<string | null>(null);
  const displayName = editedName ?? user?.display_name ?? '';
  const [saving, setSaving] = useState(false);
  const userId = session?.user.id;
  const submitting = useRef(false);
  const [formError, setFormError] = useState<string | null>(null);

  const onSave = async () => {
    if (!userId || submitting.current) return;
    setFormError(null);
    const name = displayName.trim();
    const validation = validateDisplayName(name);
    if (!validation.valid) {
      setFormError(validation.error ?? 'Enter a valid name');
      return;
    }
    submitting.current = true;
    setSaving(true);
    try {
      const { error } = await supabase.from('users_public')
        .update({ display_name: name }).eq('id', userId).select('id').single();
      if (error) throw error;
      await refreshUser();
      router.replace('/(tabs)/map');
    } catch {
      setFormError('Unable to confirm your profile. Check your connection and press Continue to retry.');
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  };
  return <View style={styles.container}>
    <Text style={styles.title}>Create your profile</Text>
    {formError && <Text accessibilityRole="alert" style={{ color: Colors.error }}>{formError}</Text>}
    <Text style={{ color: Colors.textSecondary }}>Choose a display name to join court communities.</Text>
    <View style={{ gap: 8 }}>
      <Text style={{ color: Colors.text }}>Display name *</Text>
      <TextInput accessibilityLabel="Display name" style={styles.input} placeholder="e.g. Matti"
        placeholderTextColor={Colors.textMuted} value={displayName} onChangeText={setDisplayName}
        editable={!saving} autoCapitalize="words" />
    </View>
    <TouchableOpacity accessibilityRole="button" style={[styles.saveBtn, saving && { opacity: 0.6 }]}
      onPress={() => void onSave()} disabled={saving}>
      <Text style={{ color: Colors.white, fontWeight: '700' }}>{saving ? 'Saving...' : 'Continue'}</Text>
    </TouchableOpacity>
  </View>;
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 24, gap: 20 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text },
  input: { backgroundColor: Colors.surface, borderRadius: 12, padding: 14, color: Colors.text,
    borderWidth: 1, borderColor: Colors.border },
  saveBtn: { marginTop: 'auto', backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center' },
});

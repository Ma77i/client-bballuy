import EntryFrame from '@/components/entry/EntryFrame';
import { Button, Field, Notice } from '@/components/foundation/Primitives';
import { errorText } from '@/components/pickup/error-copy';
import { useRef, useState } from 'react';

import { useRouter } from 'expo-router';
import { supabase } from '@/lib/backend/supabase';

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
  return <EntryFrame title="TU NOMBRE EN LA CANCHA" description="Elegí un nombre visible para tu cuenta.">
    {formError && <Notice>{errorText(formError)}</Notice>}
    <Field label="Nombre visible" placeholder="Tu nombre" value={displayName} onChangeText={setDisplayName} editable={!saving} autoCapitalize="words" />
    <Button label="Continuar" busy={saving} onPress={() => void onSave()} />
  </EntryFrame>;
}

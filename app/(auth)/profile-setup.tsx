import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/backend/supabase';
import Colors from '@/constants/colors';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        Alert.alert('Error', 'No authenticated user found.');
        router.replace('/(auth)/signin');
        return;
      }
      setUserId(user.id);
    })();
  }, []);

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) {
      setLocalUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your camera.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) {
      setLocalUri(result.assets[0].uri);
    }
  };

  const uploadAvatarIfNeeded = async (): Promise<string | null> => {
    if (!localUri || !userId) return null;
    setUploading(true);
    try {
      const resp = await fetch(localUri);
      const blob = await resp.blob();
      const path = `${userId}/${Date.now()}.jpg`;

      const { error: upErr } = await supabase
        .storage
        .from('avatars')
        .upload(path, blob, { contentType: 'image/jpeg', upsert: true });

      if (upErr) throw upErr;
      return path; // guardamos el path en DB
    } finally {
      setUploading(false);
    }
  };

  const onSave = async () => {
    if (!userId) return;
    const name = displayName.trim();
    if (name.length < 2) {
      Alert.alert('Validation', 'Display name must be at least 2 characters.');
      return;
    }

    setSaving(true);
    try {
      const avatarPath = await uploadAvatarIfNeeded();

      const { error: updErr } = await supabase
        .from('users_public')
        .update({
          display_name: name,
          ...(avatarPath ? { avatar_url: avatarPath } : {}),
        })
        .eq('id', userId);

      if (updErr) throw updErr;

      // listo, siguiente paso del onboarding
      router.replace('/(auth)/age-gate');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your profile</Text>
      <Text style={styles.subtitle}>Choose a display name and (optionally) add an avatar.</Text>

      <View style={styles.avatarBox}>
        <Image
          source={
            localUri
              ? { uri: localUri }
              : require('@/assets/avatar-placeholder.png')
          }
          style={styles.avatar}
        />
        <View style={styles.row}>
          <TouchableOpacity style={styles.btn} onPress={pickFromGallery} disabled={uploading || saving}>
            <Text style={styles.btnText}>Upload from gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline} onPress={takePhoto} disabled={uploading || saving}>
            <Text style={styles.btnOutlineText}>Take a photo</Text>
          </TouchableOpacity>
        </View>
        {uploading && <ActivityIndicator style={{ marginTop: 8 }} color={Colors.primary} />}
      </View>

      <View style={{ gap: 8, width: '100%' }}>
        <Text style={styles.label}>Display name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Matti"
          placeholderTextColor={Colors.textMuted}
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
        />
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, (saving || uploading) && { opacity: 0.6 }]}
        onPress={onSave}
        disabled={saving || uploading}
      >
        <Text style={styles.saveText}>{saving ? 'Saving...' : 'Continue'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 24, gap: 20 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 15, color: Colors.textSecondary },
  avatarBox: { alignItems: 'center', gap: 12, marginTop: 8 },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  row: { flexDirection: 'row', gap: 10, marginTop: 6 },
  btn: { backgroundColor: Colors.primary, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12 },
  btnText: { color: Colors.white, fontWeight: '700' },
  btnOutline: { borderColor: Colors.border, borderWidth: 1, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12 },
  btnOutlineText: { color: Colors.text, fontWeight: '700' },
  label: { color: Colors.text, fontWeight: '600' },
  input: { backgroundColor: Colors.surface, borderRadius: 12, padding: 14, color: Colors.text, borderWidth: 1, borderColor: Colors.border },
  saveBtn: { marginTop: 'auto', backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  saveText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});

import Text from '@/components/AppText';
import { useEffect } from 'react';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { authDestination } from '@/lib/auth/controller';
import Colors from '@/constants/colors';

export default function AuthGate() {
  const auth = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const navigation = useRootNavigationState();
  const section = String(segments[0] ?? '');
  const screen = String(segments[segments.length - 1] ?? '');
  const destination = authDestination(auth);

  useEffect(() => {
    if (!navigation?.key || !destination) return;
    const entry = !section || section === 'index' || section === 'splash';
    const isAuth = section === '(auth)';
    if (!auth.session) {
      if (!isAuth && !entry) router.replace('/(auth)/signin');
      else if (isAuth && screen === 'profile-setup') router.replace('/(auth)/signin');
    } else if (destination === '/(auth)/profile-setup') {
      if (!isAuth || screen !== 'profile-setup') router.replace(destination);
    } else if (isAuth || entry) {
      router.replace(destination);
    }
  }, [auth.session, destination, navigation?.key, router, screen, section]);

  if (!auth.isLoading && !auth.error) return null;
  return <View style={styles.overlay}>
    {auth.isLoading ? <ActivityIndicator color={Colors.primary} /> : <>
      <Text style={styles.message}>{auth.error}</Text>
      <TouchableOpacity onPress={() => void auth.retry()} style={styles.button}>
        <Text style={styles.label}>Retry</Text>
      </TouchableOpacity>
      {auth.session && <TouchableOpacity onPress={async () => {
        const { error } = await auth.signOut();
        if (error) Alert.alert('Sign out failed', error.message);
      }}><Text style={styles.message}>Sign out</Text></TouchableOpacity>}
    </>}
  </View>;
}
const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: Colors.background,
    justifyContent: 'center', alignItems: 'center', padding: 24, gap: 20, zIndex: 1000 },
  message: { color: Colors.text, textAlign: 'center' },
  button: { backgroundColor: Colors.primary, padding: 16, borderRadius: 12 },
  label: { color: Colors.white },
});

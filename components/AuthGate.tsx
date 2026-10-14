import { useEffect } from 'react';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { authDestination } from '@/lib/auth/controller';
import { palette } from '@/constants/design';
import { Button, Notice, StateView } from '@/components/foundation/Primitives';
import { errorText } from '@/components/pickup/error-copy';

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
    {auth.isLoading ? <StateView title="Comprobando tu sesión" loading /> : <>
      <Notice>{errorText(auth.error ?? undefined)}</Notice>
      <Button label="Reintentar" onPress={() => void auth.retry()} />
      {auth.session && <Button secondary label="Cerrar sesión" onPress={async () => {
        const { error } = await auth.signOut();
        if (error) Alert.alert('No pudimos cerrar la sesión', errorText(error.message));
      }} />}
    </>}
  </View>;
}
const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: palette.navy,
    justifyContent: 'center', padding: 24, gap: 20, zIndex: 1000 },
});

import { useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Text from '@/components/AppText';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

export default function SignOutButton() {
  const { signOut } = useAuth();
  const router = useRouter();
  const locked = useRef(false);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  async function logout() {
    if (locked.current) return;
    locked.current = true;
    setPending(true);
    setFailed(false);
    try {
      const { error } = await signOut();
      if (error) { setFailed(true); return; }
      router.replace('/(auth)/signin');
    } catch {
      setFailed(true);
    } finally {
      locked.current = false;
      setPending(false);
    }
  }
  return <View style={{ gap: 12 }}>
    {failed && <Text accessibilityRole="alert" style={{ color: Colors.text }}>
      Unable to sign out. Check your connection and retry.
    </Text>}
    <TouchableOpacity accessibilityRole="button" disabled={pending} onPress={() => void logout()}
      style={{ padding: 16, backgroundColor: Colors.surface, borderRadius: 12 }}>
      <Text style={{ color: Colors.error }}>{pending ? 'Signing out...' : failed ? 'Retry logout' : 'Logout'}</Text>
    </TouchableOpacity>
  </View>;
}

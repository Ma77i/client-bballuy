import Text from '@/components/AppText';
import { useState } from 'react';
import { View, TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, X } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';
import SignOutButton from './SignOutButton';

export default function HeaderMenu() {
  const [visible, setVisible] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  return <>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open menu"
      onPress={() => setVisible(true)} style={{ padding: 8 }}>
      <Menu color={Colors.text} size={24} />
    </TouchableOpacity>
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
      <View style={styles.overlay}>
        <Pressable accessibilityRole="button" accessibilityLabel="Dismiss menu"
          style={StyleSheet.absoluteFill} onPress={() => setVisible(false)} />
        <View style={styles.menu}>
          <View style={styles.heading}>
            <Text style={{ color: Colors.text, fontSize: 20 }}>Menu</Text>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel="Close menu" onPress={() => setVisible(false)}>
              <X color={Colors.text} size={24} />
            </TouchableOpacity>
          </View>
          <Text style={{ color: Colors.textSecondary }}>{user?.display_name}</Text>
          <TouchableOpacity accessibilityRole="button" onPress={() => {
            setVisible(false); router.navigate('/(tabs)/profile');
          }} style={{ padding: 16 }}>
            <Text style={{ color: Colors.primary }}>My Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" onPress={() => {
            setVisible(false); router.navigate('/(tabs)/my-courts');
          }} style={{ padding: 16 }}>
            <Text style={{ color: Colors.primary }}>My Courts</Text>
          </TouchableOpacity>
          <SignOutButton />
        </View>
      </View>
    </Modal>
  </>;
}
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'flex-end', justifyContent: 'center' },
  menu: { backgroundColor: Colors.surface, borderRadius: 16, padding: 20, gap: 12, width: 280 },
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

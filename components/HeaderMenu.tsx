import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, Settings, User, Shield, Bell, HelpCircle, LogOut, X } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import Colors from '@/constants/colors';
import NotificationIcon from './NotificationIcon';

export default function HeaderMenu() {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const { signOut, user, role } = useAuth();
  const { unreadCount } = useNotifications();
  const router = useRouter();

  const handleSignOut = async () => {
    setMenuVisible(false);
    await signOut();
    router.replace('/');
  };

  const handleMenuItemPress = (action: () => void) => {
    setMenuVisible(false);
    action();
  };

  return (
    <>
      <View style={styles.headerIcons}>
        <NotificationIcon unreadCount={unreadCount} />
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
          <Menu color={Colors.text} size={24} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <View>
                <Text style={styles.menuTitle}>Menu</Text>
                {user && (
                  <Text style={styles.menuSubtitle}>{user.display_name}</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <X color={Colors.textMuted} size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.menuItems}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(() => router.push('/(tabs)/profile'))}
              >
                <User color={Colors.primary} size={20} />
                <Text style={styles.menuItemText}>My Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(() => console.log('Settings'))}
              >
                <Settings color={Colors.primary} size={20} />
                <Text style={styles.menuItemText}>Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(() => router.push('/notifications'))}
              >
                <Bell color={Colors.primary} size={20} />
                <Text style={styles.menuItemText}>Notifications</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(() => console.log('Privacy'))}
              >
                <Shield color={Colors.primary} size={20} />
                <Text style={styles.menuItemText}>Privacy & Security</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(() => console.log('Help'))}
              >
                <HelpCircle color={Colors.primary} size={20} />
                <Text style={styles.menuItemText}>Help & Support</Text>
              </TouchableOpacity>

              {(role === 'moderator' || role === 'admin') && (
                <TouchableOpacity
                  style={[styles.menuItem, styles.moderatorItem]}
                  onPress={() => handleMenuItemPress(() => console.log('Moderation'))}
                >
                  <Shield color={Colors.secondary} size={20} />
                  <Text style={[styles.menuItemText, { color: Colors.secondary }]}>
                    Moderation Panel
                  </Text>
                </TouchableOpacity>
              )}

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleSignOut}
              >
                <LogOut color={Colors.error} size={20} />
                <Text style={[styles.menuItemText, { color: Colors.error }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuButton: {
    padding: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start' as const,
    alignItems: 'flex-end' as const,
  },
  menuContainer: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    minWidth: 280,
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  menuSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  menuItems: {
    padding: 8,
  },
  menuItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  moderatorItem: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
});

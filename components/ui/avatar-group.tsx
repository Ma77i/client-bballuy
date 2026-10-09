import Text from '@/components/AppText';
// components/ui/avatar-group.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import AvatarBubble from '@/components/ui/avatar-bubble';

interface Avatar {
  id: string;
  name: string;
  avatar_url: string | null;
}

interface AvatarGroupProps {
  avatars: Avatar[];
  maxVisible?: number;
  size?: number;
  showCount?: boolean;
}

export default function AvatarGroup({
  avatars,
  maxVisible = 3,
  size = 40,
  showCount = true,
}: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, maxVisible);
  const remainingCount = Math.max(0, avatars.length - maxVisible);

  return (
    <View style={styles.container}>
      <View style={styles.avatarGroup}>
        {visibleAvatars.map((a, index) => (
          <View
            key={a.id}
            style={[
              styles.avatarWrapper,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                marginLeft: index > 0 ? -8 : 0,
                zIndex: maxVisible - index,
              },
            ]}
          >
            <AvatarBubble
              avatarPath={a.avatar_url ?? undefined}
              name={a.name}
              size={size}
              borderRadius={size / 2}
            />
          </View>
        ))}

        {remainingCount > 0 && showCount && (
          <View
            style={[
              styles.countAvatar,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                marginLeft: visibleAvatars.length > 0 ? -8 : 0,
              },
            ]}
          >
            <Text style={[styles.countText, { fontSize: size * 0.3 }]}>
              +{remainingCount}
            </Text>
          </View>
        )}
      </View>

      {showCount && (
        <Text style={styles.memberCount}>
          {avatars.length} {avatars.length === 1 ? 'member' : 'members'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  avatarGroup: { flexDirection: 'row', alignItems: 'center' },
  avatarWrapper: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative', // ayuda a que zIndex funcione bien en web
  },
  countAvatar: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 2,
    borderColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: { color: Colors.text, fontWeight: '600' },
  memberCount: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
});

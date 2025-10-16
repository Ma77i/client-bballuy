import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Colors from '@/constants/colors';

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
  showCount = true 
}: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, maxVisible);
  const remainingCount = avatars.length - maxVisible;

  const renderAvatar = (avatar: Avatar, index: number) => (
    <View
      key={avatar.id}
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          marginLeft: index > 0 ? -8 : 0,
          zIndex: maxVisible - index,
        },
      ]}
    >
      {avatar.avatar_url ? (
        <Image
          source={{ uri: avatar.avatar_url }}
          style={[styles.avatarImage, { width: size, height: size, borderRadius: size / 2 }]}
        />
      ) : (
        <View style={[styles.avatarPlaceholder, { width: size, height: size, borderRadius: size / 2 }]}>
          <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>
            {avatar.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.avatarGroup}>
        {visibleAvatars.map(renderAvatar)}
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
  container: {
    gap: 8,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontWeight: '600',
  },
  countAvatar: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 2,
    borderColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: Colors.text,
    fontWeight: '600',
  },
  memberCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

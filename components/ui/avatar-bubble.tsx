// components/ui/avatar-bubble.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Users as UsersIcon } from 'lucide-react-native';
import { supabase } from '@/lib/backend/supabase';
import Colors from '@/constants/colors';

function isHttpUrl(s?: string | null) {
  return !!s && /^(https?:)?\/\//i.test(s);
}
function stripBucketPrefix(p: string) {
  // si viene "avatars/uid/file.png" le saco "avatars/" para usar createSignedUrl correctamente
  return p.startsWith('avatars/') ? p.substring('avatars/'.length) : p;
}

export default function AvatarBubble({
  avatarPath,
  name,
  size = 40,
  borderRadius,
}: {
  avatarPath?: string | null;
  name?: string | null;
  size?: number;
  borderRadius?: number;
}) {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!avatarPath) {
        setUri(null);
        return;
      }
      // Si ya es URL absoluta: úsala tal cual
      if (isHttpUrl(avatarPath)) {
        if (!cancelled) setUri(avatarPath);
        return;
      }
      // Firmar desde el bucket "avatars" con la key relativa
      try {
        const key = stripBucketPrefix(avatarPath);
        const { data, error } = await supabase
          .storage
          .from('avatars')
          .createSignedUrl(key, 3600); // 1h

        if (!cancelled) {
          if (error) {
            console.warn('sign avatar error', error.message);
            setUri(null);
          } else {
            setUri(data?.signedUrl ?? null);
          }
        }
      } catch (e: any) {
        if (!cancelled) {
          console.warn('sign avatar exception', e?.message);
          setUri(null);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [avatarPath]);

  const r = borderRadius ?? Math.round(size / 2);

  if (uri) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: r, backgroundColor: Colors.surfaceLight }} />;
  }

  const initials = (name ?? '').trim().charAt(0).toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: r, backgroundColor: Colors.surfaceLight, alignItems: 'center', justifyContent: 'center' }}>
      {initials ? (
        <Text style={{ color: Colors.text, fontWeight: '700' }}>{initials}</Text>
      ) : (
        <UsersIcon color={Colors.textSecondary} size={Math.max(18, Math.round(size * 0.6))} />
      )}
    </View>
  );
}

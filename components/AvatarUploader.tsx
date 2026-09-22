// components/AvatarUploader.tsx
import { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Camera, Image as ImgIcon } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { uploadAvatar, getSignedUrl, pickImageFromGallery, takePhoto } from '@/lib/backend/storage';

type Props = {
  userId: string;
  avatarPath: string | null;              // path en storage
  onUploaded: (newPath: string) => void;  // guarda en users_public
  size?: number;
};

export default function AvatarUploader({ userId, avatarPath, onUploaded, size = 112 }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => setUrl(await getSignedUrl(avatarPath)))();
  }, [avatarPath]);

  const handle = (source: 'gallery' | 'camera') => async () => {
    try {
      setBusy(true);
      const local = source === 'gallery' ? await pickImageFromGallery() : await takePhoto();
      if (!local) return;
      const newPath = await uploadAvatar(userId, local);
      onUploaded(newPath);
      setUrl(await getSignedUrl(newPath));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{
        width: size, height: size, borderRadius: size/2,
        backgroundColor: Colors.surface, overflow: 'hidden', alignItems: 'center', justifyContent: 'center'
      }}>
        {url ? (
          <Image source={{ uri: url }} style={{ width: '100%', height: '100%' }} />
        ) : busy ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          <ImgIcon size={32} color={Colors.textMuted} />
        )}
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
        <TouchableOpacity onPress={handle('gallery')} style={{ padding: 10, backgroundColor: Colors.surface, borderRadius: 10 }}>
          <ImgIcon size={20} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handle('camera')} style={{ padding: 10, backgroundColor: Colors.surface, borderRadius: 10 }}>
          <Camera size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

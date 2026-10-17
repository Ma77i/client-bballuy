import { useState } from 'react';
import { View, StyleSheet, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import Text from '@/components/AppText';
import { illustrations } from '@/components/foundation/GenericMedia';
import { palette } from '@/constants/design';

const art = {
  header: require('../../assets/illustrations/r02-play/header.webp'),
  '1v1': require('../../assets/illustrations/r02-play/duel.webp'),
  '2v2': require('../../assets/illustrations/r02-play/hoop.webp'),
  '5v5': require('../../assets/illustrations/r02-play/ball.webp'),
};

// Exact owner-authorized R02 crops. Formats and game data are never baked into art.
export function PlayArt({ kind, style }: { kind: keyof typeof art; style?: StyleProp<ViewStyle> }) {
  const [failed, setFailed] = useState(false);
  return <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={style}>
    <Image source={failed ? illustrations.court : art[kind]} style={StyleSheet.absoluteFill}
      contentFit={kind === 'header' ? 'contain' : 'cover'} accessible={false} transition={0} onError={() => setFailed(true)} />
  </View>;
}

export function PlayHeader() {
  const { width, fontScale } = useWindowDimensions();
  const expanded = fontScale >= 1.3 || width < 350;
  return <View style={{ minHeight: 148, paddingTop: 4 }}>
    <View style={{ alignItems: 'flex-start', gap: 0 }}>
      <Text variant="display" tone="dark" style={{ fontSize: 25, lineHeight: 26 }}>BBallUY</Text>
      <Text variant="display" style={{ color: palette.orange, fontSize: 25, lineHeight: 26 }}>ARCADE</Text>
      <Text variant="display" tone="dark" accessibilityRole="header" style={{ fontSize: 48, lineHeight: 50 }}>JUGAR</Text>
      <Text variant="caption" tone="dark" style={{ maxWidth: expanded ? '100%' : '60%', fontSize: 13, lineHeight: 18 }}>Encontrá partidos,{ '\n' }sumate o armá el tuyo.</Text>
    </View>
    <PlayArt kind="header" style={expanded ? { width: '100%', height: 112, marginTop: 8 } : { position: 'absolute', top: 0, right: 0, width: '60%', height: 128 }} />
  </View>;
}

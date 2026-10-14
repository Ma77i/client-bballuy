import { useState } from 'react';
import { Image } from 'expo-image';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Text from '@/components/AppText';
import { palette, radii, surfaces } from '@/constants/design';
import { useSurfaceTone } from './Primitives';
import { usableMediaSource, type MediaSource } from './media-policy';
export type { MediaSource } from './media-policy';

export const illustrations = {
  court: require('../../assets/illustrations/court-placeholder.webp'),
  player: require('../../assets/illustrations/player.webp'),
};

function MediaImage({ source, asset }: { source?: MediaSource; asset: keyof typeof illustrations }) {
  const [stage, setStage] = useState<'source' | 'local' | 'symbol'>(source ? 'source' : 'local');
  // A failed local decode also has a static fallback; never retry in a loop.
  if (stage === 'symbol') return <Svg width="100%" height="100%" viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="33" fill={palette.orange} stroke={palette.navy} strokeWidth="3" />
    <Path d="M17 50h66M50 17v66M30 23q30 27 0 54" fill="none" stroke={palette.navy} strokeWidth="3" />
  </Svg>;
  return <Image source={stage === 'source' ? source : illustrations[asset]} contentFit="contain"
    style={{ width: '100%', height: '100%' }} transition={0} accessible={false}
    onError={() => setStage(stage === 'source' ? 'local' : 'symbol')} />;
}

export function GenericMedia({ source, asset = 'court', size = 96, style }: {
  source?: MediaSource; asset?: keyof typeof illustrations; size?: number; style?: StyleProp<ViewStyle>;
}) {
  const colors = surfaces[useSurfaceTone()];
  const usable = usableMediaSource(source);
  const key = `${asset}:${typeof usable === 'number' ? usable : usable?.uri ?? 'local'}`;
  return <View style={[{ gap: 4 }, style]}>
    <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
      style={{ width: size, height: size, backgroundColor: colors.panel, borderRadius: radii.control }}>
      <MediaImage key={key} source={usable} asset={asset} />
    </View>
    <Text variant="caption" style={{ color: colors.muted }}>Ilustración · No es una foto</Text>
  </View>;
}

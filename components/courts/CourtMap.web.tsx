import { View } from 'react-native';
import Text from '@/components/AppText';
import Colors from '@/constants/colors';
import type { CourtMapProps } from './types';
export default function CourtMap(_props: CourtMapProps) {
  return <View style={{ padding: 16, backgroundColor: Colors.surface }}>
    <Text style={{ color: Colors.textSecondary }}>Browse the court list below. The interactive map is available in the mobile app.</Text>
  </View>;
}

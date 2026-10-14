import { View } from 'react-native';
import { StateView } from '@/components/foundation/Primitives';
import { foundationStyles } from '@/components/foundation/styles';
export default function LoadingScreen() {
  return <View style={[foundationStyles.page, { padding: 24, justifyContent: 'center' }]}><StateView title="Preparando bballuy" loading /></View>;
}

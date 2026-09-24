import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import Text from '@/components/AppText';
import Colors from '@/constants/colors';
import { useCourtMembership } from '@/hooks/courts';
export default function CourtMembership({ courtId }: { courtId: string }) {
  const { membership, mutation, joined, change } = useCourtMembership(courtId);
  const button = (label: string, action: () => void) => <TouchableOpacity accessibilityRole="button"
    disabled={mutation.isPending} onPress={action} style={{ backgroundColor: Colors.primary, borderRadius: 12, padding: 16 }}>
    <Text style={{ color: Colors.white, textAlign: 'center' }}>{label}</Text>
  </TouchableOpacity>;
  return <View style={{ gap: 14 }}>
    <Text style={{ color: Colors.textSecondary }}>Be part of this court community. No team is required; membership does not mean you are playing here now.</Text>
    {mutation.isPending ? <ActivityIndicator accessibilityLabel="Saving membership" color={Colors.primary} /> : mutation.isError ? <>
      <Text accessibilityRole="alert" style={{ color: Colors.text }}>Unable to confirm the change. Retry to confirm your membership.</Text>
      {button('Retry change', () => void change(mutation.variables!))}
    </> : membership.isPending ? <ActivityIndicator accessibilityLabel="Loading membership" color={Colors.primary} /> : membership.isError ? <>
      <Text accessibilityRole="alert" style={{ color: Colors.text }}>Unable to load your membership.</Text>
      {button('Retry membership', () => void membership.refetch())}
    </> : <>
      <Text style={{ color: Colors.text }}>{joined ? 'You are part of this court' : 'You have not joined this court yet'}</Text>
      {button(joined ? 'Leave court' : 'Join court', () => void change(!joined))}
    </>}
  </View>;
}

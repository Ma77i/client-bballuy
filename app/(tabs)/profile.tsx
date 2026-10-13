import { ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Text from '@/components/AppText';
import SignOutButton from '@/components/SignOutButton';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import ReportProblem from '@/components/ReportProblem';

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  return <>
    <Stack.Screen options={{ headerShown: true, title: 'Profile',
      headerStyle: { backgroundColor: Colors.surface }, headerTintColor: Colors.text }} />
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}
      contentContainerStyle={{ padding: 24, gap: 24 }}>
      <Text style={{ color: Colors.text, fontSize: 26 }}>{user?.display_name}</Text>
      <TouchableOpacity accessibilityRole="button" onPress={() => router.navigate('/(tabs)/my-courts')}
        style={{ backgroundColor: Colors.surface, borderRadius: 12, padding: 16 }}>
        <Text style={{ color: Colors.primary }}>My Courts</Text>
      </TouchableOpacity>
      <SignOutButton />
      <ReportProblem />
    </ScrollView>
  </>;
}

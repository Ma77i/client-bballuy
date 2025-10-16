import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function AgeGateScreen() {
  const router = useRouter();

  const handleConfirm = () => {
    router.push('/consent');
  };

  return (
    <LinearGradient colors={[Colors.background, Colors.surface]} style={styles.container}>
      <View style={{ paddingTop: 40 }} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Calendar color={Colors.primary} size={48} />
          </View>
          <Text style={styles.title}>Age Verification</Text>
          <Text style={styles.subtitle}>
            You must be 13 years or older to use StreetHoops. By continuing, you confirm that you meet this requirement.
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleConfirm}>
            <Text style={styles.primaryButtonText}>I am 13 or older</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
            <Text style={styles.secondaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between' as const,
    padding: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    gap: 24,
    alignItems: 'center' as const,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center' as const,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 24,
  },
  actions: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center' as const,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600' as const,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center' as const,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600' as const,
  },
});

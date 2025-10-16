import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[Colors.background, Colors.surface]}
      style={styles.container}
    >
      <View style={{ paddingTop: 40 }} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCo-FFKc6XhAhizN9KYGZgAeC2AHnw5R7ieL87LbkWLPxmwOVxlfQNljhyXwKhdLwGwf2X_2Dex4sfaTUTwsstF9LOxIDeAnrhd6JraCZbhDKil682_VCImYSUtC7-de0jhvExXytYqm6r8AlEBwdRBoJQuc7MaN_UmcUiBnoj9djPpWAvRdPSAs-4JSfykVRaO2i_gZetStyX8t9_YUkpQsM4FPb9rYX1WIVdchs9yepzKsbvBcOTRn5XZsGKKWBykwLp5bWdh9Q",
            }}
            style={styles.image}
          />
          <Text style={styles.title}>Find Your Game.{'\n'}Anytime. Anywhere.</Text>
          <Text style={styles.subtitle}>
            Discover basketball courts, track your stats, and join games with players in your city.
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/(auth)/age-gate')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(auth)/signin')}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
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
    paddingLeft: 24,
    paddingRight: 24,
    // paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    gap: 16,
  },
  image: {
    width: "100%",
    height: 420,
    borderRadius: 20,
    marginBottom: 20,
  },
  title: {
    textAlign: 'center' as const,
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.text,
    lineHeight: 48,
  },
  subtitle: {
    textAlign: 'center' as const,
    fontSize: 18,
    color: Colors.textSecondary,
    lineHeight: 28,
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

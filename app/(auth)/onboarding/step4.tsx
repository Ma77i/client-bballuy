
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingSlide from '@/components/OnboardingSlide';

export default function Onboarding4() {
  const router = useRouter();

  const finish = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    } catch {}
    router.replace('/(auth)/age-gate');
  };

  return (
    <OnboardingSlide
      title="VOLVÉ A MIS CANCHAS"
      description="Encontrá las canchas que agregaste. Permanecen ahí hasta que decidas quitarlas."
      current={3}
      total={4}
      onNext={finish}
      onSkip={finish}
    />
  );
}

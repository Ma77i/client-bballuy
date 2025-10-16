
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
      title="Join the community & start playing"
      description="Find your court, connect with players, and get in the game. Your next match is a tap away."
      image="<svg class='w-20 h-20 text-white' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L8.43 15l2.58 2.58c.24.24.58.37.94.35zM12 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm6.79-9.21c.13.58.21 1.17.21 1.79 0 4.08-3.05 7.44-7 7.93.35-.02.69-.15.93-.39l2.58-2.58L17.79 8.21z'></path></svg>"
      current={3}
      total={4}
      // primaryLabel="Get Started"
      onNext={finish}
      onSkip={finish}
    />
  );
}


import { useRouter } from 'expo-router';
import OnboardingSlide from '@/components/OnboardingSlide';

export default function Onboarding3() {
  const router = useRouter();
  return (
    <OnboardingSlide
      title="TUS CANCHAS A MANO"
      description="Agregá una cancha sin necesitar un equipo. Eso no significa que estés jugando allí ahora."
      current={2}
      total={4}
      onNext={() => router.push('/(auth)/onboarding/step4')}
      onSkip={() => router.replace('/(auth)/age-gate')}
    />
  );
}

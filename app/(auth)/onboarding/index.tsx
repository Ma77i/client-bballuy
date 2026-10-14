import { useRouter } from 'expo-router';
import OnboardingSlide from '@/components/OnboardingSlide';

export default function Onboarding1() {
  const router = useRouter();
  return (
    <OnboardingSlide
      title="ENCONTRÁ TU CANCHA"
      description="Descubrí las canchas del catálogo y agregalas a Mis canchas."
      current={0}
      total={4}
      onNext={() => router.push('/(auth)/onboarding/step2')}
      onSkip={() => router.push('/(auth)/age-gate')}
    />
  );
}

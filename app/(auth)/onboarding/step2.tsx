import { useRouter } from 'expo-router';
import OnboardingSlide from '@/components/OnboardingSlide';

export default function Onboarding2() {
  const router = useRouter();
  return (
    <OnboardingSlide
      title="EXPLORÁ LAS CANCHAS"
      description="Buscá por nombre y consultá los detalles. Usá el mapa en la app móvil o explorá el listado."
      current={1}
      total={4}
      onNext={() => router.push('/(auth)/onboarding/step3')}
      onSkip={() => router.replace('/(auth)/age-gate')}
    />
  );
}

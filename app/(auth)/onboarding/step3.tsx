
import { useRouter } from 'expo-router';
import OnboardingSlide from '@/components/OnboardingSlide';

export default function Onboarding3() {
  const router = useRouter();
  return (
    <OnboardingSlide
      title="Belong to a Court Community"
      description="Join a court without needing a team. Membership does not mean you are playing there now."
      image="https://lh3.googleusercontent.com/aida-public/AB6AXuAUgDgKBtoN2tD2JDGGmWSjklsfYYd_D4sqCsdDpdzGSaDLhLhcZ8qV_6PZv-e5VdU8If1KGrMruHSuH_9Y_11gSs3PYWkKHpAvd5sf5Xmt0pNcCzBKBXB1z14P28c8TijJqVlrThZ72vy6vVvjfU7joNw-pSpz95yxLRKONOKzcOuHua9juU5MHA8Nx9kXJRZKGonE9azo17v9YQ5LFU0DdentxF93STelfWqdHZxJ2aAfBeFKon1mplmAxI-Dm2Lxl7HMReQt9w"
      current={2}
      total={4}
      onNext={() => router.push('/(auth)/onboarding/step4')}
      onSkip={() => router.replace('/(auth)/age-gate')}
    />
  );
}

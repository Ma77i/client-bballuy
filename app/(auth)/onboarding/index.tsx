import { useRouter } from 'expo-router';
import OnboardingSlide from '@/components/OnboardingSlide';

export default function Onboarding1() {
  const router = useRouter();
  return (
    <OnboardingSlide
      title={"Find Your Court.\nJoin Its Community."}
      description="Discover the courts in our catalog and become part of their communities."
      image="https://lh3.googleusercontent.com/aida-public/AB6AXuCo-FFKc6XhAhizN9KYGZgAeC2AHnw5R7ieL87LbkWLPxmwOVxlfQNljhyXwKhdLwGwf2X_2Dex4sfaTUTwsstF9LOxIDeAnrhd6JraCZbhDKil682_VCImYSUtC7-de0jhvExXytYqm6r8AlEBwdRBoJQuc7MaN_UmcUiBnoj9djPpWAvRdPSAs-4JSfykVRaO2i_gZetStyX8t9_YUkpQsM4FPb9rYX1WIVdchs9yepzKsbvBcOTRn5XZsGKKWBykwLp5bWdh9Q"
      current={0}
      total={4}
      onNext={() => router.push('/(auth)/onboarding/step2')}
      onSkip={() => router.push('/(auth)/age-gate')}
    />
  );
}

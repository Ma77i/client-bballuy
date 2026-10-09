import { useRouter } from 'expo-router';
import OnboardingSlide from '@/components/OnboardingSlide';

export default function Onboarding2() {
  const router = useRouter();
  return (
    <OnboardingSlide
      title="Explore the Court Catalog"
      description="Search courts by name and view their details. Use the map in the mobile app or browse the list."
      image="https://lh3.googleusercontent.com/aida-public/AB6AXuDZja41nkldmvi7UwWCs4Vgu7VNiyRJL5YEJS4DjDnbkIil1S0ZjsqVBLzV0TS0uVwQD5_ZUHGT-PC9so_ZWpNViw0Tu72MFEctUrPvueoyODIe-4hebvMFMINd_vdiZQe6ASY965lJMdVNlEYIXG_rzEnS52Kaa_VU8fD8zeRsc-ptu0Z2r_HbGbHkHDpuwoi4kDe24-t-Kgmhc52tAhAdq2WIE80072cWJ_gxJg3JlDEgTccnLTcULnJcN6xLac9dedkNIqF5Bw"
      current={1}
      total={4}
      onNext={() => router.push('/(auth)/onboarding/step3')}
      onSkip={() => router.replace('/(auth)/age-gate')}
    />
  );
}

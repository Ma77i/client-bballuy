import { Redirect, useRootNavigationState } from 'expo-router';

export default function Index() {
  const rootState = useRootNavigationState();
  if (!rootState?.key) return null;   // esperar a que monte el Root Layout
  return <Redirect href="/splash" />;
}

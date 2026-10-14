import { useRouter } from 'expo-router';
import EntryFrame from '@/components/entry/EntryFrame';
import { Button } from '@/components/foundation/Primitives';
export default function WelcomeScreen() {
  const router=useRouter();
  return <EntryFrame title="ENCONTRÁ TU CANCHA" description="Explorá las canchas y agregalas a Mis canchas para volver a encontrarlas.">
    <Button label="Comenzar" onPress={() => router.push('/(auth)/age-gate')} />
    <Button secondary label="Iniciar sesión" onPress={() => router.push('/(auth)/signin')} />
  </EntryFrame>;
}

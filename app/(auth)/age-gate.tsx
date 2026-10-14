import { useRouter } from 'expo-router';
import EntryFrame from '@/components/entry/EntryFrame';
import { Button } from '@/components/foundation/Primitives';
export default function AgeGateScreen() {
  const router = useRouter();
  return <EntryFrame title="ANTES DE ENTRAR" description="Debés tener 13 años o más para usar bballuy. Al continuar confirmás que cumplís este requisito.">
    <Button label="Tengo 13 años o más" onPress={() => router.push('/consent')} />
    <Button secondary label="Volver" onPress={() => router.back()} />
  </EntryFrame>;
}

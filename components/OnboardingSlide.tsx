import Text from '@/components/AppText';
import EntryFrame from '@/components/entry/EntryFrame';
import { Button } from '@/components/foundation/Primitives';
interface Props { title: string; subtitle?: string; description: string; current: number; total: number; onNext(): void; onSkip?(): void; }
export default function OnboardingSlide({title, subtitle, description, current, total, onNext, onSkip}: Props) {
  return <EntryFrame title={title} description={description}>
    {subtitle && <Text variant="body" tone="dark">{subtitle}</Text>}
    <Text variant="caption" tone="dark">Paso {current + 1} de {total}</Text>
    <Button label="Continuar" onPress={onNext} />
    {onSkip && <Button secondary label="Omitir introducción" onPress={onSkip} />}
  </EntryFrame>;
}

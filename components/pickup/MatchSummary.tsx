import { View, useWindowDimensions } from 'react-native';
import { CalendarDays } from 'lucide-react-native';
import Text from './GameText';
import { PlayArt } from './PlayArt';
import { GamePanel, kit } from './Kit';
import { dateText } from './presentation';
import { palette } from '@/constants/design';
import type { Match } from '@/lib/pickup/matches';

// Recorded matches have their own real lifecycle; never invent session capacity.
export default function MatchSummary({ game, courtName }: { game: Match; courtName: string }) {
  const { width, fontScale } = useWindowDimensions();
  const stacked = width < 350 || fontScale >= 1.5;
  const completed = game.state === 'completed';
  const art = game.format === '1v1' || game.format === '2v2' || game.format === '5v5' ? game.format : 'header';
  return <GamePanel tone="light" style={{ padding: 12, gap: 8 }}>
    <View style={{ flexDirection: stacked ? 'column' : 'row', gap: 12 }}>
      <View style={{ width: stacked ? '100%' : 108, minHeight: 124, borderRadius: 12, overflow: 'hidden', backgroundColor: palette.navy }}>
        <PlayArt kind={art} style={{ position: 'absolute', inset: 0 }} />
        <Text variant="display" style={{ color: palette.cream, fontSize: 44, lineHeight: 52, margin: 8 }}>{game.format}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
        <Text style={[kit.section, { fontSize: 25, lineHeight: 30 }]}>{courtName}</Text>
        <Text variant="caption" style={{ alignSelf: 'flex-start', backgroundColor: completed ? palette.raised : palette.legacyPrimary,
          color: completed ? palette.cream : palette.navy, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>{completed ? 'Finalizado · resultado declarado' : 'Iniciado · resultado pendiente'}</Text>
        <Text variant="display" tone="light" style={{ fontSize: 40, lineHeight: 46 }}>{completed ? `${game.score_a} – ${game.score_b}` : '— : —'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <CalendarDays size={16} color={palette.navy} aria-hidden />
          <Text style={[kit.help, { flex: 1 }]}>Registrado {dateText(game.created_at)}</Text>
        </View>
        {completed && <Text style={kit.help}>Revisión {game.revision}</Text>}
      </View>
    </View>
  </GamePanel>;
}

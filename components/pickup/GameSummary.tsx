import { View } from 'react-native';
import { CalendarDays, Users } from 'lucide-react-native';
import Text from './GameText';
import { PlayArt } from './PlayArt';
import { GamePanel, kit } from './Kit';
import { sportsSessionStatus } from './play-presentation';
import { palette } from '@/constants/design';
import type { PublicSession } from '@/lib/pickup/discovery';

type Summary = Pick<PublicSession, 'available_places' | 'occupied_places' | 'capacity'> & { format: string; state: string };

// Shared composition only: eligibility and mutations stay with each screen's hooks.
export default function GameSummary({ game, courtName, schedule }: { game: Summary; courtName: string; schedule: string }) {
  const { label, ...statusStyle } = !['open', 'started', 'cancelled', 'completed'].includes(game.state) ? { label: 'No disponible', backgroundColor: palette.raised, color: palette.cream } : sportsSessionStatus({ ...game, state: game.state === 'started' || game.state === 'cancelled' || game.state === 'completed' ? game.state : 'open' });
  return <View>
    <PlayArt kind="header" style={{ height: 120, width: '100%' }} />
    <GamePanel tone="light" style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Text style={[kit.title, { fontSize: 52, lineHeight: 58 }]}>{game.format}</Text>
        <View style={{ flex: 1, minWidth: 160, gap: 4 }}>
          <Text style={[kit.section, { fontSize: 26, lineHeight: 32 }]}>{courtName}</Text>
          <Text style={{ alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, ...statusStyle }}>{label}</Text>
        </View>
      </View>
      <View style={kit.row}><CalendarDays size={20} color={palette.navy} /><Text style={[kit.body, { flex: 1 }]}>{schedule}</Text></View>
      <View style={kit.row}><Users size={20} color={palette.navy} /><Text style={[kit.body, { flex: 1 }]}>{game.state === 'open' ? `${game.available_places} lugares disponibles` : 'Inscripciones cerradas'} · {game.occupied_places}/{game.capacity} ocupados</Text></View>
    </GamePanel>
  </View>;
}

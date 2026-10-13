import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowUpRight, Radio } from 'lucide-react-native';
import Text from '@/components/AppText';
import { GamePanel, gameColors, kit } from './Kit';
import { scheduledLabel, type PublicSession } from '@/lib/pickup/discovery';

export default function SessionCard({ game, courtName }: { game: PublicSession; courtName: string }) {
  const router = useRouter();
  const playing = game.state === 'started';
  return <Pressable accessibilityRole="button" accessibilityLabel={`View ${game.format} at ${courtName}`}
    onPress={() => router.push({ pathname: '/pickup/[id]', params: { id: game.id } })}>
    <GamePanel style={playing ? { borderColor: '#98552e' } : undefined}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={kit.row}>{playing && <Radio color={gameColors.orange} size={16} />}<Text style={kit.badge}>
          {playing ? 'PLAYING · REPORTED' : game.state === 'cancelled' ? 'CANCELLED' : game.state === 'completed' ? 'CLOSED' : game.available_places === 0 ? 'FULL INVITATION' : `${game.available_places} OPEN PLACES`}
        </Text></View><ArrowUpRight color={gameColors.muted} size={20} />
      </View>
      <Text style={[kit.section, { fontSize: 22 }]}>{game.format} · {courtName}</Text>
      <Text style={kit.body}>{scheduledLabel(game)}</Text>
      <Text style={kit.help}>Organized by {game.organizer_name}</Text>
      <Text style={kit.help}>{playing ? 'Started by the organizer. Physical attendance is not verified.' : game.state !== 'open' ? 'Registration changes are closed.' : `${game.occupied_places}/${game.capacity} player places · No team or court membership needed.`}</Text>
    </GamePanel>
  </Pressable>;
}

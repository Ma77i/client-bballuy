import { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import Text from '@/components/AppText';
import { useAuth } from '@/contexts/AuthContext';
import { useMatchPlayerSearch } from '@/hooks/matches';
import type { PlayerDraft } from '@/lib/pickup/matches';
import { GameButton, GameChoice, GameField, GameNotice, gameColors, kit } from './Kit';

export default function MatchPlayerSlot({ player, index, disabled, error, change }: {
  player: PlayerDraft; index: number; disabled: boolean; error?: string; change(player: PlayerDraft): void;
}) {
  const [search, setSearch] = useState('');
  const auth = useAuth(), results = useMatchPlayerSearch(player.kind === 'account' && !disabled ? search : '');
  const label = `Side ${player.side} player ${index + 1}`;
  return <View style={{ gap: 12 }}>
    <Text style={kit.fieldLabel}>{label}</Text>
    <View style={kit.row}><GameChoice label="Guest" selected={player.kind === 'guest'} disabled={disabled} onPress={() => change({ ...player, kind: 'guest', userId: '', label: '' })} />
      <GameChoice label="Account" selected={player.kind === 'account'} disabled={disabled} onPress={() => change({ ...player, kind: 'account', userId: '', label: '' })} /></View>
    {player.kind === 'guest' ? <GameField label={`${label} guest name`} value={player.label} maxLength={40} editable={!disabled} error={error}
      onChangeText={value => change({ ...player, label: value })} /> : <>
      {Boolean(player.userId) && <Text style={kit.badge}>Selected: {player.label || 'Saved account player'}</Text>}
      <GameButton secondary label={`Use my account for ${label}`} disabled={disabled} onPress={() => change({ ...player, userId: auth.session?.user.id ?? '', label: auth.user?.display_name ?? 'My account' })} />
      <GameField label={`${label} account search`} help="Enter at least 2 characters of a known player's display name." value={search} maxLength={40} editable={!disabled} onChangeText={setSearch} error={error} />
      {search.trim().length >= 2 && results.isPending && !disabled && <ActivityIndicator color={gameColors.orange} />}
      {results.isError && !disabled && <><GameNotice>Unable to find players.</GameNotice><GameButton secondary label={`Retry search for ${label}`} onPress={() => void results.refetch()} /></>}
      {!disabled && search.trim().length >= 2 && results.isSuccess && !results.data.length && <Text style={kit.help}>No matching accounts. You can record this person as a guest.</Text>}
      {!disabled && <ScrollView style={{ maxHeight: 220 }} contentContainerStyle={{ gap: 8 }} nestedScrollEnabled>
        {results.data?.map(person => <GameChoice key={person.id} label={person.display_name} selected={player.userId === person.id}
          onPress={() => change({ ...player, userId: person.id, label: person.display_name })} />)}
      </ScrollView>}
    </>}
  </View>;
}

import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Text from '@/components/pickup/GameText';
import { useAuth } from '@/contexts/AuthContext';
import { useMatchPlayerSearch } from '@/hooks/matches';
import type { PlayerDraft } from '@/lib/pickup/matches';
import { GameLoading as ActivityIndicator, GameButton, GameChoice, ArcadeField as GameField, ArcadeNotice as GameNotice, gameColors, kit } from './Kit';

export default function MatchPlayerSlot({ player, index, disabled, error, change }: {
  player: PlayerDraft; index: number; disabled: boolean; error?: string; change(player: PlayerDraft): void;
}) {
  const [search, setSearch] = useState('');
  const auth = useAuth(), results = useMatchPlayerSearch(player.kind === 'account' && !disabled ? search : '');
  const label = `Lado ${player.side} · participante ${index + 1}`;
  return <View style={{ gap: 12 }}>
    <Text style={kit.fieldLabel}>{label}</Text>
    <View style={kit.row}><GameChoice label="Invitado" selected={player.kind === 'guest'} disabled={disabled} onPress={() => change({ ...player, kind: 'guest', userId: '', label: '' })} />
      <GameChoice label="Cuenta" selected={player.kind === 'account'} disabled={disabled} onPress={() => change({ ...player, kind: 'account', userId: '', label: '' })} /></View>
    {player.kind === 'guest' ? <GameField label={`${label} · nombre del invitado`} value={player.label} maxLength={40} editable={!disabled} error={error}
      onChangeText={value => change({ ...player, label: value })} /> : <>
      {Boolean(player.userId) && <Text style={kit.badge}>Seleccionado: {player.label || 'Participante guardado'}</Text>}
      <GameButton secondary label={`Usar mi cuenta para ${label}`} disabled={disabled} onPress={() => change({ ...player, userId: auth.session?.user.id ?? '', label: auth.user?.display_name ?? 'Mi cuenta' })} />
      <GameField label={`${label} · buscar cuenta`} help="Escribí al menos 2 caracteres del nombre de alguien que conozcas." value={search} maxLength={40} editable={!disabled} onChangeText={setSearch} error={error} />
      {search.trim().length >= 2 && results.isPending && !disabled && <ActivityIndicator color={gameColors.orange} />}
      {results.isError && !disabled && <><GameNotice>No pudimos buscar participantes.</GameNotice><GameButton secondary label={`Reintentar búsqueda para ${label}`} onPress={() => void results.refetch()} /></>}
      {!disabled && search.trim().length >= 2 && results.isSuccess && !results.data.length && <Text style={kit.help}>Sin cuentas coincidentes. Podés registrar a esta persona como invitada.</Text>}
      {!disabled && <ScrollView style={{ maxHeight: 220 }} contentContainerStyle={{ gap: 8 }} nestedScrollEnabled>
        {results.data?.map(person => <GameChoice key={person.id} label={person.display_name} selected={player.userId === person.id}
          onPress={() => change({ ...player, userId: person.id, label: person.display_name })} />)}
      </ScrollView>}
    </>}
  </View>;
}

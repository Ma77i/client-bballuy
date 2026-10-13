import { useRef, useState } from 'react';
import { Linking, View } from 'react-native';
import Text from '@/components/AppText';
import { openSupportDraft, supportDraft } from '@/lib/support';
import { GameButton, GameNotice, kit } from '@/components/pickup/Kit';

export default function ReportProblem() {
  const email = process.env.EXPO_PUBLIC_SUPPORT_EMAIL;
  const [busy, setBusy] = useState(false), [failed, setFailed] = useState(false);
  const lock = useRef(false);
  if (!supportDraft(email)) return null;
  async function report() {
    if (lock.current) return;
    lock.current = true; setBusy(true); setFailed(false);
    try { await openSupportDraft(email, (url) => Linking.openURL(url)); }
    catch { setFailed(true); }
    finally { lock.current = false; setBusy(false); }
  }
  return <View style={{ gap: 12 }}>
    <GameButton secondary label={failed ? 'Retry problem report' : 'Report a problem'} busy={busy} onPress={() => void report()} />
    <Text style={kit.help}>Opens an email draft for you to review and send. No account information is attached automatically.</Text>
    {failed && <><GameNotice>Unable to open your email app. Retry or use the contact below.</GameNotice><Text selectable style={kit.body}>{email}</Text></>}
  </View>;
}

import { useCourtMembership } from '@/hooks/courts';
import MembershipPanel from './MembershipPanel';
export default function CourtMembership({ courtId, embedded = false }: { courtId: string; embedded?: boolean }) {
  const { membership, mutation, joined, change } = useCourtMembership(courtId);
  return <MembershipPanel embedded={embedded} joined={joined} saving={mutation.isPending} saveError={mutation.isError}
    loading={membership.isPending} readError={membership.isError} onChange={() => void change(!joined)}
    onRetryChange={() => void change(mutation.variables!)} onRetryRead={() => void membership.refetch()} />;
}

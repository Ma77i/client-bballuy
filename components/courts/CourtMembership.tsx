import { useCourtMembership } from '@/hooks/courts';
import MembershipPanel from './MembershipPanel';
export default function CourtMembership({ courtId }: { courtId: string }) {
  const { membership, mutation, joined, change } = useCourtMembership(courtId);
  return <MembershipPanel joined={joined} saving={mutation.isPending} saveError={mutation.isError}
    loading={membership.isPending} readError={membership.isError} onChange={() => void change(!joined)}
    onRetryChange={() => void change(mutation.variables!)} onRetryRead={() => void membership.refetch()} />;
}

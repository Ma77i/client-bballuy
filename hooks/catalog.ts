import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/backend/supabase';
import { loadCatalog } from '@/lib/courts/catalog';
export function useCourtCatalog() {
  return useQuery({ queryKey: ['court-catalog'], queryFn: ({ signal }) => loadCatalog(supabase, signal), retry: 1 });
}

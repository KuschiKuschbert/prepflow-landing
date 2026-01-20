import { supabase } from '@/lib/supabase-pos';
import { useRouter } from 'next/navigation';

export function useCurbOSNavigation() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Clear the cookie as well
    document.cookie = 'curbos_auth=; path=/; max-age=0';
    router.push('/curbos/login');
    router.refresh();
  };

  return {
    handleLogout,
  };
}

import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/utils';
import { SearchBar } from './SearchBar';

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userIsAdmin = await isAdmin(supabase, user?.email);

  return (
    <header className="sticky top-0 z-50 bg-paper border-b border-line backdrop-blur">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 flex items-center gap-4 py-[14px] flex-wrap">
        <Link
          href="/"
          className="font-display font-extrabold text-[22px] tracking-tight text-ink flex items-center gap-2 no-underline"
        >
          CupónAR
          <span className="bg-accent text-ink py-1 px-[10px] rounded text-xs font-extrabold tracking-wider -rotate-2">
            AR
          </span>
        </Link>

        <SearchBar />

        <div className="flex items-center gap-2">
          {userIsAdmin && (
            <Link href="/admin" className="btn btn-ghost text-sm">
              Admin
            </Link>
          )}
          {user ? (
            <Link href="/cargar" className="btn btn-accent">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="hidden md:inline">Cargar promo</span>
            </Link>
          ) : (
            <Link href="/login" className="btn btn-accent">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

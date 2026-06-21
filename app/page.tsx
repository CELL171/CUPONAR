import { createClient } from '@/lib/supabase/server';
import { FiltersBar } from '@/components/FiltersBar';
import { PromoCard } from '@/components/PromoCard';
import { normalize } from '@/lib/utils';
import type { Promo, PromoType } from '@/lib/types';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{
    tab?: string;
    cat?: string;
    sub?: string;
    day?: string;
    q?: string;
    expired?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tab = (params.tab ?? 'coupon') as PromoType;
  const category = params.cat ?? 'Todos';
  const subFilter = params.sub ?? 'Todos';
  const dayFilter = params.day ?? 'Todos';
  const search = params.q ?? '';
  const showExpired = params.expired === '1';

  const supabase = await createClient();

  // Traemos todas las promos aprobadas (para los counts y filtrado client-like).
  // Para escalar: paginar y mover filtros a SQL. Para 1k de promos esto va sobrado.
  const { data: allPromos, error } = await supabase
    .from('public_promos')
    .select('*')
    .order('added_at', { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (error) {
    console.error(error);
  }

  const promos: Promo[] = (allPromos ?? []) as Promo[];

  // Counts por tab (sólo vigentes)
  const today = new Date();
  const isAlive = (p: Promo) => !p.expiry || new Date(p.expiry) >= today;
  const counts = {
    coupon: promos.filter((p) => p.type === 'coupon' && isAlive(p)).length,
    bank: promos.filter((p) => p.type === 'bank' && isAlive(p)).length,
    wallet: promos.filter((p) => p.type === 'wallet' && isAlive(p)).length,
  };

  // Filtrado
  const q = normalize(search);
  const filtered = promos
    .filter((p) => p.type === tab)
    .filter((p) => (showExpired ? true : isAlive(p)))
    .filter((p) => category === 'Todos' || p.category === category)
    .filter((p) => {
      if (subFilter === 'Todos') return true;
      if (p.type === 'bank') return p.bank === subFilter;
      if (p.type === 'wallet') return p.wallet === subFilter;
      return true;
    })
    .filter((p) => {
      if (p.type !== 'bank' || dayFilter === 'Todos') return true;
      return p.day === dayFilter || p.day === 'Todos los días';
    })
    .filter((p) => {
      if (!q) return true;
      const bag = normalize(
        [p.title, p.description, p.code, p.category, p.store, p.bank, p.wallet, p.day, p.discount]
          .filter(Boolean)
          .join(' ')
      );
      return bag.includes(q);
    })
    .sort((a, b) => {
      const sa = (a.votes_up ?? 0) - (a.votes_down ?? 0);
      const sb = (b.votes_up ?? 0) - (b.votes_down ?? 0);
      if (sb !== sa) return sb - sa;
      return new Date(b.added_at).getTime() - new Date(a.added_at).getTime();
    });

  // Stats hero
  const activeCount = promos.filter(isAlive).length;
  const bankCount = new Set(promos.filter((p) => p.type === 'bank' && isAlive(p)).map((p) => p.bank)).size;
  const walletCount = new Set(promos.filter((p) => p.type === 'wallet' && isAlive(p)).map((p) => p.wallet)).size;

  return (
    <main className="max-w-[1200px] mx-auto px-4 md:px-6">
      {/* Hero */}
      <section className="py-12 md:py-14">
        <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.02] tracking-tight max-w-[14ch]">
          Cazá la promo,{' '}
          <span className="marker-highlight">no la pagues entera.</span>
        </h1>
        <p className="mt-4 text-ink-soft text-lg max-w-[56ch]">
          Cupones, descuentos bancarios y promos de billeteras digitales — cargados y verificados por
          la propia comunidad argentina.
        </p>
        <div className="flex gap-8 mt-7 pt-6 border-t border-line flex-wrap">
          <Stat n={activeCount} label="Promos activas" />
          <Stat n={counts.coupon} label="Cupones" />
          <Stat n={bankCount} label="Bancos" />
          <Stat n={walletCount} label="Billeteras" />
        </div>
      </section>

      <FiltersBar
        tab={tab}
        category={category}
        subFilter={subFilter}
        dayFilter={dayFilter}
        showExpired={showExpired}
        counts={counts}
      />

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-5 pb-20" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {filtered.map((p) => (
            <PromoCard key={p.id} promo={p} isLoggedIn={!!user} />
          ))}
        </div>
      )}
    </main>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <div className="font-display font-bold text-3xl leading-none tracking-tight">{n}</div>
      <div className="text-muted text-[13px] mt-1.5 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 px-5 text-muted">
      <h3 className="font-display text-2xl text-ink mb-2 font-bold">No hay promos que coincidan</h3>
      <p className="text-[15px] max-w-[40ch] mx-auto mb-5">
        Probá quitando filtros o buscando otra cosa. O cargá una vos para que la comunidad la aproveche.
      </p>
      <Link href="/cargar" className="btn btn-accent">
        Cargar la primera
      </Link>
    </div>
  );
}

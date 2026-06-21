'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES, BANKS, WALLETS, DAYS } from '@/lib/catalogs';
import type { PromoType } from '@/lib/types';

const TAB_LABELS: Record<PromoType, string> = {
  coupon: 'Cupones',
  bank: 'Tarjetas',
  wallet: 'Billeteras',
};

interface FiltersProps {
  tab: PromoType;
  category: string;
  subFilter: string;
  dayFilter: string;
  showExpired: boolean;
  counts: { coupon: number; bank: number; wallet: number };
}

export function FiltersBar({
  tab,
  category,
  subFilter,
  dayFilter,
  showExpired,
  counts,
}: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === '' || value === 'Todos') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    // Cuando cambia tab, limpiar sub y día
    if (key === 'tab') {
      params.delete('sub');
      params.delete('day');
      params.delete('cat');
    }
    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  const subList = tab === 'bank' ? BANKS : tab === 'wallet' ? WALLETS : [];

  return (
    <>
      {/* Tabs */}
      <nav className="flex gap-0 border-b border-line mt-8 overflow-x-auto no-scrollbar">
        {(['coupon', 'bank', 'wallet'] as PromoType[]).map((t) => (
          <button
            key={t}
            onClick={() => setParam('tab', t)}
            className={`py-[14px] px-1 mr-6 font-semibold cursor-pointer relative text-[15px] whitespace-nowrap inline-flex items-center gap-2 bg-transparent border-none font-body ${
              tab === t ? 'text-ink' : 'text-muted'
            }`}
          >
            {TAB_LABELS[t]}
            <span
              className={`text-[11px] py-0.5 px-[7px] rounded-full font-semibold ${
                tab === t ? 'bg-ink text-paper' : 'bg-line text-ink-soft'
              }`}
            >
              {counts[t]}
            </span>
            {tab === t && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-ink" />
            )}
          </button>
        ))}
      </nav>

      {/* Filters */}
      <div className="flex flex-wrap gap-2.5 py-5 items-center">
        {/* Categorías */}
        <div className="flex gap-2 flex-wrap">
          {(['Todos', ...CATEGORIES] as string[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setParam('cat', cat === 'Todos' ? null : cat)}
              className={`chip ${category === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sub-filtros (bank/wallet) */}
        {subList.length > 0 && (
          <>
            <div className="w-px h-5 bg-line mx-1" />
            <div className="flex gap-2 flex-wrap">
              {(['Todos', ...subList] as string[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setParam('sub', s === 'Todos' ? null : s)}
                  className={`chip ${subFilter === s ? 'active' : ''}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Días (solo bank) */}
        {tab === 'bank' && (
          <>
            <div className="w-px h-5 bg-line mx-1" />
            <div className="flex gap-2 flex-wrap">
              {(['Todos', ...DAYS.slice(1)] as string[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setParam('day', d === 'Todos' ? null : d)}
                  className={`chip ${dayFilter === d ? 'active' : ''}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Toggle vencidos */}
        <label className="ml-auto flex items-center gap-2 text-[13px] text-muted cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showExpired}
            onChange={(e) => setParam('expired', e.target.checked ? '1' : null)}
            className="accent-ink"
          />
          Ver vencidos
        </label>
      </div>
    </>
  );
}

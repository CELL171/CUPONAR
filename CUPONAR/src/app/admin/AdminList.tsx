'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Promo } from '@/lib/types';
import { approveAction, rejectAction } from './actions';

export function AdminList({ items, mode }: { items: Promo[]; mode: 'pending' | 'rejected' }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (items.length === 0) {
    return <div className="text-muted text-sm">No hay items.</div>;
  }

  const handleApprove = (id: string) => {
    startTransition(async () => {
      const res = await approveAction(id);
      if (res?.error) alert(res.error);
      else router.refresh();
    });
  };

  const handleReject = (id: string) => {
    const reason = prompt('Motivo del rechazo (opcional):') ?? '';
    startTransition(async () => {
      const res = await rejectAction(id, reason);
      if (res?.error) alert(res.error);
      else router.refresh();
    });
  };

  return (
    <div className="grid gap-3">
      {items.map((p) => (
        <div key={p.id} className="bg-paper border border-line rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-wider text-muted font-bold">
              {p.type === 'coupon' ? `Cupón · ${p.store ?? ''}` : p.type === 'bank' ? `Banco · ${p.bank ?? ''}` : `Billetera · ${p.wallet ?? ''}`}
            </div>
            <div className="font-semibold mt-1">{p.title}</div>
            <div className="text-sm text-ink-soft mt-1">
              {p.discount && <span className="font-bold mr-2">{p.discount}</span>}
              {p.category}
              {p.day && p.day !== 'Todos los días' && <span> · {p.day}</span>}
              {p.expiry && <span> · vence {p.expiry}</span>}
            </div>
            {p.description && <div className="text-sm text-ink-soft mt-1.5">{p.description}</div>}
            {p.code && (
              <div className="font-mono text-xs mt-1.5 bg-bg inline-block px-2 py-1 rounded">{p.code}</div>
            )}
            {p.url && (
              <div className="text-xs mt-2">
                <a href={p.url} target="_blank" rel="noopener" className="text-ink-soft underline">
                  {p.url}
                </a>
              </div>
            )}
            <div className="text-[11px] text-muted mt-2">
              Por {p.added_by_name} ({p.added_by_email}) · {new Date(p.added_at).toLocaleString('es-AR')}
            </div>
            {p.rejected_reason && (
              <div className="text-xs text-bad mt-2">Rechazada: {p.rejected_reason}</div>
            )}
          </div>

          {mode === 'pending' && (
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleApprove(p.id)}
                disabled={pending}
                className="bg-good text-white px-3 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-60"
              >
                Aprobar
              </button>
              <button
                onClick={() => handleReject(p.id)}
                disabled={pending}
                className="bg-bad text-white px-3 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-60"
              >
                Rechazar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

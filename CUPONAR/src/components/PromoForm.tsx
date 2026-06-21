'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, BANKS, WALLETS, DAYS } from '@/lib/catalogs';
import type { PromoType } from '@/lib/types';
import { createPromoAction } from '@/app/cargar/actions';

export function PromoForm({ userEmail, userName }: { userEmail: string; userName: string }) {
  const router = useRouter();
  const [type, setType] = useState<PromoType>('coupon');
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (formData: FormData) => {
    setError(null);
    formData.set('type', type);
    startTransition(async () => {
      const res = await createPromoAction(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setTimeout(() => router.push('/'), 1500);
      }
    });
  };

  if (success) {
    return (
      <div className="bg-good/10 border border-good/30 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">✓</div>
        <h2 className="font-display font-bold text-2xl mb-2">¡Promo enviada!</h2>
        <p className="text-ink-soft">
          La estamos revisando. Si todo está bien, aparece publicada en unas horas.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="bg-paper border border-line rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-line">
        <h1 className="font-display font-bold text-2xl tracking-tight">Cargar una promo</h1>
        <p className="text-muted text-sm mt-1">
          Compartí un descuento que estés usando. Lo revisamos antes de publicarlo.
        </p>
      </div>

      <div className="p-6 flex flex-col gap-4">
        {/* Selector de tipo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          {(
            [
              ['coupon', '🎟️', 'Cupón con código'],
              ['bank', '💳', 'Promo bancaria'],
              ['wallet', '📱', 'Billetera digital'],
            ] as const
          ).map(([key, emoji, label]) => (
            <button
              type="button"
              key={key}
              onClick={() => setType(key)}
              className={`py-3 px-2 border rounded-[10px] cursor-pointer text-center text-xs font-semibold transition-all leading-tight ${
                type === key
                  ? 'bg-ink text-paper border-ink'
                  : 'bg-paper border-line-strong text-ink-soft hover:border-ink'
              }`}
            >
              <span className="text-[22px] block mb-1">{emoji}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Título */}
        <Field label="Título" hint="— Qué descuento ofrece">
          <input
            type="text"
            name="title"
            placeholder="Ej: 20% OFF en zapatillas"
            required
            maxLength={80}
            className="input"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {type === 'coupon' && (
            <Field label="Tienda">
              <input type="text" name="store" placeholder="Ej: Dexter, Garbarino…" maxLength={40} className="input" />
            </Field>
          )}
          {type === 'bank' && (
            <Field label="Banco">
              <select name="bank" className="input">
                {BANKS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>
          )}
          {type === 'wallet' && (
            <Field label="Billetera">
              <select name="wallet" className="input">
                {WALLETS.map((w) => (
                  <option key={w}>{w}</option>
                ))}
              </select>
            </Field>
          )}

          <Field label="Descuento" hint="— Ej: 20%, 2x1, $5000">
            <input type="text" name="discount" placeholder="20%" maxLength={20} className="input" />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Categoría">
            <select name="category" className="input">
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>

          {type === 'coupon' && (
            <Field label="Código" hint="— Si aplica">
              <input
                type="text"
                name="code"
                placeholder="VERANO20"
                maxLength={30}
                className="input uppercase"
                style={{ textTransform: 'uppercase' }}
              />
            </Field>
          )}
          {(type === 'bank' || type === 'wallet') && (
            <Field label="Día de la semana">
              <select name="day" className="input">
                {DAYS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </Field>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Vence el" hint="— Opcional">
            <input type="date" name="expiry" className="input" />
          </Field>
          <Field label="Link" hint="— Opcional">
            <input type="url" name="url" placeholder="https://..." className="input" />
          </Field>
        </div>

        <Field label="Detalles" hint="— Tope, días, condiciones">
          <textarea
            name="description"
            placeholder="Ej: Tope de reintegro $10.000. Sólo compras online."
            maxLength={240}
            className="input min-h-[60px] resize-y"
          />
        </Field>

        <Field label="Tu nombre o alias" hint="— Para darte crédito">
          <input
            type="text"
            name="added_by_name"
            placeholder="Anónimo"
            maxLength={30}
            defaultValue={userName}
            className="input"
          />
        </Field>

        {error && (
          <div className="bg-bad/10 border border-bad/30 text-bad text-sm rounded-lg p-3">{error}</div>
        )}
      </div>

      <div className="px-6 py-4 bg-bg border-t border-line flex justify-between items-center gap-3 flex-wrap">
        <div className="text-[11px] text-muted flex-1">
          Al cargar confirmás que la promo es real y la viste vos.
        </div>
        <button type="submit" disabled={pending} className="btn disabled:opacity-60">
          {pending ? 'Enviando…' : 'Publicar promo'}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="field-label">
        {label} {hint && <span className="field-hint">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

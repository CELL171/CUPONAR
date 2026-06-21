import Link from 'next/link';
import type { Promo } from '@/lib/types';
import { formatExpiry, isExpired } from '@/lib/utils';
import { CopyCode } from './CopyCode';
import { VoteButtons } from './VoteButtons';

interface Props {
  promo: Promo;
  /** Si está logueado, se muestran los votos como interactivos */
  isLoggedIn: boolean;
}

export function PromoCard({ promo, isLoggedIn }: Props) {
  const expiry = formatExpiry(promo.expiry);
  const expired = isExpired(promo.expiry);
  const subject = promo.type === 'coupon' ? promo.store : promo.type === 'bank' ? promo.bank : promo.wallet;
  const score = (promo.votes_up ?? 0) - (promo.votes_down ?? 0);
  const verified = score >= 10;

  return (
    <article className={`promo-card ${expired ? 'opacity-70' : ''}`}>
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-wider text-muted">
            {subject || promo.category}
          </div>
          <div className="font-display font-extrabold text-[36px] leading-none tracking-tight text-ink mt-1.5">
            {promo.discount || '—'}
            {verified && (
              <span className="align-super text-[9px] ml-1.5 bg-good text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                verificado
              </span>
            )}
          </div>
        </div>
      </div>

      <Link href={`/promo/${promo.slug}`} className="block group">
        <div className="font-semibold text-[15px] text-ink leading-snug group-hover:underline">
          {promo.title}
        </div>
      </Link>
      {promo.description && (
        <div className="text-[13px] text-ink-soft leading-relaxed line-clamp-3">
          {promo.description}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 text-xs">
        {promo.category && (
          <span className="bg-ink/5 px-2.5 py-1 rounded-full text-ink-soft font-medium">
            {promo.category}
          </span>
        )}
        {promo.day && promo.day !== 'Todos los días' && (
          <span className="bg-accent/25 px-2.5 py-1 rounded-full text-ink font-semibold">
            {promo.day}
          </span>
        )}
        {promo.card_type && (
          <span className="bg-ink/5 px-2.5 py-1 rounded-full text-ink-soft font-medium">
            {promo.card_type}
          </span>
        )}
        {expiry && (
          <span
            className={`px-2.5 py-1 rounded-full font-medium ${
              expiry.cls === 'expired'
                ? 'bg-bad/10 text-bad'
                : expiry.cls === 'soon'
                ? 'bg-accent/40 text-[#92400e]'
                : 'bg-ink/5 text-ink-soft'
            }`}
          >
            {expiry.label}
          </span>
        )}
      </div>

      {promo.code && (
        <div className="border-t border-dashed border-line-strong pt-3.5 flex items-center gap-2">
          <CopyCode code={promo.code} />
        </div>
      )}

      <div className="border-t border-line pt-3.5 flex items-center justify-between gap-2 mt-auto">
        <VoteButtons
          promoId={promo.id}
          votesUp={promo.votes_up ?? 0}
          votesDown={promo.votes_down ?? 0}
          isLoggedIn={isLoggedIn}
        />
        {promo.url && (
          <a
            href={promo.url}
            target="_blank"
            rel="noopener nofollow"
            className="text-ink-soft hover:text-ink no-underline text-xs font-semibold inline-flex items-center gap-1"
          >
            Ir al sitio →
          </a>
        )}
      </div>
      {promo.added_by_name && (
        <div className="text-[11px] text-muted -mt-2">Cargado por {promo.added_by_name}</div>
      )}
    </article>
  );
}

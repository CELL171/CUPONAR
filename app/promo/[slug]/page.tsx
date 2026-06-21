import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import type { Promo } from '@/lib/types';
import { CopyCode } from '@/components/CopyCode';
import { VoteButtons } from '@/components/VoteButtons';
import { formatExpiry, isExpired } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPromo(slug: string): Promise<Promo | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('public_promos')
    .select('*')
    .eq('slug', slug)
    .single();
  return (data as Promo) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const promo = await getPromo(slug);
  if (!promo) return { title: 'Promo no encontrada' };

  const subject = promo.store ?? promo.bank ?? promo.wallet ?? 'Argentina';
  const title = `${promo.discount ?? ''} ${promo.title} en ${subject}`.trim();
  const desc = promo.description ?? `${promo.title} — Promoción válida en ${subject}.`;

  return {
    title,
    description: desc,
    openGraph: { title, description: desc, type: 'article' },
    twitter: { card: 'summary', title, description: desc },
  };
}

export default async function PromoPage({ params }: Props) {
  const { slug } = await params;
  const promo = await getPromo(slug);
  if (!promo) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const expiry = formatExpiry(promo.expiry);
  const expired = isExpired(promo.expiry);
  const subject = promo.store ?? promo.bank ?? promo.wallet;

  // JSON-LD para resultados ricos en Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: promo.title,
    description: promo.description ?? promo.title,
    category: promo.category,
    seller: subject ? { '@type': 'Organization', name: subject } : undefined,
    validThrough: promo.expiry ?? undefined,
    url: process.env.NEXT_PUBLIC_SITE_URL + '/promo/' + promo.slug,
    priceSpecification: promo.discount ? { '@type': 'PriceSpecification', price: promo.discount } : undefined,
  };

  return (
    <main className="max-w-[760px] mx-auto px-4 md:px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/" className="text-sm text-muted hover:text-ink no-underline">
        ← Volver al inicio
      </Link>

      <article className={`mt-6 ${expired ? 'opacity-80' : ''}`}>
        <div className="text-xs font-bold uppercase tracking-wider text-muted">
          {subject ?? promo.category}
        </div>
        <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-tight tracking-tight mt-2">
          {promo.title}
        </h1>

        <div className="flex items-end gap-4 mt-5 mb-6 flex-wrap">
          <div className="font-display font-extrabold text-7xl leading-none text-ink">
            {promo.discount || '—'}
          </div>
          {expiry && (
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
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

        {promo.description && (
          <p className="text-lg text-ink-soft leading-relaxed mb-6">{promo.description}</p>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {promo.category && <Pill>{promo.category}</Pill>}
          {promo.day && promo.day !== 'Todos los días' && (
            <Pill className="bg-accent/30">{promo.day}</Pill>
          )}
          {promo.card_type && <Pill>{promo.card_type}</Pill>}
        </div>

        {promo.code && (
          <div className="bg-paper border border-line rounded-2xl p-5 mb-6">
            <div className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Código</div>
            <div className="flex gap-2 items-center">
              <CopyCode code={promo.code} />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between py-5 border-t border-b border-line">
          <VoteButtons
            promoId={promo.id}
            votesUp={promo.votes_up ?? 0}
            votesDown={promo.votes_down ?? 0}
            isLoggedIn={!!user}
          />
          {promo.url && (
            <a
              href={promo.url}
              target="_blank"
              rel="noopener nofollow"
              className="btn"
            >
              Ir al sitio →
            </a>
          )}
        </div>

        {promo.added_by_name && (
          <div className="text-sm text-muted mt-5">Cargado por {promo.added_by_name}</div>
        )}
      </article>
    </main>
  );
}

function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`bg-ink/5 px-3 py-1 rounded-full text-sm text-ink-soft font-medium ${className ?? ''}`}>
      {children}
    </span>
  );
}

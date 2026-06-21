import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('public_promos')
    .select('slug, added_at')
    .order('added_at', { ascending: false });

  const promoUrls =
    data?.map((p) => ({
      url: `${SITE_URL}/promo/${p.slug}`,
      lastModified: p.added_at ? new Date(p.added_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) ?? [];

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...promoUrls,
  ];
}

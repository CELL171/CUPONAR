'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { uniqueSlug } from '@/lib/utils';
import type { PromoType } from '@/lib/types';

export async function createPromoAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { error: 'Necesitás iniciar sesión.' };
  }

  const type = (formData.get('type') as PromoType) ?? 'coupon';
  const title = String(formData.get('title') ?? '').trim();

  if (!title) return { error: 'Falta el título.' };

  const slug = uniqueSlug(title);

  const base = {
    slug,
    type,
    country: 'ar',
    title,
    discount: String(formData.get('discount') ?? '').trim() || null,
    category: String(formData.get('category') ?? '').trim() || null,
    description: String(formData.get('description') ?? '').trim() || null,
    expiry: String(formData.get('expiry') ?? '').trim() || null,
    url: String(formData.get('url') ?? '').trim() || null,
    added_by_email: user.email,
    added_by_name: String(formData.get('added_by_name') ?? '').trim() || 'Anónimo',
    status: 'pending' as const,
  };

  let specifics: Record<string, unknown> = {};
  if (type === 'coupon') {
    specifics = {
      store: String(formData.get('store') ?? '').trim() || null,
      code: String(formData.get('code') ?? '').trim().toUpperCase() || null,
    };
  } else if (type === 'bank') {
    specifics = {
      bank: String(formData.get('bank') ?? '').trim() || null,
      day: String(formData.get('day') ?? '').trim() || null,
      card_type: 'Crédito/Débito',
    };
  } else if (type === 'wallet') {
    specifics = {
      wallet: String(formData.get('wallet') ?? '').trim() || null,
      day: String(formData.get('day') ?? '').trim() || null,
    };
  }

  const { error } = await supabase.from('promos').insert({ ...base, ...specifics });

  if (error) {
    return { error: 'No se pudo guardar la promo. ' + error.message };
  }

  revalidatePath('/');
  return { success: true };
}

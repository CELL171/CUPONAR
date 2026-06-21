'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/utils';

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado', supabase: null };
  const ok = await isAdmin(supabase, user.email);
  if (!ok) return { error: 'No autorizado', supabase: null };
  return { error: null, supabase };
}

export async function approveAction(id: string) {
  const { error, supabase } = await requireAdmin();
  if (error || !supabase) return { error: error ?? 'No autorizado' };

  const { error: dbError } = await supabase
    .from('promos')
    .update({ status: 'approved', approved_at: new Date().toISOString() })
    .eq('id', id);

  if (dbError) return { error: dbError.message };

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function rejectAction(id: string, reason: string) {
  const { error, supabase } = await requireAdmin();
  if (error || !supabase) return { error: error ?? 'No autorizado' };

  const { error: dbError } = await supabase
    .from('promos')
    .update({ status: 'rejected', rejected_reason: reason || null })
    .eq('id', id);

  if (dbError) return { error: dbError.message };

  revalidatePath('/admin');
  return { success: true };
}

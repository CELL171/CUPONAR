import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/utils';
import { AdminList } from './AdminList';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');
  const userIsAdmin = await isAdmin(supabase, user.email);
  if (!userIsAdmin) {
    return (
      <main className="max-w-[640px] mx-auto px-5 py-16 text-center">
        <h1 className="font-display font-bold text-3xl mb-3">No autorizado</h1>
        <p className="text-muted">Tu email no está en la lista de moderadores.</p>
      </main>
    );
  }

  // El admin ve todas las pending. Necesita una policy especial o usa service role.
  // Para mantenerlo simple sin service role: agregamos una policy de admin.
  // Acá leemos directamente con la sesión del admin.
  const { data: pending } = await supabase
    .from('promos')
    .select('*')
    .eq('status', 'pending')
    .order('added_at', { ascending: false });

  const { data: rejected } = await supabase
    .from('promos')
    .select('*')
    .eq('status', 'rejected')
    .order('added_at', { ascending: false })
    .limit(20);

  return (
    <main className="max-w-[1000px] mx-auto px-4 md:px-6 py-10">
      <h1 className="font-display font-bold text-3xl tracking-tight mb-2">Moderación</h1>
      <p className="text-muted text-sm mb-8">
        Aprobá lo que sea real y útil. Rechazá spam, vencido o falso.
      </p>

      <section className="mb-12">
        <h2 className="font-display font-semibold text-xl mb-4">
          Pendientes ({pending?.length ?? 0})
        </h2>
        <AdminList items={pending ?? []} mode="pending" />
      </section>

      <section>
        <h2 className="font-display font-semibold text-xl mb-4">Rechazadas recientes</h2>
        <AdminList items={rejected ?? []} mode="rejected" />
      </section>
    </main>
  );
}

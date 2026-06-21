import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PromoForm } from '@/components/PromoForm';

export default async function CargarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Tomamos como sugerencia el nombre del email (parte antes del @)
  const suggestedName = user.email?.split('@')[0] ?? '';

  return (
    <main className="max-w-[640px] mx-auto px-4 md:px-6 py-10">
      <Link href="/" className="text-sm text-muted hover:text-ink no-underline">
        ← Volver al inicio
      </Link>
      <div className="mt-6">
        <PromoForm userEmail={user.email!} userName={suggestedName} />
      </div>
    </main>
  );
}

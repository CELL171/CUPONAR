'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setError(error.message);
      else setSent(true);
    });
  };

  return (
    <main className="max-w-[460px] mx-auto px-5 py-16">
      <Link href="/" className="text-sm text-muted hover:text-ink no-underline">
        ← Volver al inicio
      </Link>

      <div className="mt-8 bg-paper border border-line rounded-2xl p-8 shadow-card">
        <h1 className="font-display font-bold text-3xl tracking-tight">
          {sent ? 'Revisá tu mail' : 'Iniciar sesión'}
        </h1>
        <p className="text-muted text-sm mt-2 mb-6">
          {sent
            ? 'Te mandamos un link mágico. Hacé clic y volvés acá logueado.'
            : 'Te mandamos un link a tu mail. No necesitás contraseña.'}
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="field-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="input"
                autoComplete="email"
              />
            </div>
            {error && (
              <div className="bg-bad/10 border border-bad/30 text-bad text-sm rounded-lg p-3">
                {error}
              </div>
            )}
            <button type="submit" disabled={pending || !email} className="btn disabled:opacity-60">
              {pending ? 'Enviando…' : 'Mandar link'}
            </button>
          </form>
        ) : (
          <div className="bg-good/10 border border-good/30 rounded-lg p-4 text-sm">
            ✓ Link enviado a <strong>{email}</strong>
            <div className="text-muted text-xs mt-2">
              Si no llega en 1 minuto, revisá spam.
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

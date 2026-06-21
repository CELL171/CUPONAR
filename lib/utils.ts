/**
 * Normaliza un string: minúsculas y sin acentos.
 * Útil para que la búsqueda encuentre "gastronomia" cuando buscan "gastronomía".
 */
export function normalize(s: string | null | undefined): string {
  return String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Convierte un título en un slug seguro para URLs.
 * "20% OFF en Galicia" -> "20-off-en-galicia"
 */
export function slugify(input: string): string {
  return normalize(input)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

/**
 * Genera un slug único agregando un sufijo aleatorio corto.
 */
export function uniqueSlug(input: string): string {
  const base = slugify(input);
  const suffix = Math.random().toString(36).slice(2, 7);
  return base ? `${base}-${suffix}` : suffix;
}

export function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr + 'T23:59:59');
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

export function formatExpiry(dateStr: string | null): { label: string; cls: string } | null {
  if (!dateStr) return null;
  const d = daysUntil(dateStr);
  if (d === null) return null;
  if (d < 0) return { label: 'Vencido', cls: 'expired' };
  if (d === 0) return { label: 'Vence hoy', cls: 'soon' };
  if (d === 1) return { label: 'Vence mañana', cls: 'soon' };
  if (d <= 7) return { label: `Vence en ${d} días`, cls: 'soon' };
  const dt = new Date(dateStr);
  return {
    label: `Hasta ${dt.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}`,
    cls: '',
  };
}

export function isExpired(expiry: string | null): boolean {
  if (!expiry) return false;
  return (daysUntil(expiry) ?? 0) < 0;
}

/**
 * Chequea si un email está en la tabla admins de Supabase.
 * Recibe el cliente de Supabase para hacer la consulta.
 */
export async function isAdmin(
  supabase: { from: (table: string) => any },
  email: string | null | undefined
): Promise<boolean> {
  if (!email) return false;
  const { data } = await supabase
    .from('admins')
    .select('email')
    .eq('email', email.toLowerCase())
    .maybeSingle();
  return !!data;
}

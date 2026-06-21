'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') ?? '');

  // Si cambian los searchParams desde fuera, sincronizar
  useEffect(() => {
    setValue(searchParams.get('q') ?? '');
  }, [searchParams]);

  // Debounce: actualizar URL 250ms después de tipear
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set('q', value);
      else params.delete('q');

      const target = pathname === '/' ? '/' : '/';
      router.replace(`${target}?${params.toString()}`, { scroll: false });
    }, 250);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="flex-1 max-w-[540px] relative order-3 md:order-none basis-full md:basis-auto">
      <svg
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        className="absolute left-[14px] top-1/2 -translate-y-1/2 text-muted pointer-events-none"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        placeholder="Buscá por tienda, banco, código…"
        autoComplete="off"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full h-[42px] pl-[42px] pr-[14px] border border-line-strong rounded-[10px] bg-paper text-ink transition-all focus:outline-none focus:border-ink"
        style={{ boxShadow: 'none' }}
        onFocus={(e) => {
          e.target.style.boxShadow = '0 0 0 3px rgba(10, 37, 64, .08)';
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}

'use client';

import { useState } from 'react';

export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // si falla el clipboard, no hacemos nada visible
    }
  };

  return (
    <>
      <div className="flex-1 bg-bg border border-dashed border-line-strong px-3 py-2 rounded-lg font-mono font-bold text-ink tracking-wider text-sm">
        {code}
      </div>
      <button
        onClick={copy}
        className={`border-none rounded-lg px-3.5 py-2 font-semibold text-[13px] cursor-pointer text-paper transition-colors ${
          copied ? 'bg-good' : 'bg-ink'
        }`}
      >
        {copied ? '¡Copiado!' : 'Copiar'}
      </button>
    </>
  );
}

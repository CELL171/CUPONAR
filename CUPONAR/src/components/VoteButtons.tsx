'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Props {
  promoId: string;
  votesUp: number;
  votesDown: number;
  isLoggedIn: boolean;
}

export function VoteButtons({ promoId, votesUp, votesDown, isLoggedIn }: Props) {
  const router = useRouter();
  const [up, setUp] = useState(votesUp);
  const [down, setDown] = useState(votesDown);
  const [voting, startTransition] = useTransition();
  const [myVote, setMyVote] = useState<'up' | 'down' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const vote = async (kind: 'up' | 'down') => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    if (voting) return;

    setError(null);
    // Optimistic UI
    if (myVote === kind) return; // ya votó así
    if (myVote === 'up' && kind === 'down') {
      setUp((v) => Math.max(0, v - 1));
      setDown((v) => v + 1);
    } else if (myVote === 'down' && kind === 'up') {
      setDown((v) => Math.max(0, v - 1));
      setUp((v) => v + 1);
    } else if (kind === 'up') {
      setUp((v) => v + 1);
    } else {
      setDown((v) => v + 1);
    }
    setMyVote(kind);

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.rpc('vote_promo', {
        p_promo_id: promoId,
        p_vote: kind,
      });
      if (error) {
        setError(error.message);
        // Revertir
        setUp(votesUp);
        setDown(votesDown);
        setMyVote(null);
      }
    });
  };

  return (
    <div className="flex gap-1 text-xs items-center">
      <button
        onClick={() => vote('up')}
        title="Funciona"
        className={`border rounded-md px-2.5 py-1 cursor-pointer text-xs font-medium inline-flex items-center gap-1 transition-all ${
          myVote === 'up'
            ? 'bg-good/10 text-good border-good/30'
            : 'bg-transparent border-line text-ink-soft hover:bg-bg'
        }`}
      >
        👍 {up}
      </button>
      <button
        onClick={() => vote('down')}
        title="No funciona"
        className={`border rounded-md px-2.5 py-1 cursor-pointer text-xs font-medium inline-flex items-center gap-1 transition-all ${
          myVote === 'down'
            ? 'bg-bad/10 text-bad border-bad/30'
            : 'bg-transparent border-line text-ink-soft hover:bg-bg'
        }`}
      >
        👎 {down}
      </button>
      {error && <span className="text-bad text-[11px] ml-1">{error}</span>}
    </div>
  );
}

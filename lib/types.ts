export type PromoType = 'coupon' | 'bank' | 'wallet';

export interface Promo {
  id: string;
  slug: string;
  type: PromoType;
  country: string;
  title: string;
  discount: string | null;
  category: string | null;
  description: string | null;
  expiry: string | null;
  url: string | null;

  store: string | null;
  code: string | null;
  bank: string | null;
  card_type: string | null;
  wallet: string | null;
  day: string | null;

  added_by_email?: string | null;
  added_by_name: string;
  added_at: string;
  votes_up: number;
  votes_down: number;
  status?: 'pending' | 'approved' | 'rejected';
  approved_at?: string | null;
  rejected_reason?: string | null;
}

export interface PromoFilters {
  type: PromoType;
  category: string;
  subFilter: string;
  dayFilter: string;
  search: string;
  showExpired: boolean;
}

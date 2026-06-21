-- ============================================
-- CupónAR · Schema completo
-- Pegá TODO este archivo en Supabase SQL Editor y ejecutalo
-- ============================================

-- Tabla principal de promos
create table if not exists promos (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  type text not null check (type in ('coupon', 'bank', 'wallet')),
  country text not null default 'ar',

  title text not null,
  discount text,
  category text,
  description text,
  expiry date,
  url text,

  -- Específicos por tipo
  store text,
  code text,
  bank text,
  card_type text,
  wallet text,
  day text,

  -- Comunidad
  added_by_email text,
  added_by_name text default 'Anónimo',
  added_at timestamptz default now(),
  votes_up int default 0,
  votes_down int default 0,

  -- Moderación
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  approved_at timestamptz,
  rejected_reason text
);

-- Índices
create index if not exists promos_type_country_status_idx
  on promos(type, country, status);
create index if not exists promos_expiry_idx on promos(expiry) where expiry is not null;
create index if not exists promos_status_idx on promos(status);
create index if not exists promos_added_at_idx on promos(added_at desc);

-- Tabla de votos
create table if not exists promo_votes (
  promo_id uuid references promos(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  vote text not null check (vote in ('up','down')),
  created_at timestamptz default now(),
  primary key (promo_id, user_id)
);

-- ============================================
-- Función para votar de forma atómica
-- ============================================
create or replace function vote_promo(
  p_promo_id uuid,
  p_vote text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_existing text;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Necesitás iniciar sesión para votar';
  end if;

  -- ¿ya votó?
  select vote into v_existing
  from promo_votes
  where promo_id = p_promo_id and user_id = v_user_id;

  if v_existing is null then
    -- voto nuevo
    insert into promo_votes (promo_id, user_id, vote)
    values (p_promo_id, v_user_id, p_vote);

    if p_vote = 'up' then
      update promos set votes_up = votes_up + 1 where id = p_promo_id;
    else
      update promos set votes_down = votes_down + 1 where id = p_promo_id;
    end if;

  elsif v_existing != p_vote then
    -- cambio de voto
    update promo_votes set vote = p_vote, created_at = now()
    where promo_id = p_promo_id and user_id = v_user_id;

    if p_vote = 'up' then
      update promos set votes_up = votes_up + 1, votes_down = greatest(votes_down - 1, 0)
      where id = p_promo_id;
    else
      update promos set votes_down = votes_down + 1, votes_up = greatest(votes_up - 1, 0)
      where id = p_promo_id;
    end if;
  end if;
end;
$$;

-- ============================================
-- Tabla de admins (moderadores)
-- IMPORTANTE: agregá tu propio email acá DESPUÉS de loguearte por primera vez
-- ============================================
create table if not exists admins (
  email text primary key,
  added_at timestamptz default now()
);

-- Función helper para chequear si el usuario actual es admin
create or replace function is_current_user_admin() returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from admins where email = auth.email()
  );
$$;

-- ============================================
-- Row Level Security
-- ============================================
alter table promos enable row level security;
alter table promo_votes enable row level security;
alter table admins enable row level security;

-- Cualquiera puede leer promos aprobadas
drop policy if exists "read approved promos" on promos;
create policy "read approved promos"
  on promos for select
  using (status = 'approved');

-- Usuarios logueados pueden ver sus propias promos pending/rejected
drop policy if exists "read own pending promos" on promos;
create policy "read own pending promos"
  on promos for select
  using (auth.email() = added_by_email);

-- Usuarios logueados pueden insertar (siempre como pending)
drop policy if exists "insert promos" on promos;
create policy "insert promos"
  on promos for insert
  to authenticated
  with check (status = 'pending' and added_by_email = auth.email());

-- Lectura de votos (para saber si ya votó este usuario)
drop policy if exists "read own votes" on promo_votes;
create policy "read own votes"
  on promo_votes for select
  to authenticated
  using (user_id = auth.uid());

-- Los inserts de votos se hacen via la función vote_promo, no directamente.

-- ============================================
-- Policies de admins (moderación)
-- ============================================
drop policy if exists "admins read everything" on promos;
create policy "admins read everything"
  on promos for select
  to authenticated
  using (is_current_user_admin());

drop policy if exists "admins update everything" on promos;
create policy "admins update everything"
  on promos for update
  to authenticated
  using (is_current_user_admin())
  with check (is_current_user_admin());

drop policy if exists "admins read admins" on admins;
create policy "admins read admins"
  on admins for select
  to authenticated
  using (is_current_user_admin());

-- ============================================
-- Vista pública pensada para SEO (slug + datos básicos)
-- ============================================
create or replace view public_promos as
  select id, slug, type, country, title, discount, category, description,
         expiry, url, store, code, bank, card_type, wallet, day,
         added_by_name, added_at, votes_up, votes_down
  from promos
  where status = 'approved';

-- ============================================
-- Permisos (grants)
-- ============================================
-- La vista pública la puede leer cualquiera (anon = no logueado, authenticated = logueado)
grant select on public_promos to anon, authenticated;

-- Los usuarios logueados pueden ejecutar las funciones
grant execute on function vote_promo(uuid, text) to authenticated;
grant execute on function is_current_user_admin() to authenticated;

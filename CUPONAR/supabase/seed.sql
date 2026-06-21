-- ============================================
-- CupónAR · Seed (datos de ejemplo)
-- Corré esto DESPUÉS de schema.sql para tener algunas promos visibles al arrancar.
-- ============================================

insert into promos (slug, type, title, discount, category, description, bank, card_type, day, added_by_name, status, approved_at, votes_up)
values
  ('galicia-supermercados-martes-20', 'bank',
   '20% en supermercados con Galicia los martes',
   '20%', 'Supermercados',
   'Sólo con Tarjeta Galicia Visa o Mastercard. Tope de reintegro $6.000 por semana.',
   'Galicia', 'Crédito', 'Martes',
   'Equipo CupónAR', 'approved', now(), 12),

  ('santander-electrodomesticos-jueves-15', 'bank',
   '15% + cuotas sin interés en electrodomésticos',
   '15%', 'Tecnología',
   'Jueves con Santander. Hasta 6 cuotas sin interés en comercios adheridos.',
   'Santander', 'Crédito', 'Jueves',
   'Equipo CupónAR', 'approved', now(), 19);

insert into promos (slug, type, title, discount, category, description, wallet, day, added_by_name, status, approved_at, votes_up)
values
  ('cuenta-dni-gastronomia-viernes-30', 'wallet',
   '30% de descuento en gastronomía',
   '30%', 'Gastronomía',
   'En restaurantes adheridos de Provincia de Buenos Aires. Tope $2.000 por viernes.',
   'Cuenta DNI', 'Viernes',
   'Equipo CupónAR', 'approved', now(), 28),

  ('modo-combustible-ypf-40', 'wallet',
   '40% en combustible YPF con MODO',
   '40%', 'Combustible',
   'Con bancos adheridos vía MODO. Tope mensual de reintegro $4.000.',
   'MODO', 'Todos los días',
   'Equipo CupónAR', 'approved', now(), 45);

insert into promos (slug, type, title, discount, category, description, store, code, added_by_name, status, approved_at, votes_up)
values
  ('bienvenido25-tienda-ejemplo', 'coupon',
   '25% OFF en primera compra',
   '25%', 'Indumentaria',
   'Sólo usuarios nuevos. No acumulable con otras promociones.',
   'Tienda ejemplo', 'BIENVENIDO25',
   'Equipo CupónAR', 'approved', now(), 8),

  ('envio-gratis-sin-minimo', 'coupon',
   'Envío gratis sin compra mínima',
   'Envío $0', 'Hogar',
   'Válido para CABA y GBA. Por tiempo limitado.',
   'Tienda ejemplo', 'ENVIOGRATIS',
   'Equipo CupónAR', 'approved', now(), 6);

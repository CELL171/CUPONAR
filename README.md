# CupónAR

Agregador de cupones, promos bancarias y descuentos de billeteras digitales para Argentina, con carga colaborativa y moderación.

Stack: **Next.js 15 + React 19 + TypeScript + Tailwind + Supabase**.

---

## Qué incluye

- 🏠 **Home** con feed filtrable por categoría, banco/billetera y día de la semana
- 🔍 **Búsqueda** en tiempo real que ignora tildes
- 📄 **Página individual** por cada promo (`/promo/galicia-20-martes`) con SEO completo, Open Graph y JSON-LD
- 👤 **Login con magic link** (sin contraseñas)
- ➕ **Carga colaborativa**: usuarios logueados cargan promos que quedan pendientes
- 👍👎 **Sistema de votos** comunitarios
- ✅ **Panel de moderación** en `/admin` para aprobar/rechazar
- 🗺️ **Sitemap dinámico** y **robots.txt** generados automáticamente
- 🎨 **Identidad visual** propia: tinta azul + amarillo etiqueta, cards estilo cupón físico

---

## ⚙️ Setup — paso a paso, sin saltearse nada

> Esta guía asume que nunca programaste. No te preocupes, son ~30 minutos.

### 1. Instalá Node.js (la herramienta que corre el proyecto)

1. Andá a [nodejs.org](https://nodejs.org)
2. Bajá la versión **LTS** (la verde, recomendada).
3. Instalá normalmente, siguiente, siguiente, listo.
4. Para verificar: abrí la **PowerShell** de Windows (apretá tecla Windows, escribí "powershell", Enter) y tipeá:
   ```
   node --version
   ```
   Tiene que mostrar algo como `v22.x.x`. Si lo muestra, ✓.

### 2. Creá tu proyecto en Supabase (la base de datos)

1. Andá a [supabase.com](https://supabase.com) y creá cuenta (con GitHub o Google es lo más rápido).
2. Clic en **New project**.
3. Ponele un nombre, por ejemplo `cuponar`.
4. **Anotá la contraseña** que te genera para la base de datos. La vas a necesitar si querés meterte por la línea de comandos algún día.
5. Elegí región **South America (São Paulo)** — es la más cercana a Argentina.
6. Plan: Free. Te alcanza para empezar.
7. Esperá 1-2 minutos a que termine de crear el proyecto.

### 3. Configurá el schema de la base de datos

1. En tu proyecto de Supabase, andá a **SQL Editor** (en el menú lateral, el ícono `< >`).
2. Clic en **New query**.
3. Abrí el archivo `supabase/schema.sql` de este proyecto, copiá **TODO** el contenido, pegalo en el editor.
4. Clic en **Run** (abajo a la derecha) o `Ctrl+Enter`.
5. Si todo salió bien, te dice "Success. No rows returned".

Repetí los pasos 2-5 con `supabase/seed.sql` si querés arrancar con 6 promos de ejemplo.

### 4. Obtené las claves de Supabase

En tu proyecto de Supabase:

1. Andá a **Settings** (engranaje abajo a la izquierda) → **API**.
2. Vas a ver dos cosas que necesitás:
   - **Project URL** — algo tipo `https://abcxyz.supabase.co`
   - **Project API keys** → **anon / public** — una cadena larga que empieza con `eyJ...`
3. Dejá esa pestaña abierta, te toca usarlas en el paso siguiente.

### 5. Configurá la app local

1. Descomprimí el zip de CupónAR en una carpeta, por ejemplo en tu Escritorio.
2. Abrí esa carpeta. Vas a ver un archivo llamado `.env.local.example`.
3. **Hacé una copia** y renombrala a `.env.local` (sin el `.example`).
4. Abrila con el Bloc de notas o cualquier editor de texto.
5. Reemplazá los valores con los de Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://abcxyz.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
6. Guardá y cerrá.

### 6. Instalá las dependencias y corré la app

1. Abrí la PowerShell **dentro de la carpeta del proyecto**. Tip: en el Explorador de Windows, hacé clic derecho en la carpeta tildando shift, y elegí "Abrir terminal" o "Abrir PowerShell aquí".
2. Tipeá:
   ```
   npm install
   ```
   Esto tarda 1-3 minutos. Va a bajar todas las librerías necesarias. Vas a ver mucho texto. Si termina sin errores en rojo, ✓.

3. Cuando termine, tipeá:
   ```
   npm run dev
   ```

4. Vas a ver algo como:
   ```
   ▲ Next.js 15.1.0
   - Local:        http://localhost:3000
   ```

5. Abrí tu navegador y andá a [http://localhost:3000](http://localhost:3000). Si todo salió bien, ves CupónAR andando con las promos de ejemplo. 🎉

> Para frenar la app, en la PowerShell apretá `Ctrl+C`.

### 7. Configurá tu cuenta de admin

Sin admin no podés moderar las promos que carguen los usuarios.

1. En tu app local, clic en **Iniciar sesión**.
2. Poné tu email y clic en **Mandar link**.
3. Revisá tu mail (puede tardar 1 minuto, o estar en spam).
4. Hacé clic en el link. Te redirige a tu CupónAR ya logueado.
5. Ahora en Supabase, **SQL Editor**, ejecutá:
   ```sql
   insert into admins (email) values ('tuemail@gmail.com');
   ```
   (cambiá `tuemail@gmail.com` por el email con el que te logueaste, igual escrito).
6. Refrescá tu CupónAR. Te aparece el botón **Admin** en el header.
7. Cargá una promo de prueba desde `/cargar`, después andá a `/admin` y aprobala. Tiene que aparecer en home.

---

## 🚀 Cómo publicarlo en internet (deploy a Vercel)

Tu app corre en tu compu. Para que cualquiera la pueda ver, hay que subirla a un servidor. Vercel hace esto gratis y es lo más fácil.

### 1. Subí el código a GitHub

1. Creá cuenta en [github.com](https://github.com) si no tenés.
2. Clic en el `+` arriba a la derecha → **New repository**.
3. Nombre: `cuponar`. Privacy: **Private** (por las dudas).
4. **NO** tildes "Add a README". Dale **Create repository**.
5. GitHub te muestra unos comandos. Vos vas a usar otros. En la PowerShell, dentro de tu carpeta del proyecto:
   ```
   git init
   git add .
   git commit -m "Primera versión"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/cuponar.git
   git push -u origin main
   ```
   (reemplazá `TU-USUARIO` por tu usuario real de GitHub)

   La primera vez te va a pedir login de GitHub.

### 2. Deploy a Vercel

1. Creá cuenta en [vercel.com](https://vercel.com) con tu cuenta de GitHub.
2. **Add new...** → **Project**.
3. Buscá tu repo `cuponar` y dale **Import**.
4. En **Environment Variables**, pegá las mismas 3 que pusiste en `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` → acá poné `https://cuponar.vercel.app` (o el dominio que te asigne)
5. Clic en **Deploy**. Tarda 1-2 minutos.
6. Te da una URL tipo `cuponar.vercel.app`. ¡Esa es tu app pública!

### 3. Actualizá Supabase con la URL real

1. En Supabase, **Authentication** → **URL Configuration**.
2. En **Site URL** poné tu URL de Vercel (`https://cuponar.vercel.app`).
3. En **Redirect URLs** agregá `https://cuponar.vercel.app/auth/callback`.
4. Guardá.

> Si después comprás un dominio (ej. `cuponar.com.ar`), lo agregás en Vercel → Domains, y actualizás `NEXT_PUBLIC_SITE_URL` y los redirect URLs.

---

## 🛠️ Tareas que vas a querer hacer

### Cambiar un texto, color o algo visual

- Textos generales (hero, etc.): `src/app/page.tsx`
- Colores: `tailwind.config.ts` (sección `colors`)
- Estilos generales: `src/app/globals.css`

### Agregar una categoría, banco o billetera

Editá `src/lib/catalogs.ts`. Los nuevos valores aparecen automáticamente en filtros y formularios.

### Agregar/quitar un admin

En Supabase SQL Editor:
```sql
-- Agregar
insert into admins (email) values ('otro@email.com');

-- Quitar
delete from admins where email = 'otro@email.com';
```

### Subir cambios después de editar código

```
git add .
git commit -m "Lo que cambiaste"
git push
```

Vercel detecta el push y redeploya solo en ~1 minuto.

---

## 📁 Estructura del proyecto

```
cuponar/
├── src/
│   ├── app/                    # Páginas (Next.js App Router)
│   │   ├── page.tsx            # Home (/)
│   │   ├── promo/[slug]/       # Detalle de promo (/promo/xyz)
│   │   ├── cargar/             # Form de carga (/cargar)
│   │   ├── admin/              # Panel de moderación (/admin)
│   │   ├── login/              # Login con magic link (/login)
│   │   ├── auth/callback/      # Callback de Supabase
│   │   ├── sitemap.ts          # Sitemap.xml dinámico
│   │   ├── robots.ts           # Robots.txt
│   │   ├── layout.tsx          # Layout raíz
│   │   └── globals.css         # Estilos globales
│   ├── components/             # Componentes reutilizables
│   ├── lib/
│   │   ├── supabase/           # Clientes de Supabase
│   │   ├── catalogs.ts         # Listas (categorías, bancos, etc.)
│   │   ├── utils.ts            # Helpers (normalize, slugify, etc.)
│   │   └── types.ts            # Tipos TypeScript
│   └── middleware.ts           # Refresca sesión en cada request
├── supabase/
│   ├── schema.sql              # Schema completo de Postgres
│   └── seed.sql                # Datos de ejemplo
├── public/                     # Archivos estáticos (favicon, etc.)
├── package.json                # Dependencias
└── tailwind.config.ts          # Configuración de colores/fonts
```

---

## 🐛 Solución a problemas comunes

**"npm: el término no se reconoce"**
→ Cerrá la PowerShell y abrila de nuevo. O reiniciá la PC después de instalar Node.

**"Cannot find module ..."**
→ Te falta correr `npm install` dentro de la carpeta del proyecto.

**El login no me llega al mail**
→ Mirá en spam. Si no llega, en Supabase → Authentication → Logs vas a ver el error. El plan free de Supabase tiene un límite de emails por hora.

**Cargo una promo y no aparece**
→ Es correcto: queda en `pending`. Aprobala desde `/admin`.

**No puedo entrar a /admin aunque soy admin**
→ Tu email tiene que estar **idéntico** en la tabla `admins`. Mayúsculas/minúsculas importan. Verificá con:
```sql
select * from admins;
```

**Error 500 en producción pero local anda bien**
→ Probablemente faltan env vars en Vercel. Verificá en Vercel → Settings → Environment Variables.

---

## 🗺️ Roadmap sugerido (lo que sigue después del MVP)

Priorizado por impacto:

1. **Compartir por WhatsApp con un botón directo** en cada promo. En AR, esto es viral.
2. **Sistema de reportar promo vencida** (botón "Esto no funciona más") que mande la promo de vuelta a pending.
3. **Tracking de clicks** en "Ir al sitio" para saber qué promos tienen demanda real.
4. **Notificaciones por email** cuando aprueban tu promo (con Resend o el SMTP de Supabase).
5. **Página por banco/billetera** (`/banco/galicia`, `/billetera/mercado-pago`) — gran SEO.
6. **Etiquetas de "popular" / "nueva" / "por vencer"** en home.
7. **Comentarios en cada promo** ("ojo que es solo para clientes nuevos", "esto vence en realidad el 15").
8. **PWA** (instalable como app en el celular): agregás `manifest.json` + ícono y listo.
9. **Múltiples países**: cuando AR esté saneada, copiás el modelo a Chile/Uruguay.

---

## 📜 Licencia

Tuya. Hacé con esto lo que quieras.

¡Suerte! 🇦🇷

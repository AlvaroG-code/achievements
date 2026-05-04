# 🏆 Guía de instalación — Achievements App

## Qué necesitas
- Cuenta en **GitHub** (gratuita) → github.com
- Cuenta en **Supabase** (gratuita) → supabase.com
- **Node.js** instalado en tu PC → nodejs.org (descarga la versión LTS)

---

## PASO 1 — Crear la base de datos en Supabase

1. Entra en **supabase.com** y crea una cuenta gratuita.
2. Haz clic en **"New project"**. Ponle nombre (ej: `achievements`), elige una región cercana y una contraseña.
3. Espera ~2 minutos a que se cree el proyecto.
4. En el menú lateral ve a **SQL Editor** y ejecuta este comando:

```sql
CREATE TABLE app_storage (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

5. Ve a **Project Settings → API** y copia:
   - **Project URL** → algo como `https://abcdefgh.supabase.co`
   - **anon public key** → una clave larga que empieza por `eyJ...`

---

## PASO 2 — Crear el repositorio en GitHub

1. Entra en **github.com** y crea un repositorio nuevo.
   - Nombre: `achievements` (o el que quieras, pero recuerda cambiarlo en `vite.config.js`)
   - Visibility: **Public** (necesario para GitHub Pages gratuito)
   - No marques ninguna opción extra.

2. En tu PC, abre una terminal en la carpeta del proyecto y ejecuta:

```bash
git init
git add .
git commit -m "primer commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/achievements.git
git push -u origin main
```

---

## PASO 3 — Añadir las claves de Supabase a GitHub

Para que el deploy automático funcione, GitHub necesita saber tus claves:

1. En GitHub, ve a tu repositorio → **Settings → Secrets and variables → Actions**.
2. Haz clic en **"New repository secret"** y añade dos:
   - Nombre: `VITE_SUPABASE_URL` → valor: tu Project URL de Supabase
   - Nombre: `VITE_SUPABASE_ANON_KEY` → valor: tu anon key de Supabase

---

## PASO 4 — Activar GitHub Pages

1. En GitHub, ve a tu repositorio → **Settings → Pages**.
2. En **Source**, selecciona **"GitHub Actions"**.
3. Guarda.

---

## PASO 5 — Primer deploy

Cada vez que hagas push a `main`, GitHub Actions construye y publica la app automáticamente.

Como ya hiciste push en el Paso 2, ve a la pestaña **Actions** de tu repositorio y verás el workflow ejecutándose. En 1-2 minutos tu app estará en:

```
https://TU_USUARIO.github.io/achievements/
```

---

## PASO 6 — Desarrollo local (opcional)

Si quieres editar y ver cambios en tiempo real en tu PC:

1. Crea un archivo `.env.local` en la raíz del proyecto con:
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...tu-clave...
```

2. Instala dependencias y arranca:
```bash
npm install
npm run dev
```

3. Abre `http://localhost:5173` en el navegador.

---

## Estructura del proyecto

```
achievements/
├── src/
│   ├── AchievementDashboard.jsx   ← toda la app
│   └── main.jsx                   ← punto de entrada
├── .github/
│   └── workflows/
│       └── deploy.yml             ← deploy automático
├── index.html
├── vite.config.js                 ← cambia "base" si cambias el nombre del repo
├── package.json
├── .gitignore
└── .env.example                   ← plantilla para tus claves
```

---

## ¿Cómo actualizar la app en el futuro?

Cuando quieras añadir cambios (por ejemplo, que yo te genere una guía nueva hardcodeada):
```bash
git add .
git commit -m "nueva guía"
git push
```
En 1-2 minutos la web se actualiza sola.

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase client ──
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const STORAGE_KEY = "achievement-guides-v1";

async function loadFromStorage() {
  try {
    const { data, error } = await supabase
      .from("app_storage")
      .select("value")
      .eq("key", STORAGE_KEY)
      .single();
    if (error || !data) return null;
    return JSON.parse(data.value);
  } catch {
    return null;
  }
}

async function saveToStorage(guides) {
  try {
    await supabase
      .from("app_storage")
      .upsert({ key: STORAGE_KEY, value: JSON.stringify(guides) }, { onConflict: "key" });
  } catch (err) {
    console.error("Supabase save error:", err);
  }
}

const PLATFORM_COLORS = {
  Steam: { bg: "#1b2838", accent: "#66c0f4", label: "Steam" },
  Epic: { bg: "#0f1923", accent: "#00d4aa", label: "Epic Games" },
  PlayStation: { bg: "#00439c", accent: "#00b4f4", label: "PlayStation" },
  Xbox: { bg: "#107c10", accent: "#52b043", label: "Xbox" },
};

const STATUS_CONFIG = {
  "no-iniciado": { label: "Sin iniciar", color: "#6b7280" },
  "en-progreso": { label: "En progreso", color: "#f59e0b" },
  completado: { label: "Completado", color: "#10b981" },
};

const FF7_GUIDE = {
  id: "ff7-remake-intergrade",
  title: "FF7 Remake Intergrade",
  platform: "Steam",
  genre: "JRPG / Acción",
  difficulty: "Muy difícil — 80-100h",
  status: "no-iniciado",
  date: "Mayo 2026",
  notes: "No hay logros missables permanentes gracias al Chapter Select. En partidas con Chapter Select obtienes x3 XP y AP. Los ítems están DESACTIVADOS en dificultad Difícil: prepara bien la Materia antes de empezar.",
  guideContent: `
<h3>📋 Resumen y hoja de ruta</h3>
<p><strong>Total de logros:</strong> 63 (42 del juego base + 21 del DLC INTERmission)<br>
<strong>Tiempo estimado:</strong> 80–100 horas<br>
<strong>Dificultad:</strong> Alta — requiere al menos 2 partidas completas más limpieza con Chapter Select.</p>
<p>La buena noticia es que <em>ningún logro es permanentemente missable</em>: al terminar el juego por primera vez se desbloquea el Chapter Select, que permite volver a cualquier capítulo conservando todo el progreso (materia, equipamiento, stats, misiones). Además, los capítulos repetidos con Chapter Select dan x3 XP y AP.</p>

<h3>🗺️ Hoja de ruta en 4 fases</h3>
<p><strong>Fase 1 — Primera partida (Normal o fácil):</strong> Disfruta la historia, completa las misiones secundarias que puedas, recoge los 31 Discos de Música y presta atención al logro Dressed to the Nines (los vestidos de Cloud, Tifa y Aerith). Es la fase más tranquila. Puedes obtener unos 35-40 logros aquí.</p>
<p><strong>Fase 2 — Partida en Difícil:</strong> Obligatoria para el logro Hardened Veteran. Los ítems de curación están completamente desactivados, así que la Materia es tu única fuente de curación. Progresa capítulo a capítulo SIN usar Chapter Select entre capítulos (el progreso de Hard no se guarda si no terminas el capítulo entero).</p>
<p><strong>Fase 3 — Limpieza con Chapter Select:</strong> Vestidos restantes de Dressed to the Nines, logros de minijuegos que te hayan quedado pendientes, Intel de combate con Chadley, armas y discos de música que falten. Con x3 AP aprovecha para subir de nivel la Materia.</p>
<p><strong>Fase 4 — DLC INTERmission (Yuffie):</strong> Campaña independiente con sus propios 21 logros. Dura unas 10-15h. También requiere completarla en Difícil para el logro equivalente.</p>

<h3>⚠️ Lo más importante que NO debes ignorar en la Fase 1</h3>
<p><strong>Dressed to the Nines</strong> — Este logro por sí solo obliga a al menos 3 partidas parciales. Los vestidos dependen de qué misiones secundarias hagas:</p>
<ul>
  <li><em>Vestido de Tifa</em> → determinado por las misiones del Capítulo 3 (cuántas haces antes de ir al reactor).</li>
  <li><em>Vestido de Aerith</em> → determinado por las misiones del Capítulo 8 (ayudar o no a los vecinos del Sector 5).</li>
  <li><em>Vestido de Cloud</em> → determinado por las decisiones del Capítulo 9 en Wall Market (qué minijuegos haces para Don Corneo).</li>
</ul>
<p>Planifica desde el principio qué combinación hacer en cada partida para no necesitar una cuarta vuelta.</p>

<h3>🔥 Consejos clave para la dificultad Difícil</h3>
<ul>
  <li><strong>Materia de Curación al máximo</strong> — Sube Cura, Revivir y Oración antes de empezar. Sin ítems, el MP es lo único que te mantiene vivo.</li>
  <li><strong>Materia MP Up al máximo</strong> — Más MP inicial al comenzar cada capítulo. Imprescindible.</li>
  <li><strong>Materia Magnificar + Curación</strong> — Cura a todo el grupo de una vez gastando solo el MP de una cura. Se obtiene en el Capítulo 9.</li>
  <li><strong>Materia Podómetro</strong> — Equípala y camina 5.000 pasos para transformarla en AP Up.</li>
</ul>
  `,
  achievements: [
    { id: "a01", name: "Master of Fate", desc: "Conseguir todos los logros del juego (platino)", type: "Platino", done: false },
    { id: "a02", name: "Onetime Gig", desc: "Completar el Capítulo 1 — Reactor Mako 1, derrotar al Centinela Escorpión", type: "Historia", done: false },
    { id: "a03", name: "Escape Artist", desc: "Completar el Capítulo 2 — Huida por los túneles, llegar al tren", type: "Historia", done: false },
    { id: "a04", name: "Mercenary Endeavors", desc: "Completar el Capítulo 3 — Sector 7 Slums, conocer a Avalanche", type: "Historia", done: false },
    { id: "a05", name: "Night on the Town", desc: "Completar el Capítulo 4 — Los Espectros, llegar a la estación de tren", type: "Historia", done: false },
    { id: "a06", name: "Plan E", desc: "Completar el Capítulo 5 — Vías del tren, derrotar al Cangrejo Guardián", type: "Historia", done: false },
    { id: "a07", name: "Lights Out", desc: "Completar el Capítulo 6 — Apagar las lámparas solares y encontrar a Biggs", type: "Historia", done: false },
    { id: "a08", name: "Trapped like Sewer Rats", desc: "Completar el Capítulo 7 — Reactor Mako 5, derrotar al Fusilador de Aire", type: "Historia", done: false },
    { id: "a09", name: "Reunited", desc: "Completar el Capítulo 8 — Conocer a Aerith, escapar de su casa", type: "Historia", done: false },
    { id: "a10", name: "Never the Bride", desc: "Completar el Capítulo 9 — Wall Market, la mansión de Don Corneo", type: "Historia", done: false },
    { id: "a11", name: "Sewer Survivor", desc: "Completar el Capítulo 10 — Las cloacas, derrotar a Abzu", type: "Historia", done: false },
    { id: "a12", name: "Paranormal Investigator", desc: "Completar el Capítulo 11", type: "Historia", done: false },
    { id: "a13", name: "The Collapse", desc: "Completar el Capítulo 12", type: "Historia", done: false },
    { id: "a14", name: "Broken Dreams", desc: "Completar el Capítulo 13", type: "Historia", done: false },
    { id: "a15", name: "Picking Up the Pieces", desc: "Completar el Capítulo 14 — Sector 5 y casa de Aerith", type: "Historia", done: false },
    { id: "a16", name: "The Pizza in the Sky", desc: "Completar el Capítulo 15 — Torre Shin-Ra", type: "Historia", done: false },
    { id: "a17", name: "No Appointment Needed", desc: "Completar el Capítulo 16 — Palacio del Presidente", type: "Historia", done: false },
    { id: "a18", name: "Emerging from Chaos", desc: "Completar el Capítulo 17 — Laboratorios de Hojo", type: "Historia", done: false },
    { id: "a19", name: "Destiny's Crossroads", desc: "Completar el Capítulo 18 — Derrotar a Sephiroth por primera vez", type: "Historia", done: false },
    { id: "a20", name: "Staggering Feat", desc: "Aumentar el multiplicador de daño de Stagger hasta el 300% en un combate", type: "Combate", done: false },
    { id: "a21", name: "Summon Slayer", desc: "Derrotar a todos los invocados en los desafíos de Chadley", type: "Combate", done: false },
    { id: "a22", name: "Intelligence Agent", desc: "Completar todos los 26 Battle Reports de Chadley", type: "Progresión", done: false },
    { id: "a23", name: "Weapons Expert", desc: "Conseguir todas las armas del juego (6 por cada personaje)", type: "Progresión", done: false },
    { id: "a24", name: "Building Character", desc: "Aprender todas las habilidades de arma de todos los personajes", type: "Progresión", done: false },
    { id: "a25", name: "Disc Jockey", desc: "Recoger los 31 Discos de Música del juego (todos los capítulos)", type: "Coleccionable", done: false },
    { id: "a26", name: "Dressed to the Nines", desc: "Ver los 9 vestidos de Cloud, Tifa y Aerith — requiere 3+ partidas o replays", type: "Coleccionable", done: false },
    { id: "a27", name: "Heavenly Dart Player", desc: "Cap.3 — Conseguir 180+ puntos en dardos en el bar de Tifa", type: "Minijuego", done: false },
    { id: "a28", name: "Biker Boy", desc: "Cap.4 — Conseguir 80.000+ puntos en el minijuego de la moto", type: "Minijuego", done: false },
    { id: "a29", name: "Sultan of Squat", desc: "Cap.9 — Ganar al entrenador en el concurso de sentadillas", type: "Minijuego", done: false },
    { id: "a30", name: "Dancing Queen", desc: "Cap.9 — Conseguir puntuación perfecta en el baile con Andrea Rhodea", type: "Minijuego", done: false },
    { id: "a31", name: "Hardened Veteran", desc: "Completar el Capítulo 18 en Difícil — derrotar a Sephiroth en su forma final", type: "Difícil", done: false },
    { id: "a32", name: "Ultimate Weapon", desc: "Cap.17 en Difícil — Derrotar al Arma Suprema en el simulador VR de Hojo", type: "Difícil", done: false },
    { id: "b01", name: "Fledgling Ninja", desc: "DLC — Completar el Capítulo 1 de INTERmission con Yuffie", type: "DLC Yuffie", done: false },
    { id: "b02", name: "Hard-Boiled", desc: "DLC — Completar INTERmission completa en dificultad Difícil", type: "DLC Difícil", done: false },
  ]
};

const DEFAULT_GUIDES = [FF7_GUIDE];

const COVER_GRADIENTS = [
  ["#1a1a2e","#16213e","#0f3460"],
  ["#1a0a00","#2d1500","#4a1c00"],
  ["#0a1a0a","#0d2d0d","#0f4a0f"],
  ["#1a001a","#2d002d","#4a004a"],
  ["#001a1a","#002d2d","#004a4a"],
  ["#1a1000","#2d1c00","#4a3000"],
  ["#0a0a1a","#16162d","#1e1e4a"],
  ["#1a000a","#2d0016","#4a0022"],
];

function getCoverGradient(id) {
  const idx = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % COVER_GRADIENTS.length;
  const [c1, c2, c3] = COVER_GRADIENTS[idx];
  return `linear-gradient(135deg, ${c1}, ${c2}, ${c3})`;
}

const AI_SYSTEM_PROMPT = `Eres un experto en videojuegos y guías de logros/trofeos. Genera una guía completa de logros en español para el videojuego indicado.

RESPONDE ÚNICAMENTE con un objeto JSON válido. Sin backticks, sin markdown, sin texto adicional. Solo el objeto JSON puro y nada más.

Estructura exacta:
{
  "id": "slug-corto-del-juego",
  "title": "Nombre Completo del Juego",
  "platform": "Steam",
  "genre": "Género1 / Género2",
  "difficulty": "Nivel de dificultad — Xh estimadas",
  "status": "no-iniciado",
  "date": "Mayo 2026",
  "notes": "2-3 frases con advertencias clave, logros missables o consejos críticos.",
  "guideContent": "HTML RICO con mínimo 8 secciones h3 con emojis, párrafos detallados, listas ul/li. Cubre: resumen, hoja de ruta por fases, logros de historia, coleccionables, logros de combate, consejos para dificultad máxima, extras. Muy detallado y útil.",
  "achievements": [
    {"id": "a01", "name": "Nombre del Logro", "desc": "Descripción precisa de cómo obtenerlo y dónde", "type": "Historia", "done": false}
  ]
}

Tipos válidos para achievements: Historia, Combate, Coleccionable, Minijuego, Exploración, Progresión, Platino, Difícil, Secundario, DLC.
Incluye entre 25 y 45 logros reales del juego en el array achievements.
El guideContent debe ser HTML válido con etiquetas h3, p, ul, li, strong, em.`;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0a; --surface: #111111; --surface2: #1a1a1a;
    --border: rgba(255,255,255,0.07); --text: #f0f0f0; --text-muted: #6b7280;
    --accent: #e8ff47; --accent-dim: rgba(232,255,71,0.12);
    --font-display: 'Bebas Neue', sans-serif; --font-body: 'DM Sans', sans-serif;
    --radius: 12px; --radius-lg: 18px;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
  .app { min-height: 100vh; background: var(--bg); position: relative; overflow-x: hidden; }
  .noise-overlay {
    pointer-events: none; position: fixed; inset: 0; opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 180px; z-index: 0;
  }
  .header {
    border-bottom: 1px solid var(--border); padding: 0 2.5rem;
    display: flex; align-items: center; justify-content: space-between;
    height: 68px; position: sticky; top: 0;
    background: rgba(10,10,10,0.92); backdrop-filter: blur(12px); z-index: 50;
  }
  .header-logo { display: flex; align-items: baseline; gap: 6px; }
  .logo-jp { font-family: var(--font-body); font-size: 1.1rem; font-weight: 300; color: var(--accent); letter-spacing: 0.02em; line-height: 1; }
  .logo-main { font-family: var(--font-display); font-size: 1.9rem; letter-spacing: 0.05em; color: var(--text); line-height: 1; }
  .logo-sub { font-family: var(--font-display); font-size: 1.9rem; color: var(--accent); line-height: 1; }
  .header-badge { font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); border: 1px solid var(--border); padding: 4px 10px; border-radius: 100px; }
  .header-actions { display: flex; gap: 8px; align-items: center; }
  .btn-ai { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 100px; border: 1px solid var(--accent); background: var(--accent-dim); color: var(--accent); font-family: var(--font-body); font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s; letter-spacing: 0.04em; }
  .btn-ai:hover { background: var(--accent); color: #0a0a0a; }
  .btn-import { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 100px; border: 1px solid var(--border); background: transparent; color: var(--text-muted); font-family: var(--font-body); font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s; letter-spacing: 0.04em; }
  .btn-import:hover { border-color: rgba(255,255,255,0.2); color: var(--text); }
  .main { max-width: 1100px; margin: 0 auto; padding: 3rem 2.5rem 4rem; position: relative; z-index: 1; }
  .section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 2rem; }
  .section-title { font-family: var(--font-display); font-size: 3rem; letter-spacing: 0.04em; line-height: 1; color: var(--text); }
  .section-title em { color: var(--accent); font-style: normal; }
  .guide-count { font-size: 13px; color: var(--text-muted); font-weight: 300; padding-bottom: 6px; }
  .filters { display: flex; gap: 8px; margin-bottom: 2rem; flex-wrap: wrap; }
  .filter-btn { padding: 7px 16px; border-radius: 100px; border: 1px solid var(--border); background: transparent; color: var(--text-muted); font-family: var(--font-body); font-size: 13px; cursor: pointer; transition: all 0.15s; }
  .filter-btn:hover { border-color: rgba(255,255,255,0.2); color: var(--text); }
  .filter-btn.active { background: var(--accent); color: #0a0a0a; border-color: var(--accent); font-weight: 500; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; cursor: pointer; transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; animation: fadeUp 0.4s ease both; }
  .card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.15); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .card-cover { height: 140px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .card-cover-pattern { position: absolute; inset: 0; opacity: 0.15; background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px); }
  .card-cover-title { font-family: var(--font-display); font-size: 1.8rem; letter-spacing: 0.06em; text-align: center; padding: 0 1rem; line-height: 1.1; z-index: 1; text-shadow: 0 2px 12px rgba(0,0,0,0.6); color: #fff; }
  .card-platform-badge { position: absolute; top: 10px; right: 10px; font-size: 10px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 9px; border-radius: 100px; z-index: 2; backdrop-filter: blur(8px); background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.15); color: #fff; }
  .card-status-dot { position: absolute; bottom: 10px; left: 10px; display: flex; align-items: center; gap: 5px; z-index: 2; font-size: 10px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; padding: 3px 9px; border-radius: 100px; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.12); }
  .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .card-body { padding: 1rem 1.25rem 1.25rem; display: flex; flex-direction: column; gap: 8px; flex: 1; }
  .card-name { font-weight: 500; font-size: 15px; color: var(--text); line-height: 1.3; }
  .card-meta { display: flex; align-items: center; gap: 12px; font-size: 12px; color: var(--text-muted); }
  .card-footer { margin-top: auto; padding-top: 10px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .card-date { font-size: 11px; color: var(--text-muted); font-weight: 300; }
  .card-arrow { font-size: 14px; color: var(--accent); transition: transform 0.15s; }
  .card:hover .card-arrow { transform: translateX(3px); }
  .progress-bar-outer { height: 3px; background: rgba(255,255,255,0.07); border-radius: 100px; overflow: hidden; margin-top: 6px; }
  .progress-bar-inner { height: 100%; background: var(--accent); border-radius: 100px; transition: width 0.4s ease; }
  .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .stat-card { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px 16px; display: flex; flex-direction: column; gap: 4px; }
  .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); font-weight: 500; }
  .stat-value { font-family: var(--font-display); font-size: 1.6rem; letter-spacing: 0.04em; color: var(--text); }
  .stat-value.accent { color: var(--accent); }
  .search-bar { display: flex; align-items: center; gap: 10px; background: var(--surface); border: 1px solid var(--border); border-radius: 100px; padding: 8px 16px; margin-bottom: 1.5rem; transition: border-color 0.15s; }
  .search-bar:focus-within { border-color: rgba(255,255,255,0.2); }
  .search-input { background: transparent; border: none; outline: none; color: var(--text); font-family: var(--font-body); font-size: 14px; flex: 1; }
  .search-input::placeholder { color: var(--text-muted); }
  .search-icon { color: var(--text-muted); font-size: 14px; }
  .detail-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(6px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1.5rem; animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .detail-panel { background: var(--surface); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-lg); width: 100%; max-width: 720px; max-height: 88vh; overflow-y: auto; animation: slideUp 0.25s ease; }
  @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .detail-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 1.5rem; border-bottom: 1px solid var(--border); gap: 1rem; }
  .detail-header-left { display: flex; flex-direction: column; gap: 6px; }
  .detail-game-title { font-family: var(--font-display); font-size: 2rem; letter-spacing: 0.04em; color: var(--text); line-height: 1; }
  .detail-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .tag { font-size: 11px; padding: 3px 10px; border-radius: 100px; border: 1px solid var(--border); color: var(--text-muted); font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; }
  .tag.accent { border-color: rgba(232,255,71,0.3); color: var(--accent); background: var(--accent-dim); }
  .close-btn { background: var(--surface2); border: 1px solid var(--border); color: var(--text-muted); width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; }
  .close-btn:hover { color: var(--text); border-color: rgba(255,255,255,0.2); }
  .detail-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
  .detail-section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-muted); font-weight: 500; margin-bottom: 0.75rem; }
  .status-selector { display: flex; gap: 6px; }
  .status-opt { flex: 1; padding: 8px; border-radius: var(--radius); border: 1px solid var(--border); background: transparent; color: var(--text-muted); font-family: var(--font-body); font-size: 12px; cursor: pointer; text-align: center; transition: all 0.15s; font-weight: 500; }
  .status-opt:hover { border-color: rgba(255,255,255,0.15); }
  .status-opt.selected { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }
  .guide-content { font-size: 14px; color: rgba(240,240,240,0.8); line-height: 1.8; font-weight: 300; }
  .guide-content h3 { font-family: var(--font-display); font-size: 1.3rem; letter-spacing: 0.04em; color: var(--accent); margin: 1.5rem 0 0.5rem; font-weight: 400; }
  .guide-content h3:first-child { margin-top: 0; }
  .guide-content p { margin-bottom: 0.75rem; }
  .guide-content ul { padding-left: 1.2rem; margin-bottom: 0.75rem; }
  .guide-content li { margin-bottom: 0.3rem; }
  .guide-content strong { color: var(--text); font-weight: 500; }
  .guide-content em { color: var(--accent); font-style: normal; }
  .note-box { background: var(--accent-dim); border: 1px solid rgba(232,255,71,0.2); border-radius: var(--radius); padding: 12px 16px; font-size: 13px; color: var(--accent); line-height: 1.6; }
  .achievement-list { display: flex; flex-direction: column; gap: 6px; }
  .achievement-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--surface2); border-radius: var(--radius); border: 1px solid var(--border); transition: border-color 0.15s; cursor: pointer; }
  .achievement-item:hover { border-color: rgba(255,255,255,0.15); }
  .achievement-check { width: 22px; height: 22px; border-radius: 6px; border: 1.5px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; font-size: 12px; }
  .achievement-check.done { background: var(--accent); border-color: var(--accent); color: #0a0a0a; font-weight: 700; }
  .achievement-name { font-size: 14px; color: var(--text); flex: 1; line-height: 1.3; }
  .achievement-name.done { color: var(--text-muted); text-decoration: line-through; }
  .achievement-type { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap; }
  .ach-filter-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
  .ach-filter { padding: 4px 12px; border-radius: 100px; border: 1px solid var(--border); background: transparent; color: var(--text-muted); font-family: var(--font-body); font-size: 11px; cursor: pointer; transition: all 0.12s; }
  .ach-filter:hover { border-color: rgba(255,255,255,0.2); color: var(--text); }
  .ach-filter.active { background: rgba(255,255,255,0.08); color: var(--text); border-color: rgba(255,255,255,0.25); }

  /* ===== MODALES ===== */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(8px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1.5rem; animation: fadeIn 0.2s ease; }
  .modal-panel { background: var(--surface); border: 1px solid rgba(255,255,255,0.12); border-radius: var(--radius-lg); width: 100%; max-width: 560px; animation: slideUp 0.25s ease; overflow: hidden; }
  .modal-header { padding: 1.5rem 1.5rem 1rem; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; justify-content: space-between; }
  .modal-title { font-family: var(--font-display); font-size: 1.8rem; letter-spacing: 0.04em; color: var(--text); }
  .modal-subtitle { font-size: 13px; color: var(--text-muted); margin-top: 4px; font-weight: 300; }
  .modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.2rem; }
  .modal-footer { padding: 1rem 1.5rem; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; }
  .field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); font-weight: 500; margin-bottom: 6px; }
  .field-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); padding: 10px 14px; color: var(--text); font-family: var(--font-body); font-size: 14px; outline: none; transition: border-color 0.15s; }
  .field-input:focus { border-color: rgba(255,255,255,0.2); }
  .field-input::placeholder { color: var(--text-muted); }
  .field-textarea { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); padding: 10px 14px; color: var(--text); font-family: var(--font-mono, monospace); font-size: 12px; outline: none; transition: border-color 0.15s; resize: vertical; min-height: 180px; line-height: 1.5; }
  .field-textarea:focus { border-color: rgba(255,255,255,0.2); }
  .platform-selector { display: flex; gap: 8px; flex-wrap: wrap; }
  .platform-opt { padding: 6px 14px; border-radius: 100px; border: 1px solid var(--border); background: transparent; color: var(--text-muted); font-family: var(--font-body); font-size: 12px; cursor: pointer; transition: all 0.15s; }
  .platform-opt.selected { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }
  .btn-primary { padding: 9px 20px; border-radius: 100px; border: none; background: var(--accent); color: #0a0a0a; font-family: var(--font-body); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; }
  .btn-primary:hover { background: #d4eb3d; }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-secondary { padding: 9px 20px; border-radius: 100px; border: 1px solid var(--border); background: transparent; color: var(--text-muted); font-family: var(--font-body); font-size: 13px; cursor: pointer; transition: all 0.15s; }
  .btn-secondary:hover { border-color: rgba(255,255,255,0.2); color: var(--text); }
  .btn-danger { padding: 9px 20px; border-radius: 100px; border: 1px solid rgba(239,68,68,0.3); background: rgba(239,68,68,0.1); color: #ef4444; font-family: var(--font-body); font-size: 13px; cursor: pointer; transition: all 0.15s; }
  .btn-danger:hover { background: rgba(239,68,68,0.2); }
  .error-msg { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: var(--radius); padding: 10px 14px; font-size: 13px; color: #ef4444; line-height: 1.5; }
  .success-msg { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: var(--radius); padding: 10px 14px; font-size: 13px; color: #10b981; line-height: 1.5; }
  .loading-box { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 2rem 1rem; }
  .loading-spinner { width: 40px; height: 40px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { font-size: 14px; color: var(--text-muted); text-align: center; line-height: 1.6; }
  .loading-text strong { color: var(--accent); font-weight: 500; }
  .preview-box { background: var(--surface2); border: 1px solid rgba(232,255,71,0.2); border-radius: var(--radius); padding: 14px 16px; }
  .preview-title { font-family: var(--font-display); font-size: 1.4rem; letter-spacing: 0.04em; color: var(--text); margin-bottom: 6px; }
  .preview-meta { display: flex; gap: 8px; flex-wrap: wrap; }
  .preview-tag { font-size: 11px; padding: 2px 8px; border-radius: 100px; border: 1px solid var(--border); color: var(--text-muted); }
  .delete-btn { margin-left: auto; padding: 4px 10px; border-radius: 100px; border: 1px solid rgba(239,68,68,0.25); background: transparent; color: rgba(239,68,68,0.6); font-family: var(--font-body); font-size: 11px; cursor: pointer; transition: all 0.15s; }
  .delete-btn:hover { border-color: rgba(239,68,68,0.5); color: #ef4444; background: rgba(239,68,68,0.08); }
  .import-hint { font-size: 12px; color: var(--text-muted); line-height: 1.6; padding: 10px 14px; background: var(--surface2); border-radius: var(--radius); border: 1px solid var(--border); }
  .import-hint code { color: var(--accent); font-family: monospace; font-size: 11px; }
`;

export default function AchievementDashboard() {
  const [guides, setGuides] = useState([]);
  const [storageReady, setStorageReady] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [achFilter, setAchFilter] = useState("Todos");

  // Modal IA
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiStep, setAiStep] = useState("form"); // "form" | "loading" | "preview"
  const [aiGameName, setAiGameName] = useState("");
  const [aiPlatform, setAiPlatform] = useState("Steam");
  const [aiError, setAiError] = useState("");
  const [generatedGuide, setGeneratedGuide] = useState(null);

  // Modal Importar
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");

  // Carga inicial desde window.storage
  useEffect(() => {
    loadFromStorage().then(saved => {
      if (saved && Array.isArray(saved) && saved.length > 0) {
        setGuides(saved);
      } else {
        setGuides(DEFAULT_GUIDES);
      }
      setStorageReady(true);
    });
  }, []);

  // Guarda cada vez que cambian las guías (solo tras la carga inicial)
  useEffect(() => {
    if (storageReady) {
      saveToStorage(guides);
    }
  }, [guides, storageReady]);

  const updateStatus = (id, status) => {
    setGuides(gs => gs.map(g => g.id === id ? { ...g, status } : g));
    if (selected?.id === id) setSelected(s => ({ ...s, status }));
  };

  const toggleAchievement = (guideId, achId) => {
    setGuides(gs => gs.map(g => {
      if (g.id !== guideId) return g;
      return { ...g, achievements: g.achievements.map(a => a.id === achId ? { ...a, done: !a.done } : a) };
    }));
    if (selected?.id === guideId) {
      setSelected(s => ({ ...s, achievements: s.achievements.map(a => a.id === achId ? { ...a, done: !a.done } : a) }));
    }
  };

  const deleteGuide = (guideId) => {
    setGuides(gs => gs.filter(g => g.id !== guideId));
    setSelected(null);
  };

  const openGuide = (guide) => {
    const current = guides.find(g => g.id === guide.id) || guide;
    setSelected(current);
    setAchFilter("Todos");
  };

  // ===== GENERADOR IA =====
  const openAIModal = () => {
    setAiStep("form");
    setAiGameName("");
    setAiPlatform("Steam");
    setAiError("");
    setGeneratedGuide(null);
    setShowAIModal(true);
  };

  const generateGuide = async () => {
    if (!aiGameName.trim()) { setAiError("Escribe el nombre del juego."); return; }
    setAiError("");
    setAiStep("loading");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8000,
          system: AI_SYSTEM_PROMPT,
          messages: [{
            role: "user",
            content: `Crea una guía completa de logros/trofeos para el videojuego: "${aiGameName.trim()}" en la plataforma ${aiPlatform}. La guía debe ser muy detallada, en español, con todos los logros reales del juego.`
          }]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `Error ${response.status}`);
      }

      const rawText = data.content
        .filter(b => b.type === "text")
        .map(b => b.text)
        .join("");

      // Limpiar posibles backticks de markdown
      const cleaned = rawText
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/, "")
        .trim();

      const guide = JSON.parse(cleaned);

      // Normalizar
      guide.platform = aiPlatform;
      guide.status = guide.status || "no-iniciado";
      guide.achievements = (guide.achievements || []).map((a, i) => ({
        ...a,
        id: a.id || `gen-${i.toString().padStart(3, "0")}`,
        done: false
      }));

      setGeneratedGuide(guide);
      setAiStep("preview");
    } catch (err) {
      setAiError(`Error al generar: ${err.message}`);
      setAiStep("form");
    }
  };

  const confirmAddGuide = () => {
    if (!generatedGuide) return;
    const exists = guides.find(g => g.id === generatedGuide.id);
    if (exists) {
      generatedGuide.id = generatedGuide.id + "-" + Date.now();
    }
    setGuides(gs => [...gs, generatedGuide]);
    setShowAIModal(false);
    setGeneratedGuide(null);
  };

  // ===== IMPORTAR JSON =====
  const openImportModal = () => {
    setImportText("");
    setImportError("");
    setImportSuccess("");
    setShowImportModal(true);
  };

  const importGuide = () => {
    setImportError("");
    setImportSuccess("");
    try {
      const cleaned = importText
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      // Soporte para array o objeto único
      const toImport = Array.isArray(parsed) ? parsed : [parsed];

      if (toImport.length === 0) throw new Error("El JSON está vacío.");

      toImport.forEach((g, idx) => {
        if (!g.id) throw new Error(`El item ${idx + 1} no tiene campo "id".`);
        if (!g.title) throw new Error(`El item ${idx + 1} no tiene campo "title".`);
      });

      const normalized = toImport.map(g => ({
        ...g,
        status: g.status || "no-iniciado",
        platform: g.platform || "Steam",
        achievements: (g.achievements || []).map((a, i) => ({
          ...a,
          id: a.id || `imp-${i.toString().padStart(3, "0")}`,
          done: a.done || false
        }))
      }));

      setGuides(gs => {
        const existingIds = new Set(gs.map(g => g.id));
        const newGuides = normalized.map(g => ({
          ...g,
          id: existingIds.has(g.id) ? g.id + "-" + Date.now() : g.id
        }));
        return [...gs, ...newGuides];
      });

      setImportSuccess(`✓ ${toImport.length} guía${toImport.length > 1 ? "s" : ""} importada${toImport.length > 1 ? "s" : ""} correctamente.`);
      setTimeout(() => setShowImportModal(false), 1200);
    } catch (err) {
      setImportError(`JSON inválido: ${err.message}`);
    }
  };

  const filters = [
    { key: "all", label: "Todas" },
    { key: "no-iniciado", label: "Sin iniciar" },
    { key: "en-progreso", label: "En progreso" },
    { key: "completado", label: "Completado" },
  ];

  const filtered = guides.filter(g => {
    const matchFilter = filter === "all" || g.status === filter;
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const completedCount = guides.filter(g => g.status === "completado").length;
  const inProgressCount = guides.filter(g => g.status === "en-progreso").length;

  const achTypes = selected?.achievements?.length
    ? ["Todos", ...Array.from(new Set(selected.achievements.map(a => a.type).filter(Boolean)))]
    : ["Todos"];
  const visibleAchs = selected?.achievements?.filter(a => achFilter === "Todos" || a.type === achFilter) || [];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="noise-overlay" />

        {/* Pantalla de carga inicial */}
        {!storageReady && (
          <div style={{ position: "fixed", inset: 0, background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", zIndex: 999 }}>
            <div className="loading-spinner" />
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", letterSpacing: "0.08em", color: "var(--text-muted)" }}>CARGANDO GUÍAS...</div>
          </div>
        )}

        <header className="header">
          <div className="header-logo">
            <span className="logo-jp">アルバロ</span>
            <span className="logo-main">&nbsp;ACHIEVE</span>
            <span className="logo-sub">MENTS</span>
          </div>
          <div className="header-actions">
            <span className="header-badge">{guides.length} guías</span>
            <span className="header-badge" style={{ color: "#10b981", borderColor: "rgba(16,185,129,0.3)" }}>
              {completedCount} completados
            </span>
            <span className="header-badge" style={{ color: "#6b7280", borderColor: "rgba(107,114,128,0.3)", fontSize: "10px" }} title="Datos guardados en Supabase">
              ☁ Guardado
            </span>
            <button className="btn-import" onClick={openImportModal}>↑ Importar JSON</button>
            <button className="btn-ai" onClick={openAIModal}>✦ Generar con IA</button>
          </div>
        </header>

        <main className="main">
          <div className="section-header">
            <h2 className="section-title">MIS<br /><em>GUÍAS</em></h2>
            <p className="guide-count">{filtered.length} {filtered.length === 1 ? "guía" : "guías"} {filter !== "all" ? "filtradas" : "en total"}</p>
          </div>

          <div className="stats-row" style={{ marginBottom: "2rem" }}>
            <div className="stat-card">
              <span className="stat-label">Total guías</span>
              <span className="stat-value">{guides.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Completados</span>
              <span className="stat-value accent">{completedCount}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">En progreso</span>
              <span className="stat-value" style={{ color: "#f59e0b" }}>{inProgressCount}</span>
            </div>
          </div>

          <div className="search-bar">
            <span className="search-icon">⌕</span>
            <input className="search-input" placeholder="Buscar guía..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="filters">
            {filters.map(f => (
              <button key={f.key} className={`filter-btn ${filter === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid">
            {filtered.map((guide, i) => {
              const status = STATUS_CONFIG[guide.status] || STATUS_CONFIG["no-iniciado"];
              const platform = PLATFORM_COLORS[guide.platform] || PLATFORM_COLORS.Steam;
              const doneCount = guide.achievements?.filter(a => a.done).length || 0;
              const totalCount = guide.achievements?.length || 0;
              const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
              return (
                <div key={guide.id} className="card" style={{ animationDelay: `${i * 0.06}s` }} onClick={() => openGuide(guide)}>
                  <div className="card-cover" style={{ background: getCoverGradient(guide.id) }}>
                    <div className="card-cover-pattern" />
                    <div className="card-cover-title">{guide.title}</div>
                    <div className="card-platform-badge" style={{ color: platform.accent }}>{platform.label}</div>
                    <div className="card-status-dot">
                      <div className="dot" style={{ background: status.color }} />
                      <span style={{ color: status.color }}>{status.label}</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="card-name">{guide.title}</div>
                    <div className="card-meta">
                      {totalCount > 0 && <span>{doneCount}/{totalCount} logros · {pct}%</span>}
                      {guide.genre && <span style={{ color: "#6b7280" }}>{guide.genre}</span>}
                    </div>
                    {totalCount > 0 && (
                      <div className="progress-bar-outer">
                        <div className="progress-bar-inner" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                    <div className="card-footer">
                      <span className="card-date">{guide.date}</span>
                      <span className="card-arrow">→</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* ===== PANEL DETALLE ===== */}
        {selected && (
          <div className="detail-overlay" onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
            <div className="detail-panel">
              <div className="detail-header">
                <div className="detail-header-left">
                  <div className="detail-game-title">{selected.title}</div>
                  <div className="detail-tags">
                    <span className="tag">{selected.platform || "Steam"}</span>
                    {selected.genre && <span className="tag">{selected.genre}</span>}
                    {selected.difficulty && <span className="tag accent">{selected.difficulty}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <button
                    className="delete-btn"
                    onClick={() => { if (confirm(`¿Eliminar la guía de "${selected.title}"?`)) deleteGuide(selected.id); }}
                  >
                    🗑 Eliminar
                  </button>
                  <button className="close-btn" onClick={() => setSelected(null)}>×</button>
                </div>
              </div>

              <div className="detail-body">
                <div>
                  <p className="detail-section-title">Estado personal</p>
                  <div className="status-selector">
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                      <button key={k} className={`status-opt ${selected.status === k ? "selected" : ""}`} onClick={() => updateStatus(selected.id, k)}>
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                {selected.guideContent && (
                  <div>
                    <p className="detail-section-title">Guía completa de logros</p>
                    <div className="guide-content" dangerouslySetInnerHTML={{ __html: selected.guideContent }} />
                  </div>
                )}

                {selected.achievements?.length > 0 && (
                  <div>
                    <p className="detail-section-title">
                      Checklist de logros — {selected.achievements.filter(a => a.done).length}/{selected.achievements.length} ({Math.round(selected.achievements.filter(a => a.done).length / selected.achievements.length * 100)}%)
                    </p>
                    <div className="ach-filter-row">
                      {achTypes.map(t => (
                        <button key={t} className={`ach-filter ${achFilter === t ? "active" : ""}`} onClick={() => setAchFilter(t)}>{t}</button>
                      ))}
                    </div>
                    <div className="achievement-list">
                      {visibleAchs.map(ach => (
                        <div key={ach.id} className="achievement-item" onClick={() => toggleAchievement(selected.id, ach.id)}>
                          <div className={`achievement-check ${ach.done ? "done" : ""}`}>{ach.done && "✓"}</div>
                          <div style={{ flex: 1 }}>
                            <div className={`achievement-name ${ach.done ? "done" : ""}`}>{ach.name}</div>
                            {ach.desc && <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{ach.desc}</div>}
                          </div>
                          {ach.type && <span className="achievement-type">{ach.type}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selected.notes && (
                  <div className="note-box">📝 <strong>Notas importantes:</strong> {selected.notes}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== MODAL GENERADOR IA ===== */}
        {showAIModal && (
          <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget && aiStep !== "loading") setShowAIModal(false); }}>
            <div className="modal-panel">
              <div className="modal-header">
                <div>
                  <div className="modal-title">✦ Generar guía con IA</div>
                  <div className="modal-subtitle">
                    {aiStep === "form" && "Escribe el nombre del juego y la IA creará una guía completa."}
                    {aiStep === "loading" && "Generando guía detallada..."}
                    {aiStep === "preview" && "Revisa la guía generada antes de añadirla."}
                  </div>
                </div>
                {aiStep !== "loading" && (
                  <button className="close-btn" onClick={() => setShowAIModal(false)}>×</button>
                )}
              </div>

              <div className="modal-body">
                {aiStep === "form" && (
                  <>
                    <div>
                      <div className="field-label">Nombre del juego</div>
                      <input
                        className="field-input"
                        placeholder="Ej: Elden Ring, God of War, Hades..."
                        value={aiGameName}
                        onChange={e => setAiGameName(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && generateGuide()}
                        autoFocus
                      />
                    </div>
                    <div>
                      <div className="field-label">Plataforma</div>
                      <div className="platform-selector">
                        {Object.keys(PLATFORM_COLORS).map(p => (
                          <button key={p} className={`platform-opt ${aiPlatform === p ? "selected" : ""}`} onClick={() => setAiPlatform(p)}>
                            {PLATFORM_COLORS[p].label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {aiError && <div className="error-msg">{aiError}</div>}
                  </>
                )}

                {aiStep === "loading" && (
                  <div className="loading-box">
                    <div className="loading-spinner" />
                    <div className="loading-text">
                      Generando guía completa de logros para<br />
                      <strong>{aiGameName}</strong><br />
                      Esto puede tardar unos segundos...
                    </div>
                  </div>
                )}

                {aiStep === "preview" && generatedGuide && (
                  <>
                    <div className="preview-box">
                      <div className="preview-title">{generatedGuide.title}</div>
                      <div className="preview-meta">
                        <span className="preview-tag">{generatedGuide.platform}</span>
                        {generatedGuide.genre && <span className="preview-tag">{generatedGuide.genre}</span>}
                        {generatedGuide.difficulty && <span className="preview-tag">{generatedGuide.difficulty}</span>}
                        <span className="preview-tag">{generatedGuide.achievements?.length || 0} logros</span>
                      </div>
                      {generatedGuide.notes && (
                        <div style={{ marginTop: "10px", fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6" }}>
                          {generatedGuide.notes}
                        </div>
                      )}
                    </div>
                    {aiError && <div className="error-msg">{aiError}</div>}
                  </>
                )}
              </div>

              <div className="modal-footer">
                {aiStep === "form" && (
                  <>
                    <button className="btn-secondary" onClick={() => setShowAIModal(false)}>Cancelar</button>
                    <button className="btn-primary" onClick={generateGuide} disabled={!aiGameName.trim()}>
                      ✦ Generar guía
                    </button>
                  </>
                )}
                {aiStep === "preview" && (
                  <>
                    <button className="btn-secondary" onClick={() => setAiStep("form")}>← Volver</button>
                    <button className="btn-primary" onClick={confirmAddGuide}>
                      ✓ Añadir a mis guías
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== MODAL IMPORTAR JSON ===== */}
        {showImportModal && (
          <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowImportModal(false); }}>
            <div className="modal-panel">
              <div className="modal-header">
                <div>
                  <div className="modal-title">↑ Importar guía</div>
                  <div className="modal-subtitle">Pega aquí el JSON de una guía que yo te haya creado.</div>
                </div>
                <button className="close-btn" onClick={() => setShowImportModal(false)}>×</button>
              </div>

              <div className="modal-body">
                <div className="import-hint">
                  Pide a Claude que cree una guía para un juego y pega el JSON aquí.<br />
                  Acepta un objeto <code>{`{ "id": ..., "title": ..., "achievements": [...] }`}</code> o un array de guías.
                </div>
                <div>
                  <div className="field-label">JSON de la guía</div>
                  <textarea
                    className="field-textarea"
                    placeholder={`{\n  "id": "elden-ring",\n  "title": "Elden Ring",\n  "platform": "Steam",\n  ...\n}`}
                    value={importText}
                    onChange={e => { setImportText(e.target.value); setImportError(""); setImportSuccess(""); }}
                  />
                </div>
                {importError && <div className="error-msg">{importError}</div>}
                {importSuccess && <div className="success-msg">{importSuccess}</div>}
              </div>

              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowImportModal(false)}>Cancelar</button>
                <button className="btn-primary" onClick={importGuide} disabled={!importText.trim()}>
                  ↑ Importar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

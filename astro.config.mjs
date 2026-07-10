import { defineConfig } from 'astro/config';

// Para GitHub Pages (project site): la base debe ser '/<repo>/'.
// Se toma de la variable de entorno SITE_BASE en el build de CI; en local es '/'.
const base = process.env.SITE_BASE || '/';
const site = process.env.SITE_URL || 'https://example.github.io';

export default defineConfig({
  site,
  base,
  // Puerto propio para no chocar con otros dev servers (Astro 4321, Vite 5173, Live Server 5500, etc.)
  server: { port: 4327 },
  preview: { port: 4327 },
});

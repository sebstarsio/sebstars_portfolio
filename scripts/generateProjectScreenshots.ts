/**
 * Script de capture des démos du Lab pour vignettes et images détail.
 * À lancer avec : npx tsx scripts/generateProjectScreenshots.ts
 * Prérequis : npm run dev en cours sur http://localhost:3000
 */

import { chromium, type Page } from 'playwright';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const VIEWPORT_WIDTH = 1600;
const VIEWPORT_HEIGHT = 900; // 16:9
const OUT_DIR = path.join(process.cwd(), 'public', 'images', 'projects');

/** Projets exclus (rendus graphiques déjà pertinents). */
const EXCLUDED_IDS = ['solar-system', 'three-body', 'fractal-generator'];

/** IDs des projets à capturer (avec démo, hors exclus). */
const CAPTURE_IDS = [
  'calculatrice',
  'constellations',
  'blog-cms',
  'ecommerce',
  'dashboard',
  'astro-data-viewer',
];

/** Ratio de recadrage pour la vignette (zone centrale). */
const THUMB_CROP_RATIO = 0.6; // 60% du centre en largeur et hauteur

async function ensureOutDir() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }
}

async function captureDemo(
  page: Page,
  projectId: string
): Promise<{ detailPath: string; thumbPath: string }> {
  const url = `${BASE_URL}/demo/${projectId}`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  // Attendre que le contenu principal de la démo soit visible
  await page.waitForSelector('main.wf-main', { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1500)); // Laisse le temps aux animations/rendu

  const detailPath = path.join(OUT_DIR, `${projectId}-detail.png`);
  const thumbPath = path.join(OUT_DIR, `${projectId}-thumb.png`);

  const buffer = await page.screenshot({
    type: 'png',
    fullPage: false,
  });

  if (!buffer || !(buffer instanceof Buffer)) {
    throw new Error(`Capture vide pour ${projectId}`);
  }

  fs.writeFileSync(detailPath, buffer);
  console.log(`  → ${projectId}-detail.png`);

  // Recadrage central pour la vignette
  const meta = await sharp(buffer).metadata();
  const w = meta.width ?? VIEWPORT_WIDTH;
  const h = meta.height ?? VIEWPORT_HEIGHT;
  const cropW = Math.floor(w * THUMB_CROP_RATIO);
  const cropH = Math.floor(h * THUMB_CROP_RATIO);
  const left = Math.floor((w - cropW) / 2);
  const top = Math.floor((h - cropH) / 2);

  await sharp(buffer)
    .extract({ left, top, width: cropW, height: cropH })
    .png()
    .toFile(thumbPath);
  console.log(`  → ${projectId}-thumb.png`);

  return { detailPath, thumbPath };
}

async function main() {
  console.log('Capture des démos Lab');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Viewport: ${VIEWPORT_WIDTH}x${VIEWPORT_HEIGHT} (16:9)`);
  console.log(`Projets à capturer: ${CAPTURE_IDS.join(', ')}`);
  console.log(`Projets exclus: ${EXCLUDED_IDS.join(', ')}\n`);

  await ensureOutDir();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  try {
    for (const projectId of CAPTURE_IDS) {
      console.log(`[${projectId}]`);
      try {
        await captureDemo(page, projectId);
      } catch (err) {
        console.error(`  Erreur: ${err instanceof Error ? err.message : err}`);
      }
    }
  } finally {
    await browser.close();
  }

  console.log('\nTerminé. Fichiers dans public/images/projects/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

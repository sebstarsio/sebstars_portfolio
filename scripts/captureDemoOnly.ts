/**
 * Capture technique des démos : uniquement le rendu du composant (main),
 * sans navbar, footer, boutons Specs/Code, ni aucun élément de page.
 * Génère [id]-detail.png (composant complet) et [id]-thumb.png (recadrage central).
 *
 * Prérequis : npm run dev sur http://localhost:3000
 * Usage : npx tsx scripts/captureDemoOnly.ts
 */

import { chromium, type Page } from 'playwright';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const VIEWPORT_WIDTH = 2560;
const VIEWPORT_HEIGHT = 1440;
const OUT_DIR = path.join(process.cwd(), 'public', 'images', 'projects');
const STABILIZE_MS = 2500;
const THUMB_CROP_RATIO = 0.55;

const DEMO_IDS = [
  'solar-system',
  'calculatrice',
  'constellations',
  'blog-cms',
  'ecommerce',
  'dashboard',
  'three-body',
  'astro-data-viewer',
  'fractal-generator',
];

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

  await page.waitForSelector('main.wf-main', { timeout: 15000 });
  await new Promise((r) => setTimeout(r, STABILIZE_MS));

  const detailPath = path.join(OUT_DIR, `${projectId}-detail.png`);
  const thumbPath = path.join(OUT_DIR, `${projectId}-thumb.png`);

  const main = page.locator('main.wf-main');
  const buffer = await main.screenshot({
    type: 'png',
  });

  if (!buffer || !(buffer instanceof Buffer)) {
    throw new Error(`Capture vide pour ${projectId}`);
  }

  fs.writeFileSync(detailPath, buffer);
  console.log(`  → ${projectId}-detail.png`);

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
  console.log('Capture technique des démos (composant seul, sans navbar/badges)');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Viewport: ${VIEWPORT_WIDTH}x${VIEWPORT_HEIGHT}`);
  console.log(`Sortie: ${OUT_DIR}\n`);

  await ensureOutDir();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  try {
    for (const projectId of DEMO_IDS) {
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

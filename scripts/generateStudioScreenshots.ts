/**
 * Génération d’assets visuels uniformes pour les pages projet (Screenshot Studio).
 * Ouvre chaque page avec ?studio=1 (mode visuel Lab 54.1), capture en 2K, exporte
 * [slug]-detail.png et [slug]-thumb.png.
 *
 * Prérequis : npm run dev en cours sur http://localhost:3000
 * Usage : npx tsx scripts/generateStudioScreenshots.ts
 */

import { chromium, type Page } from 'playwright';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const VIEWPORT_WIDTH = 2560;
const VIEWPORT_HEIGHT = 1440; // 2K 16:9
const OUT_DIR = path.join(process.cwd(), 'public', 'images', 'projects');
const STABILIZE_MS = 2500;

/** Projets exclus (rendus graphiques ou logique à part). */
const EXCLUDED_IDS = new Set(['solar-system', 'three-body', 'fractal-generator']);

/** Ratio de recadrage pour la vignette (zone centrale). */
const THUMB_CROP_RATIO = 0.5;

async function getProjectIds(): Promise<string[]> {
  const projectsPath = path.join(process.cwd(), 'src', 'lib', 'projects.ts');
  const content = fs.readFileSync(projectsPath, 'utf-8');
  const idMatches = content.matchAll(/id:\s*['"]([^'"]+)['"]/g);
  const ids = [...new Set([...idMatches].map((m) => m[1]))];
  return ids.filter((id) => !EXCLUDED_IDS.has(id));
}

async function ensureOutDir() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }
}

async function captureProjectPage(
  page: Page,
  projectId: string
): Promise<{ detailPath: string; thumbPath: string }> {
  const url = `${BASE_URL}/projects/${projectId}?studio=1`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  await page.waitForSelector('main.wf-main', { timeout: 15000 });
  await page.waitForSelector('body[data-studio="true"]', { timeout: 5000 });
  await new Promise((r) => setTimeout(r, STABILIZE_MS));

  const detailPath = path.join(OUT_DIR, `${projectId}-detail.png`);
  const thumbPath = path.join(OUT_DIR, `${projectId}-thumb.png`);

  const buffer = await page.screenshot({
    type: 'png',
    fullPage: true,
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
  const projectIds = await getProjectIds();
  console.log('Screenshot Studio — capture des pages projet');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Viewport: ${VIEWPORT_WIDTH}x${VIEWPORT_HEIGHT} (2K)`);
  console.log(`Projets à capturer: ${projectIds.join(', ')}`);
  console.log(`Projets exclus: ${[...EXCLUDED_IDS].join(', ')}\n`);

  await ensureOutDir();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  try {
    for (const projectId of projectIds) {
      console.log(`[${projectId}]`);
      try {
        await captureProjectPage(page, projectId);
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

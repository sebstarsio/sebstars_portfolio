/**
 * Capture des démos du portfolio : conteneur de la démo uniquement (main.wf-main).
 * Génère [id]-detail.png (large) et [id]-thumb.png (recadré centre).
 *
 * Prérequis : npm run dev en cours sur http://localhost:3000
 * Usage : node scripts/capture-demos.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUT_DIR = path.join(process.cwd(), 'public', 'images', 'projects');
const WAIT_MS = 2000;
const THUMB_CROP_RATIO = 0.55;

const PROJECT_IDS = [
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

const DEMO_SELECTOR = 'main.wf-main';

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function captureOne(page, projectId) {
  const url = `${BASE_URL}/demo/${projectId}`;
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  await page.waitForSelector(DEMO_SELECTOR, { timeout: 15000 });
  await new Promise((r) => setTimeout(r, WAIT_MS));

  const detailPath = path.join(OUT_DIR, `${projectId}-detail.png`);
  const thumbPath = path.join(OUT_DIR, `${projectId}-thumb.png`);

  const el = await page.$(DEMO_SELECTOR);
  if (!el) {
    throw new Error(`Sélecteur ${DEMO_SELECTOR} introuvable sur ${url}`);
  }

  const buffer = await el.screenshot({ type: 'png' });
  await el.dispose();

  if (!buffer || buffer.length === 0) {
    throw new Error(`Capture vide pour ${projectId}`);
  }

  fs.writeFileSync(detailPath, buffer);
  console.log(`  → ${projectId}-detail.png`);

  const sharp = require('sharp');
  const meta = await sharp(buffer).metadata();
  const w = meta.width || 800;
  const h = meta.height || 600;
  const cropW = Math.floor(w * THUMB_CROP_RATIO);
  const cropH = Math.floor(h * THUMB_CROP_RATIO);
  const left = Math.floor((w - cropW) / 2);
  const top = Math.floor((h - cropH) / 2);

  await sharp(buffer)
    .extract({ left, top, width: cropW, height: cropH })
    .png()
    .toFile(thumbPath);
  console.log(`  → ${projectId}-thumb.png`);
}

async function main() {
  await ensureDir(OUT_DIR);

  console.log('Capture des démos (conteneur:', DEMO_SELECTOR + ')');
  console.log('URL base:', BASE_URL);
  console.log('Sortie:', OUT_DIR, '\n');

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    for (const id of PROJECT_IDS) {
      console.log(`[${id}]`);
      try {
        await captureOne(page, id);
      } catch (err) {
        console.error('  Erreur:', err.message);
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

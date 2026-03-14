/**
 * Pipeline de post-traitement des assets projet SebStars.
 * Lit les captures brutes dans raw/, applique sharpening, vignette et logo,
 * exporte thumb.webp (16:9 cartes) et full.webp (page détail).
 *
 * Usage: node scripts/post-process-assets.js
 * Prérequis: déposer les images brutes dans public/images/projects/raw/
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'public', 'images', 'projects');
const RAW_DIR = path.join(ROOT, 'raw');
const PROCESSED_DIR = path.join(ROOT, 'processed');
const LOGO_PATH = path.join(process.cwd(), 'public', 'images', 'logo.svg');

const EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const SHARPEN_SIGMA = 0.8;
const LOGO_OPACITY = 0.4;
const LOGO_SIZE_RATIO = 0.12;
const THUMB_WIDTH = 640;
const THUMB_ASPECT = 16 / 9;
const FULL_QUALITY = 88;
const THUMB_QUALITY = 82;

function getVignetteSvg(width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.max(width, height) * 0.7;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <radialGradient id="v" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="transparent" stop-opacity="0"/>
          <stop offset="55%" stop-color="transparent" stop-opacity="0"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.35"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#v)"/>
    </svg>`
  );
}

async function loadLogoWithOpacity(imageWidth, imageHeight) {
  const maxLogo = Math.round(Math.min(imageWidth, imageHeight) * LOGO_SIZE_RATIO);
  const logoBuffer = await sharp(LOGO_PATH)
    .resize(maxLogo, maxLogo, { fit: 'inside' })
    .png()
    .toBuffer();
  const withAlpha = await sharp(logoBuffer)
    .ensureAlpha()
    .linear(1, 0, 1, 0, 1, 0, LOGO_OPACITY, 0)
    .toBuffer();
  const meta = await sharp(withAlpha).metadata();
  return { buffer: withAlpha, width: meta.width || maxLogo, height: meta.height || maxLogo };
}

async function applyPipeline(inputBuffer, meta, options = {}) {
  const { width, height } = meta;
  let pipeline = sharp(inputBuffer);

  if (options.sharpen !== false) {
    pipeline = pipeline.sharpen({ sigma: SHARPEN_SIGMA, m1: 1, m2: 0.5 });
  }

  const vignetteSvg = getVignetteSvg(width, height);
  pipeline = pipeline.composite([{ input: vignetteSvg, blend: 'over' }]);

  if (options.logo !== false && fs.existsSync(LOGO_PATH)) {
    const { buffer: logoBuf, width: lw, height: lh } = await loadLogoWithOpacity(width, height);
    const padding = Math.round(Math.min(width, height) * 0.02);
    const left = width - lw - padding;
    const top = height - lh - padding;
    pipeline = pipeline.composite([
      { input: logoBuf, left: Math.max(0, left), top: Math.max(0, top), blend: 'over' },
    ]);
  }

  return pipeline;
}

function extractProjectId(filename) {
  const base = path.basename(filename, path.extname(filename));
  return base.replace(/-detail$|-thumb$|-full$/i, '');
}

function chooseSource(files) {
  const byId = new Map();
  for (const f of files) {
    const id = extractProjectId(f.name);
    if (!byId.has(id)) byId.set(id, []);
    byId.get(id).push(f);
  }
  const chosen = new Map();
  for (const [id, list] of byId) {
    const preferDetail = list.find((f) => /-detail$/i.test(f.name));
    const preferLarger = list.sort((a, b) => (b.size || 0) - (a.size || 0))[0];
    chosen.set(id, preferDetail || preferLarger);
  }
  return chosen;
}

async function processImage(sourcePath, projectId) {
  const meta = await sharp(sourcePath).metadata();
  const { width, height } = meta;
  if (!width || !height) throw new Error(`Invalid image: ${sourcePath}`);

  const inputBuffer = fs.readFileSync(sourcePath);

  const fullPipeline = await applyPipeline(inputBuffer, { width, height });
  const fullPath = path.join(PROCESSED_DIR, `${projectId}-full.webp`);
  await fullPipeline
    .webp({ quality: FULL_QUALITY, effort: 6 })
    .toFile(fullPath);
  console.log(`  → ${projectId}-full.webp`);

  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);
  const targetHeight = Math.round(THUMB_WIDTH / THUMB_ASPECT);
  let cropW = width;
  let cropH = height;
  if (height / width > THUMB_ASPECT) {
    cropH = Math.round(width * THUMB_ASPECT);
  } else {
    cropW = Math.round(height / THUMB_ASPECT);
  }
  const left = Math.max(0, centerX - Math.floor(cropW / 2));
  const top = Math.max(0, centerY - Math.floor(cropH / 2));

  const thumbBuffer = await sharp(inputBuffer)
    .extract({ left, top, width: cropW, height: cropH })
    .resize(THUMB_WIDTH, targetHeight, { fit: 'fill' })
    .toBuffer();
  const thumbMeta = await sharp(thumbBuffer).metadata();
  const thumbPipeline = await applyPipeline(thumbBuffer, thumbMeta);
  const thumbPath = path.join(PROCESSED_DIR, `${projectId}-thumb.webp`);
  await thumbPipeline
    .webp({ quality: THUMB_QUALITY, effort: 5 })
    .toFile(thumbPath);
  console.log(`  → ${projectId}-thumb.webp`);
}

async function main() {
  if (!fs.existsSync(RAW_DIR)) {
    fs.mkdirSync(RAW_DIR, { recursive: true });
    console.log('Dossier raw/ créé. Déposez les captures brutes puis relancez le script.');
    return;
  }

  const entries = fs.readdirSync(RAW_DIR, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && EXTENSIONS.has(path.extname(e.name).toLowerCase()))
    .map((e) => ({
      name: e.name,
      path: path.join(RAW_DIR, e.name),
      size: fs.statSync(path.join(RAW_DIR, e.name)).size,
    }));

  if (files.length === 0) {
    console.log('Aucune image trouvée dans', RAW_DIR);
    console.log('Formats acceptés: png, jpg, jpeg, webp');
    return;
  }

  if (!fs.existsSync(PROCESSED_DIR)) {
    fs.mkdirSync(PROCESSED_DIR, { recursive: true });
  }

  const toProcess = chooseSource(files);
  console.log('Post-traitement assets — source:', RAW_DIR);
  console.log('Sortie:', PROCESSED_DIR);
  console.log('Projets:', [...toProcess.keys()].join(', '));
  console.log('');

  for (const [projectId, file] of toProcess) {
    console.log(`[${projectId}]`);
    try {
      await processImage(file.path, projectId);
    } catch (err) {
      console.error(`  Erreur: ${err.message}`);
    }
  }

  console.log('\nTerminé.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

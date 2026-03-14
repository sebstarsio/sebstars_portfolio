#!/usr/bin/env node
/**
 * Génère docs/rebuild/STEP_LOG_02.md à partir de l'état actuel du repo.
 * Usage: node tools/rebuild/generate_step_log_02.mjs
 * Dépendances: Node fs, path (built-in). UTF-8 explicite.
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const UTF8 = 'utf8';

// --- Helpers ---

function readText(filePath) {
  const p = path.isAbsolute(filePath) ? filePath : path.join(ROOT, filePath);
  try {
    return fs.readFileSync(p, UTF8);
  } catch {
    return null;
  }
}

function hasUseClient(text) {
  if (!text || typeof text !== 'string') return false;
  const first = text.split('\n')[0];
  if (first == null) return false;
  const trimmed = first.trim().replace(/;\s*$/, '');
  return trimmed === '"use client"' || trimmed === "'use client'";
}

function hasStyleInline(text) {
  return typeof text === 'string' && /style\s*=\s*\{\{/.test(text);
}

function hasSvg(text) {
  return typeof text === 'string' && /<svg/.test(text);
}

function lineCount(text) {
  if (text == null) return 0;
  return String(text).split(/\r?\n/).length;
}

function isStubLikely(text) {
  if (!text || typeof text !== 'string') return false;
  const t = text.trim();
  if (/className\s*=\s*["']stub["']/.test(t)) return true;
  if (/return\s+null\s*;/.test(t)) return true;
  const lines = t.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 5) {
    const oneLine = t.replace(/\s+/g, ' ');
    if (/return\s*<\s*div\s+className\s*=\s*["']stub["']\s*>[\s\S]*<\/\s*div\s*>/.test(oneLine)) return true;
    if (/<div\s+className\s*=\s*["']stub["']/.test(t) && lines.length <= 4) return true;
  }
  return false;
}

function scanStubFiles(dir = 'src') {
  const results = [];
  const fullDir = path.join(ROOT, dir);
  if (!fs.existsSync(fullDir) || !fs.statSync(fullDir).isDirectory()) return results;

  function walk(currentDir, baseRel) {
    let entries;
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch (_) {
      return;
    }
    for (const e of entries) {
      const rel = baseRel ? `${baseRel}/${e.name}` : e.name;
      const full = path.join(currentDir, e.name);
      if (e.isDirectory()) {
        walk(full, rel);
      } else if (e.isFile()) {
        const ext = path.extname(e.name).toLowerCase();
        if (ext !== '.tsx' && ext !== '.ts' && ext !== '.jsx' && ext !== '.js') continue;
        const content = readText(full);
        if (content != null && content.includes('className="stub"')) results.push(rel.replace(/\\/g, '/'));
      }
    }
  }
  walk(fullDir, dir);
  return results.sort();
}

// --- Données à inspecter ---

const COMPONENTS = [
  'src/components/Header.tsx',
  'src/components/Hero.tsx',
  'src/components/Projects.tsx',
  'src/components/Services.tsx',
  'src/components/Contact.tsx',
];

function checkTypesIndex() {
  const content = readText('src/types/index.ts');
  if (content == null) return { ok: false, note: '❌ manquant' };
  const hasInterface = /export\s+interface\s+Project\b/.test(content);
  const hasId = /\bid\s*:/.test(content);
  const hasCategory = /\bcategory\s*:/.test(content);
  const hasTitle = /\btitle\s*:/.test(content);
  const hasDescription = /\bdescription\s*:/.test(content);
  const all = hasInterface && hasId && hasCategory && hasTitle && hasDescription;
  const note = all
    ? '✅ export interface Project avec id, category, title, description'
    : `⚠️ manques: interface=${hasInterface} id=${hasId} category=${hasCategory} title=${hasTitle} description=${hasDescription}`;
  return { ok: all, note };
}

function checkProjectsTs() {
  const content = readText('src/lib/projects.ts');
  if (content == null) return { ok: false, note: '❌ manquant' };
  const hasImport = /import\s*\{\s*Project\s*\}\s*from\s*['"]@\/types['"]/.test(content);
  const hasGetAll = /function\s+getAllProjects\s*\(\s*\)\s*:\s*Project\s*\[\]/.test(content);
  const hasReturn = /return\s*\[\]/.test(content);
  const ok = hasImport && hasGetAll && (hasReturn || /return\s*\[[\s\S]*\]/.test(content));
  const note = ok
    ? '✅ import Project, getAllProjects(): Project[], return []'
    : `⚠️ import=${hasImport} getAllProjects=${hasGetAll} return[]=${hasReturn}`;
  return { ok, note };
}

function buildComponentsTable() {
  const rows = [];
  for (const file of COMPONENTS) {
    const content = readText(file);
    const exists = content != null;
    rows.push({
      file,
      use_client: exists ? (hasUseClient(content) ? '✅' : '❌') : '❌ manquant',
      style_inline: exists ? (hasStyleInline(content) ? '✅' : '—') : '—',
      svg_inline: exists ? (hasSvg(content) ? '✅' : '—') : '—',
      lines: exists ? lineCount(content) : '—',
      stub_suspected: exists ? (isStubLikely(content) ? 'oui' : 'non') : '—',
    });
  }
  return rows;
}

function readRunLog(name) {
  const p = path.join(ROOT, 'docs/rebuild/_runs', name);
  try {
    const content = fs.readFileSync(p, UTF8);
    const lines = content.split(/\r?\n/);
    return lines.length > 200 ? lines.slice(0, 200).join('\n') + '\n... (tronqué à 200 lignes)' : content;
  } catch {
    return null;
  }
}

function buildTodos(typesOk, projectsOk, rows, stubFiles) {
  const todos = [];
  const projectsContent = readText('src/lib/projects.ts');
  const dataEmpty = projectsContent != null && /return\s*\[\]\s*;?\s*}/.test(projectsContent.replace(/\s+/g, ' '));
  if (dataEmpty) todos.push('- [ ] **Données:** injecter data réelle dans `src/lib/projects.ts` (getAllProjects retourne un tableau non vide).');
  for (const r of rows) {
    if (r.stub_suspected === 'oui') todos.push(`- [ ] **${r.file}:** copier legacy 1:1 (stub détecté).`);
    if (r.use_client === '❌' && r.file !== '—' && r.lines !== '—' && r.lines > 10)
      todos.push(`- [ ] **${r.file}:** ajouter \`"use client"\` en première ligne si composant client.`);
  }
  for (const f of stubFiles) todos.push(`- [ ] **Stub restant:** ${f} (contient className="stub").`);
  if (todos.length === 0) todos.push('- [ ] Aucun TODO auto détecté.');
  return todos;
}

// --- Assemble Markdown ---

function buildMarkdown() {
  const now = new Date().toISOString().slice(0, 10);
  const typesResult = checkTypesIndex();
  const projectsResult = checkProjectsTs();
  const rows = buildComponentsTable();
  const stubFiles = scanStubFiles('src');
  const buildLog = readRunLog('build.txt');
  const devLog = readRunLog('dev.txt');
  const todos = buildTodos(typesResult.ok, projectsResult.ok, rows, stubFiles);

  let md = '';
  md += `# Rebuild — Step Log 02 — Étape 2 (généré)\n\n`;
  md += `**Date:** ${now}  \n`;
  md += `**Chemins:** REBUILD = \`${ROOT}\`  \n\n`;
  md += `---\n\n`;

  md += `## 1. Stubs data / types\n\n`;
  md += `| Fichier | Statut | Note |\n`;
  md += `|---------|--------|------|\n`;
  md += `| \`src/types/index.ts\` | ${typesResult.ok ? '✅' : '❌'} | ${typesResult.note} |\n`;
  md += `| \`src/lib/projects.ts\` | ${projectsResult.ok ? '✅' : '❌'} | ${projectsResult.note} |\n\n`;

  md += `## 2. Composants Home\n\n`;
  md += `| file | use_client | style_inline | svg_inline | lines | stub_suspected |\n`;
  md += `|------|------------|--------------|------------|-------|----------------|\n`;
  for (const r of rows) {
    md += `| ${r.file} | ${r.use_client} | ${r.style_inline} | ${r.svg_inline} | ${r.lines} | ${r.stub_suspected} |\n`;
  }
  md += `\n`;

  md += `## 3. Fichiers contenant \`className="stub"\` (stubs additionnels)\n\n`;
  if (stubFiles.length === 0) md += `Aucun fichier avec \`className="stub"\` trouvé sous \`src/\`.\n\n`;
  else {
    for (const f of stubFiles) md += `- \`${f}\`\n`;
    md += `\n`;
  }

  md += `## 4. Tests (logs _runs)\n\n`;
  md += `### build.txt\n\n`;
  if (buildLog == null) md += `❌ Fichier manquant: \`docs/rebuild/_runs/build.txt\`\n\n`;
  else md += `\`\`\`\n${buildLog}\n\`\`\`\n\n`;
  md += `### dev.txt\n\n`;
  if (devLog == null) md += `❌ Fichier manquant: \`docs/rebuild/_runs/dev.txt\`\n\n`;
  else md += `\`\`\`\n${devLog}\n\`\`\`\n\n`;

  md += `## 5. TODO auto\n\n`;
  for (const t of todos) md += `${t}\n`;
  md += `\n`;

  return md;
}

// --- Main ---

(function main() {
  const outPath = path.join(ROOT, 'docs/rebuild/STEP_LOG_02.md');
  const runsDir = path.join(ROOT, 'docs/rebuild/_runs');
  fs.mkdirSync(runsDir, { recursive: true });
  const md = buildMarkdown();
  fs.writeFileSync(outPath, md, UTF8);
  console.log('Ecrit:', outPath);
})();

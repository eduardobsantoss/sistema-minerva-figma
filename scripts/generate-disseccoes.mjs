/**
 * Gera dissecções (.md + .catalog.json) para todos os módulos implementados.
 * Solicitação usa seções curadas; demais módulos: walk automático por pasta.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const featuresRoot = path.join(root, 'src/features');
const outDir = path.join(root, 'src/features/configuracoes/disseccoes');

/** Módulos além de solicitacao-operacao (gerado pelo script dedicado). */
const AUTO_MODULES = [
  { key: 'fidc', title: "FIDC's" },
  { key: 'cra', title: "CRA's" },
  { key: 'cobranca', title: 'Cobrança' },
  { key: 'risco', title: 'Risco' },
  { key: 'ativos', title: 'Ativos' },
  { key: 'passivo', title: 'Passivo' },
];

function walkVue(dir, base = '') {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name).replace(/\\/g, '/');
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkVue(full, rel));
    else if (entry.isFile() && entry.name.endsWith('.vue')) out.push(rel);
  }
  return out;
}

function sectionTitleFor(relPath) {
  const parts = relPath.split('/');
  if (parts[0] === 'screens') {
    if (parts.length === 2) return 'Screens';
    return `Screens / ${parts.slice(1, -1).join(' / ')}`;
  }
  if (parts[0] === 'components') {
    if (parts.length === 2) return 'Components';
    return `Components / ${parts.slice(1, -1).join(' / ')}`;
  }
  return parts.slice(0, -1).join(' / ') || 'Root';
}

function generateAutoModule({ key, title }) {
  const featureDir = path.join(featuresRoot, key);
  const files = walkVue(featureDir).map((f) => f.replace(/\\/g, '/')).sort();
  if (!files.length) {
    console.warn('Skip (no vue):', key);
    return;
  }

  /** @type {Map<string, string[]>} */
  const bySection = new Map();
  for (const file of files) {
    const sec = sectionTitleFor(file);
    if (!bySection.has(sec)) bySection.set(sec, []);
    bySection.get(sec).push(file);
  }

  const sectionOrder = [...bySection.keys()].sort((a, b) => {
    const rank = (s) => (s.startsWith('Screens') ? 0 : s.startsWith('Components') ? 1 : 2);
    const d = rank(a) - rank(b);
    return d !== 0 ? d : a.localeCompare(b);
  });

  const lines = [`# ${title}`, ''];
  /** @type {{ title: string; components: { id: string; name: string; path: string; source: string }[] }[]} */
  const catalogSections = [];

  for (const section of sectionOrder) {
    lines.push(`## ${section}`, '');
    const comps = [];
    for (const file of bySection.get(section) ?? []) {
      const full = path.join(featureDir, file);
      const src = fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n').trimEnd();
      const name = path.basename(file, '.vue');
      const id = file.replace(/\.vue$/, '').replace(/\//g, '__');
      lines.push(`### ${name}`, '');
      lines.push('```vue');
      lines.push(src);
      lines.push('```');
      lines.push('');
      comps.push({ id, name, path: file, source: src });
    }
    catalogSections.push({ title: section, components: comps });
  }

  fs.mkdirSync(outDir, { recursive: true });
  const mdPath = path.join(outDir, `${key}.md`);
  const jsonPath = path.join(outDir, `${key}.catalog.json`);
  fs.writeFileSync(mdPath, lines.join('\n'), 'utf8');
  fs.writeFileSync(
    jsonPath,
    JSON.stringify({ title, feature: key, sections: catalogSections }, null, 2),
    'utf8',
  );
  const n = catalogSections.reduce((a, s) => a + s.components.length, 0);
  console.log(`Wrote ${key}: ${n} components`);
}

// 1) Tokens (sempre antes dos módulos)
const tokens = spawnSync(process.execPath, [path.join(__dirname, 'generate-design-tokens-md.mjs')], {
  cwd: root,
  stdio: 'inherit',
});
if (tokens.status !== 0) process.exit(tokens.status ?? 1);

// 2) Solicitação (seções curadas)
const sol = spawnSync(process.execPath, [path.join(__dirname, 'generate-solicitacao-disseccao.mjs')], {
  cwd: root,
  stdio: 'inherit',
});
if (sol.status !== 0) process.exit(sol.status ?? 1);

// 3) Demais módulos
for (const mod of AUTO_MODULES) generateAutoModule(mod);

console.log('Done. Output:', outDir);

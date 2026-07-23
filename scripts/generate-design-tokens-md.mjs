/**
 * Gera disseccoes/minerva-design-tokens.md a partir de theme.css + fonts.css
 * com valores resolvidos (hex) para a outra IA não inventar tokens.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const themePath = path.join(root, 'src/styles/theme.css');
const fontsPath = path.join(root, 'src/styles/fonts.css');
const outPath = path.join(root, 'src/features/configuracoes/disseccoes/minerva-design-tokens.md');
const outJsonPath = path.join(root, 'src/features/configuracoes/disseccoes/minerva-design-tokens.json');

const themeCss = fs.readFileSync(themePath, 'utf8');
const fontsCss = fs.readFileSync(fontsPath, 'utf8').trim();

const rootBlock = themeCss.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
/** @type {Record<string, string>} */
const raw = {};
for (const line of rootBlock.split('\n')) {
  const m = line.match(/--([a-z0-9-]+)\s*:\s*([^;]+);/i);
  if (m) raw[`--${m[1]}`] = m[2].trim().replace(/\s+/g, ' ');
}

function resolve(value, depth = 0) {
  if (depth > 8) return value;
  const m = value.match(/^var\((--[a-z0-9-]+)\)$/i);
  if (!m) return value;
  const next = raw[m[1]];
  if (!next) return value;
  return resolve(next, depth + 1);
}

/** @type {Record<string, string>} */
const resolved = {};
for (const [k, v] of Object.entries(raw)) {
  resolved[k] = resolve(v);
}

const groups = [
  {
    title: 'Cores primitivas',
    keys: Object.keys(raw).filter(
      (k) =>
        /--(gci|agro|neutral|success|warning|danger)-/.test(k) ||
        k === '--info-base' ||
        k === '--info-light',
    ),
  },
  {
    title: 'Surfaces',
    keys: Object.keys(raw).filter((k) => k.startsWith('--surface-')),
  },
  {
    title: 'Texto',
    keys: Object.keys(raw).filter((k) => k.startsWith('--text-') && !k.match(/--text-(micro|xs|sm|base|md|lg|xl|2xl|3xl|4xl)/)),
  },
  {
    title: 'Bordas',
    keys: Object.keys(raw).filter((k) => k.startsWith('--border-')),
  },
  {
    title: 'Ações',
    keys: Object.keys(raw).filter((k) => k.startsWith('--action-') || k === '--accent' || k === '--accent-bg'),
  },
  {
    title: 'Status',
    keys: Object.keys(raw).filter((k) => k.startsWith('--status-') || k.startsWith('--stepper-')),
  },
  {
    title: 'Tipografia — família e pesos',
    keys: Object.keys(raw).filter((k) => k.startsWith('--font-') || k.startsWith('--weight-') || k.startsWith('--leading-')),
  },
  {
    title: 'Tipografia — escala de tamanho',
    keys: Object.keys(raw).filter((k) =>
      /^--text-(micro|xs|sm|base|md|lg|xl|2xl|3xl|4xl)$/.test(k),
    ),
  },
  {
    title: 'Espaçamento',
    keys: Object.keys(raw).filter((k) => k.startsWith('--space-')),
  },
  {
    title: 'Raio',
    keys: Object.keys(raw).filter((k) => k.startsWith('--radius-')),
  },
  {
    title: 'Sombra / foco / motion',
    keys: Object.keys(raw).filter(
      (k) =>
        k.startsWith('--shadow-') ||
        k === '--focus-ring' ||
        k.startsWith('--duration-') ||
        k.startsWith('--ease-'),
    ),
  },
  {
    title: 'Layout shell',
    keys: Object.keys(raw).filter(
      (k) =>
        k.startsWith('--sidebar-') ||
        k.startsWith('--main-') ||
        k.startsWith('--topbar-') ||
        k.startsWith('--dashboard-'),
    ),
  },
];

const lines = [];
lines.push('# Minerva Design Tokens (obrigatório)');
lines.push('');
lines.push('**Regra dura para implementação:** use EXATAMENTE estes tokens/valores.');
lines.push('Não invente hex, pesos, fontes ou espaçamentos “plausíveis”.');
lines.push('Se o componente usa `var(--token)`, declare o token com o valor resolvido abaixo (ou cole o bloco `:root` completo).');
lines.push('');
lines.push('## Fonte');
lines.push('');
lines.push('- Família: **Inter** (`--font-sans`)');
lines.push('- Pesos carregados: **400, 500, 600, 700, 800**');
lines.push('- Import:');
lines.push('');
lines.push('```css');
lines.push(fontsCss);
lines.push('```');
lines.push('');
lines.push('- Base do documento: `html { font-size: 14px; font-family: var(--font-sans); color: var(--text-default); background: var(--surface-page); }`');
lines.push('- Números/tabelas: preferir `font-variant-numeric: tabular-nums` quando for valor monetário/ID.');
lines.push('');
lines.push('## Tabela token → valor resolvido');
lines.push('');

for (const g of groups) {
  if (!g.keys.length) continue;
  lines.push(`### ${g.title}`);
  lines.push('');
  lines.push('| Token | Declaração | Valor resolvido |');
  lines.push('|---|---|---|');
  for (const k of g.keys.sort()) {
    const decl = raw[k];
    const res = resolved[k];
    lines.push(`| \`${k}\` | \`${decl}\` | \`${res}\` |`);
  }
  lines.push('');
}

lines.push('## Tipografia — mapa de uso (produto)');
lines.push('');
lines.push('| Papel | Tamanho | Peso | Extras |');
lines.push('|---|---|---|---|');
lines.push('| Eyebrow / módulo | 11px | `--weight-bold` (700) | uppercase · letter-spacing 0.18em · `--accent` |');
lines.push('| Título de página (H1) | 26px | `--weight-bold` | letter-spacing -0.02em · `--text-strong` |');
lines.push('| Título de detalhe (H2) | `--text-xl` (20px) | `--weight-bold` | letter-spacing -0.01em · `--text-strong` |');
lines.push('| Label de campo | 10px | `--weight-bold` | uppercase · letter-spacing 0.10em · `--text-muted` |');
lines.push('| Corpo / descrição | `--text-sm` (13px) | `--weight-regular` | `--text-muted` · line-height 1.5 |');
lines.push('| Célula de tabela | `--text-sm` | regular/medium | tabular-nums em valores |');
lines.push('| Header de tabela | 10–11px / `--text-xs` | `--weight-bold` | uppercase · `--text-muted` |');
lines.push('| CTA de card | `--text-xs` | `--weight-bold` | `--accent` |');
lines.push('| Botão | `--text-sm` | `--weight-bold` | altura padrão 38px · `--radius-lg` |');
lines.push('');
lines.push('## Espaçamento — gaps comuns no produto');
lines.push('');
lines.push('| Contexto | Valor típico | Token |');
lines.push('|---|---|---|');
lines.push('| Gap entre cards de hub | 16px | `--space-4` |');
lines.push('| Gap de seção / stack de tela | 24px | `--space-6` |');
lines.push('| Padding de card / bloco | 22px | (próximo de `--space-5`/`--space-6`) |');
lines.push('| Gap de formulário (grid) | 14px | entre `--space-3` e `--space-4` |');
lines.push('| Gap label → campo | 6px | — |');
lines.push('| Padding horizontal input | 12px | `--space-3` |');
lines.push('| Main padding (desktop) | 40px | `--main-padding` |');
lines.push('');
lines.push('## Bloco `:root` completo (cole no CSS global do destino)');
lines.push('');
lines.push('```css');
lines.push(':root {');
for (const [k, v] of Object.entries(raw)) {
  lines.push(`  ${k}: ${v};`);
}
lines.push('}');
lines.push('```');
lines.push('');
lines.push('## Classes utilitárias de botão (theme.css)');
lines.push('');
lines.push('```css');
lines.push('.btn-animated { /* transition padrão */ }');
lines.push('.btn-primary:hover:not(:disabled) { background: var(--action-primary-bg-hover) !important; }');
lines.push('.btn-primary:active:not(:disabled) { background: var(--action-primary-bg-active) !important; }');
lines.push('.btn-agro:hover:not(:disabled) { background: var(--agro-hover) !important; }');
lines.push('.btn-agro:active:not(:disabled) { background: var(--agro-active) !important; }');
lines.push('```');
lines.push('');

/** @type {Record<string, { declaration: string; resolved: string }>} */
const jsonMap = {};
for (const [k, v] of Object.entries(raw)) {
  jsonMap[k] = { declaration: v, resolved: resolved[k] };
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
fs.writeFileSync(outJsonPath, JSON.stringify(jsonMap, null, 2) + '\n', 'utf8');
console.log('Wrote', outPath, 'and', outJsonPath, 'tokens:', Object.keys(raw).length);

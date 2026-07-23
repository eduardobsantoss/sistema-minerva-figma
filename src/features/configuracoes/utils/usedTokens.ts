export type TokenEntry = { declaration: string; resolved: string };
export type TokenMap = Record<string, TokenEntry>;

const VAR_RE = /var\(\s*(--[a-z0-9-]+)\s*(?:,[^)]+)?\)/gi;
const BARE_TOKEN_RE = /(?:^|[^a-z0-9-])(--[a-z0-9-]+)\b/gi;

/** Extrai tokens CSS referenciados no SFC / exemplo. */
export function extractUsedTokenNames(...texts: string[]): string[] {
  const found = new Set<string>();
  for (const text of texts) {
    if (!text) continue;
    for (const m of text.matchAll(VAR_RE)) found.add(m[1]);
    for (const m of text.matchAll(BARE_TOKEN_RE)) found.add(m[1]);
  }
  return [...found].sort();
}

/**
 * Inclui dependências declaradas como var(--outro) para o agente poder
 * montar o :root mínimo sem quebrar a cadeia.
 */
export function expandTokenDeps(names: string[], map: TokenMap): string[] {
  const out = new Set<string>();
  const visit = (name: string) => {
    if (out.has(name) || !map[name]) return;
    out.add(name);
    const decl = map[name].declaration;
    for (const m of decl.matchAll(VAR_RE)) visit(m[1]);
  };
  for (const n of names) visit(n);
  return [...out].sort();
}

/** Markdown compacto só com os tokens usados (+ deps). */
export function usedTokensMarkdown(
  source: string,
  example: string,
  map: TokenMap,
): string {
  const used = extractUsedTokenNames(source, example);
  const all = expandTokenDeps(used, map);
  const known = all.filter((k) => map[k]);
  const unknown = used.filter((k) => !map[k]);

  const lines: string[] = [
    '## Design tokens usados neste componente',
    '',
    '> Use estes valores (não invente hex/fontes). Para o pacote completo do DS,',
    '> copie em Configurações → Telas → **Copiar design tokens**.',
    '',
  ];

  if (!known.length && !unknown.length) {
    lines.push('_Nenhum `var(--token)` detectado neste SFC._');
    lines.push('');
    return lines.join('\n');
  }

  if (known.length) {
    const needsFont =
      known.some((k) => k.startsWith('--font-') || k.startsWith('--text-') || k.startsWith('--weight-')) ||
      /font-(family|weight|size)|letter-spacing|line-height/i.test(source + example);

    if (needsFont) {
      lines.push('### Fonte');
      lines.push('');
      lines.push('- Família: **Inter** (`--font-sans`)');
      lines.push('- Pesos: 400 / 500 / 600 / 700 / 800');
      lines.push(
        "- Import: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`",
      );
      lines.push('');
    }

    lines.push('| Token | Declaração | Valor resolvido |');
    lines.push('|---|---|---|');
    for (const k of known) {
      const { declaration, resolved } = map[k];
      lines.push(`| \`${k}\` | \`${declaration}\` | \`${resolved}\` |`);
    }
    lines.push('');

    lines.push('### `:root` mínimo');
    lines.push('');
    lines.push('```css');
    lines.push(':root {');
    for (const k of known) {
      lines.push(`  ${k}: ${map[k].declaration};`);
    }
    lines.push('}');
    lines.push('```');
    lines.push('');
  }

  if (unknown.length) {
    lines.push('### Tokens não mapeados no theme.css');
    lines.push('');
    for (const k of unknown) lines.push(`- \`${k}\``);
    lines.push('');
  }

  return lines.join('\n');
}

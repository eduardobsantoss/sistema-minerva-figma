import { usedTokensMarkdown, type TokenMap } from './usedTokens';

/** Copia texto com fallback quando Clipboard API falha (permissão / contexto). */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fallback */
  }

  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Markdown para a outra IA:
 * 1) Só os design tokens usados no SFC (com valores resolvidos)
 * 2) Exemplo mínimo
 * 3) SFC completo
 */
export function componentMarkdown(
  name: string,
  source: string,
  example: string,
  tokenMap: TokenMap,
): string {
  const tokensSection = usedTokensMarkdown(source, example, tokenMap);

  return [
    `# Minerva — pacote de implementação: ${name}`,
    '',
    '> **Obrigatório:** aplique os Design Tokens abaixo (apenas os usados neste componente).',
    '> Não substitua `var(--*)` por cores/fontes inventadas.',
    '',
    tokensSection.trim(),
    '',
    '---',
    '',
    `## Componente: ${name}`,
    '',
    '### Exemplo mínimo',
    '',
    '```vue',
    example.trim(),
    '```',
    '',
    '### Componente (SFC)',
    '',
    '```vue',
    source.trim(),
    '```',
    '',
  ].join('\n');
}

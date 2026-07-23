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

/** Markdown para a outra IA: nome + exemplo mínimo + SFC completo. */
export function componentMarkdown(name: string, source: string, example: string): string {
  return [
    `### ${name}`,
    '',
    '#### Exemplo mínimo',
    '',
    '```vue',
    example.trim(),
    '```',
    '',
    '#### Componente',
    '',
    '```vue',
    source.trim(),
    '```',
    '',
  ].join('\n');
}

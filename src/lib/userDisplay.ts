/** Partículas de nome próprias em PT-BR (ignoradas nas iniciais). */
const NAME_PARTICLES = new Set([
  'de',
  'da',
  'do',
  'dos',
  'das',
  'e',
  'di',
  'del',
  'della',
  'van',
  'von',
  'y',
]);

/**
 * Iniciais a partir do primeiro e do último nome significativo.
 * Ex.: "Eduardo Barbosa dos Santos" → "ES" (não "EB").
 */
export function getUserInitials(fullName: string): string {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .filter((p) => !NAME_PARTICLES.has(p.toLowerCase()));

  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();

  const first = parts[0]!.charAt(0);
  const last = parts[parts.length - 1]!.charAt(0);
  return (first + last).toUpperCase();
}

/** Usuário mock do shell (topbar / sidebar). */
export const CURRENT_USER = {
  fullName: 'Eduardo Barbosa dos Santos',
  role: 'Administrador',
} as const;

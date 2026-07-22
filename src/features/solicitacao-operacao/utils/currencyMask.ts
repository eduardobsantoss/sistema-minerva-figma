/** Máscara monetária BR: digitos = centavos → `R$ 2.483,02`. */

export function formatCurrencyInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 15);
  const cents = parseInt(digits || '0', 10);
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** Converte string mascarada (`R$ 1.234,56`) em número. */
export function parseCurrencyInput(raw: string): number {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return 0;
  return parseInt(digits, 10) / 100;
}

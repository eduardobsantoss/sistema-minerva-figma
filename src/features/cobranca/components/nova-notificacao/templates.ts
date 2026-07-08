export type TemplateTom = 'amigavel' | 'formal' | 'cobranca';

export const TEMPLATES: Record<TemplateTom, { label: string; avencer: string; vencidos: string }> = {
  amigavel: {
    label: 'Tom Amigável',
    avencer: 'Olá {nome}! Só passando para lembrar que seu título de {valor} vence em {vencimento}. Qualquer dúvida, estamos por aqui! 😊',
    vencidos: 'Oi {nome}, notamos que seu título de {valor} venceu em {vencimento}. Sabemos que imprevistos acontecem — entre em contato para que possamos ajudar!',
  },
  formal: {
    label: 'Tom Formal',
    avencer: 'Prezado(a) {nome}, informamos que o título de valor {valor} possui vencimento em {vencimento}. Solicitamos a regularização dentro do prazo.',
    vencidos: 'Prezado(a) {nome}, verificamos que o título de valor {valor}, com vencimento em {vencimento}, encontra-se em aberto. Pedimos que entre em contato para providenciar a liquidação.',
  },
  cobranca: {
    label: 'Tom de Cobrança',
    avencer: '{nome}, seu título de {valor} vence em {vencimento}. Regularize antes do vencimento para evitar encargos adicionais.',
    vencidos: 'AVISO: {nome}, o título de {valor} com vencimento em {vencimento} está vencido. A quitação imediata é necessária para evitar protesto.',
  },
};

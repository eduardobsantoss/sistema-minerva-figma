export interface ConfirmacaoHistoricoItem {
  tipo: string;
  data: string;
  hora: string;
  observacoes: string;
  registradoPor: string;
  resultado: string;
  evidencia?: string;
}

export interface ConfirmacoesHistoricoSeed {
  emissao: string;
  numero: string;
  /** Referência do documento/lastro exibida nas observações */
  docRef: string;
  /** Slug estável para nomes de arquivo mock */
  arquivoSlug: string;
  sacadoResultado: string;
  lastroResultado: string;
  registroResultado: string;
}

function docDigits(docRef: string, numero: string) {
  return docRef.replace(/\D/g, '').slice(-6) || numero.replace(/\D/g, '').slice(-6) || numero.slice(-6);
}

export function buildConfirmacoesHistorico(seed: ConfirmacoesHistoricoSeed): ConfirmacaoHistoricoItem[] {
  const doc = docDigits(seed.docRef, seed.numero);
  const protocolo = seed.numero.replace(/\D/g, '').slice(-5) || '00000';
  const slug = seed.arquivoSlug.replace(/[^\w.-]+/g, '-');

  return [
    {
      tipo: 'Confirmação do Sacado',
      data: seed.emissao,
      hora: '14:32',
      observacoes: `Via portal eletrônico, Documento ${doc} verificado`,
      registradoPor: 'João Beneli',
      resultado: seed.sacadoResultado,
      evidencia:
        seed.sacadoResultado === 'CONFIRMADO' ? `portal-confirmacao-${slug}.pdf` : undefined,
    },
    {
      tipo: 'Validação de Lastro',
      data: seed.emissao,
      hora: '11:08',
      observacoes: `Via portal eletrônico, Documento ${doc} verificado`,
      registradoPor: 'Marcos Damasceno',
      resultado: seed.lastroResultado,
      evidencia: seed.lastroResultado === 'CONFIRMADO' ? `lastro-${slug}.pdf` : undefined,
    },
    {
      tipo: 'Registro Registradora',
      data: seed.emissao,
      hora: '09:45',
      observacoes: `B3 — protocolo #${protocolo} registrado`,
      registradoPor: 'Sistema B3',
      resultado: seed.registroResultado,
      evidencia:
        seed.registroResultado === 'CONFIRMADO' ? `registro-b3-${slug}.pdf` : undefined,
    },
  ];
}

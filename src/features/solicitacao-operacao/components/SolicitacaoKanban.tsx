import { FolderOpen } from 'lucide-react';
import { SolicitacaoCard } from './SolicitacaoCard';
import {
  ETAPAS,
  groupByEtapa,
  type Etapa,
  type Solicitacao,
} from '../data/operacaoData';

interface Props {
  solicitacoes: Solicitacao[];
  onOpen?: (id: string) => void;
  /**
   * Move uma solicitação para outra etapa. Hoje é um stub (no-op no protótipo),
   * mas o ponto de plugue para drag-and-drop futuro já está mapeado aqui.
   */
  onMoveCard?: (id: string, etapa: Etapa) => void;
}

export function SolicitacaoKanban({ solicitacoes, onOpen, onMoveCard: _onMoveCard }: Props) {
  const grupos = groupByEtapa(solicitacoes);

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        overflowX: 'auto',
        paddingBottom: 12,
      }}
    >
      {ETAPAS.map((etapa) => {
        const cards = grupos[etapa.key];
        return (
          <div
            key={etapa.key}
            className="flex flex-col"
            // TODO: drag-and-drop — esta coluna é o drop target; chamar onMoveCard(id, etapa.key) ao soltar.
            style={{
              flex: '0 0 280px',
              width: 280,
              background: 'var(--surface-sunken)',
              borderRadius: 'var(--radius-lg)',
              borderTop: `3px solid ${etapa.cor}`,
              padding: 12,
              gap: 12,
              minHeight: 200,
            }}
          >
            {/* Header da coluna */}
            <div className="flex items-center justify-between" style={{ gap: 8 }}>
              <div className="flex items-center" style={{ gap: 8, minWidth: 0 }}>
                <span style={{ width: 8, height: 8, borderRadius: '9999px', background: etapa.cor, flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 'var(--weight-bold)',
                    letterSpacing: '0.06em',
                    color: 'var(--text-strong)',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {etapa.label}
                </span>
              </div>
              <span
                className="flex items-center justify-center"
                style={{
                  minWidth: 22,
                  height: 22,
                  padding: '0 7px',
                  borderRadius: '9999px',
                  background: `color-mix(in srgb, ${etapa.cor} 16%, transparent)`,
                  fontSize: 11,
                  fontWeight: 'var(--weight-bold)',
                  color: etapa.cor,
                  fontVariantNumeric: 'tabular-nums',
                  flexShrink: 0,
                }}
              >
                {cards.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col" style={{ gap: 10 }}>
              {cards.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center"
                  style={{
                    padding: '28px 8px',
                    gap: 8,
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                  }}
                >
                  <FolderOpen size={22} strokeWidth={1.5} style={{ opacity: 0.5 }} />
                  <span style={{ fontSize: 11 }}>Nenhuma solicitação</span>
                </div>
              ) : (
                cards.map((s) => (
                  <SolicitacaoCard key={s.id} solicitacao={s} compact onOpen={onOpen} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

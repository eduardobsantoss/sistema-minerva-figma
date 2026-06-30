import { CheckCircle2, XCircle } from 'lucide-react';
import {
  brl,
  fmtDuracao,
  slaRatio,
  etapaLabel,
  etapaCor,
  type Solicitacao,
} from '../data/operacaoData';

interface Props {
  solicitacoes: Solicitacao[];
  onOpen?: (id: string) => void;
}

const COLS = '90px 1.6fr 0.9fr 1.2fr 1fr 1.1fr 1fr';

export function SolicitacaoTable({ solicitacoes, onOpen }: Props) {
  return (
    <div
      style={{
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        background: 'var(--surface-card)',
      }}
    >
      {/* Header */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: COLS,
          padding: '12px 20px',
          background: 'var(--surface-sunken)',
          fontSize: 10,
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }}
      >
        <div>ID</div>
        <div>Cedente</div>
        <div>Tipo</div>
        <div>Veículo</div>
        <div style={{ textAlign: 'right' }}>Valor</div>
        <div>Etapa</div>
        <div>SLA da Etapa</div>
      </div>

      {/* Rows */}
      {solicitacoes.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          Nenhuma solicitação encontrada.
        </div>
      ) : (
        solicitacoes.map((s) => {
          const valido = s.validacao === 'VALIDO';
          const ratio = slaRatio(s);
          const atrasado = ratio > 1;
          const slaColor = atrasado ? 'var(--danger-base)' : 'var(--success-base)';
          const slaTrack = atrasado ? 'var(--danger-light)' : 'var(--success-light)';
          const slaPct = Math.min(Math.max(ratio, 0), 1) * 100;
          return (
            <div
              key={s.id}
              onClick={() => onOpen?.(s.id)}
              className="grid items-center"
              style={{
                gridTemplateColumns: COLS,
                padding: '14px 20px',
                borderTop: '1px solid var(--border-default)',
                fontSize: 'var(--text-sm)',
                cursor: onOpen ? 'pointer' : 'default',
                transition: 'background var(--duration-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                {s.id}
              </div>
              <div className="flex items-center" style={{ gap: 8, minWidth: 0 }}>
                <span
                  className="flex items-center justify-center"
                  style={{ flexShrink: 0, color: valido ? 'var(--success-base)' : 'var(--danger-base)' }}
                  title={valido ? 'Válido' : 'Inválido'}
                >
                  {valido ? <CheckCircle2 size={15} strokeWidth={2.25} /> : <XCircle size={15} strokeWidth={2.25} />}
                </span>
                <span style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {s.cedente}
                </span>
              </div>
              <div style={{ color: 'var(--text-default)' }}>{s.tipoContrato}</div>
              <div style={{ color: 'var(--text-default)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.veiculo}</div>
              <div style={{ textAlign: 'right', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
                {brl(s.valor)}
              </div>
              <div>
                <span
                  className="flex items-center"
                  style={{
                    gap: 6,
                    width: 'fit-content',
                    fontSize: 10,
                    fontWeight: 'var(--weight-bold)',
                    letterSpacing: '0.06em',
                    padding: '4px 9px',
                    borderRadius: '9999px',
                    background: `color-mix(in srgb, ${etapaCor(s.etapa)} 14%, transparent)`,
                    color: etapaCor(s.etapa),
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '9999px', background: etapaCor(s.etapa) }} />
                  {etapaLabel(s.etapa)}
                </span>
              </div>
              <div className="flex items-center" style={{ gap: 8 }}>
                <div style={{ flex: 1, height: 5, background: slaTrack, borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${slaPct}%`, background: slaColor, borderRadius: '9999px' }} />
                </div>
                <span style={{ fontSize: 10, color: atrasado ? 'var(--danger-base)' : 'var(--text-muted)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', fontWeight: atrasado ? 'var(--weight-bold)' : 'var(--weight-regular)' }}>
                  {fmtDuracao(s.tempoEtapaHoras)} / {fmtDuracao(s.slaEtapaHoras)}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Building2,
  ChevronDown,
  ChevronUp,
  Bookmark,
} from 'lucide-react';
import {
  brl,
  fmtDuracao,
  slaRatio,
  type Solicitacao,
} from '../data/operacaoData';

interface Props {
  solicitacao: Solicitacao;
  compact?: boolean;
  onOpen?: (id: string) => void;
}

/** Cor leve por tipo de contrato (badge). */
function contratoTone(tipo: string): { bg: string; fg: string } {
  const t = tipo.toUpperCase();
  if (t.includes('CDCA')) return { bg: 'var(--success-light)', fg: 'var(--success-dark)' };
  if (t.includes('CPR') || t.includes('NC')) return { bg: 'var(--warning-light)', fg: 'var(--warning-dark)' };
  return { bg: 'var(--surface-sunken)', fg: 'var(--text-default)' };
}

export function SolicitacaoCard({ solicitacao: s, compact = false, onOpen }: Props) {
  const [hover, setHover] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const valido = s.validacao === 'VALIDO';
  const atrasado = slaRatio(s) > 1;
  const barColor = atrasado ? 'var(--danger-base)' : 'var(--success-base)';
  const ct = contratoTone(s.tipoContrato);

  const isCliente = s.esteira === 'CLIENTE';

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen?.(s.id)}
      className="flex flex-col"
      style={{
        position: 'relative',
        background: 'var(--surface-card)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: hover ? 'rgba(8,60,74,0.25)' : 'var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: compact ? 12 : 16,
        gap: compact ? 10 : 12,
        cursor: onOpen ? 'pointer' : 'default',
        boxShadow: hover ? '0 12px 28px -14px rgba(8,60,74,0.18)' : 'var(--shadow-xs)',
        transform: hover && !compact ? 'translateY(-3px)' : 'translateY(0)',
        transition:
          'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
      }}
    >
      {isCliente && (
        <Bookmark
          size={18}
          style={{
            position: 'absolute',
            top: compact ? 8 : 10,
            right: compact ? 8 : 10,
            color: 'var(--agro-base)',
            fill: 'var(--agro-base)',
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Badges: tipo de contrato + validação */}
      <div className="flex items-center justify-between" style={{ gap: 8 }}>
        <span
          style={{
            fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em',
            padding: '3px 8px', borderRadius: 'var(--radius-sm)',
            background: ct.bg, color: ct.fg, textTransform: 'uppercase',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60%',
          }}
        >
          {s.tipoContrato}
        </span>
        <span
          className="flex items-center"
          style={{
            gap: 4, flexShrink: 0,
            fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em',
            padding: '3px 8px', borderRadius: '9999px',
            background: valido ? 'var(--status-success-bg)' : 'var(--status-danger-bg)',
            color: valido ? 'var(--status-success-text)' : 'var(--status-danger-text)',
          }}
        >
          {valido ? <CheckCircle2 size={10} strokeWidth={2.5} /> : <XCircle size={10} strokeWidth={2.5} />}
          {valido ? 'VÁLIDO' : 'INVÁLIDO'}
        </span>
      </div>

      {/* Cedente + ID */}
      <div>
        <div
          style={{
            fontSize: compact ? 'var(--text-sm)' : 'var(--text-base)',
            fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)',
            letterSpacing: '-0.01em', lineHeight: 1.25,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}
        >
          {s.cedente}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
          {s.id}
        </div>
      </div>

      {/* Valor */}
      <div
        style={{
          fontSize: compact ? 'var(--text-md)' : 'var(--text-lg)',
          fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)',
          fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em',
        }}
      >
        {brl(s.valor)}
      </div>

      {/* Vínculo (pill) */}
      <div
        className="flex items-center"
        style={{
          gap: 8, padding: '8px 12px', borderRadius: 'var(--radius-md)',
          background: 'var(--surface-sunken)', fontSize: 11,
          color: s.vinculo ? 'var(--text-default)' : 'var(--text-muted)',
        }}
      >
        <Building2 size={13} strokeWidth={2} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {s.vinculo || 'Sem vínculo'}
        </span>
      </div>

      {/* Divisor */}
      <div style={{ height: 1, background: 'var(--border-default)' }} />

      {/* TOTAL | ETAPA */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <TimeCol icon={Clock} label="Total" value={fmtDuracao(s.tempoTotalHoras)} barColor={barColor} />
        <TimeCol icon={RefreshCw} label="Etapa" value={fmtDuracao(s.tempoEtapaHoras)} barColor={barColor} emphasize={atrasado} />
      </div>

      {/* Detalhes expandidos */}
      {expanded && (
        <div className="flex flex-col" style={{ gap: 10, paddingTop: 4 }}>
          <DetailRow label="Veículo" value={s.veiculo} />
          <DetailRow label="Taxa" value={`${s.taxa.toFixed(2).replace('.', ',')}%`} />
          <DetailRow label="Gerente" value={s.gerente} />
          <DetailRow label="Atendente" value={s.atendente} />
        </div>
      )}

      {/* Toggle Mais/Menos detalhes */}
      <button
        onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
        className="flex items-center justify-center"
        style={{
          gap: 6, marginTop: 2, padding: '6px 0',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: 11, fontWeight: 'var(--weight-semibold)',
        }}
      >
        {expanded ? (<><ChevronUp size={14} /> Menos detalhes</>) : (<><ChevronDown size={14} /> Mais detalhes</>)}
      </button>
    </div>
  );
}

function TimeCol({ icon: Icon, label, value, barColor, emphasize }: {
  icon: typeof Clock; label: string; value: string; barColor: string; emphasize?: boolean;
}) {
  return (
    <div className="flex flex-col" style={{ gap: 5 }}>
      <div className="flex items-center" style={{ gap: 5, fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
        <Icon size={11} strokeWidth={2} /> {label}
      </div>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: emphasize ? 'var(--danger-base)' : 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
      <div style={{ height: 3, borderRadius: '9999px', background: barColor }} />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between" style={{ gap: 12 }}>
      <span style={{ fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase', flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)', textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {value || '—'}
      </span>
    </div>
  );
}

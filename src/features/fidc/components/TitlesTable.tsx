import { brl, type Title, type TitleStatus } from '../data/fidcsData';

const statusTone: Record<TitleStatus, { bg: string; fg: string }> = {
  CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-dark)' },
  VENCIDO: { bg: 'var(--danger-light)', fg: 'var(--danger-dark)' },
};

interface Props {
  rows: Title[];
  onOpen: (t: Title) => void;
  /** classId → class display label (e.g. { leite: 'LEITE', animais: 'ANIMAIS' }) */
  classMap?: Record<string, string>;
}

export function TitlesTable({ rows, onOpen, classMap }: Props) {
  const hasClass = !!classMap;

  const cols = hasClass
    ? '0.5fr 1fr 0.65fr 1.5fr 1.5fr 0.95fr 1fr 0.9fr'
    : '1fr 0.7fr 1.6fr 1.6fr 1fr 1.1fr 1fr';

  if (!rows.length) {
    return (
      <div
        style={{
          padding: 60,
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: 'var(--text-sm)',
        }}
      >
        Nenhum título encontrado.
      </div>
    );
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: cols,
          padding: '14px 20px',
          background: 'var(--surface-sunken)',
          fontSize: 10,
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.14em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }}
      >
        {hasClass && <div>Classe</div>}
        <div>Nº Título</div>
        <div>Lastro</div>
        <div>Cedente</div>
        <div>Sacado</div>
        <div>Vencimento</div>
        <div style={{ textAlign: 'right' }}>VR. Nominal</div>
        <div style={{ textAlign: 'center' }}>Status</div>
      </div>

      {/* Linhas */}
      {rows.map((t) => {
        const tone = statusTone[t.status];
        const classLabel = classMap?.[t.classId];
        return (
          <div
            key={t.id}
            onClick={() => onOpen(t)}
            className="grid items-center"
            style={{
              gridTemplateColumns: cols,
              padding: '16px 20px',
              borderTop: '1px solid var(--border-default)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              transition: 'background var(--duration-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {hasClass && classLabel && (
              <div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 'var(--weight-bold)',
                    letterSpacing: '0.08em',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--status-neutral-bg)',
                    color: 'var(--status-neutral-text)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {classLabel}
                </span>
              </div>
            )}
            {hasClass && !classLabel && <div />}

            <div
              style={{
                fontWeight: 'var(--weight-bold)',
                color: 'var(--text-strong)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              #{t.numero}
            </div>

            <div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 'var(--weight-bold)',
                  letterSpacing: '0.10em',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--gci-light)',
                  color: 'var(--gci-base)',
                }}
              >
                {t.lastro.replace('_', '-')}
              </span>
            </div>

            <div>
              <div style={{ color: 'var(--text-strong)', fontWeight: 'var(--weight-semibold)' }}>
                {t.cedente}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                {t.cedenteCnpj}
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-strong)', fontWeight: 'var(--weight-semibold)' }}>
                {t.sacado}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                {t.sacadoCnpj}
              </div>
            </div>

            <div style={{ color: 'var(--text-default)', fontVariantNumeric: 'tabular-nums' }}>
              {t.vencimento}
            </div>

            <div
              style={{
                fontWeight: 'var(--weight-bold)',
                color: t.status === 'VENCIDO' ? 'var(--danger-base)' : 'var(--text-strong)',
                fontVariantNumeric: 'tabular-nums',
                textAlign: 'right',
              }}
            >
              {brl(t.vrNominal)}
            </div>

            <div style={{ textAlign: 'center' }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 'var(--weight-bold)',
                  letterSpacing: '0.10em',
                  padding: '5px 10px',
                  borderRadius: '9999px',
                  background: tone.bg,
                  color: tone.fg,
                }}
              >
                {t.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

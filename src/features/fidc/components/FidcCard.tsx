import { useState } from 'react';
import { Wallet, Clock } from 'lucide-react';
import { brl, type Fidc } from '../data/fidcsData';

interface Props {
  fidc: Fidc;
  onOpen: (id: string) => void;
}

export function FidcCard({ fidc, onOpen }: Props) {
  const [hover, setHover] = useState(false);

  const catColor =
    fidc.category === 'MONOCLASSE'
      ? { bg: 'var(--agro-light)', fg: 'var(--agro-base)' }
      : { bg: 'var(--gci-light)', fg: 'var(--gci-base)' };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen(fidc.id)}
      className="relative flex flex-col"
      style={{
        background: 'var(--surface-card)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: hover ? 'rgba(242,125,38,0.30)' : 'var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        padding: 20,
        gap: 16,
        cursor: 'pointer',
        boxShadow: hover ? '0 20px 40px -16px rgba(8,60,74,0.12)' : 'var(--shadow-xs)',
        transform: hover ? 'translateY(-5px)' : 'translateY(0)',
        transition:
          'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
      }}
    >
      {/* Topo: FIDC tag + CNPJ + status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center" style={{ gap: 10 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.12em',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--gci-light)',
              color: 'var(--gci-base)',
            }}
          >
            FIDC
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            {fidc.cnpj}
          </span>
        </div>
        <span
          className="flex items-center"
          style={{
            gap: 6,
            fontSize: 10,
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.10em',
            color: 'var(--success-dark)',
            background: 'var(--success-light)',
            padding: '4px 10px',
            borderRadius: '9999px',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '9999px',
              background: 'var(--success-base)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
          EM ANDAMENTO
        </span>
      </div>

      {/* Nome */}
      <div
        style={{
          fontSize: 'var(--text-md)',
          fontWeight: 'var(--weight-bold)',
          color: 'var(--text-strong)',
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
          minHeight: 42,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {fidc.name}
      </div>

      {/* Categoria tag */}
      <div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.12em',
            padding: '5px 10px',
            borderRadius: 'var(--radius-sm)',
            background: catColor.bg,
            color: catColor.fg,
          }}
        >
          {fidc.category}
        </span>
      </div>

      {/* Carteira vs Vencido */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          padding: 12,
          background: 'var(--surface-sunken)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div>
          <div
            className="flex items-center"
            style={{
              gap: 6,
              fontSize: 10,
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.12em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            <Wallet size={12} /> Carteira
          </div>
          <div
            style={{
              fontSize: 'var(--text-md)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--text-strong)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {brl(fidc.carteira.valor)}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
            Títulos: <strong style={{ color: 'var(--text-default)' }}>{fidc.carteira.titulos}</strong>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            className="flex items-center"
            style={{
              gap: 6,
              fontSize: 10,
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.12em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              marginBottom: 4,
              justifyContent: 'flex-end',
            }}
          >
            <Clock size={12} /> Vencido
          </div>
          <div
            style={{
              fontSize: 'var(--text-md)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--danger-base)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {brl(fidc.vencido.valor)}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
            Títulos:{' '}
            <strong style={{ color: 'var(--danger-base)' }}>{fidc.vencido.titulos}</strong>
          </div>
        </div>
      </div>

      {/* Indicadores curto prazo */}
      <div
        className="grid"
        style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, paddingTop: 4 }}
      >
        <ShortKPI label="Venc. Hoje" value={brl(fidc.vencendoHoje)} />
        <ShortKPI label="Venc. Mês" value={brl(fidc.vencendoMes)} />
        <ShortKPI
          label="Confirmação"
          value={brl(0)}
          trailing={
            <span
              style={{
                fontSize: 10,
                color: fidc.confirmacaoPct >= 50 ? 'var(--success-base)' : 'var(--success-base)',
                fontWeight: 'var(--weight-bold)',
                marginLeft: 4,
              }}
            >
              {fidc.confirmacaoPct.toString().replace('.', ',')}%
            </span>
          }
        />
      </div>
    </div>
  );
}

function ShortKPI({
  label,
  value,
  trailing,
}: {
  label: string;
  value: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 9,
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-semibold)',
          color: 'var(--text-default)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
        {trailing}
      </div>
    </div>
  );
}

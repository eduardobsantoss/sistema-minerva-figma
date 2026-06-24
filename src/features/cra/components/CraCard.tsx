import { useState } from 'react';
import { TrendingUp, Wallet, Clock } from 'lucide-react';
import { brl, num, type Cra } from '../data/craData';

interface Props {
  cra: Cra;
  onOpen: (id: string) => void;
}

function DonutRing({ pct, color, trackColor = 'var(--border-default)' }: {
  pct: number; color: string; trackColor?: string;
}) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dashoffset = circ * (1 - Math.min(Math.max(pct, 0), 100) / 100);
  return (
    <svg width={52} height={52} viewBox="0 0 52 52" style={{ flexShrink: 0 }}>
      <circle cx={26} cy={26} r={r} fill="none" stroke={trackColor} strokeWidth={5} />
      <circle cx={26} cy={26} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${circ}`} strokeDashoffset={dashoffset} strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '26px 26px', transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle"
        style={{ fontSize: 9, fontWeight: 700, fill: color, fontFamily: 'var(--font-sans)' }}>
        {pct.toFixed(1).replace('.', ',')}%
      </text>
    </svg>
  );
}

export function CraCard({ cra, onOpen }: Props) {
  const [hover, setHover] = useState(false);

  // Derive CRA type from operações
  const craType = cra.operacoes.length > 0 && cra.operacoes.every((o) => o.tipo === 'MONO CRA')
    ? 'MONO CRA'
    : 'MULTI CRA';
  const craTypeColor = craType === 'MONO CRA'
    ? { bg: 'var(--agro-light)', fg: 'var(--agro-base)' }
    : { bg: 'var(--gci-light)', fg: 'var(--gci-base)' };

  // Aggregate from all operações
  const totalCarteira = cra.operacoes.reduce(
    (a, o) => ({ valor: a.valor + o.carteira.valor, titulos: a.titulos + o.carteira.titulos }),
    { valor: 0, titulos: 0 },
  );
  const totalVencido = cra.operacoes.reduce(
    (a, o) => ({ valor: a.valor + o.vencido.valor, titulos: a.titulos + o.vencido.titulos }),
    { valor: 0, titulos: 0 },
  );
  const avgPartesRel =
    cra.operacoes.length
      ? cra.operacoes.reduce((a, o) => a + o.partesRelacionadas.pct, 0) / cra.operacoes.length
      : 0;
  const totalPartesRelValor = cra.operacoes.reduce((a, o) => a + o.partesRelacionadas.valor, 0);
  const avgNovosSacados =
    cra.operacoes.length
      ? cra.operacoes.reduce((a, o) => a + o.novosSacados.pct, 0) / cra.operacoes.length
      : 0;
  const totalNovosSacadosValor = cra.operacoes.reduce((a, o) => a + o.novosSacados.valor, 0);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen(cra.id)}
      className="relative flex flex-col"
      style={{
        background: 'var(--surface-card)',
        borderWidth: 1, borderStyle: 'solid',
        borderColor: hover ? 'rgba(8,60,74,0.25)' : 'var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        padding: 20, gap: 14, cursor: 'pointer',
        boxShadow: hover ? '0 20px 40px -16px rgba(8,60,74,0.12)' : 'var(--shadow-xs)',
        transform: hover ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
      }}
    >
      {/* Header: tag + nome + status */}
      <div className="flex items-start justify-between" style={{ gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center" style={{ gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', padding: '3px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--gci-light)', color: 'var(--gci-base)' }}>
              CRA
            </span>
          </div>
          <div style={{
            fontSize: 'var(--text-md)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)',
            letterSpacing: '-0.01em', lineHeight: 1.25, marginBottom: 4,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {cra.nome}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
            {cra.cessionaria} · {cra.cnpj}
          </div>
        </div>
        <span className="flex items-center" style={{
          gap: 5, flexShrink: 0, marginTop: 4, whiteSpace: 'nowrap',
          fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em',
          color: 'var(--success-dark)', background: 'var(--success-light)',
          padding: '5px 10px', borderRadius: '9999px',
        }}>
          <TrendingUp size={10} strokeWidth={2.5} />
          EM ANDAMENTO
        </span>
      </div>

      {/* CRA type badge */}
      <div>
        <span style={{
          fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em',
          padding: '5px 10px', borderRadius: 'var(--radius-sm)',
          background: craTypeColor.bg, color: craTypeColor.fg,
        }}>
          {craType}
        </span>
      </div>

      {/* Carteira vs Vencido */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12, padding: 12, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)' }}>
        <div>
          <div className="flex items-center" style={{ gap: 5, fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
            <Wallet size={11} /> Valor em Carteira
          </div>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
            {brl(totalCarteira.valor)}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>
            Títulos: <strong style={{ color: 'var(--text-default)' }}>{num(totalCarteira.titulos)}</strong>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="flex items-center" style={{ gap: 5, fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4, justifyContent: 'flex-end' }}>
            <Clock size={11} /> Valor em Vencido
          </div>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--danger-base)', fontVariantNumeric: 'tabular-nums' }}>
            {brl(totalVencido.valor)}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>
            Títulos: <strong style={{ color: 'var(--danger-base)' }}>{num(totalVencido.titulos)}</strong>
          </div>
        </div>
      </div>

      {/* Donut metrics */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 8, paddingTop: 2 }}>
        <div className="flex items-center" style={{ gap: 10 }}>
          <DonutRing pct={avgPartesRel} color="var(--danger-base)" trackColor="var(--danger-light)" />
          <div>
            <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', color: 'var(--danger-base)', letterSpacing: '0.04em', marginBottom: 3 }}>
              Partes Relacionadas
            </div>
            <div style={{ fontSize: 11, fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
              {brl(totalPartesRelValor)}
            </div>
          </div>
        </div>
        <div className="flex items-center" style={{ gap: 10, justifyContent: 'flex-end', flexDirection: 'row' }}>
          <DonutRing pct={avgNovosSacados} color="#7C3AED" trackColor="#EDE9FE" />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', color: '#7C3AED', letterSpacing: '0.04em', marginBottom: 3 }}>
              Novos Sacados
            </div>
            <div style={{ fontSize: 11, fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
              {brl(totalNovosSacadosValor)}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

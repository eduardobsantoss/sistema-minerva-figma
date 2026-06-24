import { useState } from 'react';
import { Search, Plus, Landmark, Wallet, CheckCircle2, Clock } from 'lucide-react';
import type { Fidc } from '../data/fidcsData';
import { FidcCard } from '../components/FidcCard';

interface Props {
  fidcs: Fidc[];
  onOpen: (id: string) => void;
  onNew: () => void;
}

interface KpiDef {
  label: string;
  value: string;
  icon: typeof Landmark;
  tone: { bg: string; fg: string };
}

export function FidcListScreen({ fidcs, onOpen, onNew }: Props) {
  const [q, setQ] = useState('');
  const [focus, setFocus] = useState(false);

  const filtered = fidcs.filter(
    (f) =>
      !q ||
      f.name.toLowerCase().includes(q.toLowerCase()) ||
      f.cnpj.includes(q),
  );

  const kpis: KpiDef[] = [
    {
      label: 'Total de Fundos',
      value: '3',
      icon: Landmark,
      tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
    },
    {
      label: 'Valor Total',
      value: 'R$ 552,1M',
      icon: Wallet,
      tone: { bg: 'var(--success-light)', fg: 'var(--success-base)' },
    },
    {
      label: 'Títulos Ativos',
      value: '31.288',
      icon: CheckCircle2,
      tone: { bg: '#EEF0FF', fg: '#4F46E5' },
    },
    {
      label: 'Pendências',
      value: '1,1M',
      icon: Clock,
      tone: { bg: 'var(--danger-light)', fg: 'var(--danger-base)' },
    },
  ];

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      {/* Search bar + actions */}
      <div className="flex items-center" style={{ gap: 16 }}>
        <div
          className="relative"
          style={{
            flex: 1,
            background: 'var(--surface-card)',
            borderRadius: 'var(--radius-xl)',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: focus ? 'var(--gci-base)' : 'var(--border-default)',
            boxShadow: focus ? '0 0 0 4px rgba(8,60,74,0.06)' : 'var(--shadow-xs)',
            transition: 'border-color var(--duration-base), box-shadow var(--duration-base)',
          }}
        >
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--neutral-400)',
            }}
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholder="Pesquisar por nome do fundo ou CNPJ..."
            style={{
              width: '100%',
              height: 56,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              paddingLeft: 52,
              paddingRight: 160,
              fontSize: 'var(--text-base)',
              color: 'var(--text-strong)',
              borderRadius: 'var(--radius-xl)',
            }}
          />
          <button
            style={{
              position: 'absolute',
              right: 8,
              top: 8,
              bottom: 8,
              padding: '0 24px',
              background: 'var(--action-primary-bg)',
              color: 'var(--action-primary-text)',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.10em',
            }}
          >
            PESQUISAR
          </button>
        </div>
        <button
          className="flex items-center"
          style={{
            gap: 8,
            height: 56,
            padding: '0 24px',
            background: 'var(--agro-base)',
            color: '#fff',
            borderRadius: 'var(--radius-xl)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.10em',
            boxShadow: '0 10px 24px -8px rgba(242,125,38,0.40)',
            transition: 'background var(--duration-base)',
          }}
          onClick={onNew}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--agro-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--agro-base)')}
        >
          <span
            className="flex items-center justify-center"
            style={{
              width: 22,
              height: 22,
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.20)',
            }}
          >
            <Plus size={14} />
          </span>
          NOVO FIDC
        </button>
      </div>

      {/* KPIs */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              className="flex items-center"
              style={{
                gap: 16,
                background: 'var(--surface-card)',
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: 'var(--border-default)',
                borderRadius: 'var(--radius-xl)',
                padding: 20,
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-lg)',
                  background: k.tone.bg,
                  color: k.tone.fg,
                  flexShrink: 0,
                }}
              >
                <Icon size={22} strokeWidth={1.75} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 'var(--weight-bold)',
                    letterSpacing: '0.14em',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}
                >
                  {k.label}
                </div>
                <div
                  style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 'var(--weight-bold)',
                    color: 'var(--text-strong)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {k.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid de FIDC */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {filtered.map((f) => (
          <FidcCard key={f.id} fidc={f} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

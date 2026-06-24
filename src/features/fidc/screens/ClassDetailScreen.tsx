import { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  TrendingUp,
  Calendar,
  AlertCircle,
  Search,
  Filter,
} from 'lucide-react';
import { brl, type Fidc, type FidcClass } from '../data/fidcsData';
import { PLHero } from './FidcDetailScreen';
import { TitlesTable } from '../components/TitlesTable';

interface Props {
  fidc: Fidc;
  klass: FidcClass;
  onBack: () => void;
  onOpenTitle: (titleId: string) => void;
}

export function ClassDetailScreen({ fidc, klass, onBack, onOpenTitle }: Props) {
  const [q, setQ] = useState('');
  const filtered = klass.titulos.filter(
    (t) =>
      !q ||
      t.numero.includes(q) ||
      t.cedente.toLowerCase().includes(q.toLowerCase()) ||
      t.sacado.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      <div className="flex items-center" style={{ gap: 16 }}>
        <button
          onClick={onBack}
          aria-label="Voltar"
          className="flex items-center justify-center"
          style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-card)',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: 'var(--border-default)',
            cursor: 'pointer',
            color: 'var(--text-strong)',
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.18em',
              color: 'var(--agro-base)',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            {fidc.name}
          </div>
          <h2
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--text-strong)',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            {klass.name}
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
            Classe • {klass.cnpj}
          </p>
        </div>
      </div>

      <PLHero fidc={fidc} />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <ClassKPI
          icon={FileText}
          label="Valor Nominal"
          value={brl(klass.vrNominal)}
          tone={{ bg: 'var(--success-light)', fg: 'var(--success-base)' }}
        />
        <ClassKPI
          icon={TrendingUp}
          label="Valor em Aberto"
          value={brl(klass.vrAberto)}
          tone={{ bg: 'var(--gci-light)', fg: 'var(--gci-base)' }}
        />
        <ClassKPI
          icon={Calendar}
          label="Valor Presente"
          value={brl(klass.vrPresente)}
          tone={{ bg: '#EEF0FF', fg: '#4F46E5' }}
        />
        <ClassKPI
          icon={AlertCircle}
          label="Valor Vencido"
          value={brl(klass.vrVencido)}
          tone={{ bg: 'var(--danger-light)', fg: 'var(--danger-base)' }}
          danger
        />
      </div>

      <div
        style={{
          background: 'var(--surface-card)',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
        }}
      >
        <div
          className="flex items-center"
          style={{
            gap: 16,
            padding: 20,
            borderBottom: '1px solid var(--border-default)',
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-lg)',
              background: 'var(--surface-sunken)',
              color: 'var(--gci-base)',
            }}
          >
            <FileText size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--weight-bold)',
                color: 'var(--text-strong)',
                letterSpacing: '-0.01em',
              }}
            >
              Títulos da Classe
            </div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.14em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginTop: 4,
              }}
            >
              {klass.titulos.length} direitos creditórios vinculados
            </div>
          </div>
          <button
            aria-label="Filtros"
            className="flex items-center justify-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-lg)',
              background: 'var(--surface-card)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: 'var(--border-default)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <Filter size={16} />
          </button>
        </div>

        <div style={{ padding: 20, borderBottom: '1px solid var(--border-default)' }}>
          <div
            className="relative"
            style={{ background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)' }}
          >
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--neutral-400)',
              }}
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por número, lastro, cedente ou sacado..."
              style={{
                width: '100%',
                height: 44,
                paddingLeft: 44,
                paddingRight: 16,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-strong)',
              }}
            />
          </div>
        </div>

        <TitlesTable
          rows={filtered}
          onOpen={(t) => onOpenTitle(t.id)}
          classMap={{ [klass.id]: String(fidc.classes.findIndex((c) => c.id === klass.id) + 1) }}
        />
      </div>
    </div>
  );
}

function ClassKPI({
  icon: Icon,
  label,
  value,
  tone,
  danger,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
  tone: { bg: string; fg: string };
  danger?: boolean;
}) {
  return (
    <div
      style={{
        background: 'var(--surface-card)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        padding: 18,
      }}
    >
      <div className="flex items-center" style={{ gap: 12, marginBottom: 12 }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-lg)',
            background: tone.bg,
            color: tone.fg,
          }}
        >
          <Icon size={18} strokeWidth={1.75} />
        </div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.14em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
      </div>
      <div
        style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--weight-bold)',
          color: danger ? 'var(--danger-base)' : 'var(--text-strong)',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.01em',
        }}
      >
        {value}
      </div>
    </div>
  );
}

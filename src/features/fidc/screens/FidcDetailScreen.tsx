import { useState } from 'react';
import {
  ArrowLeft,
  TrendingUp,
  Wallet,
  ChevronUp,
  ChevronDown,
  FileText,
  Calendar,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Settings2,
  X,
} from 'lucide-react';
import { brl, num, type Fidc, type FidcClass, type Title } from '../data/fidcsData';
import { TitlesTable } from '../components/TitlesTable';

interface Props {
  fidc: Fidc;
  onBack: () => void;
  onOpenClass: (classId: string) => void;
  onOpenTitle: (classId: string, titleId: string) => void;
  onCreateClass: () => void;
}

type Tab = 'classes' | 'titulos';

export function FidcDetailScreen({
  fidc,
  onBack,
  onOpenClass,
  onOpenTitle,
  onCreateClass,
}: Props) {
  const [openCarteira, setOpenCarteira] = useState(true);
  const [tab, setTab] = useState<Tab>('classes');
  const [q, setQ] = useState('');
  const [showColPanel, setShowColPanel] = useState(false);

  const allTitles: Title[] = fidc.classes.flatMap((c) => c.titulos);
  const filteredTitles = allTitles.filter(
    (t) =>
      !q ||
      t.numero.includes(q) ||
      t.cedente.toLowerCase().includes(q.toLowerCase()) ||
      t.sacado.toLowerCase().includes(q.toLowerCase()),
  );

  const isMulticlasse = fidc.category === 'MULTICLASSE';

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      {/* Header */}
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
          <h2
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--text-strong)',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            {fidc.name}
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
            {fidc.cnpj} • Gestão de Carteira e Títulos
          </p>
        </div>
      </div>

      {/* Painel PL */}
      <PLHero fidc={fidc} />

      {/* Carteira do fundo */}
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
        <button
          onClick={() => setOpenCarteira((v) => !v)}
          className="relative w-full flex items-center"
          style={{
            gap: 16,
            padding: '20px 24px',
            background: 'var(--success-base)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.06)',
            }}
          />
          <div
            className="flex items-center justify-center"
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255,255,255,0.18)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Wallet size={22} />
          </div>
          <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                opacity: 0.85,
                marginBottom: 4,
              }}
            >
              Carteira do Fundo
            </div>
            <div
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--weight-bold)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {num(fidc.carteiraSummaryTitles)} títulos ativos
            </div>
          </div>
          <span
            className="flex items-center"
            style={{
              gap: 8,
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '8px 14px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 'var(--radius-lg)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {openCarteira ? 'Recolher Indicadores' : 'Exibir Indicadores'}
            {openCarteira ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </button>

        {openCarteira && (
          <div
            className="grid"
            style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, padding: 20 }}
          >
            <SubKPI
              icon={FileText}
              label="Valor Nominal"
              value={brl(fidc.carteira.valor)}
              tone={{ bg: 'var(--success-light)', fg: 'var(--success-base)' }}
            />
            <SubKPI
              icon={TrendingUp}
              label="Valor em Aberto"
              value={brl(fidc.carteira.valor)}
              tone={{ bg: 'var(--gci-light)', fg: 'var(--gci-base)' }}
            />
            <SubKPI
              icon={Calendar}
              label="Valor Presente"
              value={brl(fidc.carteira.valor * 0.82)}
              tone={{ bg: '#EEF0FF', fg: '#4F46E5' }}
            />
            <SubKPI
              icon={AlertCircle}
              label="Valor Vencido"
              value={brl(fidc.vencido.valor)}
              tone={{ bg: 'var(--danger-light)', fg: 'var(--danger-base)' }}
              badge={
                fidc.carteira.valor
                  ? `${((fidc.vencido.valor / fidc.carteira.valor) * 100)
                      .toFixed(2)
                      .replace('.', ',')}%`
                  : undefined
              }
            />
          </div>
        )}
      </div>

      {/* Classes/Títulos */}
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
          style={{ gap: 16, padding: 20, borderBottom: '1px solid var(--border-default)' }}
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
              {tab === 'classes' ? 'Classes do Fundo' : 'Títulos da Carteira'}
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
              {tab === 'classes'
                ? `${fidc.classes.length} unidades cadastradas`
                : `${allTitles.length} títulos na carteira`}
            </div>
          </div>
          {isMulticlasse && tab === 'classes' && (
            <button
              onClick={onCreateClass}
              className="flex items-center"
              style={{
                gap: 8,
                padding: '10px 18px',
                background: 'var(--agro-base)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                fontWeight: 'var(--weight-bold)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.10em',
                boxShadow: '0 10px 24px -10px rgba(242,125,38,0.40)',
              }}
            >
              <Plus size={14} /> NOVA CLASSE
            </button>
          )}
          <div
            className="flex"
            style={{
              padding: 4,
              background: 'var(--surface-sunken)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <TabBtn active={tab === 'classes'} onClick={() => setTab('classes')}>
              VISUALIZAR CLASSES
            </TabBtn>
            <TabBtn active={tab === 'titulos'} onClick={() => setTab('titulos')}>
              VISUALIZAR TÍTULOS
            </TabBtn>
          </div>
          <div className="flex items-center" style={{ gap: 6, position: 'relative' }}>
            <button aria-label="Colunas" onClick={() => setShowColPanel((v) => !v)}
              className="flex items-center justify-center" style={{
                width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)',
                borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)',
                color: 'var(--text-muted)', cursor: 'pointer',
              }}>
              <Settings2 size={16} />
            </button>
            <button aria-label="Filtros" className="flex items-center justify-center" style={{
              width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)',
              borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)',
              color: 'var(--text-muted)', cursor: 'pointer',
            }}>
              <Filter size={16} />
            </button>
            {showColPanel && <FidcColPanel tab={tab} onClose={() => setShowColPanel(false)} />}
          </div>
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

        {tab === 'classes' ? (
          <ClassesTable rows={fidc.classes} onOpen={onOpenClass} />
        ) : (
          <TitlesTable
            rows={filteredTitles}
            onOpen={(t) => onOpenTitle(t.classId, t.id)}
            classMap={Object.fromEntries(
              fidc.classes.map((c, i) => [c.id, String(i + 1)])
            )}
          />
        )}

        <div
          className="flex items-center justify-between"
          style={{ padding: '16px 20px', borderTop: '1px solid var(--border-default)' }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.14em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            Exibindo{' '}
            <span style={{ color: 'var(--text-strong)' }}>
              {tab === 'classes' ? fidc.classes.length : filteredTitles.length}
            </span>{' '}
            de{' '}
            <span style={{ color: 'var(--text-strong)' }}>
              {tab === 'classes' ? fidc.classes.length : allTitles.length}
            </span>{' '}
            registros
          </div>
          <div className="flex items-center" style={{ gap: 12 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.14em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              Classe Ativa:
            </span>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.10em',
                padding: '6px 12px',
                background: 'var(--gci-base)',
                color: '#fff',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              TODAS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PLHero({ fidc }: { fidc: Fidc }) {
  const [showAudit, setShowAudit] = useState(false);
  return (
    <>
    <div
      onClick={() => setShowAudit(true)}
      className="relative overflow-hidden flex items-center"
      style={{
        background: 'var(--gci-base)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 32px',
        color: '#fff',
        boxShadow: '0 20px 40px -20px rgba(8,60,74,0.40)',
        cursor: 'pointer',
      }}
    >
      <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '9999px', background: 'rgba(255,255,255,0.04)' }} />
      <div style={{ position: 'absolute', bottom: -120, right: 80, width: 240, height: 240, borderRadius: '9999px', background: 'rgba(242,125,38,0.04)' }} />

      {/* "Ver histórico" affordance — top-right corner */}
      <span className="flex items-center" style={{
        position: 'absolute', top: 16, right: 20, zIndex: 2,
        fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em',
        color: 'rgba(255,255,255,0.45)', gap: 4,
      }}>
        <TrendingUp size={12} /> VER HISTÓRICO
      </span>

      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 'var(--weight-bold)', letterSpacing: '0.18em', color: 'var(--agro-base)', textTransform: 'uppercase', marginBottom: 10 }}>
          Patrimônio Líquido
        </div>
        <div style={{ fontSize: 36, fontWeight: 'var(--weight-bold)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
          {brl(fidc.pl)}
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.65)', marginTop: 8 }}>
          Ref: {fidc.plRef} • {fidc.plRefAgo}
        </div>
      </div>
      <div className="flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.10)', color: '#fff', position: 'relative', zIndex: 1 }}>
        <TrendingUp size={26} />
      </div>
    </div>
    {showAudit && <PLAuditModal fidc={fidc} onClose={() => setShowAudit(false)} />}
    </>

  );
}

function SubKPI({
  icon: Icon,
  label,
  value,
  tone,
  badge,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  tone: { bg: string; fg: string };
  badge?: string;
}) {
  return (
    <div
      className="flex items-center"
      style={{
        gap: 14,
        padding: 14,
        background: 'var(--surface-card)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'var(--border-default)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-lg)',
          background: tone.bg,
          color: tone.fg,
          flexShrink: 0,
        }}
      >
        <Icon size={18} strokeWidth={1.75} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
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
          {label}
        </div>
        <div className="flex items-center" style={{ gap: 8 }}>
          <span
            style={{
              fontSize: 'var(--text-md)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--text-strong)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {value}
          </span>
          {badge && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.08em',
                padding: '3px 7px',
                borderRadius: '9999px',
                background: 'var(--danger-base)',
                color: '#fff',
              }}
            >
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.10em',
        border: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--radius-md)',
        background: active ? 'var(--surface-card)' : 'transparent',
        color: active ? 'var(--text-strong)' : 'var(--text-muted)',
        boxShadow: active ? 'var(--shadow-xs)' : 'none',
        transition: 'all var(--duration-base)',
      }}
    >
      {children}
    </button>
  );
}

function ClassesTable({
  rows,
  onOpen,
}: {
  rows: FidcClass[];
  onOpen: (id: string) => void;
}) {
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
        Nenhuma classe cadastrada para este fundo.
      </div>
    );
  }
  return (
    <div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: '2.4fr 1fr 1.2fr 1.2fr 1.2fr 1.2fr',
          padding: '14px 20px',
          background: 'var(--surface-sunken)',
          fontSize: 10,
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.14em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }}
      >
        <div>Nome da Unidade</div>
        <div>Status</div>
        <div>VR. Nominal</div>
        <div>VR. Aberto</div>
        <div>VR. Presente</div>
        <div style={{ textAlign: 'right' }}>VR. Vencido</div>
      </div>
      {rows.map((r) => (
        <div
          key={r.id}
          onClick={() => onOpen(r.id)}
          className="grid items-center"
          style={{
            gridTemplateColumns: '2.4fr 1fr 1.2fr 1.2fr 1.2fr 1.2fr',
            padding: '18px 20px',
            borderTop: '1px solid var(--border-default)',
            borderLeft: '3px solid var(--gci-base)',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            transition: 'background var(--duration-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <div className="flex items-center" style={{ gap: 12 }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-sunken)',
                color: 'var(--gci-base)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-bold)',
              }}
            >
              T
            </div>
            <div>
              <div
                style={{
                  fontWeight: 'var(--weight-bold)',
                  color: 'var(--text-strong)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                {r.name}
              </div>
              <div
                style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}
              >
                {r.cnpj}
              </div>
            </div>
          </div>
          <div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.10em',
                padding: '5px 10px',
                borderRadius: '9999px',
                background: 'var(--success-light)',
                color: 'var(--success-dark)',
              }}
            >
              EM ANDAMENTO
            </span>
          </div>
          <div
            style={{
              fontWeight: 'var(--weight-bold)',
              color: 'var(--text-strong)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {brl(r.vrNominal)}
          </div>
          <div
            style={{
              fontWeight: 'var(--weight-bold)',
              color: 'var(--text-strong)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {brl(r.vrAberto)}
          </div>
          <div
            style={{
              fontWeight: 'var(--weight-bold)',
              color: 'var(--text-strong)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {brl(r.vrPresente)}
          </div>
          <div
            style={{
              fontWeight: 'var(--weight-bold)',
              color: 'var(--danger-base)',
              fontVariantNumeric: 'tabular-nums',
              textAlign: 'right',
            }}
          >
            {brl(r.vrVencido)}
          </div>
        </div>
      ))}
    </div>
  );
}

const FIDC_CLASS_COLS = ['Nome da Unidade', 'Status', 'VR. Nominal', 'VR. Aberto', 'VR. Presente', 'VR. Vencido'];
const FIDC_TIT_COLS = ['Classe', 'Nº Título', 'Lastro', 'Cedente', 'Sacado', 'Vencimento', 'VR. Nominal', 'Status'];

function FidcColPanel({ tab, onClose }: { tab: 'classes' | 'titulos'; onClose: () => void }) {
  const cols = tab === 'classes' ? FIDC_CLASS_COLS : FIDC_TIT_COLS;
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(cols.map((c) => [c, true])),
  );
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
      <div style={{
        position: 'absolute', top: 48, right: 0, zIndex: 20,
        background: 'var(--surface-card)', borderWidth: 1, borderStyle: 'solid',
        borderColor: 'var(--border-default)', borderRadius: 'var(--radius-lg)',
        padding: 16, minWidth: 220, boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
          Colunas visíveis
        </div>
        <div className="flex flex-col" style={{ gap: 8 }}>
          {cols.map((c) => (
            <label key={c} className="flex items-center" style={{ gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={checked[c]} onChange={() => setChecked((p) => ({ ...p, [c]: !p[c] }))} style={{ accentColor: 'var(--gci-base)', width: 14, height: 14 }} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>{c}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── PLAuditModal ────────────────────────────────────────────────── */

const PL_AUDIT_LOG = [
  { dt: '22/06/2026 14:32', value: 16359182.10, user: 'Eduardo Santos' },
  { dt: '21/06/2026 09:15', value: 16120450.00, user: 'Mariana Costa' },
  { dt: '20/06/2026 16:48', value: 15987631.44, user: 'Eduardo Santos' },
  { dt: '18/06/2026 11:22', value: 15740200.00, user: 'Rafael Oliveira' },
  { dt: '15/06/2026 10:05', value: 15500000.00, user: 'Mariana Costa' },
  { dt: '10/06/2026 08:30', value: 15200000.00, user: 'Eduardo Santos' },
];

function PLAuditModal({ fidc, onClose }: { fidc: Fidc; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0,
      background: 'rgba(15,23,42,0.50)', backdropFilter: 'blur(6px)',
      zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 32, animation: 'fadeIn 0.2s ease-out',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)',
        width: '100%', maxWidth: 680, maxHeight: '80vh',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
        borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)',
      }}>
        {/* Header */}
        <div className="flex items-start justify-between" style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-default)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-strong)', letterSpacing: '-0.02em', marginBottom: 4 }}>
              Histórico — Patrimônio Líquido
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
              {fidc.name}
            </p>
          </div>
          <button onClick={onClose} className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}>
            <X size={16} />
          </button>
        </div>

        {/* Log entries */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Table header */}
          <div className="grid" style={{
            gridTemplateColumns: '1.2fr 1.4fr 1fr',
            padding: '12px 28px', background: 'var(--surface-sunken)',
            fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em',
            color: 'var(--text-muted)', textTransform: 'uppercase',
          }}>
            <div>Data e Hora</div>
            <div style={{ textAlign: 'center' }}>Valor Atualizado</div>
            <div style={{ textAlign: 'right' }}>Responsável</div>
          </div>
          {PL_AUDIT_LOG.map((entry, i) => (
            <div key={i} className="grid items-center" style={{
              gridTemplateColumns: '1.2fr 1.4fr 1fr',
              padding: '16px 28px',
              borderTop: '1px solid var(--border-default)',
            }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                {entry.dt}
              </div>
              <div style={{ textAlign: 'center', fontSize: 'var(--text-md)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
                {brl(entry.value)}
              </div>
              <div style={{ textAlign: 'right', fontSize: 'var(--text-sm)', color: 'var(--text-default)', fontWeight: 'var(--weight-semibold)' }}>
                {entry.user}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

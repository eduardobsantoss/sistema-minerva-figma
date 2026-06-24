import { useState } from 'react';
import {
  ArrowLeft, TrendingUp, Wallet, FileText, Search, Filter,
  ChevronUp, ChevronDown, Plus, Settings2, Clock,
  CheckCircle2, XCircle, LayoutList, ScanLine,
} from 'lucide-react';
import { brl, num, type Cra, type CraOperacao, type CraTitulo } from '../data/craData';

interface Props {
  cra: Cra;
  onBack: () => void;
  onCreateOperacao: () => void;
  onOpenOperacao: (operacaoId: string) => void;
  onOpenTitulo: (operacaoId: string, tituloId: string) => void;
}

type Tab = 'operacoes' | 'titulos';

export function CraDetailScreen({ cra, onBack, onCreateOperacao, onOpenOperacao, onOpenTitulo }: Props) {
  const [openCarteira, setOpenCarteira] = useState(true);
  const [tab, setTab] = useState<Tab>('operacoes');
  const [q, setQ] = useState('');
  const [showColPanel, setShowColPanel] = useState(false);

  const allTitulos: CraTitulo[] = cra.operacoes.flatMap((o) => o.titulos);
  const filteredTitulos = allTitulos.filter(
    (t) =>
      !q ||
      t.numero.includes(q) ||
      t.cedente.toLowerCase().includes(q.toLowerCase()) ||
      t.sacado.toLowerCase().includes(q.toLowerCase()),
  );

  const totalCarteira = cra.operacoes.reduce(
    (a, o) => ({ valor: a.valor + o.carteira.valor, titulos: a.titulos + o.carteira.titulos }),
    { valor: 0, titulos: 0 },
  );
  const totalVencido = cra.operacoes.reduce(
    (a, o) => ({ valor: a.valor + o.vencido.valor, titulos: a.titulos + o.vencido.titulos }),
    { valor: 0, titulos: 0 },
  );
  const totalEmissao = cra.operacoes.reduce((a, o) => a + o.valorEmissao, 0);
  const avgPartesRel =
    cra.operacoes.length
      ? cra.operacoes.reduce((a, o) => a + o.partesRelacionadas.pct, 0) / cra.operacoes.length
      : 0;
  const avgNovosSacados =
    cra.operacoes.length
      ? cra.operacoes.reduce((a, o) => a + o.novosSacados.pct, 0) / cra.operacoes.length
      : 0;

  const operacaoMap = Object.fromEntries(cra.operacoes.map((o) => [o.id, o.nome]));
  // Classe number: operação index (1-based)
  const operacaoClassMap = Object.fromEntries(cra.operacoes.map((o, i) => [o.id, String(i + 1)]));

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      {/* Header */}
      <div className="flex items-center" style={{ gap: 16 }}>
        <button onClick={onBack} aria-label="Voltar" className="flex items-center justify-center" style={{
          width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)',
          borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)',
          cursor: 'pointer', color: 'var(--text-strong)',
        }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            {cra.nome}
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
            {cra.cessionaria} · {cra.cnpj} · Gestão de Operações e Títulos
          </p>
        </div>
      </div>

      {/* Hero */}
      <CraHero totalEmissao={totalEmissao} cra={cra} />

      {/* Carteira */}
      <div style={{ background: 'var(--surface-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <button onClick={() => setOpenCarteira((v) => !v)} className="relative w-full flex items-center" style={{
          gap: 16, padding: '20px 24px', background: 'var(--success-base)',
          color: '#fff', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '9999px', background: 'rgba(255,255,255,0.06)' }} />
          <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.18)', position: 'relative', zIndex: 1 }}>
            <Wallet size={22} />
          </div>
          <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.85, marginBottom: 4 }}>
              Carteira da Operação
            </div>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', fontVariantNumeric: 'tabular-nums' }}>
              {num(totalCarteira.titulos)} títulos ativos
            </div>
          </div>
          <span className="flex items-center" style={{
            gap: 8, fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '8px 14px', background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-lg)', position: 'relative', zIndex: 1,
          }}>
            {openCarteira ? 'Recolher Indicadores' : 'Exibir Indicadores'}
            {openCarteira ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </button>
        {openCarteira && (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, padding: 20 }}>
            <StatusKPI
              icon={Clock} label="Pendente"
              qty={allTitulos.filter(t => t.status === 'PENDENTE').length}
              value={brl(allTitulos.filter(t => t.status === 'PENDENTE').reduce((s, t) => s + t.vrNominal, 0), true)}
              bg="var(--status-warning-bg)" fg="var(--status-warning-text)"
            />
            <StatusKPI
              icon={ScanLine} label="Análise Documental"
              qty={0}
              value={brl(0, true)}
              bg="var(--status-neutral-bg)" fg="var(--status-neutral-text)"
            />
            <StatusKPI
              icon={XCircle} label="Rejeitado"
              qty={allTitulos.filter(t => t.status === 'VENCIDO').length}
              value={brl(allTitulos.filter(t => t.status === 'VENCIDO').reduce((s, t) => s + t.vrNominal, 0), true)}
              bg="var(--status-danger-bg)" fg="var(--status-danger-text)"
            />
            <StatusKPI
              icon={CheckCircle2} label="Validado"
              qty={allTitulos.filter(t => t.status === 'CONFIRMADO').length}
              value={brl(allTitulos.filter(t => t.status === 'CONFIRMADO').reduce((s, t) => s + t.vrNominal, 0), true)}
              bg="var(--status-success-bg)" fg="var(--status-success-text)"
            />
            <StatusKPI
              icon={Wallet} label="Em Carteira"
              qty={totalCarteira.titulos}
              value={brl(totalCarteira.valor, true)}
              bg="var(--status-active-bg)" fg="var(--status-active-text)"
            />
          </div>
        )}
      </div>

      {/* Operações / Títulos */}
      <div style={{ background: 'var(--surface-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        {/* Panel header */}
        <div className="flex items-center" style={{ gap: 16, padding: 20, borderBottom: '1px solid var(--border-default)' }}>
          <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', color: 'var(--gci-base)' }}>
            <FileText size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>
              {tab === 'operacoes' ? 'Operações do CRA' : 'Títulos da Carteira'}
            </div>
            <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 4 }}>
              {tab === 'operacoes'
                ? `${cra.operacoes.length} operações cadastradas`
                : `${allTitulos.length} títulos na carteira`}
            </div>
          </div>

          {/* Nova Operação button (always visible) */}
          <button onClick={onCreateOperacao} className="flex items-center" style={{
            gap: 8, padding: '10px 18px', background: 'var(--agro-base)', color: '#fff', border: 'none',
            borderRadius: 'var(--radius-lg)', cursor: 'pointer',
            fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.10em',
            boxShadow: '0 10px 24px -10px rgba(242,125,38,0.40)',
          }}>
            <Plus size={14} /> NOVA OPERAÇÃO
          </button>

          {/* Tab toggle */}
          <div className="flex" style={{ padding: 4, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)' }}>
            <TabBtn active={tab === 'operacoes'} onClick={() => setTab('operacoes')}>VISUALIZAR OPERAÇÕES</TabBtn>
            <TabBtn active={tab === 'titulos'}   onClick={() => setTab('titulos')}>VISUALIZAR TÍTULOS</TabBtn>
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
            {showColPanel && <ColPanel tab={tab} onClose={() => setShowColPanel(false)} />}
          </div>
        </div>

        {/* Search (only in títulos tab) */}
        {tab === 'titulos' && (
          <div style={{ padding: 20, borderBottom: '1px solid var(--border-default)' }}>
            <div className="relative" style={{ background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)' }}>
              <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
              <input value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por número, cedente ou sacado..."
                style={{ width: '100%', height: 44, paddingLeft: 44, paddingRight: 16, background: 'transparent', border: 'none', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        {tab === 'operacoes'
          ? <OperacoesTable rows={cra.operacoes} onOpen={onOpenOperacao} />
          : <TitulosTable rows={filteredTitulos} classMap={operacaoClassMap} onOpen={(r) => onOpenTitulo(r.operacaoId, r.id)} />
        }

        {/* Footer */}
        <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderTop: '1px solid var(--border-default)' }}>
          <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Exibindo{' '}
            <span style={{ color: 'var(--text-strong)' }}>
              {tab === 'operacoes' ? cra.operacoes.length : filteredTitulos.length}
            </span>{' '}
            de{' '}
            <span style={{ color: 'var(--text-strong)' }}>
              {tab === 'operacoes' ? cra.operacoes.length : allTitulos.length}
            </span>{' '}
            registros
          </div>
          <div className="flex items-center" style={{ gap: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Operação Ativa:
            </span>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '6px 12px', background: 'var(--gci-base)', color: '#fff', borderRadius: 'var(--radius-sm)' }}>
              TODAS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── CraHero ─────────────────────────────────────────────────────── */

function CraHero({ totalEmissao, cra }: { totalEmissao: number; cra: Cra }) {
  return (
    <div className="relative overflow-hidden flex items-center" style={{
      background: 'var(--gci-base)', borderRadius: 'var(--radius-xl)',
      padding: '28px 32px', color: '#fff',
      boxShadow: '0 20px 40px -20px rgba(8,60,74,0.40)',
    }}>
      <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '9999px', background: 'rgba(255,255,255,0.04)' }} />
      <div style={{ position: 'absolute', bottom: -120, right: 80, width: 240, height: 240, borderRadius: '9999px', background: 'rgba(242,125,38,0.04)' }} />
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 'var(--weight-bold)', letterSpacing: '0.18em', color: 'var(--agro-base)', textTransform: 'uppercase', marginBottom: 10 }}>
          Valor Total de Emissão
        </div>
        <div style={{ fontSize: 36, fontWeight: 'var(--weight-bold)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
          {brl(totalEmissao)}
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.65)', marginTop: 8 }}>
          {cra.operacoes.length} {cra.operacoes.length === 1 ? 'operação' : 'operações'} · {cra.cessionaria}
        </div>
      </div>
      <div className="flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.10)', color: '#fff', position: 'relative', zIndex: 1 }}>
        <TrendingUp size={26} />
      </div>
    </div>
  );
}

/* ─── SubKPI ─────────────────────────────────────────────────────── */

function SubKPI({ icon: Icon, label, value, tone, badge }: {
  icon: typeof Wallet; label: string; value: string;
  tone: { bg: string; fg: string }; badge?: string;
}) {
  return (
    <div className="flex items-center" style={{ gap: 14, padding: 14, background: 'var(--surface-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-lg)' }}>
      <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: tone.bg, color: tone.fg, flexShrink: 0 }}>
        <Icon size={18} strokeWidth={1.75} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
          {label}
        </div>
        <div className="flex items-center" style={{ gap: 8 }}>
          <span style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
            {value}
          </span>
          {badge && (
            <span style={{ fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', padding: '3px 7px', borderRadius: '9999px', background: 'var(--danger-base)', color: '#fff' }}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── TabBtn ─────────────────────────────────────────────────────── */

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 16px', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
      letterSpacing: '0.10em', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)',
      background: active ? 'var(--surface-card)' : 'transparent',
      color: active ? 'var(--text-strong)' : 'var(--text-muted)',
      boxShadow: active ? 'var(--shadow-xs)' : 'none',
      transition: 'all var(--duration-base)',
    }}>
      {children}
    </button>
  );
}

/* ─── OperacoesTable ─────────────────────────────────────────────── */

function OperacoesTable({ rows, onOpen }: { rows: CraOperacao[]; onOpen: (id: string) => void }) {
  if (!rows.length) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
        Nenhuma operação cadastrada para este CRA.
      </div>
    );
  }
  const cols = '2.4fr 0.8fr 1fr 1.2fr 1.2fr 1.2fr 1.2fr';
  return (
    <div>
      <div className="grid" style={{
        gridTemplateColumns: cols, padding: '14px 20px', background: 'var(--surface-sunken)',
        fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em',
        color: 'var(--text-muted)', textTransform: 'uppercase',
      }}>
        <div>Nome da Operação</div>
        <div>Status</div>
        <div>Tipo</div>
        <div>VR. Emissão</div>
        <div>VR. Carteira</div>
        <div>VR. Vencido</div>
        <div style={{ textAlign: 'right' }}>Títulos</div>
      </div>
      {rows.map((r) => (
        <div key={r.id} onClick={() => onOpen(r.id)} className="grid items-center" style={{
          gridTemplateColumns: cols,
          padding: '18px 20px', borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)', cursor: 'pointer',
          transition: 'background var(--duration-fast)',
          borderLeft: '3px solid var(--gci-base)',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <div className="flex items-center" style={{ gap: 12 }}>
            <div className="flex items-center justify-center" style={{
              width: 32, height: 32, borderRadius: 'var(--radius-md)',
              background: 'var(--gci-light)', color: 'var(--gci-base)',
              fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
            }}>
              {r.numeroEmissao}
            </div>
            <div>
              <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', fontSize: 'var(--text-sm)' }}>
                {r.nome}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                {r.cessionaria}
              </div>
            </div>
          </div>
          <div>
            <span style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '5px 10px', borderRadius: '9999px', background: 'var(--success-light)', color: 'var(--success-dark)' }}>
              {r.status}
            </span>
          </div>
          <div>
            <span style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: r.tipo === 'MONO CRA' ? 'var(--agro-light)' : 'var(--gci-light)', color: r.tipo === 'MONO CRA' ? 'var(--agro-base)' : 'var(--gci-base)' }}>
              {r.tipo}
            </span>
          </div>
          <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{brl(r.valorEmissao)}</div>
          <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{brl(r.carteira.valor)}</div>
          <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--danger-base)', fontVariantNumeric: 'tabular-nums' }}>{brl(r.vencido.valor)}</div>
          <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{num(r.carteira.titulos)}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── TitulosTable ───────────────────────────────────────────────── */

function TitulosTable({ rows, classMap, onOpen }: { rows: CraTitulo[]; classMap: Record<string, string>; onOpen?: (r: CraTitulo) => void }) {
  if (!rows.length) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
        Nenhum título encontrado para esta operação.
      </div>
    );
  }

  const statusStyle = (s: CraTitulo['status']) => ({
    CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
    PENDENTE:   { bg: 'var(--warning-light)', fg: 'var(--warning-base)' },
    VENCIDO:    { bg: 'var(--danger-light)',  fg: 'var(--danger-base)' },
  }[s]);

  const cols = '0.5fr 0.8fr 0.6fr 1.4fr 1.4fr 0.7fr 0.9fr 0.65fr';

  return (
    <div>
      <div className="grid" style={{
        gridTemplateColumns: cols, padding: '14px 20px', background: 'var(--surface-sunken)',
        fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em',
        color: 'var(--text-muted)', textTransform: 'uppercase',
      }}>
        <div>Classe</div>
        <div>Nº Título</div>
        <div>Tipo</div>
        <div>Cedente</div>
        <div>Sacado</div>
        <div>Vencimento</div>
        <div>VR. Nominal</div>
        <div style={{ textAlign: 'right' }}>Status</div>
      </div>
      {rows.map((r) => {
        const sc = statusStyle(r.status);
        const classeNum = classMap[r.operacaoId] ?? '—';
        return (
          <div key={r.id} onClick={() => onOpen?.(r)} className="grid items-center" style={{
            gridTemplateColumns: cols, padding: '16px 20px',
            borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)',
            cursor: 'pointer', transition: 'background var(--duration-fast)',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <div>
              <span style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--status-neutral-bg)', color: 'var(--status-neutral-text)', whiteSpace: 'nowrap' }}>
                {classeNum}
              </span>
            </div>
            <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
              #{r.numero}
            </div>
            <div>
              <span style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '4px 7px', borderRadius: 'var(--radius-sm)', background: 'var(--gci-light)', color: 'var(--gci-base)' }}>
                {r.tipo}
              </span>
            </div>
            <div>
              <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{r.cedente}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{r.cedenteCnpj}</div>
            </div>
            <div>
              <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{r.sacado}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{r.sacadoCnpj}</div>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{r.vencimento}</div>
            <div style={{ fontWeight: 'var(--weight-bold)', color: r.status === 'VENCIDO' ? 'var(--danger-base)' : 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
              {brl(r.vrNominal)}
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '4px 8px', borderRadius: '9999px', background: sc.bg, color: sc.fg }}>
                {r.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── StatusKPI ──────────────────────────────────────────────────── */

function StatusKPI({ icon: Icon, label, qty, value, bg, fg }: {
  icon: typeof Wallet; label: string; qty: number; value: string; bg: string; fg: string;
}) {
  return (
    <div style={{
      padding: 14, borderRadius: 'var(--radius-lg)', background: bg,
      borderWidth: 1, borderStyle: 'solid', borderColor: 'transparent',
    }}>
      <div className="flex items-center" style={{ gap: 8, marginBottom: 8 }}>
        <Icon size={14} style={{ color: fg, flexShrink: 0 }} strokeWidth={2} />
        <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: fg, textTransform: 'uppercase' }}>
          {label}
        </div>
      </div>
      <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: fg, fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}>
        {qty}
      </div>
      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: fg, opacity: 0.75, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
    </div>
  );
}

/* ─── ColPanel ───────────────────────────────────────────────────── */

const CRA_OP_COLS = ['Nome da Operação', 'Status', 'Tipo', 'VR. Emissão', 'VR. Carteira', 'VR. Vencido', 'Títulos'];
const CRA_TIT_COLS = ['Classe', 'Nº Título', 'Tipo', 'Cedente', 'Sacado', 'Vencimento', 'VR. Nominal', 'Status'];

function ColPanel({ tab, onClose }: { tab: 'operacoes' | 'titulos'; onClose: () => void }) {
  const cols = tab === 'operacoes' ? CRA_OP_COLS : CRA_TIT_COLS;
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

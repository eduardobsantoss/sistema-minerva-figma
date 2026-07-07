import { useMemo, useRef, useState } from 'react';
import {
  Plus,
  Search,
  LayoutGrid,
  Columns3,
  Table2,
  ChevronDown,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  solicitacoes as initialSolicitacoes,
  ESTEIRAS,
  ETAPAS,
  slaRatio,
  type Etapa,
  type Esteira,
  type Solicitacao,
} from '../data/operacaoData';
import { SolicitacaoCard } from '../components/SolicitacaoCard';
import { SolicitacaoKanban } from '../components/SolicitacaoKanban';
import { SolicitacaoTable } from '../components/SolicitacaoTable';
import { NovoPedidoModal, type NewPedidoData } from '../components/NovoPedidoModal';
import { SolicitacaoDetailScreen } from './SolicitacaoDetailScreen';

type ViewMode = 'kanban' | 'cards' | 'tabela';
type EsteiraFilter = Esteira | 'TODAS';

const VIEW_MODES: { key: ViewMode; label: string; icon: typeof LayoutGrid }[] = [
  { key: 'kanban', label: 'Kanban', icon: Columns3 },
  { key: 'cards',  label: 'Cards',  icon: LayoutGrid },
  { key: 'tabela', label: 'Tabela', icon: Table2 },
];

function buildFromForm(data: NewPedidoData): Solicitacao {
  const valorNum = parseFloat((data.valorOperacao || '').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  return {
    id: `#${Math.floor(1397 + Math.random() * 600)}`,
    cedente: data.grupoEmpresarial || 'NOVO CEDENTE',
    tipoContrato: data.tipoContrato || '—',
    validacao: 'VALIDO',
    valor: valorNum,
    vinculo: data.grupoEmpresarial || '—',
    veiculo: data.fundo || '—',
    etapa: 'RASCUNHO',
    esteira: (data.esteira as Esteira) || 'CONVENCIONAL',
    tipoOperacao: data.tipoOperacao || '—',
    grupoEmpresarial: data.grupoEmpresarial || '—',
    abertura: new Date().toISOString().slice(0, 10),
    tempoTotalHoras: 0,
    tempoEtapaHoras: 0,
    slaEtapaHoras: 24,
    taxa: parseFloat((data.taxaOperacao || '').replace(',', '.')) || 0,
    gerente: data.gerenteComercial || '—',
    atendente: '',
  };
}

export function SolicitacaoScreen() {
  const [lista, setLista] = useState<Solicitacao[]>(initialSolicitacoes);
  const [esteira, setEsteira] = useState<EsteiraFilter>('TODAS');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [q, setQ] = useState('');
  const [tipoOp, setTipoOp] = useState('');
  const [grupo, setGrupo] = useState('');
  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterPlacement, setFilterPlacement] = useState<'below' | 'above'>('below');
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const [etapasFiltro, setEtapasFiltro] = useState<Etapa[]>([]);
  const [validacaoFiltro, setValidacaoFiltro] = useState('');
  const [slaFiltro, setSlaFiltro] = useState('');

  const tiposOperacao = useMemo(
    () => Array.from(new Set(initialSolicitacoes.map((s) => s.tipoOperacao))),
    [],
  );
  const grupos = useMemo(
    () => Array.from(new Set(initialSolicitacoes.map((s) => s.grupoEmpresarial))).sort(),
    [],
  );

  const extraFilterCount =
    (etapasFiltro.length > 0 ? 1 : 0) +
    (validacaoFiltro ? 1 : 0) +
    (slaFiltro ? 1 : 0);

  const filtered = useMemo(
    () =>
      lista.filter((s) => {
        if (esteira !== 'TODAS' && s.esteira !== esteira) return false;
        if (tipoOp && s.tipoOperacao !== tipoOp) return false;
        if (grupo && s.grupoEmpresarial !== grupo) return false;
        if (q) {
          const needle = q.toLowerCase();
          const hay = `${s.id} ${s.cedente} ${s.veiculo} ${s.vinculo}`.toLowerCase();
          if (!hay.includes(needle)) return false;
        }
        if (etapasFiltro.length > 0 && !etapasFiltro.includes(s.etapa)) return false;
        if (validacaoFiltro && s.validacao !== validacaoFiltro) return false;
        if (slaFiltro === 'ok' && slaRatio(s) > 1) return false;
        if (slaFiltro === 'late' && slaRatio(s) <= 1) return false;
        return true;
      }),
    [lista, esteira, tipoOp, grupo, q, etapasFiltro, validacaoFiltro, slaFiltro],
  );

  const openFilters = () => {
    if (!showFilters && filterBtnRef.current) {
      const rect = filterBtnRef.current.getBoundingClientRect();
      const estimatedPanelHeight = 320;
      const spaceBelow = window.innerHeight - rect.bottom;
      setFilterPlacement(spaceBelow < estimatedPanelHeight && rect.top > spaceBelow ? 'above' : 'below');
    }
    setShowFilters((v) => !v);
  };

  const handleCreate = (data: NewPedidoData) => {
    setLista((prev) => [buildFromForm(data), ...prev]);
    setCreating(false);
  };

  const selected = selectedId ? lista.find((s) => s.id === selectedId) ?? null : null;
  if (selected) {
    return <SolicitacaoDetailScreen solicitacao={selected} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      {/* ── Camada 1: Identificação + ação primária ── */}
      <div className="flex items-center justify-between" style={{ gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--accent)', fontWeight: 'var(--weight-bold)', marginBottom: 6 }}>
            Workflow Operacional
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Solicitação de Operação
          </h1>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center"
          style={{
            gap: 8, height: 48, padding: '0 22px',
            background: 'var(--agro-base)', color: '#fff',
            borderRadius: 'var(--radius-lg)', border: 'none', cursor: 'pointer',
            fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.10em',
            boxShadow: '0 10px 24px -8px rgba(242,125,38,0.40)', transition: 'background var(--duration-base)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--agro-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--agro-base)')}
        >
          <span className="flex items-center justify-center" style={{ width: 22, height: 22, borderRadius: '9999px', background: 'rgba(255,255,255,0.20)' }}>
            <Plus size={14} />
          </span>
          NOVA SOLICITAÇÃO
        </button>
      </div>

      {/* ── Tabs de esteira ── */}
      <div className="flex items-center" style={{ gap: 6, flexWrap: 'wrap' }}>
        {([{ key: 'TODAS', label: 'Todas' }, ...ESTEIRAS] as { key: EsteiraFilter; label: string }[]).map((e) => {
          const active = esteira === e.key;
          return (
            <button
              key={e.key}
              onClick={() => setEsteira(e.key)}
              style={{
                padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer',
                fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', letterSpacing: '0.04em',
                border: '1px solid',
                borderColor: active ? 'var(--gci-base)' : 'var(--border-default)',
                background: active ? 'var(--gci-base)' : 'var(--surface-card)',
                color: active ? '#fff' : 'var(--text-muted)',
                transition: 'all var(--duration-fast)',
              }}
            >
              {e.label}
            </button>
          );
        })}
      </div>

      {/* ── Barra de filtros + toggle de visualização ── */}
      <div className="flex flex-col" style={{ gap: 10 }}>
        <div className="flex items-center" style={{ gap: 12, flexWrap: 'wrap' }}>
          {/* Search */}
          <div
            className="relative"
            style={{ flex: 1, minWidth: 240, background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)' }}
          >
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por ID, cedente ou veículo..."
              style={{ width: '100%', height: 42, paddingLeft: 40, paddingRight: 14, background: 'transparent', border: 'none', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-strong)', borderRadius: 'var(--radius-lg)' }}
            />
          </div>

          <FilterSelect value={tipoOp} onChange={setTipoOp} placeholder="Tipo de Operação" options={tiposOperacao} />
          <FilterSelect value={grupo} onChange={setGrupo} placeholder="Grupo empresarial" options={grupos} />

          {/* Filtros adicionais (popover, estilo date-picker) */}
          <div style={{ position: 'relative' }}>
            <button
              ref={filterBtnRef}
              onClick={openFilters}
              className="flex items-center"
              style={{
                gap: 8, height: 42, padding: '0 16px', cursor: 'pointer',
                background: showFilters || extraFilterCount > 0 ? 'var(--gci-light)' : 'var(--surface-card)',
                border: `1px solid ${showFilters || extraFilterCount > 0 ? 'var(--gci-base)' : 'var(--border-default)'}`,
                borderRadius: 'var(--radius-lg)', fontWeight: 'var(--weight-bold)',
                fontSize: 'var(--text-xs)', letterSpacing: '0.04em',
                color: showFilters || extraFilterCount > 0 ? 'var(--gci-base)' : 'var(--text-muted)',
                transition: 'all var(--duration-fast)',
              }}
            >
              <SlidersHorizontal size={15} strokeWidth={2} />
              Filtros
              {extraFilterCount > 0 && (
                <span style={{ minWidth: 18, height: 18, padding: '0 5px', borderRadius: '9999px', background: 'var(--gci-base)', color: '#fff', fontSize: 10, fontWeight: 'var(--weight-bold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {extraFilterCount}
                </span>
              )}
              <ChevronDown size={14} style={{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base)' }} />
            </button>

            {/* Painel de filtros adicionais */}
            {showFilters && (
              <>
                <div onClick={() => setShowFilters(false)} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
                <div
                  style={{
                    position: 'absolute',
                    [filterPlacement === 'below' ? 'top' : 'bottom']: 'calc(100% + 8px)',
                    left: 0,
                    zIndex: 31,
                    width: 420,
                    maxWidth: 'calc(100vw - 48px)',
                    background: 'var(--surface-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '16px 20px',
                  }}
                >
                  <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: 11, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Filtros adicionais
                    </span>
                    {extraFilterCount > 0 && (
                      <button
                        onClick={() => { setEtapasFiltro([]); setValidacaoFiltro(''); setSlaFiltro(''); }}
                        className="flex items-center"
                        style={{ gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 'var(--weight-semibold)' }}
                      >
                        <X size={12} /> Limpar filtros
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col" style={{ gap: 16 }}>
                    {/* Etapa — chips */}
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Etapa</div>
                      <div className="flex items-center" style={{ gap: 6, flexWrap: 'wrap' }}>
                        {ETAPAS.map((e) => {
                          const active = etapasFiltro.includes(e.key);
                          return (
                            <button
                              key={e.key}
                              onClick={() => setEtapasFiltro((prev) => active ? prev.filter((x) => x !== e.key) : [...prev, e.key])}
                              style={{
                                padding: '5px 12px', borderRadius: '9999px', cursor: 'pointer',
                                fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
                                border: `1px solid ${active ? e.cor : 'var(--border-default)'}`,
                                background: active ? `color-mix(in srgb, ${e.cor} 12%, transparent)` : 'transparent',
                                color: active ? e.cor : 'var(--text-muted)',
                                transition: 'all var(--duration-fast)',
                              }}
                            >
                              {e.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {/* Grade 2 colunas x 2 linhas: Validação + SLA */}
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Validação</div>
                        <div className="flex items-center" style={{ gap: 6, flexWrap: 'wrap' }}>
                          {[{ v: '', l: 'Todas' }, { v: 'VALIDO', l: 'Válido' }, { v: 'INVALIDO', l: 'Inválido' }].map(({ v, l }) => (
                            <button
                              key={v}
                              onClick={() => setValidacaoFiltro(v)}
                              style={{
                                padding: '5px 12px', borderRadius: '9999px', cursor: 'pointer',
                                fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
                                border: `1px solid ${validacaoFiltro === v ? 'var(--gci-base)' : 'var(--border-default)'}`,
                                background: validacaoFiltro === v ? 'var(--gci-light)' : 'transparent',
                                color: validacaoFiltro === v ? 'var(--gci-base)' : 'var(--text-muted)',
                                transition: 'all var(--duration-fast)',
                              }}
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>SLA</div>
                        <div className="flex items-center" style={{ gap: 6, flexWrap: 'wrap' }}>
                          {[{ v: '', l: 'Todos' }, { v: 'ok', l: 'Dentro do prazo' }, { v: 'late', l: 'Atrasado' }].map(({ v, l }) => (
                            <button
                              key={v}
                              onClick={() => setSlaFiltro(v)}
                              style={{
                                padding: '5px 12px', borderRadius: '9999px', cursor: 'pointer',
                                fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
                                border: `1px solid ${slaFiltro === v ? 'var(--gci-base)' : 'var(--border-default)'}`,
                                background: slaFiltro === v ? 'var(--gci-light)' : 'transparent',
                                color: slaFiltro === v ? 'var(--gci-base)' : 'var(--text-muted)',
                                transition: 'all var(--duration-fast)',
                              }}
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Segmented view toggle */}
          <div className="flex items-center" style={{ gap: 4, padding: 4, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)' }}>
            {VIEW_MODES.map((m) => {
              const Icon = m.icon;
              const active = viewMode === m.key;
              return (
                <button
                  key={m.key}
                  onClick={() => setViewMode(m.key)}
                  className="flex items-center"
                  style={{
                    gap: 6, padding: '8px 14px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                    fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', letterSpacing: '0.04em',
                    background: active ? 'var(--surface-card)' : 'transparent',
                    color: active ? 'var(--text-strong)' : 'var(--text-muted)',
                    boxShadow: active ? 'var(--shadow-xs)' : 'none',
                    transition: 'all var(--duration-fast)',
                  }}
                >
                  <Icon size={15} strokeWidth={2} />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Conteúdo ── */}
      {viewMode === 'kanban' && <SolicitacaoKanban solicitacoes={filtered} onOpen={setSelectedId} />}

      {viewMode === 'cards' && (
        filtered.length === 0 ? (
          <EmptyList />
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {filtered.map((s) => (
              <SolicitacaoCard key={s.id} solicitacao={s} onOpen={setSelectedId} />
            ))}
          </div>
        )
      )}

      {viewMode === 'tabela' && <SolicitacaoTable solicitacoes={filtered} onOpen={setSelectedId} />}

      {creating && (
        <NovoPedidoModal onClose={() => setCreating(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}

function EmptyList() {
  return (
    <div style={{ padding: 60, textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)' }}>
      Nenhuma solicitação encontrada para os filtros selecionados.
    </div>
  );
}

function FilterSelect({ value, onChange, placeholder, options }: {
  value: string; onChange: (v: string) => void; placeholder: string; options: string[];
}) {
  return (
    <div style={{ position: 'relative', minWidth: 180 }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', height: 42, padding: '0 36px 0 14px',
          background: 'var(--surface-card)', border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)', outline: 'none', cursor: 'pointer',
          fontSize: 'var(--text-sm)', color: value ? 'var(--text-strong)' : 'var(--text-muted)',
          appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)', pointerEvents: 'none' }} />
    </div>
  );
}

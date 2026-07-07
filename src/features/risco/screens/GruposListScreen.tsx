import { useMemo, useRef, useState } from 'react';
import {
  Filter, ChevronDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight,
  MoreVertical, SlidersHorizontal, CheckCircle2, Clock, XCircle, Minus, Building2,
  Settings2, UserCog, BellRing, ShieldCheck, type LucideIcon,
} from 'lucide-react';
import {
  GRUPOS_SEED, GERENTES_SEED, TIPO_CLIENTE_OPTS,
  statusOperacaoColor, parecerLabel, parecerColor, brl,
  type GrupoEmpresarial, type ParecerStatus,
} from '../data/riscoData';
import { TransferirGerenteModal } from '../components/modals/TransferirGerenteModal';
import { ConfigurarNotificacoesModal } from '../components/modals/ConfigurarNotificacoesModal';
import { HabilitarOperarModal } from '../components/modals/HabilitarOperarModal';

interface Props {
  onOpen: (id: string) => void;
}

type ColKey = 'documento' | 'statusOperacao' | 'limite' | 'limiteAutoatendimento' | 'riscoTotal' | 'riscoUraStt' | 'gerente' | 'vencimentoLimite' | 'parecerCredito';

const ALL_COLS: { key: ColKey; label: string; align?: 'right' | 'center' }[] = [
  { key: 'documento', label: 'Documento' },
  { key: 'statusOperacao', label: 'Status de Operação' },
  { key: 'limite', label: 'Limite', align: 'right' },
  { key: 'limiteAutoatendimento', label: 'Limite Autoatend.', align: 'right' },
  { key: 'riscoTotal', label: 'Risco Total', align: 'right' },
  { key: 'riscoUraStt', label: 'Risco (Ura & Stt)', align: 'right' },
  { key: 'gerente', label: 'Gerente' },
  { key: 'vencimentoLimite', label: 'Vencimento do Limite' },
  { key: 'parecerCredito', label: 'Parecer de Crédito', align: 'center' },
];

const PARECER_ICON: Record<ParecerStatus, typeof CheckCircle2> = {
  CONFORME: CheckCircle2,
  EXPIRANDO: Clock,
  EXPIRADO: XCircle,
  AUSENTE: Minus,
};

interface Filters {
  nome: string;
  gerente: string;
  tipoCliente: string;
  possuiParecer: string;
  vencMin: string;
  vencMax: string;
}

const EMPTY_FILTERS: Filters = { nome: '', gerente: '', tipoCliente: '', possuiParecer: '', vencMin: '', vencMax: '' };

function parseDateBR(d: string | null): number {
  if (!d) return NaN;
  const [dd, mm, yyyy] = d.split('/').map(Number);
  return new Date(yyyy, mm - 1, dd).getTime();
}

export function GruposListScreen({ onOpen }: Props) {
  const [grupos] = useState<GrupoEmpresarial[]>(GRUPOS_SEED);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterPlacement, setFilterPlacement] = useState<'below' | 'above'>('below');
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const [draft, setDraft] = useState<Filters>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<Filters>(EMPTY_FILTERS);
  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(new Set(ALL_COLS.map((c) => c.key)));
  const [colsMenuOpen, setColsMenuOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [parecerTooltip, setParecerTooltip] = useState<{ label: string; x: number; y: number } | null>(null);
  const [transferindo, setTransferindo] = useState<GrupoEmpresarial | null>(null);
  const [configurandoNotif, setConfigurandoNotif] = useState<GrupoEmpresarial | null>(null);
  const [habilitando, setHabilitando] = useState<GrupoEmpresarial | null>(null);

  const filtered = useMemo(() => {
    return grupos.filter((g) => {
      if (applied.nome && !g.nome.toLowerCase().includes(applied.nome.toLowerCase())) return false;
      if (applied.gerente && g.gerente !== applied.gerente) return false;
      if (applied.tipoCliente && g.tipoCliente !== applied.tipoCliente) return false;
      if (applied.possuiParecer === 'Sim' && g.parecerCredito === 'AUSENTE') return false;
      if (applied.possuiParecer === 'Não' && g.parecerCredito !== 'AUSENTE') return false;
      if (applied.vencMin) {
        const t = parseDateBR(g.vencimentoLimite);
        if (Number.isNaN(t) || t < new Date(applied.vencMin).getTime()) return false;
      }
      if (applied.vencMax) {
        const t = parseDateBR(g.vencimentoLimite);
        if (Number.isNaN(t) || t > new Date(applied.vencMax).getTime()) return false;
      }
      return true;
    });
  }, [grupos, applied]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);

  const activeFilterCount = Object.values(applied).filter((v) => v !== '').length;

  const cols = ALL_COLS.filter((c) => visibleCols.has(c.key));
  const gridTemplate = `1.8fr ${cols.map(() => '1fr').join(' ')} 56px`;

  const handleFilter = () => { setApplied(draft); setPage(1); setFilterOpen(false); };
  const handleClear = () => { setDraft(EMPTY_FILTERS); setApplied(EMPTY_FILTERS); setPage(1); setFilterOpen(false); };
  const toggleCol = (key: ColKey) => {
    setVisibleCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const openFilters = () => {
    if (!filterOpen && filterBtnRef.current) {
      const rect = filterBtnRef.current.getBoundingClientRect();
      const estimatedPanelHeight = 380;
      const spaceBelow = window.innerHeight - rect.bottom;
      setFilterPlacement(spaceBelow < estimatedPanelHeight && rect.top > spaceBelow ? 'above' : 'below');
    }
    setFilterOpen((v) => !v);
  };

  return (
    <div className="flex flex-col" style={{ gap: 20 }}>
      {/* Identificação */}
      <div>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--accent)', fontWeight: 'var(--weight-bold)', marginBottom: 6 }}>
          Risco
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          Grupos Empresariais
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
          {filtered.length} {filtered.length === 1 ? 'grupo encontrado' : 'grupos encontrados'}
        </p>
      </div>

      {/* Toolbar: Filtros + Colunas */}
      <div className="flex items-center justify-end" style={{ gap: 10 }}>
        {/* Filtros (popover, estilo date-picker) */}
        <div style={{ position: 'relative' }}>
          <button
            ref={filterBtnRef}
            onClick={openFilters}
            className="flex items-center"
            style={{ gap: 8, height: 38, padding: '0 16px', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', color: 'var(--text-strong)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)' }}
          >
            <Filter size={15} style={{ color: 'var(--text-muted)' }} />
            Filtros
            {activeFilterCount > 0 && (
              <span style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', padding: '2px 8px', borderRadius: '9999px', background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                {activeFilterCount}
              </span>
            )}
            <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: filterOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base)' }} />
          </button>

          {filterOpen && (
            <>
              <div onClick={() => setFilterOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
              <div
                style={{
                  position: 'absolute',
                  [filterPlacement === 'below' ? 'top' : 'bottom']: 'calc(100% + 8px)',
                  right: 0,
                  zIndex: 31,
                  width: 440,
                  maxWidth: 'calc(100vw - 48px)',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: 20,
                }}
              >
                <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                  <FilterField label="Nome">
                    <Input placeholder="Buscar por nome" value={draft.nome} onChange={(e) => setDraft({ ...draft, nome: e.target.value })} />
                  </FilterField>
                  <FilterField label="Gerente">
                    <Select value={draft.gerente} onChange={(e) => setDraft({ ...draft, gerente: e.target.value })} options={GERENTES_SEED} placeholder="Todos" />
                  </FilterField>
                  <FilterField label="Tipo de Cliente">
                    <Select value={draft.tipoCliente} onChange={(e) => setDraft({ ...draft, tipoCliente: e.target.value })} options={TIPO_CLIENTE_OPTS} placeholder="Todos" />
                  </FilterField>
                  <FilterField label="Possui Parecer de Crédito">
                    <Select value={draft.possuiParecer} onChange={(e) => setDraft({ ...draft, possuiParecer: e.target.value })} options={['Sim', 'Não']} placeholder="Todos" />
                  </FilterField>
                  <FilterField label="Vencimento do Limite (mín.)">
                    <Input type="date" value={draft.vencMin} onChange={(e) => setDraft({ ...draft, vencMin: e.target.value })} />
                  </FilterField>
                  <FilterField label="Vencimento do Limite (máx.)">
                    <Input type="date" value={draft.vencMax} onChange={(e) => setDraft({ ...draft, vencMax: e.target.value })} />
                  </FilterField>
                </div>
                <div className="flex items-center justify-end" style={{ gap: 10, marginTop: 18 }}>
                  <button
                    onClick={handleClear}
                    style={{ height: 38, padding: '0 16px', background: 'none', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)' }}
                  >
                    Limpar
                  </button>
                  <button
                    onClick={handleFilter}
                    className="flex items-center"
                    style={{ gap: 6, height: 38, padding: '0 18px', background: 'var(--action-primary-bg)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em' }}
                  >
                    <Filter size={13} /> FILTRAR
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Controle de colunas */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setColsMenuOpen((v) => !v)}
            className="flex items-center"
            style={{ gap: 6, height: 38, padding: '0 14px', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)' }}
          >
            <SlidersHorizontal size={14} /> Colunas
          </button>
          {colsMenuOpen && (
            <>
              <div onClick={() => setColsMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 31, background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', minWidth: 220, padding: 8 }}>
                {ALL_COLS.map((c) => (
                  <label
                    key={c.key}
                    className="flex items-center"
                    style={{ gap: 10, padding: '8px 10px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <input type="checkbox" checked={visibleCols.has(c.key)} onChange={() => toggleCol(c.key)} />
                    {c.label}
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabela de resultados */}
      <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', background: 'var(--surface-card)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ width: 'max-content', minWidth: '100%' }}>
            <div className="grid" style={{ gridTemplateColumns: gridTemplate, padding: '12px 20px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              <div>Nome</div>
              {cols.map((c) => <div key={c.key} style={{ textAlign: c.align }}>{c.label}</div>)}
              <div style={{ textAlign: 'right' }}>Ações</div>
            </div>

            {pageItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center" style={{ gap: 10, padding: '48px 24px', textAlign: 'center' }}>
                <Building2 size={30} strokeWidth={1.5} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-default)' }}>Nenhum grupo encontrado</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Ajuste os filtros para ver outros resultados.</div>
              </div>
            ) : (
              pageItems.map((g) => {
                const ParecerIcon = PARECER_ICON[g.parecerCredito];
                return (
                  <div
                    key={g.id}
                    onClick={() => onOpen(g.id)}
                    className="grid items-center"
                    style={{ gridTemplateColumns: gridTemplate, padding: '14px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', cursor: 'pointer', transition: 'background var(--duration-fast)', whiteSpace: 'nowrap' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>{g.nome}</div>
                    {visibleCols.has('documento') && <div style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{g.documento}</div>}
                    {visibleCols.has('statusOperacao') && (
                      <div>
                        <span
                          className="flex items-center"
                          style={{ gap: 6, width: 'fit-content', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.04em', padding: '4px 9px', borderRadius: '9999px', background: `color-mix(in srgb, ${statusOperacaoColor(g.statusOperacao)} 14%, transparent)`, color: statusOperacaoColor(g.statusOperacao), whiteSpace: 'nowrap' }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: '9999px', background: statusOperacaoColor(g.statusOperacao) }} />
                          {g.statusOperacao}
                        </span>
                      </div>
                    )}
                    {visibleCols.has('limite') && <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{brl(g.limite, { compact: true })}</div>}
                    {visibleCols.has('limiteAutoatendimento') && <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-default)' }}>{brl(g.limiteAutoatendimento, { compact: true })}</div>}
                    {visibleCols.has('riscoTotal') && <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-default)' }}>{brl(g.riscoTotal, { compact: true })}</div>}
                    {visibleCols.has('riscoUraStt') && <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-default)' }}>{brl(g.riscoUraStt, { compact: true })}</div>}
                    {visibleCols.has('gerente') && <div style={{ color: 'var(--text-default)' }}>{g.gerente}</div>}
                    {visibleCols.has('vencimentoLimite') && (
                      <div style={{ fontVariantNumeric: 'tabular-nums', color: g.vencimentoLimite ? 'var(--text-default)' : 'var(--text-muted)' }}>
                        {g.vencimentoLimite ?? 'Não Informado'}
                      </div>
                    )}
                    {visibleCols.has('parecerCredito') && (
                      <div
                        className="flex items-center justify-center"
                        style={{ gap: 6, color: parecerColor(g.parecerCredito), width: '100%' }}
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          setParecerTooltip({ label: parecerLabel(g.parecerCredito), x: rect.left + rect.width / 2, y: rect.top });
                        }}
                        onMouseLeave={() => setParecerTooltip(null)}
                      >
                        <ParecerIcon size={15} strokeWidth={2.25} />
                      </div>
                    )}
                    <div className="flex justify-end" style={{ position: 'relative' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === g.id ? null : g.id); }}
                        className="flex items-center justify-center"
                        style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', border: 'none', background: menuOpenId === g.id ? 'var(--surface-sunken)' : 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        <MoreVertical size={16} />
                      </button>
                      {menuOpenId === g.id && (
                        <>
                          <div onClick={(e) => { e.stopPropagation(); setMenuOpenId(null); }} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
                          <div style={{ position: 'absolute', top: 36, right: 0, zIndex: 31, background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', minWidth: 200, overflow: 'hidden' }}>
                            <MenuItem icon={Settings2} onClick={(e) => { e.stopPropagation(); setMenuOpenId(null); onOpen(g.id); }}>Parametrizações</MenuItem>
                            <MenuItem icon={UserCog} onClick={(e) => { e.stopPropagation(); setMenuOpenId(null); setTransferindo(g); }}>Transferir gerente</MenuItem>
                            <MenuItem icon={BellRing} onClick={(e) => { e.stopPropagation(); setMenuOpenId(null); setConfigurandoNotif(g); }}>Configurar notificações</MenuItem>
                            <MenuItem icon={ShieldCheck} onClick={(e) => { e.stopPropagation(); setMenuOpenId(null); setHabilitando(g); }}>Habilitar para operar</MenuItem>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Paginação */}
        <div className="flex items-center justify-between" style={{ padding: '12px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          <div className="flex items-center" style={{ gap: 8 }}>
            <span>Itens por página</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              style={{ height: 30, padding: '0 8px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', color: 'var(--text-default)', fontSize: 'var(--text-xs)' }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center" style={{ gap: 14 }}>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>
              {filtered.length === 0 ? '0–0' : `${(clampedPage - 1) * pageSize + 1}–${Math.min(clampedPage * pageSize, filtered.length)}`} de {filtered.length}
            </span>
            <div className="flex items-center" style={{ gap: 4 }}>
              <PageButton onClick={() => setPage(1)} disabled={clampedPage === 1}><ChevronsLeft size={14} /></PageButton>
              <PageButton onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={clampedPage === 1}><ChevronLeft size={14} /></PageButton>
              <PageButton onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={clampedPage === totalPages}><ChevronRight size={14} /></PageButton>
              <PageButton onClick={() => setPage(totalPages)} disabled={clampedPage === totalPages}><ChevronsRight size={14} /></PageButton>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip do Parecer de Crédito (fixed, não sofre clipping do scroll horizontal) */}
      {parecerTooltip && (
        <div
          className="flex flex-col items-center"
          style={{ position: 'fixed', left: parecerTooltip.x, top: parecerTooltip.y - 8, transform: 'translate(-50%, -100%)', zIndex: 200, pointerEvents: 'none' }}
        >
          <div
            style={{
              background: 'var(--gci-base)', color: '#fff', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)',
              padding: '6px 10px', borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap', boxShadow: 'var(--shadow-md)',
            }}
          >
            {parecerTooltip.label}
          </div>
          <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid var(--gci-base)' }} />
        </div>
      )}

      {transferindo && (
        <TransferirGerenteModal
          grupoNome={transferindo.nome}
          gerenteAtual={transferindo.gerente}
          onClose={() => setTransferindo(null)}
          onConfirm={() => setTransferindo(null)}
        />
      )}
      {configurandoNotif && (
        <ConfigurarNotificacoesModal
          grupoNome={configurandoNotif.nome}
          onClose={() => setConfigurandoNotif(null)}
          onConfirm={() => setConfigurandoNotif(null)}
        />
      )}
      {habilitando && (
        <HabilitarOperarModal
          grupoNome={habilitando.nome}
          onClose={() => setHabilitando(null)}
          onConfirm={() => setHabilitando(null)}
        />
      )}
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{ width: '100%', height: 38, padding: '0 12px', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }}
    />
  );
}

function Select({ value, onChange, options, placeholder }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[]; placeholder: string }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{ width: '100%', height: 38, padding: '0 12px', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function MenuItem({ onClick, icon: Icon, children }: { onClick: (e: React.MouseEvent) => void; icon?: LucideIcon; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center"
      style={{ gap: 10, width: '100%', padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--text-default)', textAlign: 'left' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {Icon && <Icon size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
      {children}
    </button>
  );
}

function PageButton({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center"
      style={{ width: 28, height: 28, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--surface-card)', cursor: disabled ? 'not-allowed' : 'pointer', color: disabled ? 'var(--text-disabled)' : 'var(--text-muted)' }}
    >
      {children}
    </button>
  );
}

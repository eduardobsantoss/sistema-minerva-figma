import { useMemo, useState } from 'react';
import { X, Pencil, Search, ArrowRight, ArrowLeft, Link2 } from 'lucide-react';
import {
  nomesAgrupamentos,
  type Agrupamento,
  type OperacaoVinculavel,
  type TipoOperacaoVinculo,
} from '../../data/riscoData';

type FiltroTipo = 'TODOS' | TipoOperacaoVinculo;

const FILTRO_OPTS: { key: FiltroTipo; label: string }[] = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'CRA', label: 'CRAs' },
  { key: 'FIDC', label: 'FIDCs' },
];

interface Props {
  agrupamento: Agrupamento;
  agrupamentos: Agrupamento[];
  operacoes: OperacaoVinculavel[];
  onUpdateOperacoes: (next: OperacaoVinculavel[]) => void;
  onClose: () => void;
  onEdit: () => void;
}

export function VincularAgrupamentoModal({ agrupamento, agrupamentos, operacoes, onUpdateOperacoes, onClose, onEdit }: Props) {
  const [searchLeft, setSearchLeft] = useState('');
  const [searchRight, setSearchRight] = useState('');
  const [filterLeft, setFilterLeft] = useState<FiltroTipo>('TODOS');
  const [filterRight, setFilterRight] = useState<FiltroTipo>('TODOS');
  const [selectedLeft, setSelectedLeft] = useState<Set<string>>(new Set());
  const [selectedRight, setSelectedRight] = useState<Set<string>>(new Set());

  const disponiveis = useMemo(
    () => operacoes.filter((o) => !o.agrupamentoIds.includes(agrupamento.id)),
    [operacoes, agrupamento.id],
  );
  const vinculadas = useMemo(
    () => operacoes.filter((o) => o.agrupamentoIds.includes(agrupamento.id)),
    [operacoes, agrupamento.id],
  );

  const disponiveisFiltradas = useMemo(
    () => filtrarOperacoes(disponiveis, filterLeft, searchLeft),
    [disponiveis, filterLeft, searchLeft],
  );
  const vinculadasFiltradas = useMemo(
    () => filtrarOperacoes(vinculadas, filterRight, searchRight),
    [vinculadas, filterRight, searchRight],
  );

  const crasVinculados = vinculadas.filter((o) => o.tipo === 'CRA').length;
  const fidcsVinculados = vinculadas.filter((o) => o.tipo === 'FIDC').length;

  const toggle = (set: Set<string>, setFn: (s: Set<string>) => void, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id); else next.add(id);
    setFn(next);
  };

  const handleVincular = () => {
    if (selectedLeft.size === 0) return;
    onUpdateOperacoes(
      operacoes.map((o) =>
        selectedLeft.has(o.id) ? { ...o, agrupamentoIds: [...o.agrupamentoIds, agrupamento.id] } : o,
      ),
    );
    setSelectedLeft(new Set());
  };

  const handleDesvincular = () => {
    if (selectedRight.size === 0) return;
    onUpdateOperacoes(
      operacoes.map((o) =>
        selectedRight.has(o.id) ? { ...o, agrupamentoIds: o.agrupamentoIds.filter((id) => id !== agrupamento.id) } : o,
      ),
    );
    setSelectedRight(new Set());
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(8,60,74,0.55)', backdropFilter: 'blur(8px)',
        zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 32, animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col"
        style={{
          background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)',
          width: '100%', maxWidth: 1040, maxHeight: '92vh',
          overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header — claro, conforme tokens (sem faixa teal) */}
        <div className="flex items-center justify-between" style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
          <div className="flex items-center" style={{ gap: 10 }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              Agrupamento: {agrupamento.nome}
            </h2>
            <button
              onClick={onEdit}
              aria-label="Editar agrupamento"
              title="Editar agrupamento"
              className="flex items-center justify-center"
              style={{ width: 30, height: 30, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--surface-card)', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}
            >
              <Pencil size={13} />
            </button>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex items-center justify-center"
            style={{ width: 32, height: 32, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', background: 'var(--surface-card)', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col" style={{ padding: 24, gap: 20, overflow: 'auto' }}>
          {/* Cards de resumo — somente leitura, calculados */}
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            <SummaryCard label="CRAs vinculados" value={crasVinculados} />
            <SummaryCard label="FIDCs vinculados" value={fidcsVinculados} />
            <SummaryCard label="Total" value={vinculadas.length} strong />
          </div>

          {/* Transferência dupla */}
          <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', padding: 20 }}>
            <div className="flex items-center" style={{ gap: 8, marginBottom: 14 }}>
              <Link2 size={14} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Operações Vinculadas
              </span>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1fr 140px 1fr', gap: 16, alignItems: 'stretch' }}>
              <TransferPanel
                title={`Disponíveis (${disponiveisFiltradas.length})`}
                search={searchLeft}
                onSearch={setSearchLeft}
                filter={filterLeft}
                onFilter={setFilterLeft}
                items={disponiveisFiltradas}
                agrupamentos={agrupamentos}
                selected={selectedLeft}
                onToggleItem={(id) => toggle(selectedLeft, setSelectedLeft, id)}
              />

              {/* Ações centrais */}
              <div className="flex flex-col items-center justify-center" style={{ gap: 10 }}>
                <TransferButton
                  icon={ArrowRight}
                  label="Vincular"
                  active={selectedLeft.size > 0}
                  onClick={handleVincular}
                />
                <TransferButton
                  icon={ArrowLeft}
                  label="Desvincular"
                  active={selectedRight.size > 0}
                  onClick={handleDesvincular}
                  reverse
                />
              </div>

              <TransferPanel
                title={`Vinculadas (${vinculadasFiltradas.length})`}
                search={searchRight}
                onSearch={setSearchRight}
                filter={filterRight}
                onFilter={setFilterRight}
                items={vinculadasFiltradas}
                agrupamentos={agrupamentos}
                selected={selectedRight}
                onToggleItem={(id) => toggle(selectedRight, setSelectedRight, id)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end" style={{ gap: 12, padding: '14px 28px', borderTop: '1px solid var(--border-default)', background: 'var(--surface-card)', flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{ height: 40, padding: '0 20px', background: 'var(--surface-card)', color: 'var(--text-strong)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)' }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function filtrarOperacoes(list: OperacaoVinculavel[], filtro: FiltroTipo, search: string): OperacaoVinculavel[] {
  const needle = search.trim().toLowerCase();
  return list.filter((o) => {
    if (filtro !== 'TODOS' && o.tipo !== filtro) return false;
    if (needle && !o.nome.toLowerCase().includes(needle)) return false;
    return true;
  });
}

function SummaryCard({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '14px 18px', background: strong ? 'var(--surface-sunken)' : 'var(--surface-card)' }}>
      <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
    </div>
  );
}

function TransferButton({ icon: Icon, label, active, onClick, reverse }: {
  icon: typeof ArrowRight; label: string; active: boolean; onClick: () => void; reverse?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!active}
      className="flex items-center justify-center"
      style={{
        gap: 8, width: '100%', height: 40, padding: '0 14px',
        borderRadius: 'var(--radius-lg)', border: 'none', cursor: active ? 'pointer' : 'not-allowed',
        fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em',
        background: active ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
        color: active ? '#fff' : 'var(--text-disabled)',
        transition: 'background var(--duration-base)',
        flexDirection: reverse ? 'row-reverse' : 'row',
      }}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

function TransferPanel({ title, search, onSearch, filter, onFilter, items, agrupamentos, selected, onToggleItem }: {
  title: string;
  search: string;
  onSearch: (v: string) => void;
  filter: FiltroTipo;
  onFilter: (v: FiltroTipo) => void;
  items: OperacaoVinculavel[];
  agrupamentos: Agrupamento[];
  selected: Set<string>;
  onToggleItem: (id: string) => void;
}) {
  return (
    <div className="flex flex-col" style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: 0 }}>
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-default)', background: 'var(--surface-sunken)' }}>
        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', marginBottom: 10 }}>
          {title}
        </div>
        <div className="relative" style={{ marginBottom: 10 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar CRA ou FIDC pelo nome"
            style={{ width: '100%', height: 34, paddingLeft: 32, paddingRight: 10, background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', outline: 'none', fontSize: 'var(--text-xs)', color: 'var(--text-strong)' }}
          />
        </div>
        <div className="flex items-center" style={{ gap: 6 }}>
          {FILTRO_OPTS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => onFilter(f.key)}
                style={{
                  padding: '4px 10px', borderRadius: '9999px', cursor: 'pointer',
                  fontSize: 10, fontWeight: 'var(--weight-bold)',
                  border: `1px solid ${active ? 'var(--gci-base)' : 'var(--border-default)'}`,
                  background: active ? 'var(--surface-selected)' : 'var(--surface-card)',
                  color: active ? 'var(--gci-base)' : 'var(--text-muted)',
                  transition: 'all var(--duration-fast)',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ overflowY: 'auto', maxHeight: 340, minHeight: 340 }}>
        {items.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Nenhuma operação encontrada.
          </div>
        ) : (
          items.map((op) => (
            <OperationRow
              key={op.id}
              op={op}
              agrupamentos={agrupamentos}
              checked={selected.has(op.id)}
              onToggle={() => onToggleItem(op.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function OperationRow({ op, agrupamentos, checked, onToggle }: {
  op: OperacaoVinculavel; agrupamentos: Agrupamento[]; checked: boolean; onToggle: () => void;
}) {
  const nomes = nomesAgrupamentos(op, agrupamentos);
  const subtitle = nomes.length > 0 ? `Agrupamento: ${nomes.join(', ')}` : 'Sem agrupamento';
  const badgeBg = op.tipo === 'CRA' ? 'var(--agro-light)' : 'var(--gci-light)';
  const badgeColor = op.tipo === 'CRA' ? 'var(--agro-base)' : 'var(--gci-base)';

  return (
    <label
      className="flex items-center"
      style={{ gap: 10, padding: '10px 14px', borderBottom: '1px solid var(--border-default)', cursor: 'pointer', background: checked ? 'var(--surface-selected)' : 'transparent' }}
    >
      <input type="checkbox" checked={checked} onChange={onToggle} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {op.nome}
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {subtitle}
        </div>
      </div>
      <span
        style={{
          fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em',
          padding: '3px 8px', borderRadius: 'var(--radius-sm)', flexShrink: 0,
          background: badgeBg, color: badgeColor,
        }}
      >
        {op.tipo}
      </span>
    </label>
  );
}

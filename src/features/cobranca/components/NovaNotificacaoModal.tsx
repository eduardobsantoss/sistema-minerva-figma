import { useEffect, useRef, useState } from 'react';
import {
  X,
  Settings,
  Clock,
  AlertCircle,
  Building2,
  ChevronRight,
  Check,
  Trash2,
  Plus,
  Search,
  ChevronDown,
} from 'lucide-react';
import type { Metodo, VeiculoTipo } from '../data/cobrancaData';
import { mockVeiculos } from '../data/cobrancaData';

export interface NewNotificacaoData {
  nome: string;
  metodos: Metodo[];
  templateAVencer: string;
  templateVencidos: string;
  intervalosAVencer: number[];
  intervalosVencidos: number[];
  veiculos: string[];
}

interface Props {
  onClose: () => void;
  onCreate: (data: NewNotificacaoData) => void;
}

interface StepDef {
  key: string;
  label: string;
  icon: typeof Settings;
}

const steps: StepDef[] = [
  { key: 'config', label: 'Configuração', icon: Settings },
  { key: 'avencer', label: 'A Vencer', icon: Clock },
  { key: 'vencidos', label: 'Vencidos', icon: AlertCircle },
  { key: 'veiculos', label: 'Veículos', icon: Building2 },
];

type TemplateTom = 'amigavel' | 'formal' | 'cobranca';

const TEMPLATES: Record<TemplateTom, { label: string; avencer: string; vencidos: string }> = {
  amigavel: {
    label: 'Tom Amigável',
    avencer: 'Olá {nome}! Só passando para lembrar que seu título de {valor} vence em {vencimento}. Qualquer dúvida, estamos por aqui! 😊',
    vencidos: 'Oi {nome}, notamos que seu título de {valor} venceu em {vencimento}. Sabemos que imprevistos acontecem — entre em contato para que possamos ajudar!',
  },
  formal: {
    label: 'Tom Formal',
    avencer: 'Prezado(a) {nome}, informamos que o título de valor {valor} possui vencimento em {vencimento}. Solicitamos a regularização dentro do prazo.',
    vencidos: 'Prezado(a) {nome}, verificamos que o título de valor {valor}, com vencimento em {vencimento}, encontra-se em aberto. Pedimos que entre em contato para providenciar a liquidação.',
  },
  cobranca: {
    label: 'Tom de Cobrança',
    avencer: '{nome}, seu título de {valor} vence em {vencimento}. Regularize antes do vencimento para evitar encargos adicionais.',
    vencidos: 'AVISO: {nome}, o título de {valor} com vencimento em {vencimento} está vencido. A quitação imediata é necessária para evitar protesto.',
  },
};

/* ─── Field sub-components ─────────────────────────────── */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        height: 40,
        padding: '0 14px',
        width: '100%',
        background: 'var(--surface-card)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'var(--border-default)',
        borderRadius: 'var(--radius-md)',
        outline: 'none',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-strong)',
      }}
    />
  );
}

/* ─── Step 1: Configuração ─────────────────────────────── */

function TemplateSelector({
  label,
  value,
  onChange,
  textKey,
}: {
  label: string;
  value: TemplateTom;
  onChange: (v: TemplateTom) => void;
  textKey: 'avencer' | 'vencidos';
}) {
  const [open, setOpen] = useState(false);
  const selected = TEMPLATES[value];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <FieldLabel>{label}</FieldLabel>

      {/* Selector trigger */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            width: '100%',
            padding: '10px 14px',
            background: 'var(--surface-card)',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: open ? 'var(--border-focus)' : 'var(--border-default)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>{selected.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selected[textKey].slice(0, 90)}…
            </div>
          </div>
          <ChevronDown size={15} style={{ color: 'var(--text-muted)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base)' }} />
        </button>

        {open && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: 'var(--surface-card)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: 'var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 30,
              overflow: 'hidden',
            }}
          >
            {(Object.entries(TEMPLATES) as [TemplateTom, typeof TEMPLATES.amigavel][]).map(([key, t]) => (
              <button
                key={key}
                type="button"
                onClick={() => { onChange(key); setOpen(false); }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: value === key ? 'var(--surface-sunken)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: key !== 'cobranca' ? '1px solid var(--border-default)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
                onMouseEnter={(e) => { if (value !== key) e.currentTarget.style.background = 'var(--surface-sunken)'; }}
                onMouseLeave={(e) => { if (value !== key) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {value === key && <Check size={13} style={{ color: 'var(--success-base)', flexShrink: 0 }} />}
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>{t.label}</span>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', paddingLeft: value === key ? 21 : 0 }}>
                  {t[textKey].slice(0, 80)}…
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Preview */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
          Pré-visualização do template
        </div>
        <div
          style={{
            padding: 14,
            background: 'var(--surface-sunken)',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: 'var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-default)',
            lineHeight: 'var(--leading-relaxed)',
          }}
        >
          {selected[textKey]}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2/3: Interval list ──────────────────────────── */

function IntervalStep({
  title,
  subtitle,
  inputLabel,
  intervals,
  onChange,
  mode,
}: {
  title: string;
  subtitle: string;
  inputLabel: string;
  intervals: number[];
  onChange: (v: number[]) => void;
  mode: 'avencer' | 'vencidos';
}) {
  const listRef = useRef<HTMLDivElement>(null);

  const addRow = () => {
    const last = intervals[intervals.length - 1] ?? (mode === 'avencer' ? 31 : 0);
    const next = mode === 'avencer' ? Math.max(last - 1, 1) : last + 1;
    onChange([...intervals, next]);
    setTimeout(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }, 30);
  };

  const removeRow = (idx: number) => {
    onChange(intervals.filter((_, i) => i !== idx));
  };

  const updateRow = (idx: number, val: string) => {
    const n = parseInt(val, 10);
    const clamped = mode === 'avencer' ? Math.max(1, isNaN(n) ? 1 : n) : Math.max(1, isNaN(n) ? 1 : n);
    onChange(intervals.map((v, i) => (i === idx ? clamped : v)));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-strong)', marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{subtitle}</div>
      </div>

      <div
        ref={listRef}
        style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 340, overflowY: 'auto' }}
      >
        {intervals.map((val, idx) => (
          <div key={idx} className="flex items-center" style={{ gap: 12 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '9999px',
                background: 'var(--surface-sunken)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--text-muted)',
                flexShrink: 0,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {idx + 1}
            </div>
            <div style={{ flex: 1 }}>
              <FieldLabel>{inputLabel}</FieldLabel>
              <input
                type="number"
                min={1}
                value={val}
                onChange={(e) => updateRow(idx, e.target.value)}
                style={{
                  height: 40,
                  padding: '0 14px',
                  width: '100%',
                  background: 'var(--surface-card)',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: 'var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-strong)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              />
            </div>
            <button
              onClick={() => removeRow(idx)}
              style={{
                marginTop: 20,
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'color var(--duration-fast), background var(--duration-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--action-danger-text-only)'; e.currentTarget.style.background = 'var(--danger-light)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
              title="Remover intervalo"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addRow}
        className="flex items-center"
        style={{
          gap: 6,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-link)',
          fontWeight: 600,
          fontSize: 'var(--text-sm)',
          padding: '4px 0',
          alignSelf: 'flex-start',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        <Plus size={15} /> Adicionar intervalo
      </button>
    </div>
  );
}

/* ─── Step 4: Veículos ─────────────────────────────────── */

type VeiculosTabKey = 'Todos' | 'FIDC' | 'CRA' | 'Garantia';

const TAB_LABELS: Record<VeiculosTabKey, string> = {
  Todos: 'Todos',
  FIDC: 'FIDCs',
  CRA: 'CRAs',
  Garantia: 'Garantias',
};

const TIPO_BADGE: Record<VeiculoTipo, { bg: string; fg: string }> = {
  FIDC: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  CRA: { bg: 'var(--agro-light)', fg: 'var(--agro-base)' },
  Garantia: { bg: '#EEF0FF', fg: '#4F46E5' },
};

// Borderless, shadow-only checkbox — white unchecked, GCI navy checked
function Checkbox({
  checked,
  indeterminate = false,
  onChange,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
}) {
  const isOn = checked || indeterminate;

  return (
    <div
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      tabIndex={0}
      onClick={onChange}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onChange(); } }}
      style={{
        width: 16,
        height: 16,
        borderRadius: 4,
        border: 'none',
        outline: 'none',
        flexShrink: 0,
        cursor: 'pointer',
        background: isOn ? 'var(--gci-base)' : '#fff',
        boxShadow: isOn
          ? '0 0 0 2px rgba(8,60,74,0.18)'
          : '0 1px 3px rgba(15,23,42,0.14), 0 1px 2px rgba(15,23,42,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background var(--duration-fast), box-shadow var(--duration-fast)',
      }}
    >
      {isOn && (
        indeterminate ? (
          <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
            <rect width="8" height="2" rx="1" fill="white" />
          </svg>
        ) : (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      )}
    </div>
  );
}

function VeiculosStep({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const [tab, setTab] = useState<VeiculosTabKey>('Todos');
  const [query, setQuery] = useState('');

  const tabVeiculos = tab === 'Todos'
    ? mockVeiculos
    : mockVeiculos.filter((v) => v.tipo === tab);

  const visible = query.trim()
    ? tabVeiculos.filter((v) => v.nome.toLowerCase().includes(query.toLowerCase()))
    : tabVeiculos;

  const toggle = (id: string) =>
    selected.includes(id)
      ? onChange(selected.filter((s) => s !== id))
      : onChange([...selected, id]);

  const remove = (id: string) => onChange(selected.filter((s) => s !== id));

  // Select-all checkbox state for the visible list
  const visibleIds = visible.map((v) => v.id);
  const allChecked = visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));
  const someChecked = visibleIds.some((id) => selected.includes(id));
  const indeterminate = someChecked && !allChecked;

  const toggleAll = () => {
    if (allChecked) {
      // deselect all visible
      onChange(selected.filter((id) => !visibleIds.includes(id)));
    } else {
      // select all visible
      onChange([...new Set([...selected, ...visibleIds])]);
    }
  };

  // Selected panel shows only vehicles from the current tab
  const selectedInTab = tab === 'Todos'
    ? mockVeiculos.filter((v) => selected.includes(v.id))
    : mockVeiculos.filter((v) => v.tipo === tab && selected.includes(v.id));

  const countByType = (t: VeiculoTipo) =>
    mockVeiculos.filter((v) => v.tipo === t && selected.includes(v.id)).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-strong)', marginBottom: 6 }}>
          Veículos associados
        </div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          Selecione os veículos que executarão esta notificação.
        </div>
      </div>

      {/* Tabs — with count badge for selected in each filter */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-default)' }}>
        {(['Todos', 'FIDC', 'CRA', 'Garantia'] as VeiculosTabKey[]).map((t) => {
          const cnt = t === 'Todos'
            ? selected.length
            : mockVeiculos.filter((v) => v.tipo === t && selected.includes(v.id)).length;
          return (
            <button
              key={t}
              onClick={() => { setTab(t); setQuery(''); }}
              className="flex items-center"
              style={{
                gap: 6,
                padding: '10px 20px',
                background: 'transparent',
                border: 'none',
                borderBottom: tab === t ? '2px solid var(--agro-base)' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                fontWeight: tab === t ? 700 : 500,
                color: tab === t ? 'var(--text-strong)' : 'var(--text-muted)',
                marginBottom: -1,
                transition: 'color var(--duration-fast)',
              }}
            >
              {TAB_LABELS[t]}
              {cnt > 0 && (
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  background: tab === t ? 'var(--agro-light)' : 'var(--status-neutral-bg)',
                  color: tab === t ? 'var(--agro-base)' : 'var(--status-neutral-text)',
                }}>
                  {cnt}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filtrar por nome..."
          style={{
            height: 40, paddingLeft: 36, paddingRight: 14, width: '100%',
            background: 'var(--surface-card)',
            borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)',
            borderRadius: 'var(--radius-md)', outline: 'none',
            fontSize: 'var(--text-sm)', color: 'var(--text-strong)',
          }}
        />
      </div>

      {/* Vehicle list */}
      <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>

        {/* Select-all header row */}
        <label
          className="flex items-center"
          style={{
            gap: 10, padding: '10px 14px',
            background: 'var(--surface-sunken)',
            borderBottom: '1px solid var(--border-default)',
            cursor: 'pointer',
          }}
        >
          <Checkbox checked={allChecked} indeterminate={indeterminate} onChange={toggleAll} />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Selecionar todos
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {visibleIds.filter((id) => selected.includes(id)).length} / {visible.length}
          </span>
        </label>

        {visible.length === 0 ? (
          <div className="flex items-center justify-center" style={{ padding: '24px 14px', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            Nenhum veículo encontrado.
          </div>
        ) : (
          visible.map((v, idx) => {
            const isChecked = selected.includes(v.id);
            const badge = TIPO_BADGE[v.tipo];
            return (
              <label
                key={v.id}
                className="flex items-center"
                style={{
                  gap: 10, padding: '11px 14px',
                  borderBottom: idx < visible.length - 1 ? '1px solid var(--border-default)' : 'none',
                  background: isChecked ? 'rgba(8,60,74,0.03)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background var(--duration-fast)',
                }}
                onMouseEnter={(e) => { if (!isChecked) e.currentTarget.style.background = 'var(--surface-sunken)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = isChecked ? 'rgba(8,60,74,0.03)' : 'transparent'; }}
              >
                <Checkbox checked={isChecked} onChange={() => toggle(v.id)} />
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-sm)', background: badge.bg, color: badge.fg, flexShrink: 0 }}>
                  {v.tipo}
                </span>
                <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: isChecked ? 600 : 400, color: 'var(--text-strong)' }}>
                  {v.nome}
                </span>
              </label>
            );
          })
        )}
      </div>

      {/* Selected chips — scoped to current tab */}
      {selectedInTab.length > 0 && (
        <div>
          <div className="flex items-center" style={{ gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' }}>
              {tab === 'Todos' ? 'Selecionados' : `Selecionados — ${TAB_LABELS[tab]}`}
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--status-active-bg)', color: 'var(--status-active-text)' }}>
              {selectedInTab.length}
            </span>
          </div>
          <div className="flex flex-wrap" style={{ gap: 8 }}>
            {selectedInTab.map((v) => {
              const badge = TIPO_BADGE[v.tipo];
              return (
                <span
                  key={v.id}
                  className="flex items-center"
                  style={{ gap: 6, padding: '5px 10px', borderRadius: 'var(--radius-full)', background: 'var(--status-active-bg)', color: 'var(--status-active-text)', fontSize: 'var(--text-xs)', fontWeight: 600 }}
                >
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 'var(--radius-sm)', background: badge.bg, color: badge.fg }}>
                    {v.tipo}
                  </span>
                  {v.nome}
                  <button
                    onClick={() => remove(v.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--status-active-text)', display: 'flex', padding: 0, marginLeft: 2 }}
                    title="Remover"
                  >
                    <X size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Cross-tab summary */}
      <div style={{ padding: '10px 16px', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
        <strong style={{ color: 'var(--text-default)' }}>{countByType('FIDC')}</strong> FIDCs ·{' '}
        <strong style={{ color: 'var(--text-default)' }}>{countByType('CRA')}</strong> CRAs ·{' '}
        <strong style={{ color: 'var(--text-default)' }}>{countByType('Garantia')}</strong> Garantias selecionados
      </div>
    </div>
  );
}

/* ─── Main modal ────────────────────────────────────────── */

export function NovaNotificacaoModal({ onClose, onCreate }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [nome, setNome] = useState('');
  const [metodos, setMetodos] = useState<Metodo[]>(['Email']);
  const [templateAVencer, setTemplateAVencer] = useState<TemplateTom>('amigavel');
  const [templateVencidos, setTemplateVencidos] = useState<TemplateTom>('formal');
  const [intervalosAVencer, setIntervalosAVencer] = useState<number[]>([30, 15, 7]);
  const [intervalosVencidos, setIntervalosVencidos] = useState<number[]>([1, 5, 10]);
  const [veiculos, setVeiculos] = useState<string[]>([]);

  const step = steps[stepIdx];
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === steps.length - 1;

  const toggleMetodo = (m: Metodo) => {
    setMetodos((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
  };

  const handleSave = () => {
    onCreate({
      nome,
      metodos,
      templateAVencer: TEMPLATES[templateAVencer].avencer,
      templateVencidos: TEMPLATES[templateVencidos].vencidos,
      intervalosAVencer,
      intervalosVencidos,
      veiculos,
    });
  };

  // Close on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8,60,74,0.55)',
        backdropFilter: 'blur(8px)',
        zIndex: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: 840,
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between"
          style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}
        >
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--text-strong)', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 4 }}>
              Nova Notificação de Cobrança
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
              Configure a régua de notificação · Etapa {stepIdx + 1} de {steps.length}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Stepper */}
        <div
          className="flex"
          style={{ background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}
        >
          {steps.map((s, i) => {
            const Icon = s.icon;
            const done = i < stepIdx;
            const current = i === stepIdx;
            const color = current ? 'var(--agro-base)' : done ? 'var(--gci-base)' : 'var(--text-muted)';
            return (
              <button
                key={s.key}
                onClick={() => setStepIdx(i)}
                className="flex flex-col items-center justify-center"
                style={{
                  flex: 1,
                  gap: 6,
                  padding: '14px 8px 11px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: current ? '3px solid var(--agro-base)' : '3px solid transparent',
                  cursor: 'pointer',
                  color,
                  opacity: !current && !done ? 0.55 : 1,
                  transition: 'color var(--duration-base), opacity var(--duration-base), border-color var(--duration-base)',
                }}
                onMouseEnter={(e) => { if (!current) e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { if (!current && !done) e.currentTarget.style.opacity = '0.55'; }}
              >
                <Icon size={18} strokeWidth={current ? 2.25 : 1.5} />
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.20em', textTransform: 'uppercase', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 40 }}>
          {/* Step 1 — Configuração */}
          {step.key === 'config' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {/* Nome */}
              <div>
                <FieldLabel>Nome da Notificação *</FieldLabel>
                <TextInput value={nome} onChange={setNome} placeholder="Ex: Régua Padrão — A Vencer" />
              </div>

              {/* Métodos */}
              <div>
                <FieldLabel>Método de Notificação</FieldLabel>
                <div className="flex" style={{ gap: 8 }}>
                  {(['Email', 'WhatsApp', 'SMS'] as Metodo[]).map((m) => {
                    const active = metodos.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => toggleMetodo(m)}
                        style={{
                          padding: '10px 24px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid',
                          borderColor: active ? 'var(--action-primary-bg)' : 'var(--action-secondary-border)',
                          background: active ? 'var(--action-primary-bg)' : 'var(--action-secondary-bg)',
                          color: active ? '#fff' : 'var(--action-secondary-text)',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: 'var(--text-sm)',
                          transition: 'all var(--duration-fast)',
                        }}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Templates */}
              <div
                style={{
                  padding: 20,
                  background: 'var(--surface-sunken)',
                  borderRadius: 'var(--radius-lg)',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: 'var(--border-default)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 24,
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Templates de Mensagem
                </div>
                <TemplateSelector
                  label="Template para mensagens a vencer"
                  value={templateAVencer}
                  onChange={setTemplateAVencer}
                  textKey="avencer"
                />
                <div style={{ height: 1, background: 'var(--border-default)' }} />
                <TemplateSelector
                  label="Template para mensagens vencidas"
                  value={templateVencidos}
                  onChange={setTemplateVencidos}
                  textKey="vencidos"
                />
              </div>
            </div>
          )}

          {/* Step 2 — A Vencer */}
          {step.key === 'avencer' && (
            <IntervalStep
              title="Intervalos de Notificação — A Vencer"
              subtitle="Defina quantos dias antes do vencimento cada disparo deve ocorrer."
              inputLabel="Dias antes do vencimento"
              intervals={intervalosAVencer}
              onChange={setIntervalosAVencer}
              mode="avencer"
            />
          )}

          {/* Step 3 — Vencidos */}
          {step.key === 'vencidos' && (
            <IntervalStep
              title="Intervalos de Notificação — Vencidos"
              subtitle="Defina quantos dias após o vencimento cada disparo deve ocorrer."
              inputLabel="Dias após o vencimento"
              intervals={intervalosVencidos}
              onChange={setIntervalosVencidos}
              mode="vencidos"
            />
          )}

          {/* Step 4 — Veículos */}
          {step.key === 'veiculos' && (
            <VeiculosStep selected={veiculos} onChange={setVeiculos} />
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: '16px 32px',
            borderTop: '1px solid var(--border-default)',
            background: isLast ? 'rgba(5,150,105,0.04)' : 'var(--surface-card)',
            flexShrink: 0,
            transition: 'background var(--duration-base)',
          }}
        >
          <button
            onClick={isFirst ? onClose : () => setStepIdx((i) => i - 1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 600, fontSize: 'var(--text-sm)', padding: '10px 4px' }}
          >
            {isFirst ? 'Cancelar' : '← Voltar'}
          </button>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            {stepIdx + 1} / {steps.length}
          </span>
          <button
            onClick={isLast ? handleSave : () => setStepIdx((i) => i + 1)}
            className="flex items-center"
            style={{
              gap: 8,
              padding: '12px 28px',
              background: isLast ? 'var(--success-base)' : 'var(--action-primary-bg)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 'var(--text-sm)',
              letterSpacing: '0.04em',
              boxShadow: isLast
                ? '0 8px 20px -8px rgba(5,150,105,0.40)'
                : '0 8px 20px -8px rgba(8,60,74,0.30)',
            }}
          >
            {isLast ? 'Salvar Notificação' : 'Próxima Etapa'}
            {isLast ? <Check size={15} /> : <ChevronRight size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}

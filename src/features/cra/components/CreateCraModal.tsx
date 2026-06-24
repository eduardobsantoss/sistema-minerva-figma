import { useState } from 'react';
import {
  X,
  Info,
  Mail,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Briefcase,
  Phone,
  MapPin,
  type LucideIcon,
} from 'lucide-react';

export interface NewCraData {
  tipoOperacao: string;
  numeroEmissao: string;
  nomeFantasia: string;
}

interface Props {
  onClose: () => void;
  onCreate: (data: NewCraData) => void;
}

interface Step {
  key: string;
  label: string;
  icon: LucideIcon;
  hint: string;
}

const steps: Step[] = [
  { key: 'info', label: 'Campos de CRA', icon: Info, hint: 'Identificação da operação' },
];

const UF_OPTIONS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

export function CreateCraModal({ onClose, onCreate }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [form, setForm] = useState<NewCraData>({
    tipoOperacao: '',
    numeroEmissao: '',
    nomeFantasia: '',
  });

  const set = (field: keyof NewCraData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const setVal = (field: keyof NewCraData) => (v: string) =>
    setForm((prev) => ({ ...prev, [field]: v }));

  const step = steps[stepIdx];
  const isFirst = stepIdx === 0;
  const isLast  = stepIdx === steps.length - 1;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(8,60,74,0.55)',
        backdropFilter: 'blur(8px)',
        zIndex: 400,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
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
          maxWidth: 900,
          maxHeight: 'calc(100vh - 64px)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between" style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-default)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--text-strong)', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 4 }}>
              Novo CRA
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
              {step.hint} · Etapa {stepIdx + 1} de {steps.length}
            </p>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>

        {/* ── Stepper ── */}
        <div className="flex" style={{ background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border-default)' }}>
          {steps.map((s, i) => {
            const Icon = s.icon;
            const done    = i < stepIdx;
            const current = i === stepIdx;
            const color = current ? 'var(--agro-base)' : done ? 'var(--gci-base)' : 'var(--text-muted)';
            return (
              <button key={s.key} onClick={() => setStepIdx(i)} className="flex flex-col items-center justify-center" style={{
                flex: 1, gap: 6, padding: '14px 8px 11px',
                background: 'transparent', border: 'none',
                borderBottom: current ? '3px solid var(--agro-base)' : '3px solid transparent',
                cursor: 'pointer', color,
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

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 40 }}>

          {/* Campos de CRA */}
          {step.key === 'info' && (
            <StepGrid>
              <SelectField
                label="Tipo de Operação"
                options={['Mono CRA', 'Multi CRA']}
                placeholder="Selecione"
                span={4}
                value={form.tipoOperacao}
                onChange={setVal('tipoOperacao')}
              />
              <FormField
                label="Número de Emissão"
                placeholder="Ex: 4ª"
                span={4}
                value={form.numeroEmissao}
                onChange={set('numeroEmissao')}
              />
              <FormField
                label="Nome do CRA"
                placeholder="Ex: CRA Semeagro"
                span={4}
                value={form.nomeFantasia}
                onChange={set('nomeFantasia')}
              />
            </StepGrid>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between" style={{ padding: '16px 32px', borderTop: '1px solid var(--border-default)', background: 'var(--surface-card)' }}>
          <button onClick={isFirst ? onClose : () => setStepIdx((i) => i - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 600, fontSize: 'var(--text-sm)', padding: '10px 4px' }}>
            {isFirst ? 'Cancelar' : '← Voltar'}
          </button>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            {stepIdx + 1} / {steps.length}
          </span>
          <button onClick={isLast ? () => onCreate(form) : () => setStepIdx((i) => i + 1)} className="flex items-center" style={{
            gap: 8, padding: '12px 28px',
            background: isLast ? 'var(--success-base)' : 'var(--action-primary-bg)',
            color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
            fontWeight: 700, fontSize: 'var(--text-sm)', letterSpacing: '0.04em',
            boxShadow: isLast ? '0 8px 20px -8px rgba(5,150,105,0.40)' : '0 8px 20px -8px rgba(8,60,74,0.30)',
          }}>
            {isLast ? 'Finalizar Cadastro' : 'Próxima Etapa'}
            {isLast ? <Check size={15} /> : <ChevronRight size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────── */

function StepGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ComponentType<{ size?: number; strokeWidth?: number }> }) {
  return (
    <div className="flex items-center" style={{ gap: 8, fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase', marginTop: 8, marginBottom: 10 }}>
      {Icon && (
        <span className="flex items-center justify-center" style={{ width: 24, height: 24, borderRadius: 'var(--radius-md)', background: 'var(--agro-light)', color: 'var(--agro-base)' }}>
          <Icon size={13} strokeWidth={2} />
        </span>
      )}
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
      {children}
    </div>
  );
}

function Input({ disabled, style, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...rest} disabled={disabled} style={{
      height: 40, padding: '0 14px',
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)',
      borderRadius: 'var(--radius-md)', outline: 'none',
      fontSize: 'var(--text-sm)',
      color: disabled ? 'var(--text-muted)' : 'var(--text-strong)',
      width: '100%', ...style,
    }} />
  );
}

function FormField({ label, placeholder, type, span, disabled, value, onChange }: {
  label: string; placeholder?: string; type?: string; span?: number;
  disabled?: boolean; value?: string; onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div style={{ gridColumn: span ? `span ${span}` : undefined }}>
      <FieldLabel>{label}</FieldLabel>
      <Input placeholder={placeholder} type={type} disabled={disabled} value={value} onChange={onChange} />
    </div>
  );
}

function SelectField({ label, options, span, placeholder, value, onChange }: {
  label?: string; options: string[]; span?: number;
  placeholder?: string; value?: string; onChange?: (v: string) => void;
}) {
  return (
    <div style={{ gridColumn: span ? `span ${span}` : undefined }}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div style={{ position: 'relative' }}>
        <select value={value} onChange={(e) => onChange?.(e.target.value)} style={{
          height: 40, paddingLeft: 14, paddingRight: 40,
          background: 'var(--surface-card)',
          borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)',
          borderRadius: 'var(--radius-md)', outline: 'none',
          fontSize: 'var(--text-sm)', color: value ? 'var(--text-strong)' : 'var(--text-muted)',
          width: '100%', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
        }}>
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

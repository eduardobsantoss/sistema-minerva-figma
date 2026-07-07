import { Plus, type LucideIcon } from 'lucide-react';

export function TabPill({ active, onClick, icon: Icon, children }: { active: boolean; onClick: () => void; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex items-center" style={{ gap: 8, padding: '10px 14px', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-lg)', background: active ? 'var(--gci-base)' : 'transparent', color: active ? '#fff' : 'var(--text-muted)', transition: 'all var(--duration-base)' }}>
      <Icon size={14} />{children}
    </button>
  );
}

export function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 16, gap: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase' }}>{title}</div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function TabCard({ title, icon: Icon, children, onSave }: { title: string; icon?: LucideIcon; children: React.ReactNode; onSave?: () => void }) {
  return (
    <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', background: 'var(--surface-card)', overflow: 'hidden' }}>
      <div className="flex items-center" style={{ gap: 10, padding: '16px 22px', borderBottom: '1px solid var(--border-default)' }}>
        {Icon && <Icon size={16} style={{ color: 'var(--text-muted)' }} />}
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>{title}</h3>
      </div>
      <div style={{ padding: 22 }}>{children}</div>
      {onSave && (
        <div className="flex items-center justify-end" style={{ padding: '14px 22px', borderTop: '1px solid var(--border-default)' }}>
          <button
            onClick={onSave}
            style={{ height: 40, padding: '0 20px', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', background: 'var(--action-primary-bg)', color: '#fff' }}
          >
            SALVAR
          </button>
        </div>
      )}
    </div>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
      {children}
    </div>
  );
}

export function FormField({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        {...rest}
        style={{ width: '100%', height: 40, padding: '0 14px', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }}
      />
    </div>
  );
}

export function SelectField({ label, options, value, onChange, placeholder }: { label: string; options: string[]; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; placeholder?: string }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={onChange}
        style={{ width: '100%', height: 40, padding: '0 14px', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function PctInput({ label, value, onChange, disabled }: { label: string; value: number; onChange: (v: number) => void; disabled?: boolean }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type="text"
        disabled={disabled}
        value={`${value.toFixed(2).replace('.', ',')}%`}
        onChange={(e) => onChange(Number(e.target.value.replace('%', '').replace(',', '.')) || 0)}
        style={{
          width: '100%', height: 40, padding: '0 14px',
          background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
          border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none',
          fontSize: 'var(--text-sm)', color: disabled ? 'var(--text-disabled)' : 'var(--text-strong)',
          fontVariantNumeric: 'tabular-nums', cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
    </div>
  );
}

export function DiasInput({ label, value, onChange, disabled }: { label: string; value: number; onChange: (v: number) => void; disabled?: boolean }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type="number"
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        style={{
          width: '100%', height: 40, padding: '0 14px',
          background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
          border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none',
          fontSize: 'var(--text-sm)', color: disabled ? 'var(--text-disabled)' : 'var(--text-strong)',
          fontVariantNumeric: 'tabular-nums',
        }}
      />
    </div>
  );
}

export function ToggleRow({ label, on, onToggle, hint }: { label: string; on: boolean; onToggle: () => void; hint?: string }) {
  return (
    <div
      onClick={onToggle}
      className="flex items-center justify-between"
      style={{
        padding: '14px 18px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
        borderWidth: 1, borderStyle: 'solid',
        borderColor: on ? 'var(--success-base)' : 'var(--border-default)',
        background: on ? 'var(--success-light)' : 'var(--surface-card)',
        transition: 'all var(--duration-base)',
      }}
    >
      <div>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{label}</div>
        {hint && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{hint}</div>}
      </div>
      <div style={{ position: 'relative', width: 44, height: 24, borderRadius: '9999px', background: on ? 'var(--success-base)' : 'var(--border-strong)', transition: 'background var(--duration-base)', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: '9999px', background: '#fff', transition: 'left var(--duration-base)', boxShadow: 'var(--shadow-xs)' }} />
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, hint }: { icon: LucideIcon; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center" style={{ gap: 10, padding: '32px 24px', textAlign: 'center', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-default)' }}>
      <Icon size={26} strokeWidth={1.5} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-default)' }}>{title}</div>
      {hint && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', maxWidth: 360 }}>{hint}</div>}
    </div>
  );
}

export function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center"
      style={{
        height: 40, minWidth: 40, padding: '0 16px', gap: 6,
        background: 'var(--success-base)', color: '#fff', border: 'none',
        borderRadius: 'var(--radius-lg)', cursor: 'pointer',
        fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em',
        whiteSpace: 'nowrap',
      }}
    >
      <Plus size={14} /> ADICIONAR
    </button>
  );
}

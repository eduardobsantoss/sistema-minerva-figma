import { useState } from 'react';
import { Copy, Check as CheckIcon, type LucideIcon } from 'lucide-react';

/** Visual primitives shared across every tab of SolicitacaoDetailScreen. */

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(value).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      title={copied ? 'Copiado!' : 'Copiar'}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: copied ? 'var(--success-base)' : 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', borderRadius: 4, flexShrink: 0 }}
    >
      {copied ? <CheckIcon size={13} /> : <Copy size={13} />}
    </button>
  );
}

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

export function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{value}</div>
    </div>
  );
}

export function Card({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
      <div className="flex items-center" style={{ gap: 8, marginBottom: 16 }}>
        <Icon size={15} style={{ color: 'var(--gci-base)' }} />
        <span style={{ fontSize: 11, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', color: 'var(--text-strong)', textTransform: 'uppercase' }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, hint }: { icon: LucideIcon; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center" style={{ gap: 10, padding: '48px 24px', textAlign: 'center', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-default)' }}>
      <Icon size={30} strokeWidth={1.5} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-default)' }}>{title}</div>
      {hint && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', maxWidth: 360 }}>{hint}</div>}
    </div>
  );
}

export function GhostButton({ icon: Icon, onClick, children }: { icon: LucideIcon; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex items-center" style={{ gap: 8, height: 38, padding: '0 16px', background: 'var(--surface-card)', color: 'var(--text-strong)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em' }}>
      <Icon size={15} />{children}
    </button>
  );
}

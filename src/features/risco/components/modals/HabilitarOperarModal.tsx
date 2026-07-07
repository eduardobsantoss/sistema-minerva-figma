import { ShieldCheck } from 'lucide-react';

interface Props {
  grupoNome: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function HabilitarOperarModal({ grupoNome, onClose, onConfirm }: Props) {
  return (
    <div className="flex items-center justify-center" style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(15,23,42,0.45)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440, background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', padding: 28 }}>
        <div className="flex items-center justify-center" style={{ width: 52, height: 52, borderRadius: '9999px', background: 'var(--status-success-bg)', color: 'var(--success-base)', marginBottom: 18 }}>
          <ShieldCheck size={26} />
        </div>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', marginBottom: 8 }}>
          Habilitar "{grupoNome}" para operar?
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 22 }}>
          O grupo passará a poder realizar novas operações dentro do limite parametrizado.
        </p>
        <div className="flex items-center justify-end" style={{ gap: 10 }}>
          <button onClick={onClose} style={{ height: 42, padding: '0 18px', background: 'var(--surface-card)', color: 'var(--text-strong)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)' }}>
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{ height: 42, padding: '0 18px', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)', background: 'var(--success-base)', color: '#fff' }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

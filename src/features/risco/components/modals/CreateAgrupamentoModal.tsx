import { useState } from 'react';
import { X, Layers } from 'lucide-react';
import type { Agrupamento } from '../../data/riscoData';

interface Props {
  onClose: () => void;
  onSave: (nome: string) => void;
  initial?: Agrupamento;
}

export function CreateAgrupamentoModal({ onClose, onSave, initial }: Props) {
  const [nome, setNome] = useState(initial?.nome ?? '');
  const canSave = nome.trim() !== '';

  const handleSave = () => {
    if (!canSave) return;
    onSave(nome.trim());
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
        style={{
          background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)',
          width: '100%', maxWidth: 480,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between" style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-default)' }}>
          <div className="flex items-center" style={{ gap: 12 }}>
            <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--accent-bg)', color: 'var(--accent)', flexShrink: 0 }}>
              <Layers size={19} />
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>
                {initial ? 'Renomear Agrupamento' : 'Novo Agrupamento'}
              </h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                Usado no bloco "Agrupamentos" da parametrização de limite dos grupos
              </p>
            </div>
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
        <div style={{ padding: 28 }}>
          <div>
            <FieldLabel>Nome</FieldLabel>
            <Input placeholder="Ex.: Confina" value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end" style={{ gap: 12, padding: '16px 28px', borderTop: '1px solid var(--border-default)', background: 'var(--surface-card)' }}>
          <button
            onClick={onClose}
            style={{ height: 42, padding: '0 18px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            style={{
              height: 42, padding: '0 22px', border: 'none', borderRadius: 'var(--radius-lg)',
              cursor: canSave ? 'pointer' : 'not-allowed',
              fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em',
              background: canSave ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
              color: canSave ? '#fff' : 'var(--text-disabled)',
              transition: 'background var(--duration-base)',
            }}
          >
            SALVAR
          </button>
        </div>
      </div>
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

function Input({ style, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...rest}
      style={{
        width: '100%', height: 40, padding: '0 14px',
        background: 'var(--surface-card)', border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)', outline: 'none',
        fontSize: 'var(--text-sm)', color: 'var(--text-strong)',
        ...style,
      }}
    />
  );
}

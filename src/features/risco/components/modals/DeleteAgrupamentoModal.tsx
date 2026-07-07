import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { Agrupamento } from '../../data/riscoData';

interface Props {
  agrupamento: Agrupamento;
  onClose: () => void;
  onConfirm: (justificativa: string) => void;
}

export function DeleteAgrupamentoModal({ agrupamento, onClose, onConfirm }: Props) {
  const [justificativa, setJustificativa] = useState('');
  const canConfirm = justificativa.trim().length > 0;

  return (
    <div className="flex items-center justify-center" style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(15,23,42,0.45)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 460, background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', padding: 28 }}>
        <div className="flex items-center justify-center" style={{ width: 52, height: 52, borderRadius: '9999px', background: 'var(--status-danger-bg)', color: 'var(--danger-base)', marginBottom: 18 }}>
          <AlertTriangle size={26} />
        </div>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', marginBottom: 8 }}>
          Excluir o agrupamento "{agrupamento.nome}"?
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 18 }}>
          Esta ação é crítica e não pode ser desfeita. Grupos que consomem limite através deste agrupamento perderão essa referência.
        </p>

        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--danger-base)', textTransform: 'uppercase', marginBottom: 6 }}>
            * Justificativa da exclusão
          </div>
          <textarea
            value={justificativa}
            onChange={(e) => setJustificativa(e.target.value)}
            placeholder="Descreva o motivo da exclusão..."
            rows={3}
            style={{
              width: '100%', padding: '10px 14px', resize: 'vertical',
              background: 'var(--surface-card)', border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)', outline: 'none',
              fontSize: 'var(--text-sm)', color: 'var(--text-strong)', fontFamily: 'inherit',
            }}
          />
        </div>

        <div className="flex items-center justify-end" style={{ gap: 10 }}>
          <button onClick={onClose} style={{ height: 42, padding: '0 18px', background: 'var(--surface-card)', color: 'var(--text-strong)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)' }}>
            Cancelar
          </button>
          <button
            onClick={() => canConfirm && onConfirm(justificativa.trim())}
            disabled={!canConfirm}
            style={{
              height: 42, padding: '0 18px', border: 'none', borderRadius: 'var(--radius-lg)',
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)',
              background: canConfirm ? 'var(--action-danger-bg)' : 'var(--neutral-200)',
              color: canConfirm ? 'var(--action-danger-text)' : 'var(--text-disabled)',
            }}
          >
            Confirmar exclusão
          </button>
        </div>
      </div>
    </div>
  );
}

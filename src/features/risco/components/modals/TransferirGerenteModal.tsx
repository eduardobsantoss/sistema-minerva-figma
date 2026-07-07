import { useState } from 'react';
import { X, UserCog } from 'lucide-react';
import { GERENTES_SEED } from '../../data/riscoData';

interface Props {
  grupoNome: string;
  gerenteAtual: string;
  onClose: () => void;
  onConfirm: (novoGerente: string) => void;
}

export function TransferirGerenteModal({ grupoNome, gerenteAtual, onClose, onConfirm }: Props) {
  const [gerente, setGerente] = useState('');
  const canConfirm = gerente !== '' && gerente !== gerenteAtual;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,60,74,0.55)', backdropFilter: 'blur(8px)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
        <div className="flex items-start justify-between" style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-default)' }}>
          <div className="flex items-center" style={{ gap: 12 }}>
            <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--accent-bg)', color: 'var(--accent)', flexShrink: 0 }}>
              <UserCog size={19} />
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>Transferir gerente</h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{grupoNome}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', background: 'var(--surface-card)', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
            Gerente atual
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)', marginBottom: 18 }}>{gerenteAtual}</div>

          <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
            Novo gerente
          </div>
          <select
            value={gerente}
            onChange={(e) => setGerente(e.target.value)}
            style={{ width: '100%', height: 40, padding: '0 14px', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }}
          >
            <option value="">Selecione</option>
            {GERENTES_SEED.filter((g) => g !== gerenteAtual).map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end" style={{ gap: 12, padding: '16px 28px', borderTop: '1px solid var(--border-default)' }}>
          <button onClick={onClose} style={{ height: 42, padding: '0 18px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)' }}>
            Cancelar
          </button>
          <button
            onClick={() => canConfirm && onConfirm(gerente)}
            disabled={!canConfirm}
            style={{
              height: 42, padding: '0 22px', border: 'none', borderRadius: 'var(--radius-lg)',
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em',
              background: canConfirm ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
              color: canConfirm ? '#fff' : 'var(--text-disabled)',
            }}
          >
            TRANSFERIR
          </button>
        </div>
      </div>
    </div>
  );
}

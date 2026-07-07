import { useState } from 'react';
import { X, BellRing } from 'lucide-react';

interface Props {
  grupoNome: string;
  onClose: () => void;
  onConfirm: (config: { vencimentoLimite: boolean; parecerCredito: boolean; novoEventoHistorico: boolean }) => void;
}

export function ConfigurarNotificacoesModal({ grupoNome, onClose, onConfirm }: Props) {
  const [vencimentoLimite, setVencimentoLimite] = useState(true);
  const [parecerCredito, setParecerCredito] = useState(true);
  const [novoEventoHistorico, setNovoEventoHistorico] = useState(false);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,60,74,0.55)', backdropFilter: 'blur(8px)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
        <div className="flex items-start justify-between" style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-default)' }}>
          <div className="flex items-center" style={{ gap: 12 }}>
            <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--accent-bg)', color: 'var(--accent)', flexShrink: 0 }}>
              <BellRing size={19} />
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>Configurar notificações</h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{grupoNome}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', background: 'var(--surface-card)', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}>
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col" style={{ padding: 28, gap: 10 }}>
          <ToggleRow label="Vencimento do limite" on={vencimentoLimite} onToggle={() => setVencimentoLimite((v) => !v)} />
          <ToggleRow label="Alteração no parecer de crédito" on={parecerCredito} onToggle={() => setParecerCredito((v) => !v)} />
          <ToggleRow label="Novo evento no histórico" on={novoEventoHistorico} onToggle={() => setNovoEventoHistorico((v) => !v)} />
        </div>

        <div className="flex items-center justify-end" style={{ gap: 12, padding: '16px 28px', borderTop: '1px solid var(--border-default)' }}>
          <button onClick={onClose} style={{ height: 42, padding: '0 18px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)' }}>
            Cancelar
          </button>
          <button
            onClick={() => onConfirm({ vencimentoLimite, parecerCredito, novoEventoHistorico })}
            style={{ height: 42, padding: '0 22px', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', background: 'var(--action-primary-bg)', color: '#fff' }}
          >
            SALVAR
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
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
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{label}</span>
      <div style={{ position: 'relative', width: 44, height: 24, borderRadius: '9999px', background: on ? 'var(--success-base)' : 'var(--border-strong)', transition: 'background var(--duration-base)', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: '9999px', background: '#fff', transition: 'left var(--duration-base)', boxShadow: 'var(--shadow-xs)' }} />
      </div>
    </div>
  );
}

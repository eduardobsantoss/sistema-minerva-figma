import { useState } from 'react';
import { Mail, MessageCircle, Smartphone, Building2, MoreVertical, Pencil, EyeOff, Eye, BellOff } from 'lucide-react';
import type { Notificacao, Metodo } from '../data/cobrancaData';

interface Props {
  notificacao: Notificacao;
  onEdit: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onInativar?: (id: string) => void;
}

const MetodoIcon = ({ m, active }: { m: Metodo; active: boolean }) => {
  const icon =
    m === 'Email' ? Mail :
    m === 'WhatsApp' ? MessageCircle :
    Smartphone;
  const Icon = icon;
  return (
    <span
      className="flex items-center"
      style={{
        gap: 4,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        padding: '3px 8px',
        borderRadius: 'var(--radius-full)',
        background: active ? 'var(--status-active-bg)' : 'var(--status-neutral-bg)',
        color: active ? 'var(--status-active-text)' : 'var(--status-neutral-text)',
      }}
    >
      <Icon size={10} strokeWidth={2.5} />
      {m}
    </span>
  );
};

// Show up to `max` days, append "+N" if there are more
function formatDias(dias: number[], max = 4) {
  if (dias.length === 0) return '—';
  const shown = dias.slice(0, max);
  const rest  = dias.length - max;
  const base  = shown.map((d) => `${d}d`).join(', ');
  return rest > 0 ? `${base} +${rest}` : base;
}

export function CobrancaCard({ notificacao, onEdit, onToggleStatus, onInativar }: Props) {
  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isAtiva = notificacao.status === 'Ativa';

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setMenuOpen(false); }}
      className="relative flex flex-col"
      style={{
        background: 'var(--surface-card)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: hover ? 'rgba(8,60,74,0.20)' : 'var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        padding: 20,
        gap: 14,
        boxShadow: hover ? '0 20px 40px -16px rgba(8,60,74,0.10)' : 'var(--shadow-xs)',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        transition:
          'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
        opacity: isAtiva ? 1 : 0.75,
      }}
    >
      {/* Header: name + status + menu */}
      <div className="flex items-start justify-between" style={{ gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 'var(--text-md)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--text-strong)',
              lineHeight: 1.25,
              letterSpacing: '-0.01em',
              marginBottom: 6,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {notificacao.nome}
          </div>
          {/* Status badge */}
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: isAtiva ? 'var(--status-success-bg)' : 'var(--status-neutral-bg)',
              color: isAtiva ? 'var(--status-success-text)' : 'var(--status-neutral-text)',
            }}
          >
            {notificacao.status}
          </span>
        </div>

        {/* Three-dot menu */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: menuOpen ? 'var(--surface-sunken)' : 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background var(--duration-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
            onMouseLeave={(e) => { if (!menuOpen) e.currentTarget.style.background = 'transparent'; }}
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 36,
                right: 0,
                background: 'var(--surface-card)',
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: 'var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                zIndex: 20,
                overflow: 'hidden',
                minWidth: 172,
              }}
            >
              {/* Editar */}
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit(notificacao.id); }}
                className="flex items-center"
                style={{
                  gap: 10, width: '100%', padding: '10px 14px',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: 'var(--text-sm)', color: 'var(--text-default)', textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Pencil size={14} />
                Editar régua
              </button>

              {/* Ativar / Pausar toggle */}
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onToggleStatus(notificacao.id); }}
                className="flex items-center"
                style={{
                  gap: 10, width: '100%', padding: '10px 14px',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  color: isAtiva ? 'var(--text-default)' : 'var(--success-dark)',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {isAtiva ? <EyeOff size={14} /> : <Eye size={14} />}
                {isAtiva ? 'Pausar envios' : 'Reativar régua'}
              </button>

              {/* Divider */}
              {isAtiva && (
                <div style={{ height: 1, background: 'var(--border-default)', margin: '2px 0' }} />
              )}

              {/* Inativar — only shown when active */}
              {isAtiva && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); setMenuOpen(false);
                    if (onInativar) onInativar(notificacao.id);
                    else onToggleStatus(notificacao.id);
                  }}
                  className="flex items-center"
                  style={{
                    gap: 10, width: '100%', padding: '10px 14px',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    fontSize: 'var(--text-sm)', color: 'var(--action-danger-text-only)', textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <BellOff size={14} />
                  Inativar notificação
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Methods */}
      <div className="flex flex-wrap" style={{ gap: 6 }}>
        {(['Email', 'WhatsApp', 'SMS'] as Metodo[]).map((m) => (
          <MetodoIcon key={m} m={m} active={notificacao.metodos.includes(m)} />
        ))}
      </div>

      {/* Interval counts + day breakdown */}
      <div
        className="flex"
        style={{
          gap: 1,
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--border-default)',
        }}
      >
        {/* A Vencer */}
        <div
          style={{
            flex: 1,
            padding: '10px 12px',
            background: 'var(--surface-sunken)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            A Vencer
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {notificacao.intervalosAVencer.length}
            </span>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)' }}>
              {notificacao.intervalosAVencer.length === 1 ? 'envio' : 'envios'}
            </span>
          </div>
          <div
            style={{
              fontSize: 10,
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={notificacao.intervalosAVencer.map((d) => `${d}d antes`).join(', ')}
          >
            {formatDias(notificacao.intervalosAVencer)} antes
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: 'var(--border-default)', flexShrink: 0 }} />

        {/* Vencidos */}
        <div
          style={{
            flex: 1,
            padding: '10px 12px',
            background: 'var(--surface-sunken)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Vencidos
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--danger-base)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {notificacao.intervalosVencidos.length}
            </span>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)' }}>
              {notificacao.intervalosVencidos.length === 1 ? 'envio' : 'envios'}
            </span>
          </div>
          <div
            style={{
              fontSize: 10,
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={notificacao.intervalosVencidos.map((d) => `${d}d depois`).join(', ')}
          >
            {formatDias(notificacao.intervalosVencidos)} depois
          </div>
        </div>
      </div>

      {/* Vehicles */}
      <div className="flex items-center" style={{ gap: 6 }}>
        <Building2 size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text-default)' }}>{notificacao.veiculos.length}</strong>{' '}
          {notificacao.veiculos.length === 1 ? 'veículo associado' : 'veículos associados'}
        </span>
      </div>
    </div>
  );
}

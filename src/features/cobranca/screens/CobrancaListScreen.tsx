import { useState } from 'react';
import {
  Search,
  Plus,
  BellRing,
  LayoutGrid,
  List,
  Mail,
  MessageCircle,
  Smartphone,
  Building2,
  Pencil,
  PowerOff,
  Power,
  MoreVertical,
} from 'lucide-react';
import type { Notificacao, Metodo } from '../data/cobrancaData';
import { CobrancaCard } from '../components/CobrancaCard';

interface Props {
  notificacoes: Notificacao[];
  onNew: () => void;
  onEdit: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

type ViewMode = 'cards' | 'list';

const METODO_ICONS: Record<Metodo, typeof Mail> = {
  Email: Mail,
  WhatsApp: MessageCircle,
  SMS: Smartphone,
};

export function CobrancaListScreen({ notificacoes, onNew, onEdit, onToggleStatus }: Props) {
  const [q, setQ] = useState('');
  const [focusSearch, setFocusSearch] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);

  const filtered = notificacoes.filter(
    (n) => !q || n.nome.toLowerCase().includes(q.toLowerCase()),
  );

  const kpis = [
    {
      label: 'Total de Réguas',
      value: String(notificacoes.length),
      icon: BellRing,
      tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
    },
    {
      label: 'Réguas Ativas',
      value: String(notificacoes.filter((n) => n.status === 'Ativa').length),
      icon: BellRing,
      tone: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)' },
    },
    {
      label: 'Total de Veículos',
      value: String(new Set(notificacoes.flatMap((n) => n.veiculos)).size),
      icon: Building2,
      tone: { bg: '#EEF0FF', fg: '#4F46E5' },
    },
    {
      label: 'Réguas Inativas',
      value: String(notificacoes.filter((n) => n.status === 'Inativa').length),
      icon: BellRing,
      tone: { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-text)' },
    },
  ];

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      {/* Search + actions bar */}
      <div className="flex items-center" style={{ gap: 16 }}>
        <div
          className="relative"
          style={{
            flex: 1,
            background: 'var(--surface-card)',
            borderRadius: 'var(--radius-xl)',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: focusSearch ? 'var(--gci-base)' : 'var(--border-default)',
            boxShadow: focusSearch ? '0 0 0 4px rgba(8,60,74,0.06)' : 'var(--shadow-xs)',
            transition: 'border-color var(--duration-base), box-shadow var(--duration-base)',
          }}
        >
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--neutral-400)',
            }}
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocusSearch(true)}
            onBlur={() => setFocusSearch(false)}
            placeholder="Pesquisar régua de notificação..."
            style={{
              width: '100%',
              height: 56,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              paddingLeft: 52,
              paddingRight: 160,
              fontSize: 'var(--text-base)',
              color: 'var(--text-strong)',
              borderRadius: 'var(--radius-xl)',
            }}
          />
          <button
            style={{
              position: 'absolute',
              right: 8,
              top: 8,
              bottom: 8,
              padding: '0 24px',
              background: 'var(--action-primary-bg)',
              color: 'var(--action-primary-text)',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.10em',
            }}
          >
            PESQUISAR
          </button>
        </div>

        {/* View toggle */}
        <div
          className="flex items-center"
          style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            padding: 4,
            gap: 2,
            height: 56,
          }}
        >
          {(['cards', 'list'] as ViewMode[]).map((mode) => {
            const Icon = mode === 'cards' ? LayoutGrid : List;
            const active = viewMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                title={mode === 'cards' ? 'Visualização em Cards' : 'Visualização em Lista'}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-lg)',
                  border: 'none',
                  cursor: 'pointer',
                  background: active ? 'var(--gci-base)' : 'transparent',
                  color: active ? '#fff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background var(--duration-fast), color var(--duration-fast)',
                }}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>

        {/* New button */}
        <button
          onClick={onNew}
          className="flex items-center"
          style={{
            gap: 8,
            height: 56,
            padding: '0 24px',
            background: 'var(--agro-base)',
            color: '#fff',
            borderRadius: 'var(--radius-xl)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.10em',
            boxShadow: '0 10px 24px -8px rgba(242,125,38,0.40)',
            transition: 'background var(--duration-base)',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--agro-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--agro-base)')}
        >
          <span
            className="flex items-center justify-center"
            style={{ width: 22, height: 22, borderRadius: '9999px', background: 'rgba(255,255,255,0.20)' }}
          >
            <Plus size={14} />
          </span>
          NOVA NOTIFICAÇÃO
        </button>
      </div>

      {/* KPIs */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              className="flex items-center"
              style={{
                gap: 16,
                background: 'var(--surface-card)',
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: 'var(--border-default)',
                borderRadius: 'var(--radius-xl)',
                padding: 20,
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-lg)',
                  background: k.tone.bg,
                  color: k.tone.fg,
                  flexShrink: 0,
                }}
              >
                <Icon size={22} strokeWidth={1.75} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 'var(--weight-bold)',
                    letterSpacing: '0.14em',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}
                >
                  {k.label}
                </div>
                <div
                  style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 'var(--weight-bold)',
                    color: 'var(--text-strong)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {k.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content */}
      {viewMode === 'cards' ? (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {filtered.map((n) => (
            <CobrancaCard
              key={n.id}
              notificacao={n}
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            background: 'var(--surface-card)',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: 'var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
          }}
        >
          {/* Table header */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: '2fr 1.4fr 120px 120px 100px 100px 56px',
              padding: '10px 20px',
              background: 'var(--surface-sunken)',
              borderBottom: '1px solid var(--border-default)',
            }}
          >
            {['Nome', 'Métodos', 'A Vencer', 'Vencidos', 'Veículos', 'Status', ''].map((col) => (
              <div
                key={col}
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}
              >
                {col}
              </div>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((n, idx) => {
            const isAtiva = n.status === 'Ativa';
            const isMenuOpen = openRowMenu === n.id;
            return (
              <div
                key={n.id}
                className="grid"
                style={{
                  gridTemplateColumns: '2fr 1.4fr 120px 120px 100px 100px 56px',
                  padding: '14px 20px',
                  alignItems: 'center',
                  borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-default)' : 'none',
                  transition: 'background var(--duration-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Nome */}
                <div
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--weight-semibold)',
                    color: 'var(--text-strong)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    paddingRight: 12,
                  }}
                >
                  {n.nome}
                </div>

                {/* Métodos */}
                <div className="flex flex-wrap" style={{ gap: 4 }}>
                  {(['Email', 'WhatsApp', 'SMS'] as Metodo[]).map((m) => {
                    const Icon = METODO_ICONS[m];
                    const active = n.metodos.includes(m);
                    return (
                      <span
                        key={m}
                        title={m}
                        style={{
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 'var(--radius-sm)',
                          background: active ? 'var(--status-active-bg)' : 'var(--status-neutral-bg)',
                          color: active ? 'var(--status-active-text)' : 'var(--neutral-300)',
                        }}
                      >
                        <Icon size={12} strokeWidth={2.5} />
                      </span>
                    );
                  })}
                </div>

                {/* A Vencer */}
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)', fontVariantNumeric: 'tabular-nums' }}>
                  {n.intervalosAVencer.length} intervalos
                </div>

                {/* Vencidos */}
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--danger-base)', fontVariantNumeric: 'tabular-nums' }}>
                  {n.intervalosVencidos.length} intervalos
                </div>

                {/* Veículos */}
                <div className="flex items-center" style={{ gap: 4, fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>
                  <Building2 size={12} style={{ color: 'var(--text-muted)' }} />
                  {n.veiculos.length}
                </div>

                {/* Status */}
                <div>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: '0.10em',
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: isAtiva ? 'var(--status-success-bg)' : 'var(--status-neutral-bg)',
                      color: isAtiva ? 'var(--status-success-text)' : 'var(--status-neutral-text)',
                    }}
                  >
                    {n.status}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenRowMenu((v) => v === n.id ? null : n.id); }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      background: isMenuOpen ? 'var(--surface-sunken)' : 'transparent',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MoreVertical size={15} />
                  </button>
                  {isMenuOpen && (
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
                        minWidth: 160,
                      }}
                    >
                      <button
                        onClick={() => { setOpenRowMenu(null); onEdit(n.id); }}
                        className="flex items-center"
                        style={{ gap: 10, width: '100%', padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--text-default)', textAlign: 'left' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Pencil size={14} /> Editar
                      </button>
                      <button
                        onClick={() => { setOpenRowMenu(null); onToggleStatus(n.id); }}
                        className="flex items-center"
                        style={{ gap: 10, width: '100%', padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', color: isAtiva ? 'var(--action-danger-text-only)' : 'var(--success-dark)', textAlign: 'left' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        {isAtiva ? <PowerOff size={14} /> : <Power size={14} />}
                        {isAtiva ? 'Desativar' : 'Ativar'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

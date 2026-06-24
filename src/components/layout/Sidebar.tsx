import {
  LayoutDashboard,
  Landmark,
  Briefcase,
  Database,
  Users,
  FileText,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Building2,
  BellRing,
  BarChart3,
  Receipt,
  type LucideIcon,
} from 'lucide-react';

interface SubItem {
  key: string;
  label: string;
  icon: LucideIcon;
}

interface NavItem {
  key: string;
  label: string;
  icon: LucideIcon;
  children?: SubItem[];
}

const items: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    key: 'fidcs',
    label: "FIDC's",
    icon: Landmark,
    children: [
      { key: 'fidcs', label: 'Listagem', icon: FileText },
      { key: 'fidcs-cedentes', label: 'Cedentes', icon: Building2 },
      { key: 'fidcs-notif', label: 'Notificações', icon: BellRing },
      { key: 'fidcs-rel', label: 'Relatórios', icon: BarChart3 },
    ],
  },
  {
    key: 'cras',
    label: "CRA's",
    icon: Briefcase,
    children: [
      { key: 'cras', label: 'Listagem', icon: FileText },
      { key: 'cras-cedentes', label: 'Cedentes', icon: Building2 },
      { key: 'cras-rel', label: 'Relatórios', icon: BarChart3 },
    ],
  },
  {
    key: 'cobranca',
    label: 'Cobrança',
    icon: Receipt,
    children: [
      { key: 'cobranca-notif', label: 'Notificações de Cobrança', icon: BellRing },
    ],
  },
  { key: 'passivo', label: 'Passivo', icon: Database },
  { key: 'colab', label: 'Colaboradores', icon: Users },
  { key: 'rel', label: 'Relatórios', icon: FileText },
  { key: 'conf', label: 'Configurações', icon: Settings },
];

const EXPANDED = 280;
const COLLAPSED = 80;

interface Props {
  active: string;
  onNavigate: (key: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  openMenu: string | null;
  onToggleMenu: (key: string) => void;
}

export function Sidebar({
  active,
  onNavigate,
  collapsed,
  onToggle,
  openMenu,
  onToggleMenu,
}: Props) {
  return (
    <aside
      className="relative flex flex-col"
      style={{
        width: collapsed ? COLLAPSED : EXPANDED,
        background: 'var(--gci-base)',
        padding: collapsed ? '24px 12px 16px' : '24px 16px 16px',
        boxShadow: '6px 0 24px rgba(15,23,42,0.12)',
        transition:
          'width var(--duration-slow) var(--ease-standard), padding var(--duration-slow) var(--ease-standard)',
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <button
        onClick={() => onNavigate('dashboard')}
        className="flex items-center"
        style={{
          gap: 12,
          padding: '0 4px',
          marginBottom: 32,
          justifyContent: collapsed ? 'center' : 'flex-start',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(255,255,255,0.10)',
            color: 'var(--agro-base)',
            flexShrink: 0,
          }}
        >
          <Database size={20} />
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 'var(--weight-bold)',
            color: '#fff',
            letterSpacing: '-0.01em',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            opacity: collapsed ? 0 : 1,
            width: collapsed ? 0 : 'auto',
            transition: 'opacity var(--duration-base), width var(--duration-slow)',
          }}
        >
          Minerva
        </div>
      </button>

      {/* Botão colapsar */}
      <button
        aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        onClick={onToggle}
        style={{
          position: 'absolute',
          right: -12,
          top: 76,
          width: 24,
          height: 24,
          borderRadius: '9999px',
          background: 'var(--agro-base)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(15,23,42,0.18)',
          zIndex: 10,
          transition: 'background var(--duration-fast)',
        }}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Nav */}
      <nav className="flex flex-col" style={{ gap: 4 }}>
        {items.map((it) => {
          const Icon = it.icon;
          const isActiveSelf = active === it.key;
          const hasChildren = !!it.children?.length;
          const isAnyChildActive = hasChildren && it.children!.some((c) => c.key === active);
          const isActive = isActiveSelf || isAnyChildActive;
          const isOpen = openMenu === it.key && !collapsed;

          const handleClick = () => {
            if (hasChildren && !collapsed) {
              onToggleMenu(it.key);
            } else {
              onNavigate(hasChildren ? it.children![0].key : it.key);
            }
          };

          return (
            <div key={it.key}>
              <button
                onClick={handleClick}
                title={collapsed ? it.label : undefined}
                className="relative flex items-center"
                style={{
                  gap: 16,
                  padding: collapsed ? '12px 0' : '12px',
                  width: '100%',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--radius-xl)',
                  background: isActive ? 'rgba(255,255,255,0.10)' : 'transparent',
                  color: isActive ? 'var(--agro-base)' : 'rgba(255,255,255,0.60)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--weight-medium)',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition:
                    'background var(--duration-fast), color var(--duration-fast), padding var(--duration-slow)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.60)';
                  }
                }}
              >
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      left: collapsed ? -12 : 0,
                      top: 8,
                      bottom: 8,
                      width: 4,
                      background: 'var(--agro-base)',
                      borderRadius: '0 4px 4px 0',
                      transition: 'left var(--duration-slow)',
                    }}
                  />
                )}
                <Icon size={18} style={{ flexShrink: 0 }} />
                {!collapsed && (
                  <>
                    <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{it.label}</span>
                    {hasChildren && (
                      <ChevronDown
                        size={16}
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform var(--duration-base)',
                        }}
                      />
                    )}
                  </>
                )}
              </button>

              {/* Submenu */}
              {hasChildren && !collapsed && (
                <div
                  style={{
                    overflow: 'hidden',
                    maxHeight: isOpen ? it.children!.length * 40 + 8 : 0,
                    opacity: isOpen ? 1 : 0,
                    transition:
                      'max-height var(--duration-slow) var(--ease-standard), opacity var(--duration-base)',
                  }}
                >
                  <div
                    className="flex flex-col"
                    style={{ gap: 2, padding: '6px 0 6px 36px', position: 'relative' }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: 25,
                        top: 6,
                        bottom: 6,
                        width: 1,
                        background: 'rgba(255,255,255,0.10)',
                      }}
                    />
                    {it.children!.map((c) => {
                      const SubIcon = c.icon;
                      const isSubActive = active === c.key;
                      return (
                        <button
                          key={c.key}
                          onClick={() => onNavigate(c.key)}
                          className="relative flex items-center"
                          style={{
                            gap: 12,
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-lg)',
                            background: isSubActive ? 'rgba(242,125,38,0.12)' : 'transparent',
                            color: isSubActive ? 'var(--agro-base)' : 'rgba(255,255,255,0.55)',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--weight-medium)',
                            textAlign: 'left',
                            transition: 'background var(--duration-fast), color var(--duration-fast)',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                              e.currentTarget.style.color = '#fff';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                            }
                          }}
                        >
                          <SubIcon size={14} style={{ flexShrink: 0 }} />
                          <span style={{ whiteSpace: 'nowrap' }}>{c.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User card */}
      <div
        className="flex items-center"
        style={{
          marginTop: 'auto',
          gap: 12,
          padding: collapsed ? 8 : 12,
          borderRadius: 'var(--radius-xl)',
          background: 'rgba(255,255,255,0.05)',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'rgba(255,255,255,0.10)',
          justifyContent: collapsed ? 'center' : 'flex-start',
          transition: 'padding var(--duration-slow)',
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            borderRadius: '9999px',
            background: 'var(--agro-base)',
            color: '#fff',
            flexShrink: 0,
          }}
        >
          <User size={16} />
        </div>
        {!collapsed && (
          <>
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 'var(--weight-bold)',
                  color: '#fff',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                }}
              >
                Eduardo Santos
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.60)',
                  marginTop: 2,
                  whiteSpace: 'nowrap',
                }}
              >
                Administrador
              </div>
            </div>
            <button
              aria-label="Sair"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.60)',
                cursor: 'pointer',
                display: 'flex',
                padding: 4,
              }}
            >
              <LogOut size={16} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}

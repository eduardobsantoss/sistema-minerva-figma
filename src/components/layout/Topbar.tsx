import { Search, Bell } from 'lucide-react';
import { useState } from 'react';

interface Props {
  title: string;
}

export function Topbar({ title }: Props) {
  const [searchFocus, setSearchFocus] = useState(false);

  return (
    <header
      className="flex items-center"
      style={{
        height: 'var(--topbar-height)',
        background: 'var(--surface-card)',
        borderBottom: '1px solid var(--border-default)',
        padding: '0 var(--topbar-padding-x)',
        gap: 24,
        transition: 'height var(--duration-base), padding var(--duration-base)',
      }}
    >
      <h2
        style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--weight-bold)',
          color: 'var(--text-strong)',
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minWidth: 0,
        }}
      >
        {title}
      </h2>

      <div style={{ flex: 1, minWidth: 8 }} />

      {/* Search */}
      <div className="topbar-search relative" style={{ width: 256, flexShrink: 1, minWidth: 140 }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--neutral-400)',
          }}
        />
        <input
          type="text"
          placeholder="Buscar no sistema..."
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
          style={{
            width: '100%',
            height: 40,
            paddingLeft: 36,
            paddingRight: 12,
            background: 'var(--surface-sunken)',
            border: 'none',
            outline: 'none',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-strong)',
            boxShadow: searchFocus ? '0 0 0 3px rgba(8,60,74,0.20)' : 'none',
            transition: 'box-shadow var(--duration-base)',
          }}
        />
      </div>

      {/* Bell */}
      <button
        aria-label="Notificações"
        className="relative flex items-center justify-center"
        style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-lg)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--neutral-600)',
        }}
      >
        <Bell size={18} />
        <span
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 8,
            height: 8,
            borderRadius: '9999px',
            background: 'var(--agro-base)',
            border: '2px solid var(--surface-card)',
          }}
        />
      </button>

      {/* Divisor */}
      <div
        className="topbar-user-meta"
        style={{
          width: 1,
          height: 32,
          background: 'var(--border-default)',
          flexShrink: 0,
        }}
      />

      {/* User chip */}
      <div className="flex items-center" style={{ gap: 12, flexShrink: 0 }}>
        <div className="topbar-user-meta" style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--text-strong)',
              lineHeight: 1.2,
            }}
          >
            Eduardo Santos
          </div>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              marginTop: 2,
            }}
          >
            Administrador
          </div>
        </div>
        <div
          className="flex items-center justify-center"
          style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-xl)',
            background: 'var(--gci-base)',
            color: '#fff',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.02em',
          }}
        >
          ES
        </div>
      </div>
    </header>
  );
}

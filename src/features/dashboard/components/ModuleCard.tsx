import { useState } from 'react';
import { toneStyles, type ModuleItem } from '../data/modulesData';

export function ModuleCard({ item }: { item: ModuleItem }) {
  const [hover, setHover] = useState(false);
  const Icon = item.icon;
  const tone = toneStyles[item.tone];

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative overflow-hidden flex flex-col"
      style={{
        background: 'var(--surface-card)',
        border: `1px solid ${hover ? 'rgba(242,125,38,0.30)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-xl)',
        padding: 24,
        minHeight: 200,
        cursor: 'pointer',
        boxShadow: hover ? '0 20px 40px -16px rgba(8,60,74,0.10)' : 'none',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        transition:
          'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
      }}
    >
      {/* Quarto de círculo decorativo no canto superior direito */}
      <div
        style={{
          position: 'absolute',
          top: -64,
          right: -64,
          width: 128,
          height: 128,
          borderRadius: '9999px',
          background: hover ? 'rgba(242,125,38,0.08)' : 'var(--neutral-100)',
          transition: 'background var(--duration-base)',
          zIndex: 0,
        }}
      />

      <div className="relative flex flex-col" style={{ gap: 16, zIndex: 1, flex: 1 }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-xl)',
            background: tone.bg,
            color: tone.color,
          }}
        >
          <Icon size={28} strokeWidth={1.75} />
        </div>

        <div>
          <div
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--text-strong)',
              marginBottom: 6,
              letterSpacing: '-0.01em',
            }}
          >
            {item.title}
          </div>
          <div
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            {item.description}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--accent)',
            fontWeight: 'var(--weight-bold)',
            opacity: hover ? 1 : 0,
            transform: hover ? 'translateY(0)' : 'translateY(4px)',
            transition: 'opacity var(--duration-base), transform var(--duration-base)',
          }}
        >
          Acessar módulo →
        </div>
      </div>
    </div>
  );
}

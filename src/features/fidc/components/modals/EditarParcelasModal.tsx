import { useState } from 'react';
import { X, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import { brl, type ParcelaCronograma } from '../../data/fidcsData';

interface Props {
  cronograma: ParcelaCronograma[];
  onClose: () => void;
  onUpdate: (cronograma: ParcelaCronograma[]) => void;
}

export function EditarParcelasModal({ cronograma, onClose, onUpdate }: Props) {
  const [rows, setRows] = useState<ParcelaCronograma[]>(() => cronograma.map((c) => ({ ...c })));

  const setValor = (i: number, field: 'amortizacao' | 'juros', value: string) => {
    const num = Number(value.replace(',', '.')) || 0;
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: num } : r)));
  };

  const totalAmortizacao = rows.reduce((acc, r) => acc + r.amortizacao, 0);
  const totalJuros = rows.reduce((acc, r) => acc + r.juros, 0);
  const totalGeral = totalAmortizacao + totalJuros;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(8,60,74,0.55)', backdropFilter: 'blur(8px)',
        zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 32, animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)',
          width: '100%', maxWidth: 900, maxHeight: '86vh',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between" style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-default)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>
              Editar Parcelas
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
              Ajuste os valores de amortização e juros de cada parcela do cronograma
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex items-center justify-center"
            style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', background: 'var(--surface-card)', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr 1fr', padding: '10px 16px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <div>Vencimento</div><div>Amortização</div><div>Juros</div>
            </div>
            {rows.map((r, i) => (
              <div key={i} className="grid items-center" style={{ gridTemplateColumns: '1.2fr 1fr 1fr', padding: '10px 16px', borderTop: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{r.vencimento}</div>
                <EditableCell value={r.amortizacao} onChange={(v) => setValor(i, 'amortizacao', v)} />
                <EditableCell value={r.juros} onChange={(v) => setValor(i, 'juros', v)} />
              </div>
            ))}
            <div className="grid items-center" style={{ gridTemplateColumns: '1.2fr 1fr 1fr', padding: '12px 16px', borderTop: '1px solid var(--border-default)', background: 'var(--surface-sunken)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>
              <div>Total</div>
              <div style={{ fontVariantNumeric: 'tabular-nums' }}>{brl(totalAmortizacao)}</div>
              <div style={{ fontVariantNumeric: 'tabular-nums' }}>{brl(totalJuros)}</div>
            </div>
          </div>

          {/* Paginação decorativa (não funcional) */}
          <div className="flex items-center justify-center" style={{ gap: 6, marginTop: 16 }}>
            <PageBtn icon={ChevronLeft} disabled />
            <span style={{ width: 30, height: 30, borderRadius: 'var(--radius-md)', background: 'var(--gci-base)', color: '#fff', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
            <PageBtn icon={ChevronRight} disabled />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between" style={{ padding: '16px 32px', borderTop: '1px solid var(--border-default)', background: 'var(--surface-card)' }}>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Valor Total: <span style={{ color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{brl(totalGeral)}</span>
          </div>
          <div className="flex items-center" style={{ gap: 12 }}>
            <button
              onClick={onClose}
              style={{ height: 44, padding: '0 20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)' }}
            >
              Cancelar
            </button>
            <button
              onClick={() => onUpdate(rows)}
              className="flex items-center"
              style={{ gap: 8, height: 44, padding: '0 24px', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', background: 'var(--action-primary-bg)', color: '#fff' }}
            >
              <Pencil size={15} /> ATUALIZAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditableCell({ value, onChange }: { value: number; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      inputMode="decimal"
      defaultValue={value.toFixed(2)}
      onBlur={(e) => onChange(e.target.value)}
      style={{
        width: '100%', height: 36, padding: '0 12px',
        background: 'var(--surface-card)', border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)', outline: 'none',
        fontSize: 'var(--text-sm)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums',
      }}
    />
  );
}

function PageBtn({ icon: Icon, disabled }: { icon: typeof ChevronLeft; disabled?: boolean }) {
  return (
    <button
      disabled={disabled}
      className="flex items-center justify-center"
      style={{ width: 30, height: 30, borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', border: '1px solid var(--border-default)', color: 'var(--text-disabled)', cursor: 'not-allowed' }}
    >
      <Icon size={14} />
    </button>
  );
}

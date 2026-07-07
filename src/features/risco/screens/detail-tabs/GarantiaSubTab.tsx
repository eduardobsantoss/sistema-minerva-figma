import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { ParametrizacaoGarantia } from '../../data/riscoData';
import { TabCard, FieldLabel, ToggleRow } from './shared';

interface Props {
  data: ParametrizacaoGarantia;
  onSave: (data: ParametrizacaoGarantia) => void;
}

export function GarantiaSubTab({ data, onSave }: Props) {
  const [form, setForm] = useState<ParametrizacaoGarantia>(data);

  return (
    <TabCard title="Garantia" icon={ShieldCheck} onSave={() => onSave(form)}>
      <div className="flex flex-col" style={{ gap: 16 }}>
        <ToggleRow
          label="Requer confirmação de títulos de garantia"
          hint="Exige confirmação formal dos títulos oferecidos como garantia antes da liberação da operação."
          on={form.requerConfirmacaoTitulos}
          onToggle={() => setForm({ ...form, requerConfirmacaoTitulos: !form.requerConfirmacaoTitulos })}
        />
        {form.requerConfirmacaoTitulos && (
          <div style={{ maxWidth: 240 }}>
            <FieldLabel>Percentual mínimo de garantia</FieldLabel>
            <input
              type="text"
              value={`${form.percentualGarantia.toFixed(0)}%`}
              onChange={(e) => setForm({ ...form, percentualGarantia: Number(e.target.value.replace('%', '')) || 0 })}
              style={{ width: '100%', height: 40, padding: '0 14px', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}
            />
          </div>
        )}
      </div>
    </TabCard>
  );
}

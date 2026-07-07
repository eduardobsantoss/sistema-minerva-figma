import { useState } from 'react';
import { Zap } from 'lucide-react';
import type { ParametrizacaoAutoatendimento } from '../../data/riscoData';
import { TabCard, FieldLabel } from './shared';

interface Props {
  data: ParametrizacaoAutoatendimento;
  onSave: (data: ParametrizacaoAutoatendimento) => void;
}

export function AutoatendimentoSubTab({ data, onSave }: Props) {
  const [form, setForm] = useState<ParametrizacaoAutoatendimento>(data);

  return (
    <TabCard title="Autoatendimento" icon={Zap} onSave={() => onSave(form)}>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div>
          <FieldLabel>Limite p/ operações automáticas com duplicatas</FieldLabel>
          <MoneyInput value={form.limiteOperacoesAutomaticas} onChange={(v) => setForm({ ...form, limiteOperacoesAutomaticas: v })} />
        </div>
        <div>
          <FieldLabel>Taxa de fee</FieldLabel>
          <PctInput value={form.taxaFee} onChange={(v) => setForm({ ...form, taxaFee: v })} />
        </div>
        <div>
          <FieldLabel>Taxa de risco</FieldLabel>
          <PctInput value={form.taxaRisco} onChange={(v) => setForm({ ...form, taxaRisco: v })} />
        </div>
      </div>
    </TabCard>
  );
}

function MoneyInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="text"
      value={value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      onChange={(e) => onChange(Number(e.target.value.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0)}
      style={{ width: '100%', height: 40, padding: '0 14px', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}
    />
  );
}

function PctInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="text"
      value={`${value.toFixed(2).replace('.', ',')}%`}
      onChange={(e) => onChange(Number(e.target.value.replace('%', '').replace(',', '.')) || 0)}
      style={{ width: '100%', height: 40, padding: '0 14px', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}
    />
  );
}

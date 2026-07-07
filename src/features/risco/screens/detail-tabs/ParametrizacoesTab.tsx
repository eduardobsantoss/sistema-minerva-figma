import { useState } from 'react';
import type { Parametrizacoes } from '../../data/riscoData';
import { LimiteSubTab } from './LimiteSubTab';
import { AutoatendimentoSubTab } from './AutoatendimentoSubTab';
import { GeralSubTab } from './GeralSubTab';
import { GarantiaSubTab } from './GarantiaSubTab';

interface Props {
  data: Parametrizacoes;
  onChange: (data: Parametrizacoes) => void;
}

const SUB_TABS = ['Limite', 'Autoatendimento', 'Geral', 'Garantia'] as const;
type SubTab = typeof SUB_TABS[number];

export function ParametrizacoesTab({ data, onChange }: Props) {
  const [tab, setTab] = useState<SubTab>('Limite');

  return (
    <div className="flex flex-col" style={{ gap: 20 }}>
      <div className="flex items-center" style={{ gap: 6, borderBottom: '1px solid var(--border-default)' }}>
        {SUB_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '10px 4px', marginRight: 22, background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)',
              color: tab === t ? 'var(--text-strong)' : 'var(--text-muted)',
              borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Limite' && <LimiteSubTab data={data.limite} onSave={(limite) => onChange({ ...data, limite })} />}
      {tab === 'Autoatendimento' && <AutoatendimentoSubTab data={data.autoatendimento} onSave={(autoatendimento) => onChange({ ...data, autoatendimento })} />}
      {tab === 'Geral' && <GeralSubTab data={data.geral} onSave={(geral) => onChange({ ...data, geral })} />}
      {tab === 'Garantia' && <GarantiaSubTab data={data.garantia} onSave={(garantia) => onChange({ ...data, garantia })} />}
    </div>
  );
}

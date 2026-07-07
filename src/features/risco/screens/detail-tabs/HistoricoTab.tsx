import { Clock, History } from 'lucide-react';
import type { HistoricoEvento } from '../../data/riscoData';
import { Section, EmptyState } from './shared';

interface Props {
  eventos: HistoricoEvento[];
}

export function HistoricoTab({ eventos }: Props) {
  if (eventos.length === 0) {
    return <EmptyState icon={History} title="Nenhum evento registrado" hint="O histórico deste grupo aparecerá aqui conforme novos eventos ocorrerem." />;
  }

  return (
    <Section title="Linha do Tempo">
      <div className="flex flex-col" style={{ gap: 0, position: 'relative' }}>
        {eventos.map((e, i) => (
          <div key={e.id} className="flex items-start" style={{ gap: 16, padding: '12px 0', position: 'relative' }}>
            <div style={{ position: 'relative', width: 12 }}>
              <span style={{ display: 'block', width: 12, height: 12, borderRadius: '9999px', background: 'var(--gci-base)', marginTop: 4 }} />
              {i < eventos.length - 1 && <span style={{ position: 'absolute', left: 5, top: 16, bottom: -12, width: 2, background: 'var(--border-default)' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>
                {e.descricao}
              </div>
              <div className="flex items-center" style={{ gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                <Clock size={12} /> {e.datetime}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

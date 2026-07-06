import { Clock } from 'lucide-react';
import { detalheSolicitacao } from '../../data/operacaoData';
import { Section } from './shared';

export function HistoricoTab({ det }: { det: ReturnType<typeof detalheSolicitacao> }) {
  return (
    <Section title="Linha do Tempo">
      <div className="flex flex-col" style={{ position: 'relative' }}>
        {det.historico.map((ev, i) => (
          <div key={i} className="flex items-start" style={{ gap: 16, padding: '12px 0', position: 'relative' }}>
            <div style={{ position: 'relative', width: 12 }}>
              <span style={{ display: 'block', width: 12, height: 12, borderRadius: '9999px', background: 'var(--gci-base)', marginTop: 4 }} />
              {i < det.historico.length - 1 && <span style={{ position: 'absolute', left: 5, top: 16, bottom: -12, width: 2, background: 'var(--border-default)' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>
                <strong>{ev.autor}</strong> {ev.acao}
              </div>
              <div className="flex items-center" style={{ gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                <Clock size={12} /> {ev.data}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

import { Plus, Boxes, Search } from 'lucide-react';
import { brl, detalheSolicitacao } from '../../data/operacaoData';
import { Section, EmptyState, GhostButton } from './shared';

export function AtivosTab({
  det, onAddContrato,
}: {
  det: ReturnType<typeof detalheSolicitacao>;
  onAddContrato: () => void;
}) {
  const total = det.ativos.reduce((acc, a) => acc + a.valorTotal, 0);
  return (
    <Section title="Ativos Vinculados" action={<GhostButton icon={Plus} onClick={onAddContrato}>Adicionar contrato</GhostButton>}>
      <div className="flex items-center" style={{ gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <FilterInput placeholder="Lastros" />
        <FilterInput placeholder="Número" />
        <FilterInput placeholder="Sacado" />
      </div>
      {det.ativos.length === 0 ? (
        <EmptyState icon={Boxes} title="Nenhum ativo vinculado" hint="Use “Adicionar contrato” para vincular lastros a esta solicitação. O valor total será calculado automaticamente." />
      ) : (
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1.4fr', padding: '12px 16px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            <div>Número</div><div>Tipo</div><div>Emissão</div><div>Vencimento</div><div>Sacado</div>
          </div>
          {det.ativos.map((a, i) => (
            <div key={`${a.numero}-${i}`} className="grid items-center" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1.4fr', padding: '12px 16px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }}>
              <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{a.numero || '—'}</div>
              <div style={{ color: 'var(--text-default)' }}>{a.tipo}</div>
              <div style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{a.emissao || '—'}</div>
              <div style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{a.vencimento || '—'}</div>
              <div style={{ color: 'var(--text-default)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.sacadoNome || '—'}</div>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between" style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-default)' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Valor total</span>
        <span style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{brl(total)}</span>
      </div>
    </Section>
  );
}

function FilterInput({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative" style={{ flex: 1, minWidth: 160 }}>
      <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
      <input placeholder={placeholder} style={{ width: '100%', height: 40, paddingLeft: 36, paddingRight: 12, background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }} />
    </div>
  );
}

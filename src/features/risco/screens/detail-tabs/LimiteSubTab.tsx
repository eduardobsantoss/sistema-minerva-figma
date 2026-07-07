import { useState } from 'react';
import { FileText, Eye, RefreshCw, AlertTriangle, Layers, Plus } from 'lucide-react';
import { RATINGS_SEED, AGRUPAMENTOS_SEED, brl, type ParametrizacaoLimite } from '../../data/riscoData';
import { TabCard, FieldLabel, SelectField } from './shared';

interface Props {
  data: ParametrizacaoLimite;
  onSave: (data: ParametrizacaoLimite) => void;
}

const RATING_OPTS = [...RATINGS_SEED.map((r) => r.nome), 'NÃO SE APLICA'];

export function LimiteSubTab({ data, onSave }: Props) {
  const [form, setForm] = useState<ParametrizacaoLimite>(data);

  return (
    <div className="flex flex-col" style={{ gap: 20 }}>
      <TabCard title="Dados da Análise" icon={FileText} onSave={() => onSave(form)}>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <FieldLabel>* Parecer de crédito</FieldLabel>
            {form.parecerCreditoArquivo ? (
              <div className="flex items-center justify-between" style={{ height: 40, padding: '0 8px 0 14px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.parecerCreditoArquivo}</span>
                <div className="flex items-center" style={{ gap: 4 }}>
                  <button aria-label="Visualizar" className="flex items-center justify-center" style={{ width: 28, height: 28, border: 'none', background: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <Eye size={14} />
                  </button>
                  <button aria-label="Atualizar" className="flex items-center justify-center" style={{ width: 28, height: 28, border: 'none', background: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between" style={{ height: 40, padding: '0 14px', border: '1px dashed var(--danger-base)', borderRadius: 'var(--radius-lg)', background: 'var(--status-danger-bg)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--danger-base)', fontWeight: 'var(--weight-semibold)' }}>Nenhum parecer anexado</span>
                <button className="flex items-center justify-center" style={{ width: 28, height: 28, border: 'none', background: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--danger-base)' }}>
                  <RefreshCw size={14} />
                </button>
              </div>
            )}
          </div>
          <SelectField
            label="Indicativo de rating"
            options={RATING_OPTS}
            value={form.indicativoRating}
            onChange={(e) => setForm({ ...form, indicativoRating: e.target.value })}
          />
        </div>
      </TabCard>

      {form.reparametrizacaoData && (
        <div className="flex items-center" style={{ gap: 12, padding: '14px 18px', borderRadius: 'var(--radius-lg)', background: 'var(--status-warning-bg)', border: '1px solid var(--warning-base)' }}>
          <AlertTriangle size={18} style={{ color: 'var(--warning-dark)', flexShrink: 0 }} />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--warning-dark)', fontWeight: 'var(--weight-semibold)' }}>
            Este grupo possui reparametrização de limite agendada para {form.reparametrizacaoData}.
          </span>
        </div>
      )}

      <TabCard title="Agrupamentos" icon={Layers}>
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div className="grid items-center" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 44px', padding: '10px 16px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            <div>Agrupamento</div><div style={{ textAlign: 'right' }}>Produtos</div><div style={{ textAlign: 'right' }}>Limite</div><div style={{ textAlign: 'right' }}>Risco</div><div />
          </div>
          {form.agrupamentos.map((row, i) => {
            const nome = AGRUPAMENTOS_SEED.find((a) => a.id === row.agrupamentoId)?.nome ?? row.agrupamentoId;
            return (
              <div key={i} className="grid items-center" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 44px', padding: '12px 16px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }}>
                <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{nome}</div>
                <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.produtos}</div>
                <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{brl(row.limite, { compact: true })}</div>
                <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{brl(row.risco, { compact: true })}</div>
                <div className="flex justify-end">
                  <button
                    aria-label="Adicionar agrupamento"
                    title="Vincular novo agrupamento (em breve)"
                    className="flex items-center justify-center"
                    style={{ width: 28, height: 28, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </TabCard>
    </div>
  );
}

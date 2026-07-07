import { useState } from 'react';
import { ClipboardCheck, Users, Truck, ShieldCheck, FileSearch, ScrollText, UserCheck, FileSignature, Trash2 } from 'lucide-react';
import { FREQUENCIA_LAUDO_OPTS, type ParametrizacaoGeral, type ExcecaoConcentracao } from '../../data/riscoData';
import { TabCard, FieldLabel, SelectField, ToggleRow, PctInput, DiasInput, EmptyState, AddButton } from './shared';

interface Props {
  data: ParametrizacaoGeral;
  onSave: (data: ParametrizacaoGeral) => void;
}

function Cell({ span, children }: { span: number; children: React.ReactNode }) {
  return <div style={{ gridColumn: `span ${span}` }}>{children}</div>;
}

export function GeralSubTab({ data, onSave }: Props) {
  const [form, setForm] = useState<ParametrizacaoGeral>(data);
  const [excSacadoDoc, setExcSacadoDoc] = useState('');
  const [excSacadoNome, setExcSacadoNome] = useState('');
  const [excPct, setExcPct] = useState('');

  const addExcecao = () => {
    if (!excSacadoNome.trim() || !excPct) return;
    const nova: ExcecaoConcentracao = { id: `exc-${Date.now()}`, sacadoDocumento: excSacadoDoc, sacadoNome: excSacadoNome, percentual: Number(excPct.replace(',', '.')) || 0 };
    setForm({ ...form, excecoesConcentracao: [...form.excecoesConcentracao, nova] });
    setExcSacadoDoc(''); setExcSacadoNome(''); setExcPct('');
  };

  const removeExcecao = (id: string) => setForm({ ...form, excecoesConcentracao: form.excecoesConcentracao.filter((e) => e.id !== id) });
  const toggleAvalistaObrigatorio = (id: string) => setForm({ ...form, avalistas: form.avalistas.map((a) => a.id === id ? { ...a, obrigatorio: !a.obrigatorio } : a) });
  const removeAvalista = (id: string) => setForm({ ...form, avalistas: form.avalistas.filter((a) => a.id !== id) });

  return (
    <div className="flex flex-col" style={{ gap: 20 }}>
      <TabCard title="Confirmação de Cessões" icon={ClipboardCheck}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
          <Cell span={3}><PctInput label="* Confirmação (Pré-Desembolso)" value={form.confirmacaoPreDesembolsoPct} onChange={(v) => setForm({ ...form, confirmacaoPreDesembolsoPct: v })} /></Cell>
          <Cell span={4}><DiasInput label="* Prazo para confirmação dos títulos (dias)" value={form.prazoConfirmacaoTitulosDias} onChange={(v) => setForm({ ...form, prazoConfirmacaoTitulosDias: v })} /></Cell>
          <Cell span={5}><PctInput label="* Confirmação p/ clientes novos (Pós-Desembolso)" value={form.confirmacaoClientesNovosPct} onChange={(v) => setForm({ ...form, confirmacaoClientesNovosPct: v })} /></Cell>
          <Cell span={5}><PctInput label="* Confirmação p/ clientes antigos (Pós-Desembolso)" value={form.confirmacaoClientesAntigosPct} onChange={(v) => setForm({ ...form, confirmacaoClientesAntigosPct: v })} /></Cell>
        </div>
      </TabCard>

      <TabCard title="Sacado" icon={Users}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
          <Cell span={4}><PctInput label="* Notificação dos sacados" value={form.notificacaoSacadosPct} onChange={(v) => setForm({ ...form, notificacaoSacadosPct: v })} /></Cell>
          <Cell span={5}><PctInput label="* Concentr. máxima por sacado (limite)" value={form.concentracaoMaximaSacadoPct} onChange={(v) => setForm({ ...form, concentracaoMaximaSacadoPct: v })} /></Cell>
        </div>
      </TabCard>

      <TabCard title="NF de Entrega Futura" icon={Truck}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
          <Cell span={4}><ToggleRow label="Pode operar" on={form.nfEntregaFuturaPodeOperar} onToggle={() => setForm({ ...form, nfEntregaFuturaPodeOperar: !form.nfEntregaFuturaPodeOperar })} /></Cell>
          <Cell span={5}>
            <PctInput
              label="Operação máxima para NF de entrega futura"
              value={form.nfEntregaFuturaOperacaoMaximaPct}
              onChange={(v) => setForm({ ...form, nfEntregaFuturaOperacaoMaximaPct: v })}
              disabled={!form.nfEntregaFuturaPodeOperar}
            />
          </Cell>
        </div>
      </TabCard>

      <TabCard title="Crédito e Validade Serasa" icon={ShieldCheck}>
        <div className="flex flex-col" style={{ gap: 16 }}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
            <Cell span={5}><ToggleRow label="Pré-aprovação do sacado pelo crédito" on={form.creditoPreAprovacaoSacado} onToggle={() => setForm({ ...form, creditoPreAprovacaoSacado: !form.creditoPreAprovacaoSacado })} /></Cell>
            <Cell span={3}><DiasInput label="Validade Serasa do sacado (dias)" value={form.validadeSerasaSacadoDias} onChange={(v) => setForm({ ...form, validadeSerasaSacadoDias: v })} /></Cell>
            <Cell span={4}><DiasInput label="Validade Serasa do avalista (dias)" value={form.validadeSerasaAvalistaDias} onChange={(v) => setForm({ ...form, validadeSerasaAvalistaDias: v })} /></Cell>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
            <Cell span={4}><DiasInput label="Validade Serasa do cedente (dias)" value={form.validadeSerasaCedenteDias} onChange={(v) => setForm({ ...form, validadeSerasaCedenteDias: v })} /></Cell>
            <Cell span={5}><ToggleRow label="Necessita aval do cônjuge" on={form.necessitaAvalConjuge} onToggle={() => setForm({ ...form, necessitaAvalConjuge: !form.necessitaAvalConjuge })} /></Cell>
          </div>
        </div>
      </TabCard>

      <TabCard title="Laudo de Ativo/Imóvel" icon={FileSearch}>
        <div className="flex flex-col" style={{ gap: 16 }}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
            <Cell span={5}><ToggleRow label="Laudo do ativo antes do desembolso" on={form.laudoAtivoAntesDesembolso} onToggle={() => setForm({ ...form, laudoAtivoAntesDesembolso: !form.laudoAtivoAntesDesembolso })} /></Cell>
            <Cell span={3}><SelectField label="Frequência do laudo do ativo" options={FREQUENCIA_LAUDO_OPTS} value={form.laudoFrequencia} onChange={(e) => setForm({ ...form, laudoFrequencia: e.target.value as ParametrizacaoGeral['laudoFrequencia'] })} /></Cell>
            <Cell span={4}><DiasInput label="(AF Imóvel) prazo do laudo pós comitê (dias)" value={form.afImovelPrazoLaudoPosComiteDias} onChange={(v) => setForm({ ...form, afImovelPrazoLaudoPosComiteDias: v })} /></Cell>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
            <Cell span={6}><ToggleRow label="(AF Imóvel) AF aprovado só com escritura pública" on={form.afImovelAprovadoSoEscrituraPublica} onToggle={() => setForm({ ...form, afImovelAprovadoSoEscrituraPublica: !form.afImovelAprovadoSoEscrituraPublica })} /></Cell>
          </div>
        </div>
      </TabCard>

      <TabCard title="Protocolos por Produto" icon={ScrollText}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
          <Cell span={5}><ToggleRow label="(CPR) Desembolso só com protocolo" on={form.protocoloCpr} onToggle={() => setForm({ ...form, protocoloCpr: !form.protocoloCpr })} /></Cell>
          <Cell span={7}><ToggleRow label="(Garantia de Imóvel) Desembolso só com protocolo" on={form.protocoloGarantiaImovel} onToggle={() => setForm({ ...form, protocoloGarantiaImovel: !form.protocoloGarantiaImovel })} /></Cell>
        </div>
      </TabCard>

      <TabCard title="Exceções de Concentração por Sacado" icon={UserCheck}>
        <div className="flex flex-col" style={{ gap: 16 }}>
          <div className="grid items-end" style={{ gridTemplateColumns: '1fr 1.4fr 0.7fr auto', gap: 10 }}>
            <div>
              <FieldLabel>* CPF/CNPJ do sacado</FieldLabel>
              <input value={excSacadoDoc} onChange={(e) => setExcSacadoDoc(e.target.value)} placeholder="—" style={{ width: '100%', height: 38, padding: '0 12px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none', fontSize: 'var(--text-sm)' }} />
            </div>
            <div>
              <FieldLabel>Nome do sacado</FieldLabel>
              <input value={excSacadoNome} onChange={(e) => setExcSacadoNome(e.target.value)} placeholder="—" style={{ width: '100%', height: 38, padding: '0 12px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none', fontSize: 'var(--text-sm)' }} />
            </div>
            <div>
              <FieldLabel>* Concentr. máxima do sacado</FieldLabel>
              <input value={excPct} onChange={(e) => setExcPct(e.target.value)} placeholder="0,00%" style={{ width: '100%', height: 38, padding: '0 12px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none', fontSize: 'var(--text-sm)' }} />
            </div>
            <AddButton onClick={addExcecao} />
          </div>

          {form.excecoesConcentracao.length === 0 ? (
            <EmptyState icon={UserCheck} title="Nenhuma exceção cadastrada" hint="Use o formulário acima para cadastrar exceções de concentração por sacado." />
          ) : (
            <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div className="grid items-center" style={{ gridTemplateColumns: '1.4fr 1fr 0.7fr 40px', padding: '10px 16px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                <div>Sacado</div><div>CPF/CNPJ</div><div style={{ textAlign: 'right' }}>Percentual</div><div />
              </div>
              {form.excecoesConcentracao.map((e) => (
                <div key={e.id} className="grid items-center" style={{ gridTemplateColumns: '1.4fr 1fr 0.7fr 40px', padding: '10px 16px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }}>
                  <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{e.sacadoNome}</div>
                  <div style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-muted)' }}>{e.sacadoDocumento || '—'}</div>
                  <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{e.percentual.toFixed(2).replace('.', ',')}%</div>
                  <div className="flex justify-end">
                    <button onClick={() => removeExcecao(e.id)} aria-label="Remover" className="flex items-center justify-center" style={{ width: 26, height: 26, border: 'none', background: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--action-danger-text-only)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </TabCard>

      <TabCard title="Avalistas com Obrigatoriedade de Assinatura" icon={FileSignature} onSave={() => onSave(form)}>
        {form.avalistas.length === 0 ? (
          <EmptyState icon={FileSignature} title="Nenhum avalista cadastrado" hint="Avalistas obrigatórios de assinatura são herdados do cadastro de cedentes/avalistas do grupo." />
        ) : (
          <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div className="grid items-center" style={{ gridTemplateColumns: '1.4fr 1fr 130px 40px', padding: '10px 16px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <div>Avalista</div><div>CPF/CNPJ</div><div>Assinatura obrigatória</div><div />
            </div>
            {form.avalistas.map((a) => (
              <div key={a.id} className="grid items-center" style={{ gridTemplateColumns: '1.4fr 1fr 130px 40px', padding: '10px 16px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }}>
                <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{a.nome}</div>
                <div style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-muted)' }}>{a.documento}</div>
                <div>
                  <input type="checkbox" checked={a.obrigatorio} onChange={() => toggleAvalistaObrigatorio(a.id)} />
                </div>
                <div className="flex justify-end">
                  <button onClick={() => removeAvalista(a.id)} aria-label="Remover" className="flex items-center justify-center" style={{ width: 26, height: 26, border: 'none', background: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--action-danger-text-only)' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </TabCard>
    </div>
  );
}

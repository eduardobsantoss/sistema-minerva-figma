import { useState } from 'react';
import { X, Tag, Paperclip, Trash2, FileText, AlertTriangle, Layers, CalendarClock, type LucideIcon } from 'lucide-react';
import { UF_OPTIONS, PAISES_DDI, type ContratoAtivo, type ParcelaAtivo } from '../../data/operacaoData';

interface Props {
  onClose: () => void;
  onCreate: (data: ContratoAtivo) => void;
  valorOperacao: number;
  tipoCalculo: string;
}

const TIPO_OPERACAO_OPTS = [
  'Desconto Duplicata', 'Contrato NC', 'Contrato NP', 'Contrato CCB',
  'Contrato CPR', 'Contrato CPRF', 'Contrato CDCA',
];
const DOC_CEDENTE_OPTS = ['Contrato_Social_Cedente.pdf', 'Procuracao_2026.pdf', 'Cartao_CNPJ.pdf'];
const FLUXO_OPTS = ['Única', 'Mensal', 'Bimestral', 'Trimestral', 'Quadrimestral', 'Semestral', 'Anual'];
const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const DDI_OPTS = PAISES_DDI.map((p) => p.ddi);

interface FormState {
  gerarMinuta: boolean;
  documento: string;
  tipoValorNominal: boolean;
  numero: string;
  tipo: string;
  emissao: string;
  vencimento: string;
  chaveNota: string;
  docCedente: string;
  gerarOperacaoGarantias: boolean;
  possuiParcelas: boolean;
  possuiCronograma: boolean;
  cronogramaAutomatico: boolean;
  fluxoAmortizacao: string;
  fluxoJuros: string;
  sacadoDocumento: string;
  sacadoNome: string;
  sacadoEmail: string;
  ddi: string;
  telefone: string;
  cep: string;
  endereco: string;
  numeroEndereco: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
}

const initialForm: FormState = {
  gerarMinuta: false,
  documento: '',
  tipoValorNominal: false,
  numero: '',
  tipo: '',
  emissao: '',
  vencimento: '',
  chaveNota: '',
  docCedente: '',
  gerarOperacaoGarantias: false,
  possuiParcelas: false,
  possuiCronograma: false,
  cronogramaAutomatico: false,
  fluxoAmortizacao: '',
  fluxoJuros: '',
  sacadoDocumento: '',
  sacadoNome: '',
  sacadoEmail: '',
  ddi: '+55',
  telefone: '',
  cep: '',
  endereco: '',
  numeroEndereco: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  pais: 'Brasil',
};

export function AdicionarContratoModal({ onClose, onCreate, valorOperacao, tipoCalculo }: Props) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [parcelas, setParcelas] = useState<ParcelaAtivo[]>([]);
  const [parcelaForm, setParcelaForm] = useState({ valor: '', vencimento: '' });
  const [cronograma, setCronograma] = useState<ParcelaAtivo[]>([]);
  const [pagamentoForm, setPagamentoForm] = useState({ amortizacao: '', vencimento: '', pagarJuros: false, valorJuros: '' });

  const set = (f: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [f]: e.target.value }));
  const setVal = (f: keyof FormState) => (v: string) =>
    setForm((prev) => ({ ...prev, [f]: v }));
  const toggle = (f: keyof FormState) => () =>
    setForm((prev) => ({ ...prev, [f]: !prev[f] }));

  const somatoriaParcelas = parcelas.reduce((acc, p) => acc + (Number(p.valor) || 0), 0);
  const somatoriaAmortizacao = cronograma.reduce((acc, c) => acc + (Number(c.amortizacao) || 0), 0);

  const addParcela = () => {
    if (!parcelaForm.valor || !parcelaForm.vencimento) return;
    setParcelas((prev) => [...prev, {
      parcela: `${prev.length + 1}ª Parcela`,
      valor: Number(parcelaForm.valor),
      vencimento: parcelaForm.vencimento,
    }]);
    setParcelaForm({ valor: '', vencimento: '' });
  };
  const removeParcela = (i: number) => setParcelas((prev) => prev.filter((_, idx) => idx !== i));

  const addPagamento = () => {
    if (!pagamentoForm.vencimento) return;
    setCronograma((prev) => [...prev, {
      parcela: `${prev.length + 1}ª Parcela`,
      vencimento: pagamentoForm.vencimento,
      amortizacao: Number(pagamentoForm.amortizacao) || 0,
      juros: pagamentoForm.pagarJuros ? Number(pagamentoForm.valorJuros) || 0 : 0,
      pagarJuros: pagamentoForm.pagarJuros,
    }]);
    setPagamentoForm({ amortizacao: '', vencimento: '', pagarJuros: false, valorJuros: '' });
  };
  const removePagamento = (i: number) => setCronograma((prev) => prev.filter((_, idx) => idx !== i));

  const gerarPagamentosAutomaticos = () => {
    if (!form.fluxoAmortizacao || !form.fluxoJuros) return;
    const base = valorOperacao > 0 ? valorOperacao / 2 : 50_000;
    setCronograma([
      { parcela: '1ª Parcela', vencimento: '30/07/2026', amortizacao: Math.round(base), juros: Math.round(base * 0.02), pagarJuros: true },
      { parcela: '2ª Parcela', vencimento: '30/08/2026', amortizacao: Math.round(base), juros: Math.round(base * 0.02), pagarJuros: true },
    ]);
  };

  const canSubmit = form.numero.trim() !== '' && form.tipo.trim() !== '';

  const handleSubmit = () => {
    if (!canSubmit) return;
    onCreate({
      numero: form.numero,
      tipo: form.tipo,
      emissao: form.emissao,
      vencimento: form.vencimento,
      valorTotal: valorOperacao,
      sacadoNome: form.sacadoNome,
      sacadoDocumento: form.sacadoDocumento,
      parcelas: form.possuiCronograma ? cronograma : parcelas,
    });
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(8,60,74,0.55)', backdropFilter: 'blur(8px)',
        zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 32, animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)',
          width: '100%', maxWidth: 1040, height: '88vh',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between" style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-default)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>
              Adicionar Contrato
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
              Dados do título, parcelas/cronograma e dados do sacado
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

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          <div className="flex flex-col" style={{ gap: 24 }}>
            <ToggleRow label="Gerar minuta" on={form.gerarMinuta} onToggle={toggle('gerarMinuta')} />

            <BentoBox title="Dados do Título" icon={Tag}>
              <div className="flex flex-col" style={{ gap: 14 }}>
                <div className="flex items-center" style={{ gap: 8, height: 42, padding: '0 14px', background: 'var(--surface-card)', border: '1px dashed var(--border-default)', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                  <Paperclip size={15} /> Insira o documento...
                </div>

                <BentoGrid cols={4}>
                  <FormField label="Valor total" value={brl(valorOperacao)} disabled />
                  <SelectField label="Tipo de cálculo" options={[tipoCalculo]} value={tipoCalculo} disabled />
                  <FormField label="Número" placeholder="—" value={form.numero} onChange={set('numero')} />
                  <SelectField label="Tipo" options={TIPO_OPERACAO_OPTS} placeholder="Selecione" value={form.tipo} onChange={setVal('tipo')} />
                </BentoGrid>

                <ToggleRow label="Tipo de valor: NOMINAL" on={form.tipoValorNominal} onToggle={toggle('tipoValorNominal')} compact />

                <BentoGrid cols={4}>
                  <FormField label="Emissão" placeholder="dd/mm/aaaa" value={form.emissao} onChange={set('emissao')} required />
                  <FormField label="Vencimento" placeholder="dd/mm/aaaa" value={form.vencimento} onChange={set('vencimento')} required />
                  <FormField label="Chave da nota" placeholder="—" value={form.chaveNota} onChange={set('chaveNota')} />
                  <SelectField label="Doc. da cedente" options={DOC_CEDENTE_OPTS} placeholder="Selecione" value={form.docCedente} onChange={setVal('docCedente')} />
                </BentoGrid>

                <ToggleRow label="Gerar operação no módulo de garantias" on={form.gerarOperacaoGarantias} onToggle={toggle('gerarOperacaoGarantias')} compact />
              </div>
            </BentoBox>

            <ToggleRow label="Possui múltiplas parcelas" on={form.possuiParcelas} onToggle={toggle('possuiParcelas')} />
            {form.possuiParcelas && (
              <BentoBox title="Parcelas" icon={Tag}>
                <div className="flex flex-col" style={{ gap: 14 }}>
                  <div className="grid items-end" style={{ gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12 }}>
                    <FormField label="Parcela" value={`${parcelas.length + 1}ª Parcela`} disabled />
                    <FormField label="Valor" placeholder="R$ 0,00" value={parcelaForm.valor} onChange={(e) => setParcelaForm((p) => ({ ...p, valor: e.target.value }))} />
                    <FormField label="Vencimento" placeholder="dd/mm/aaaa" value={parcelaForm.vencimento} onChange={(e) => setParcelaForm((p) => ({ ...p, vencimento: e.target.value }))} required />
                    <AddButton onClick={addParcela}>Adicionar parcela</AddButton>
                  </div>

                  {parcelas.length === 0 ? (
                    <EmptyState icon={Layers} title="Nenhuma parcela adicionada" hint="Use o formulário acima para adicionar as parcelas deste contrato." />
                  ) : (
                    <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                      <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr 1fr auto', padding: '10px 14px', background: 'var(--surface-card)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        <div>Parcela</div><div>Valor</div><div>Vencimento</div><div />
                      </div>
                      {parcelas.map((p, i) => (
                        <div key={i} className="grid items-center" style={{ gridTemplateColumns: '1.4fr 1fr 1fr auto', padding: '10px 14px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }}>
                          <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{p.parcela}</div>
                          <div style={{ fontVariantNumeric: 'tabular-nums' }}>{brl(p.valor ?? 0)}</div>
                          <div style={{ fontVariantNumeric: 'tabular-nums' }}>{p.vencimento}</div>
                          <button aria-label="Remover" onClick={() => removeParcela(i)} className="flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center justify-center" style={{ padding: '10px 14px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>
                        Somatória das parcelas: {brl(somatoriaParcelas)}
                      </div>
                    </div>
                  )}
                  {somatoriaParcelas !== valorOperacao && (
                    <div className="flex items-center justify-center" style={{ gap: 6, fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: 'var(--warning-base)' }}>
                      <AlertTriangle size={13} /> Total das parcelas diferente do valor total solicitado
                    </div>
                  )}
                </div>
              </BentoBox>
            )}

            <ToggleRow label="Possui cronograma de pagamentos" on={form.possuiCronograma} onToggle={toggle('possuiCronograma')} />
            {form.possuiCronograma && (
              <BentoBox title="Cronograma de Pagamentos" icon={Tag}>
                <div className="flex flex-col" style={{ gap: 14 }}>
                  <ToggleRow label="Gerar pagamentos automaticamente" on={form.cronogramaAutomatico} onToggle={toggle('cronogramaAutomatico')} compact />

                  {form.cronogramaAutomatico ? (
                    <div className="grid items-end" style={{ gridTemplateColumns: '1fr 1fr auto', gap: 12 }}>
                      <SelectField label="Fluxo de Amortização" options={FLUXO_OPTS} placeholder="Selecione" value={form.fluxoAmortizacao} onChange={setVal('fluxoAmortizacao')} />
                      <SelectField label="Fluxo de pagamento de juros" options={FLUXO_OPTS} placeholder="Selecione" value={form.fluxoJuros} onChange={setVal('fluxoJuros')} />
                      <AddButton onClick={gerarPagamentosAutomaticos}>Gerar pagamentos</AddButton>
                    </div>
                  ) : (
                    <div className="grid items-end" style={{ gridTemplateColumns: '1fr 1fr auto auto auto', gap: 12 }}>
                      <FormField label="Amortização" placeholder="R$ 0,00" value={pagamentoForm.amortizacao} onChange={(e) => setPagamentoForm((p) => ({ ...p, amortizacao: e.target.value }))} />
                      <FormField label="Vencimento" placeholder="dd/mm/aaaa" value={pagamentoForm.vencimento} onChange={(e) => setPagamentoForm((p) => ({ ...p, vencimento: e.target.value }))} required />
                      <ToggleRow label="Pagar juros" on={pagamentoForm.pagarJuros} onToggle={() => setPagamentoForm((p) => ({ ...p, pagarJuros: !p.pagarJuros }))} compact />
                      <FormField label="Valor do juros" placeholder="R$ 0,00" value={pagamentoForm.valorJuros} onChange={(e) => setPagamentoForm((p) => ({ ...p, valorJuros: e.target.value }))} disabled={!pagamentoForm.pagarJuros} />
                      <AddButton onClick={addPagamento}>Adicionar pagamento</AddButton>
                    </div>
                  )}

                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--danger-base)' }}>
                    Obs: Em títulos pré-fixados, caso o cronograma mostre pagamento de juros com valor de R$ 0,00, será considerado o valor de juros projetado na simulação.
                  </div>

                  {cronograma.length === 0 ? (
                    <EmptyState icon={CalendarClock} title="Nenhum pagamento adicionado ao cronograma" hint="Use o formulário acima para adicionar pagamentos manualmente ou gere automaticamente pelo fluxo selecionado." />
                  ) : (
                    <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto', padding: '10px 14px', background: 'var(--surface-card)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        <div>Parcela</div><div>Vencimento</div><div>Amortização</div><div>Juros</div><div>Pagar juros</div><div />
                      </div>
                      {cronograma.map((c, i) => (
                        <div key={i} className="grid items-center" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto', padding: '10px 14px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }}>
                          <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{c.parcela}</div>
                          <div style={{ fontVariantNumeric: 'tabular-nums' }}>{c.vencimento}</div>
                          <div style={{ fontVariantNumeric: 'tabular-nums' }}>{brl(c.amortizacao ?? 0)}</div>
                          <div style={{ fontVariantNumeric: 'tabular-nums' }}>{brl(c.juros ?? 0)}</div>
                          <div>{c.pagarJuros ? 'Sim' : 'Não'}</div>
                          <button aria-label="Remover" onClick={() => removePagamento(i)} className="flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center justify-center" style={{ padding: '10px 14px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>
                        Amortização: {brl(somatoriaAmortizacao)}
                      </div>
                    </div>
                  )}
                </div>
              </BentoBox>
            )}

            <BentoBox title="Dados do Sacado" icon={Tag}>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: 14 }}>
                <div style={{ gridColumn: 'span 4' }}>
                  <FormField label="CPF/CNPJ" placeholder="—" value={form.sacadoDocumento} onChange={set('sacadoDocumento')} />
                </div>
                <div style={{ gridColumn: 'span 5' }}>
                  <FormField label="Nome" placeholder="—" value={form.sacadoNome} onChange={set('sacadoNome')} />
                </div>
                <div style={{ gridColumn: 'span 3' }}>
                  <FormField label="E-mail" placeholder="—" value={form.sacadoEmail} onChange={set('sacadoEmail')} />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <SelectField label="DDI" options={DDI_OPTS} value={form.ddi} onChange={setVal('ddi')} />
                </div>
                <div style={{ gridColumn: 'span 4' }}>
                  <FormField label="Telefone" placeholder="—" value={form.telefone} onChange={set('telefone')} />
                </div>
                <div style={{ gridColumn: 'span 3' }}>
                  <FormField label="CEP" placeholder="—" value={form.cep} onChange={set('cep')} />
                </div>
                <div style={{ gridColumn: 'span 3' }}>
                  <FormField label="Número" placeholder="—" value={form.numeroEndereco} onChange={set('numeroEndereco')} />
                </div>

                <div style={{ gridColumn: 'span 6' }}>
                  <FormField label="Endereço" placeholder="—" value={form.endereco} onChange={set('endereco')} />
                </div>
                <div style={{ gridColumn: 'span 6' }}>
                  <FormField label="Complemento" placeholder="—" value={form.complemento} onChange={set('complemento')} />
                </div>

                <div style={{ gridColumn: 'span 4' }}>
                  <FormField label="Bairro" placeholder="—" value={form.bairro} onChange={set('bairro')} />
                </div>
                <div style={{ gridColumn: 'span 4' }}>
                  <FormField label="Cidade" placeholder="—" value={form.cidade} onChange={set('cidade')} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <SelectField label="Estado" options={UF_OPTIONS} placeholder="UF" value={form.estado} onChange={setVal('estado')} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <SelectField label="País" options={PAIS_OPTS} placeholder="Selecione" value={form.pais} onChange={setVal('pais')} />
                </div>
              </div>
            </BentoBox>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end" style={{ gap: 12, padding: '16px 32px', borderTop: '1px solid var(--border-default)', background: 'var(--surface-card)' }}>
          <button
            onClick={onClose}
            style={{ height: 44, padding: '0 20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex items-center"
            style={{
              gap: 8, height: 44, padding: '0 24px', border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em',
              background: canSubmit ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
              color: canSubmit ? '#fff' : 'var(--text-disabled)',
              transition: 'background var(--duration-base)',
            }}
          >
            <FileText size={15} /> GERAR TÍTULO
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Primitivas locais (padrão replicado dos demais modais) ──────── */

function brl(n: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
}

function BentoBox({ title, icon: Icon, children }: { title: string; icon?: typeof Tag; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
      <div className="flex items-center" style={{ gap: 8, fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 14 }}>
        {Icon && <Icon size={13} strokeWidth={2} />}
        {title}
      </div>
      {children}
    </div>
  );
}

function BentoGrid({ cols, children }: { cols: number; children: React.ReactNode }) {
  return <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 14 }}>{children}</div>;
}

function EmptyState({ icon: Icon, title, hint }: { icon: LucideIcon; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center" style={{ gap: 10, padding: '40px 24px', textAlign: 'center', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-default)' }}>
      <Icon size={28} strokeWidth={1.5} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-default)' }}>{title}</div>
      {hint && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', maxWidth: 360 }}>{hint}</div>}
    </div>
  );
}

function FieldLabel({ children, showError }: { children: React.ReactNode; showError?: boolean }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: showError ? 'var(--danger-base)' : 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
      {showError && '* '}{children}
    </div>
  );
}

function Input({ style, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...rest}
      style={{
        width: '100%', height: 40, padding: '0 14px',
        background: rest.disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)', outline: 'none',
        fontSize: 'var(--text-sm)', color: rest.disabled ? 'var(--text-muted)' : 'var(--text-strong)',
        cursor: rest.disabled ? 'not-allowed' : 'text',
        ...style,
      }}
    />
  );
}

function FormField({ label, placeholder, value, onChange, disabled, required }: {
  label: string; placeholder?: string; value?: string; onChange?: React.ChangeEventHandler<HTMLInputElement>; disabled?: boolean; required?: boolean;
}) {
  const [touched, setTouched] = useState(false);
  const showError = !!required && touched && !value;
  return (
    <div>
      <FieldLabel showError={showError}>{label}</FieldLabel>
      <Input placeholder={placeholder} value={value} onChange={onChange} disabled={disabled} onBlur={() => setTouched(true)} />
    </div>
  );
}

function SelectField({ label, options, placeholder, value, onChange, disabled }: {
  label?: string; options: string[]; placeholder?: string; value?: string; onChange?: (v: string) => void; disabled?: boolean;
}) {
  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          style={{
            width: '100%', height: 40, padding: '0 36px 0 14px',
            background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)', outline: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: 'var(--text-sm)', color: value ? 'var(--text-strong)' : 'var(--text-muted)',
            appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
          }}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}

function ToggleRow({ label, on, onToggle, compact }: { label: string; on: boolean; onToggle: () => void; compact?: boolean }) {
  return (
    <div
      onClick={onToggle}
      className="flex items-center justify-between"
      style={{
        padding: compact ? '10px 16px' : '14px 18px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
        borderWidth: 1, borderStyle: 'solid',
        borderColor: on ? 'var(--success-base)' : 'var(--border-default)',
        background: on ? 'var(--success-light)' : 'var(--surface-card)',
        transition: 'all var(--duration-base)',
      }}
    >
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{label}</span>
      <div style={{ position: 'relative', width: 44, height: 24, borderRadius: '9999px', background: on ? 'var(--success-base)' : 'var(--border-strong)', transition: 'background var(--duration-base)', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: '9999px', background: '#fff', transition: 'left var(--duration-base)', boxShadow: 'var(--shadow-xs)' }} />
      </div>
    </div>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center"
      style={{ height: 40, padding: '0 18px', background: 'var(--gci-base)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}
    >
      {children}
    </button>
  );
}

import { useState } from 'react';
import {
  X, Info, SlidersHorizontal, Network, Settings, Percent,
  Wallet, FileText, AlertTriangle, CheckSquare,
  Check, ChevronLeft, ChevronRight, ChevronDown, Search, Layers,
  Plus, Trash2,
  type LucideIcon,
} from 'lucide-react';
import { gruposEmpresariais } from '../data/craData';

const BENEFICIARIO_OPTS = [
  'CERES SECURIZADORA S/A',
  'BTG SECURIZADORA S/A',
  'ISEC SECURIZADORA S/A',
  'RB CAPITAL',
  'Oliveira Trust',
  'Vórtx',
  'BRL Trust',
];

export interface NewCraOperacaoData {
  tipoCliente: string;
  beneficiarioFinal: string;
  nome: string;
  numeroEmissao: string;
  cessionaria: string;
  prestadorServico: string;
  custodiante: string;
  toggles: Record<string, boolean>;
  gruposSelecionados: string[];
  diasMinVencimento: string;
  diasMaxVencimento: string;
  tipoOperacaoCra: string;
  tipoCalculoElegibilidade: string;
  grupoLimites: string;
  dataEmissao: string;
  dataInicio: string;
  dataVencimento: string;
  valorEmissao: string;
  valorGarantiaMinimo: string;
  taxaDescontoPadrao: string;
  metodoNotificacao: string;
  // Carteira de cobrança
  carteiraNome: string;
  banco: string;
  carteira: string;
  tipoCnab: string;
  conta: string;
  agencia: string;
  codigoEmpresa: string;
  taxaJurosPadrao: string;
  taxaMultaPadrao: string;
  permiteFimDeSemana: boolean;
  titularConta: string;
  // Carteira de registro
  registradora: string;
  idCarteira: string;
  apiToken: string;
  apiSecret: string;
}

interface Props {
  onClose: () => void;
  onCreate: (data: NewCraOperacaoData) => void;
}

interface Step {
  key: string;
  label: string;
  icon: LucideIcon;
  hint: string;
}

const steps: Step[] = [
  { key: 'info',     label: 'Cadastrais',  icon: Info,              hint: 'Informações cadastrais da operação' },
  { key: 'veiculo',  label: 'Veículo',     icon: Settings,          hint: 'Configurações do veículo' },
  { key: 'config',   label: 'Adicionais',  icon: SlidersHorizontal, hint: 'Configurações adicionais' },
  { key: 'limites',  label: 'Limites',     icon: Percent,           hint: 'Configuração de limites' },
  { key: 'cobranca', label: 'Cobrança',    icon: Wallet,            hint: 'Carteira de cobrança' },
  { key: 'registro', label: 'Registro',    icon: Network,           hint: 'Carteira de registro' },
  { key: 'pdd',      label: 'PDD',         icon: AlertTriangle,     hint: 'Parametrização de PDD' },
  { key: 'grupos',   label: 'Grupos',      icon: Layers,            hint: 'Seleção de grupos empresariais' },
  { key: 'ativos',   label: 'Ativos',      icon: FileText,          hint: 'Tipo de ativos aceitos' },
];

const TOGGLE_KEYS = [
  { key: 'accrual',         label: 'Veículo calcula accrual' },
  { key: 'inscricaoEst',    label: 'Veículo valida Inscrição Estadual' },
  { key: 'vencidoSacado',   label: 'Veículo valida vencidos por sacado' },
  { key: 'topSacados',      label: 'Veículo valida TOP Sacados' },
  { key: 'topCedentes',     label: 'Veículo valida TOP Cedentes' },
  { key: 'distribTipo',     label: 'Veículo valida distribuição por tipo de título' },
  { key: 'nfEntregaFutura', label: 'Veículo pode operar com NF de entrega futura' },
];

const initToggles = () =>
  Object.fromEntries(TOGGLE_KEYS.map((t) => [t.key, false]));

const lastroOpts = [
  { key: 'CPR',    label: 'Cédula de Produto Rural' },
  { key: 'CPR-F',  label: 'Cédula de Produto Rural Financeira' },
  { key: 'CDA',    label: 'Certificado de Depósito Agropecuário' },
  { key: 'CDA-WA', label: 'Cert. de Depósito Agrop. e Warrant' },
  { key: 'CDCA',   label: 'Cert. de Direitos Creditórios do Agronegócio' },
  { key: 'WAR',    label: 'Warrant' },
  { key: 'NF',     label: 'Nota Fiscal' },
  { key: 'NFE',    label: 'Nota Fiscal Eletrônica' },
  { key: 'DM',     label: 'Duplicata Mercantil' },
  { key: 'DS',     label: 'Duplicata de Serviço' },
  { key: 'CTE',    label: 'Conhecimento de Transporte Eletrônico' },
  { key: 'NC',     label: 'Nota Comercial' },
  { key: 'CCB',    label: 'Cédula de Crédito Bancário' },
  { key: 'CTR',    label: 'Contrato' },
  { key: 'PV',     label: 'Pedido de Venda' },
  { key: 'FAT',    label: 'Fatura' },
];

export function CreateCraOperacaoModal({ onClose, onCreate }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [form, setForm] = useState<NewCraOperacaoData>({
    tipoCliente: '', beneficiarioFinal: '',
    nome: '', numeroEmissao: '',
    cessionaria: '', prestadorServico: '', custodiante: '',
    toggles: initToggles(), gruposSelecionados: [],
    diasMinVencimento: '', diasMaxVencimento: '', tipoOperacaoCra: '',
    tipoCalculoElegibilidade: '', grupoLimites: '',
    dataEmissao: '', dataInicio: '', dataVencimento: '',
    valorEmissao: '', valorGarantiaMinimo: '', taxaDescontoPadrao: '',
    metodoNotificacao: '',
    carteiraNome: '', banco: '', carteira: '', tipoCnab: '', conta: '',
    agencia: '', codigoEmpresa: '', taxaJurosPadrao: '', taxaMultaPadrao: '',
    permiteFimDeSemana: false, titularConta: '',
    registradora: '', idCarteira: '', apiToken: '', apiSecret: '',
  });
  const [grupoQ, setGrupoQ] = useState('');

  // Step Limites — 4 sub-tabs
  type LimitTab = 'concentracao' | 'totalizadores' | 'topCedente' | 'topSacado';
  const [limitTab, setLimitTab] = useState<LimitTab>('concentracao');
  const CONCENTRACAO_LABELS = [
    'Partes relacionadas (total)',
    'Novos sacados (totais)',
    'Novos sacados (individuais)',
    'Sacados elegíveis (individual)',
  ];
  const [concentracao, setConcentracao] = useState<Record<string, { base: string; pct: string }>>(
    Object.fromEntries(CONCENTRACAO_LABELS.map((l) => [l, { base: 'Garantia', pct: '' }])),
  );
  const setConcentracaoField = (label: string, field: 'base' | 'pct', value: string) =>
    setConcentracao((prev) => ({ ...prev, [label]: { ...prev[label], [field]: value } }));

  const [totalizadores, setTotalizadores] = useState<{ tipo: string; pct: string }[]>([
    { tipo: 'CPR-F', pct: '40,0' },
    { tipo: 'CDCA', pct: '35,0' },
  ]);
  const [totalForm, setTotalForm] = useState({ tipo: 'CPR', pct: '' });
  const addTotalizador = () => {
    if (!totalForm.pct) return;
    setTotalizadores((prev) => [...prev, totalForm]);
    setTotalForm({ tipo: 'CPR', pct: '' });
  };

  const [topCedente, setTopCedente] = useState<{ top: string; pct: string }[]>([
    { top: 'TOP 1', pct: '15,0' },
    { top: 'TOP 5', pct: '45,0' },
  ]);
  const [topCedForm, setTopCedForm] = useState({ top: 'TOP 1', pct: '' });
  const addTopCedente = () => {
    if (!topCedForm.pct) return;
    setTopCedente((prev) => [...prev, topCedForm]);
    setTopCedForm({ top: 'TOP 1', pct: '' });
  };

  const [topSacado, setTopSacado] = useState<{ top: string; pct: string }[]>([
    { top: 'TOP 1', pct: '20,0' },
    { top: 'TOP 10', pct: '60,0' },
  ]);
  const [topSacForm, setTopSacForm] = useState({ top: 'TOP 1', pct: '' });
  const addTopSacado = () => {
    if (!topSacForm.pct) return;
    setTopSacado((prev) => [...prev, topSacForm]);
    setTopSacForm({ top: 'TOP 1', pct: '' });
  };

  // Step 7 — Ativos aceitos
  const [ativos, setAtivos] = useState<string[]>(['CPR', 'CPR-F', 'CDCA']);
  const toggleAtivo = (k: string) =>
    setAtivos((prev) => (prev.includes(k) ? prev.filter((a) => a !== k) : [...prev, k]));

  // Step 8 — PDD
  const [pddFaixas, setPddFaixas] = useState<{ de: string; ate: string; rating: string; pct: string }[]>([
    { de: '0',   ate: '30',  rating: 'A', pct: '0,5'  },
    { de: '31',  ate: '60',  rating: 'B', pct: '1,0'  },
    { de: '61',  ate: '90',  rating: 'C', pct: '3,0'  },
    { de: '91',  ate: '180', rating: 'D', pct: '10,0' },
    { de: '181', ate: '360', rating: 'E', pct: '50,0' },
  ]);
  const [pddForm, setPddForm] = useState({ de: '', ate: '', rating: 'A', pct: '' });
  const addPdd = () => {
    if (!pddForm.de || !pddForm.ate || !pddForm.pct) return;
    setPddFaixas((prev) => [...prev, pddForm]);
    setPddForm({ de: '', ate: '', rating: 'A', pct: '' });
  };

  const set = (f: keyof NewCraOperacaoData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [f]: e.target.value }));
  const setVal = (f: keyof NewCraOperacaoData) => (v: string) =>
    setForm((prev) => ({ ...prev, [f]: v }));
  const toggleSwitch = (key: string) =>
    setForm((prev) => ({ ...prev, toggles: { ...prev.toggles, [key]: !prev.toggles[key] } }));
  const toggleGrupo = (nome: string) =>
    setForm((prev) => ({
      ...prev,
      gruposSelecionados: prev.gruposSelecionados.includes(nome)
        ? prev.gruposSelecionados.filter((x) => x !== nome)
        : [...prev.gruposSelecionados, nome],
    }));

  const filteredGrupos = gruposEmpresariais.filter(
    (g) => !grupoQ || g.nome.toLowerCase().includes(grupoQ.toLowerCase()),
  );

  const step = steps[stepIdx];
  const isFirst = stepIdx === 0;
  const isLast  = stepIdx === steps.length - 1;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(8,60,74,0.55)', backdropFilter: 'blur(8px)',
      zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 32, animation: 'fadeIn 0.2s ease-out',
    }}>
      <style>{`
        .ccm-row .ccm-trash { opacity: 0; transition: opacity 0.15s; }
        .ccm-row:hover .ccm-trash { opacity: 1; }
        .ccm-trash button { background: transparent; color: var(--text-muted); transition: all 0.15s; }
        .ccm-trash button:hover { background: var(--danger-light); color: var(--danger-base); }
      `}</style>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)',
        width: '100%', maxWidth: 1100,
        maxHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column',
        overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
      }}>

        {/* ── Header ── */}
        <div className="flex items-start justify-between" style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-default)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--text-strong)', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 4 }}>
              Nova Operação CRA
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
              {step.hint} · Etapa {stepIdx + 1} de {steps.length}
            </p>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>

        {/* ── Stepper ── */}
        <div className="flex" style={{ background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border-default)' }}>
          {steps.map((s, i) => {
            const Icon = s.icon;
            const done    = i < stepIdx;
            const current = i === stepIdx;
            const color = current ? 'var(--agro-base)' : done ? 'var(--gci-base)' : 'var(--text-muted)';
            return (
              <button key={s.key} onClick={() => setStepIdx(i)} className="flex flex-col items-center justify-center" style={{
                flex: 1, gap: 6, padding: '14px 8px 11px',
                background: 'transparent', border: 'none',
                borderBottom: current ? '3px solid var(--agro-base)' : '3px solid transparent',
                cursor: 'pointer', color,
                opacity: !current && !done ? 0.55 : 1,
                transition: 'color var(--duration-base), opacity var(--duration-base), border-color var(--duration-base)',
              }}
                onMouseEnter={(e) => { if (!current) e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { if (!current && !done) e.currentTarget.style.opacity = '0.55'; }}
              >
                <Icon size={18} strokeWidth={current ? 2.25 : 1.5} />
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.20em', textTransform: 'uppercase', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 40 }}>

          {/* Step 1 — Informações cadastrais */}
          {step.key === 'info' && (
            <StepGrid>
              <SelectField label="Tipo da Operação" options={['CRA Carteira', 'CRA Controle', 'CRA Terceiro']} placeholder="Selecione" span={6} value={form.tipoOperacaoCra} onChange={setVal('tipoOperacaoCra')} />
              <SelectField label="Tipo de Cliente" options={['Monocedente', 'Multicedente']} placeholder="Selecione" span={6} value={form.tipoCliente} onChange={setVal('tipoCliente')} />
              <FormField label="Número de Emissão" placeholder="Ex: 4ª" span={3} value={form.numeroEmissao} onChange={set('numeroEmissao')} />
              <FormField label="Nome da Operação" placeholder="Ex: 4ª Emissão CRA Semeagro" span={9} value={form.nome} onChange={set('nome')} />
              <SelectField label="Cessionária" options={['CERES SECURIZADORA S/A', 'BTG SECURIZADORA S/A', 'ISEC SECURIZADORA S/A', 'RB CAPITAL']} placeholder="Selecione" span={3} value={form.cessionaria} onChange={setVal('cessionaria')} />
              <SelectField label="Prestador de Serviço" options={['Oliveira Trust', 'Vórtx', 'Singulare', 'Daycoval', 'BRL Trust']} placeholder="Selecione" span={3} value={form.prestadorServico} onChange={setVal('prestadorServico')} />
              <SelectField label="Custodiante" options={['B3', 'Cetip', 'Daycoval', 'Singulare', 'Oliveira Trust']} placeholder="Selecione" span={3} value={form.custodiante} onChange={setVal('custodiante')} />
              <SelectField label="Beneficiário Final" options={BENEFICIARIO_OPTS} placeholder="Selecione" span={3} value={form.beneficiarioFinal} onChange={setVal('beneficiarioFinal')} />
            </StepGrid>
          )}

          {/* Step 2 — Configurações do veículo (toggles) */}
          {step.key === 'veiculo' && (
            <div className="flex flex-col" style={{ gap: 10 }}>
              <SectionHelp>
                Defina as regras de validação e cálculo que o veículo deve aplicar a esta operação.
              </SectionHelp>
              {TOGGLE_KEYS.map((t) => (
                <ToggleRow key={t.key} label={t.label} on={form.toggles[t.key]} onToggle={() => toggleSwitch(t.key)} />
              ))}
            </div>
          )}

          {/* Step 8 — Grupos Empresariais */}
          {step.key === 'grupos' && (
            <div className="flex flex-col" style={{ gap: 16 }}>
              <SectionHelp>
                Selecione os grupos empresariais autorizados a operar nesta operação.{' '}
                <strong style={{ color: 'var(--text-default)' }}>{form.gruposSelecionados.length} selecionados</strong>.
              </SectionHelp>
              <div className="relative" style={{ background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)' }}>
                <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
                <input value={grupoQ} onChange={(e) => setGrupoQ(e.target.value)} placeholder="Filtrar grupos..." style={{ width: '100%', height: 44, paddingLeft: 44, paddingRight: 16, background: 'transparent', border: 'none', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }} />
              </div>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {filteredGrupos.map((g) => {
                  const selected = form.gruposSelecionados.includes(g.nome);
                  return (
                    <button key={g.nome} onClick={() => toggleGrupo(g.nome)} className="flex items-center" style={{
                      gap: 10, padding: '12px 14px',
                      borderWidth: 1, borderStyle: 'solid',
                      borderColor: selected ? 'var(--gci-base)' : 'var(--border-default)',
                      borderRadius: 'var(--radius-lg)',
                      background: selected ? 'var(--gci-light)' : 'var(--surface-card)',
                      cursor: 'pointer', textAlign: 'left', transition: 'all var(--duration-base)',
                    }}>
                      <span className="flex items-center justify-center" style={{
                        width: 20, height: 20, borderRadius: '9999px', flexShrink: 0,
                        background: selected ? 'var(--gci-base)' : 'var(--surface-sunken)',
                        color: selected ? '#fff' : 'var(--text-muted)', transition: 'all var(--duration-base)',
                      }}>
                        {selected && <Check size={11} />}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: selected ? 'var(--weight-semibold)' : 'var(--weight-medium)',
                          color: selected ? 'var(--gci-base)' : 'var(--text-default)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>{g.nome}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{g.cnpj}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3 — Configurações adicionais */}
          {step.key === 'config' && (
            <StepGrid>
              <FormField label="Dias Mínimo para Vencimento" placeholder="Ex: 30" type="number" span={3} value={form.diasMinVencimento} onChange={set('diasMinVencimento')} />
              <FormField label="Dias Máximo para Vencimento" placeholder="Ex: 720" type="number" span={3} value={form.diasMaxVencimento} onChange={set('diasMaxVencimento')} />
              <SelectField label="Tipo de Cálculo de Elegibilidade" options={['Valor de garantia', 'Valor da emissão']} placeholder="Selecione" span={3} value={form.tipoCalculoElegibilidade} onChange={setVal('tipoCalculoElegibilidade')} />
              <SelectField label="Grupo de Limites" options={['Confina', 'Op Multicedentes', 'Op Monocedentes', 'Trading', 'CeresSec']} placeholder="Selecione" span={3} value={form.grupoLimites} onChange={setVal('grupoLimites')} />
              <FormField label="Data de Emissão" type="date" span={3} value={form.dataEmissao} onChange={set('dataEmissao')} />
              <FormField label="Data de Início da Operação" type="date" span={3} value={form.dataInicio} onChange={set('dataInicio')} />
              <FormField label="Data de Vencimento" type="date" span={3} value={form.dataVencimento} onChange={set('dataVencimento')} />
              <SelectField label="Método de Notificação Padrão" options={['E-mail', 'Telefone', 'Mensagem de Texto', 'WhatsApp']} placeholder="Selecione" span={3} value={form.metodoNotificacao} onChange={setVal('metodoNotificacao')} />
              <FormField label="Valor de Emissão da Operação" placeholder="R$ 0,00" span={6} value={form.valorEmissao} onChange={set('valorEmissao')} />
              <FormField label="Valor Mínimo de Garantia da Emissão" placeholder="R$ 0,00" span={6} value={form.valorGarantiaMinimo} onChange={set('valorGarantiaMinimo')} />
            </StepGrid>
          )}

          {/* Step 4 — Configuração de limites (4 abas) */}
          {step.key === 'limites' && (
            <div className="flex flex-col" style={{ gap: 20 }}>
              <SectionHelp>
                Configure os limites de concentração da carteira e os totalizadores por tipo de ativo e TOP.
              </SectionHelp>
              <div className="flex" style={{ gap: 4, padding: 4, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)', alignSelf: 'flex-start', flexWrap: 'wrap' }}>
                {([
                  ['concentracao',  'Concentração'],
                  ['totalizadores', 'Totalizadores de ativos'],
                  ['topCedente',    'TOP Cedente'],
                  ['topSacado',     'TOP Sacado'],
                ] as [LimitTab, string][]).map(([k, label]) => (
                  <button key={k} onClick={() => setLimitTab(k)} style={{
                    padding: '8px 16px', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em',
                    border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)',
                    background: limitTab === k ? 'var(--surface-card)' : 'transparent',
                    color: limitTab === k ? 'var(--text-strong)' : 'var(--text-muted)',
                    boxShadow: limitTab === k ? 'var(--shadow-xs)' : 'none',
                    transition: 'all var(--duration-base)',
                  }}>{label}</button>
                ))}
              </div>

              {limitTab === 'concentracao' && (
                <div className="flex flex-col" style={{ gap: 12 }}>
                  {CONCENTRACAO_LABELS.map((label) => (
                    <LimiteRow
                      key={label}
                      label={label}
                      base={concentracao[label].base}
                      pct={concentracao[label].pct}
                      onBase={(v) => setConcentracaoField(label, 'base', v)}
                      onPct={(v) => setConcentracaoField(label, 'pct', v)}
                    />
                  ))}
                </div>
              )}

              {limitTab === 'totalizadores' && (
                <SectionGroup icon={FileText} title="Totalizadores de ativos">
                  <div className="grid items-end" style={{ gridTemplateColumns: '2fr 1fr auto', gap: 12, marginBottom: 16 }}>
                    <div>
                      <FieldLabel>Tipo de Ativo</FieldLabel>
                      <SelectField options={lastroOpts.map((o) => o.key)} value={totalForm.tipo} onChange={(v) => setTotalForm((p) => ({ ...p, tipo: v }))} />
                    </div>
                    <div>
                      <FieldLabel>% de Limite</FieldLabel>
                      <Input placeholder="0,00" value={totalForm.pct} onChange={(e) => setTotalForm((p) => ({ ...p, pct: e.target.value }))} />
                    </div>
                    <AddButton onClick={addTotalizador} />
                  </div>
                  <DataTable
                    cols={[
                      { key: 'tipo', label: 'Tipo de Ativo', width: '2fr' },
                      { key: 'pct',  label: '% de Limite',   width: '1fr', format: (v) => `${v}%` },
                    ]}
                    rows={totalizadores}
                    empty="Nenhum totalizador cadastrado."
                    onRemove={(i) => setTotalizadores((prev) => prev.filter((_, idx) => idx !== i))}
                  />
                </SectionGroup>
              )}

              {limitTab === 'topCedente' && (
                <SectionGroup icon={Percent} title="TOP Cedente">
                  <div className="grid items-end" style={{ gridTemplateColumns: '2fr 1fr auto', gap: 12, marginBottom: 16 }}>
                    <div>
                      <FieldLabel>Tipo de TOP</FieldLabel>
                      <SelectField options={['TOP 1', 'TOP 5', 'TOP 10', 'TOP 20']} value={topCedForm.top} onChange={(v) => setTopCedForm((p) => ({ ...p, top: v }))} />
                    </div>
                    <div>
                      <FieldLabel>% de Limite</FieldLabel>
                      <Input placeholder="0,00" value={topCedForm.pct} onChange={(e) => setTopCedForm((p) => ({ ...p, pct: e.target.value }))} />
                    </div>
                    <AddButton onClick={addTopCedente} />
                  </div>
                  <DataTable
                    cols={[
                      { key: 'top', label: 'Tipo de TOP', width: '2fr' },
                      { key: 'pct', label: '% de Limite', width: '1fr', format: (v) => `${v}%` },
                    ]}
                    rows={topCedente}
                    empty="Nenhum TOP cedente cadastrado."
                    onRemove={(i) => setTopCedente((prev) => prev.filter((_, idx) => idx !== i))}
                  />
                </SectionGroup>
              )}

              {limitTab === 'topSacado' && (
                <SectionGroup icon={Percent} title="TOP Sacado">
                  <div className="grid items-end" style={{ gridTemplateColumns: '2fr 1fr auto', gap: 12, marginBottom: 16 }}>
                    <div>
                      <FieldLabel>Tipo de TOP</FieldLabel>
                      <SelectField options={['TOP 1', 'TOP 5', 'TOP 10', 'TOP 20']} value={topSacForm.top} onChange={(v) => setTopSacForm((p) => ({ ...p, top: v }))} />
                    </div>
                    <div>
                      <FieldLabel>% de Limite</FieldLabel>
                      <Input placeholder="0,00" value={topSacForm.pct} onChange={(e) => setTopSacForm((p) => ({ ...p, pct: e.target.value }))} />
                    </div>
                    <AddButton onClick={addTopSacado} />
                  </div>
                  <DataTable
                    cols={[
                      { key: 'top', label: 'Tipo de TOP', width: '2fr' },
                      { key: 'pct', label: '% de Limite', width: '1fr', format: (v) => `${v}%` },
                    ]}
                    rows={topSacado}
                    empty="Nenhum TOP sacado cadastrado."
                    onRemove={(i) => setTopSacado((prev) => prev.filter((_, idx) => idx !== i))}
                  />
                </SectionGroup>
              )}
            </div>
          )}

          {/* Step 5 — Carteira de cobrança */}
          {step.key === 'cobranca' && (
            <div className="flex flex-col" style={{ gap: 16 }}>
              <SectionHelp>Parâmetros bancários para emissão de boletos e cobrança dos títulos.</SectionHelp>
              <StepGrid>
                <FormField label="Nome da Carteira" placeholder="Ex: Carteira Principal" span={6} value={form.carteiraNome} onChange={set('carteiraNome')} />
                <SelectField label="Banco" options={['001 - Banco do Brasil', '237 - Bradesco', '341 - Itaú', '033 - Santander', '748 - Sicredi', '756 - Sicoob']} placeholder="Selecione" span={3} value={form.banco} onChange={setVal('banco')} />
                <SelectField label="Tipo de CNAB" options={['CNAB 240', 'CNAB 400']} placeholder="Selecione" span={3} value={form.tipoCnab} onChange={setVal('tipoCnab')} />
                <FormField label="Carteira" placeholder="Ex: 17" span={3} value={form.carteira} onChange={set('carteira')} />
                <FormField label="Agência" placeholder="0000" span={3} value={form.agencia} onChange={set('agencia')} />
                <FormField label="Conta" placeholder="00000-0" span={3} value={form.conta} onChange={set('conta')} />
                <FormField label="Código da Empresa" placeholder="Código no banco" span={3} value={form.codigoEmpresa} onChange={set('codigoEmpresa')} />
                <FormField label="Taxa de Juros Padrão" placeholder="0,0000% a.m." span={4} value={form.taxaJurosPadrao} onChange={set('taxaJurosPadrao')} />
                <FormField label="Taxa de Multa Padrão" placeholder="0,00%" span={4} value={form.taxaMultaPadrao} onChange={set('taxaMultaPadrao')} />
                <FormField label="Taxa de Desconto Padrão" placeholder="0,0000%" span={4} value={form.taxaDescontoPadrao} onChange={set('taxaDescontoPadrao')} />
                <div style={{ gridColumn: 'span 12' }}>
                  <FieldLabel>Titular da Conta</FieldLabel>
                  <Input
                    disabled
                    value={form.beneficiarioFinal || '—'}
                    style={{ color: 'var(--text-muted)' }}
                  />
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                    Preenchido automaticamente conforme o Beneficiário Final da Etapa 1.
                  </div>
                </div>
              </StepGrid>
              <ToggleRow
                label="Permite vencimento em finais de semana e feriado"
                on={form.permiteFimDeSemana}
                onToggle={() => setForm((p) => ({ ...p, permiteFimDeSemana: !p.permiteFimDeSemana }))}
              />
            </div>
          )}

          {/* Step 6 — Carteira de registro */}
          {step.key === 'registro' && (
            <div className="flex flex-col" style={{ gap: 16 }}>
              <SectionHelp>Credenciais de integração com a registradora do veículo.</SectionHelp>
              <StepGrid>
                <SelectField label="Registradora" options={['B3', 'CERC', 'Núclea', 'CRDC']} placeholder="Selecione" span={6} value={form.registradora} onChange={setVal('registradora')} />
                <FormField label="ID da Carteira" placeholder="Identificador na registradora" span={6} value={form.idCarteira} onChange={set('idCarteira')} />
                <FormField label="API Token" placeholder="Token de integração" span={6} value={form.apiToken} onChange={set('apiToken')} />
                <FormField label="API Secret" type="password" placeholder="••••••••" span={6} value={form.apiSecret} onChange={set('apiSecret')} />
              </StepGrid>
            </div>
          )}

          {/* Step 7 — Tipo de Ativos Aceitos */}
          {step.key === 'ativos' && (
            <div>
              <SectionHelp>
                Selecione os tipos de ativos creditórios aceitos nesta operação CRA.
              </SectionHelp>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {lastroOpts.map((o) => {
                  const on = ativos.includes(o.key);
                  return (
                    <button
                      key={o.key}
                      onClick={() => toggleAtivo(o.key)}
                      style={{
                        padding: 16,
                        borderWidth: 1, borderStyle: 'solid',
                        borderColor: on ? 'var(--agro-base)' : 'var(--border-default)',
                        borderRadius: 'var(--radius-lg)',
                        background: on ? 'var(--agro-light)' : 'var(--surface-card)',
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'all var(--duration-base)',
                      }}
                    >
                      <div style={{
                        fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
                        letterSpacing: '0.12em',
                        color: on ? 'var(--agro-base)' : 'var(--text-muted)',
                        marginBottom: 6,
                      }}>
                        {o.key}
                      </div>
                      <div style={{
                        fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)',
                        color: 'var(--text-strong)',
                      }}>
                        {o.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 8 — Parametrização de PDD */}
          {step.key === 'pdd' && (
            <div className="flex flex-col" style={{ gap: 16 }}>
              <SectionHelp>
                Defina as faixas de aging e o percentual de provisão para cada classificação de risco.
              </SectionHelp>
              <SectionGroup icon={AlertTriangle} title="Provisão para Devedores Duvidosos">
                <div className="grid items-end" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 12, marginBottom: 16 }}>
                  <div>
                    <FieldLabel>Dias Mín.</FieldLabel>
                    <Input type="number" placeholder="0" value={pddForm.de}
                      onChange={(e) => setPddForm((p) => ({ ...p, de: e.target.value }))} />
                  </div>
                  <div>
                    <FieldLabel>Dias Máx.</FieldLabel>
                    <Input type="number" placeholder="30" value={pddForm.ate}
                      onChange={(e) => setPddForm((p) => ({ ...p, ate: e.target.value }))} />
                  </div>
                  <div>
                    <FieldLabel>% de PDD</FieldLabel>
                    <Input placeholder="0,50" value={pddForm.pct}
                      onChange={(e) => setPddForm((p) => ({ ...p, pct: e.target.value }))} />
                  </div>
                  <div>
                    <FieldLabel>Classificação</FieldLabel>
                    <SelectField options={['A', 'B', 'C', 'D', 'E', 'F']}
                      value={pddForm.rating}
                      onChange={(v) => setPddForm((p) => ({ ...p, rating: v }))} />
                  </div>
                  <AddButton onClick={addPdd} />
                </div>
                <DataTable
                  cols={[
                    { key: 'de',     label: 'Dias Mín.',    width: '1fr' },
                    { key: 'ate',    label: 'Dias Máx.',    width: '1fr' },
                    { key: 'rating', label: 'Classificação',width: '1fr' },
                    { key: 'pct',    label: '% Provisão',   width: '1fr', format: (v) => `${v}%` },
                  ]}
                  rows={pddFaixas}
                  empty="Nenhuma faixa cadastrada."
                  onRemove={(i) => setPddFaixas((prev) => prev.filter((_, idx) => idx !== i))}
                />
              </SectionGroup>
            </div>
          )}

        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between" style={{ padding: '16px 32px', borderTop: '1px solid var(--border-default)', background: 'var(--surface-card)' }}>
          <button onClick={isFirst ? onClose : () => setStepIdx((i) => i - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 600, fontSize: 'var(--text-sm)', padding: '10px 4px' }}>
            {isFirst ? 'Cancelar' : '← Voltar'}
          </button>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            {stepIdx + 1} / {steps.length}
          </span>
          <button onClick={isLast ? () => onCreate(form) : () => setStepIdx((i) => i + 1)} className="flex items-center" style={{
            gap: 8, padding: '12px 28px',
            background: isLast ? 'var(--success-base)' : 'var(--action-primary-bg)',
            color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
            fontWeight: 700, fontSize: 'var(--text-sm)', letterSpacing: '0.04em',
            boxShadow: isLast ? '0 8px 20px -8px rgba(5,150,105,0.40)' : '0 8px 20px -8px rgba(8,60,74,0.30)',
          }}>
            {isLast ? 'Finalizar Cadastro' : 'Próxima Etapa'}
            {isLast ? <Check size={15} /> : <ChevronRight size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────── */

function StepGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>{children}</div>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>{children}</div>;
}

function Input({ disabled, style, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...rest} disabled={disabled} style={{ height: 40, padding: '0 14px', background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-md)', outline: 'none', fontSize: 'var(--text-sm)', color: disabled ? 'var(--text-muted)' : 'var(--text-strong)', width: '100%', ...style }} />;
}

function FormField({ label, placeholder, type, span, disabled, value, onChange }: { label: string; placeholder?: string; type?: string; span?: number; disabled?: boolean; value?: string; onChange?: React.ChangeEventHandler<HTMLInputElement>; }) {
  return (
    <div style={{ gridColumn: span ? `span ${span}` : undefined }}>
      <FieldLabel>{label}</FieldLabel>
      <Input placeholder={placeholder} type={type} disabled={disabled} value={value} onChange={onChange} />
    </div>
  );
}

function SelectField({ label, options, span, placeholder, value, onChange }: { label?: string; options: string[]; span?: number; placeholder?: string; value?: string; onChange?: (v: string) => void; }) {
  return (
    <div style={{ gridColumn: span ? `span ${span}` : undefined }}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div style={{ position: 'relative' }}>
        <select value={value} onChange={(e) => onChange?.(e.target.value)} style={{ height: 40, paddingLeft: 14, paddingRight: 40, background: 'var(--surface-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-md)', outline: 'none', fontSize: 'var(--text-sm)', color: value ? 'var(--text-strong)' : 'var(--text-muted)', width: '100%', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}>
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

function SectionHelp({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 8, lineHeight: 'var(--leading-relaxed)' }}>{children}</div>;
}

function ToggleRow({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void; }) {
  return (
    <div className="flex items-center justify-between" style={{
      padding: '14px 16px', borderRadius: 'var(--radius-lg)', borderWidth: 1, borderStyle: 'solid',
      borderColor: on ? 'var(--success-base)' : 'var(--border-default)',
      background: on ? 'var(--success-light)' : 'var(--surface-card)',
      transition: 'all var(--duration-base)', cursor: 'pointer',
    }} onClick={onToggle}>
      <span style={{ fontSize: 'var(--text-sm)', color: on ? 'var(--success-dark)' : 'var(--text-default)', fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-regular)', userSelect: 'none' }}>
        {label}
      </span>
      <div style={{ width: 44, height: 24, borderRadius: '9999px', background: on ? 'var(--success-base)' : 'var(--border-default)', position: 'relative', flexShrink: 0, transition: 'background var(--duration-base)' }}>
        <span style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: '9999px', background: '#fff', transition: 'left var(--duration-base)', boxShadow: '0 1px 3px rgba(0,0,0,0.18)' }} />
      </div>
    </div>
  );
}

function SectionGroup({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      padding: 20, background: 'var(--surface-card)',
      borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)',
      borderRadius: 'var(--radius-lg)',
    }}>
      {(title || Icon) && (
        <div className="flex items-center" style={{
          gap: 8, fontSize: 10, fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase',
          marginBottom: 16,
        }}>
          {Icon && (
            <span className="flex items-center justify-center" style={{
              width: 24, height: 24, borderRadius: 'var(--radius-md)',
              background: 'var(--agro-light)', color: 'var(--agro-base)',
            }}>
              <Icon size={13} strokeWidth={2} />
            </span>
          )}
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center justify-center" style={{
      height: 40, minWidth: 40, padding: '0 16px', gap: 6,
      background: 'var(--success-base)', color: '#fff', border: 'none',
      borderRadius: 'var(--radius-md)', cursor: 'pointer',
      fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.10em',
      whiteSpace: 'nowrap',
    }}>
      <Plus size={14} /> ADICIONAR
    </button>
  );
}

function RowTrash({ onClick }: { onClick: () => void }) {
  return (
    <div className="ccm-trash" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={onClick} className="flex items-center justify-center" style={{
        width: 32, height: 32, borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
      }}>
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function DataTable<T extends Record<string, string>>({
  cols,
  rows,
  empty,
  onRemove,
}: {
  cols: { key: string; label: string; width: string; format?: (v: string) => string }[];
  rows: T[];
  empty: string;
  onRemove: (i: number) => void;
}) {
  const template = cols.map((c) => c.width).join(' ') + ' 36px';
  if (!rows.length) {
    return (
      <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
        {empty}
      </div>
    );
  }
  return (
    <div style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <div className="grid" style={{
        gridTemplateColumns: template, padding: '10px 14px',
        background: 'var(--surface-sunken)', fontSize: 10,
        fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em',
        color: 'var(--text-muted)', textTransform: 'uppercase',
      }}>
        {cols.map((c) => <div key={c.key}>{c.label}</div>)}
        <div />
      </div>
      {rows.map((row, i) => (
        <div key={i} className="grid items-center ccm-row" style={{
          gridTemplateColumns: template, padding: '12px 14px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)', fontVariantNumeric: 'tabular-nums',
        }}>
          {cols.map((c) => (
            <div key={c.key} style={{ color: 'var(--text-strong)', fontWeight: 'var(--weight-semibold)' }}>
              {c.format ? c.format(row[c.key] ?? '') : (row[c.key] ?? '')}
            </div>
          ))}
          <RowTrash onClick={() => onRemove(i)} />
        </div>
      ))}
    </div>
  );
}

function LimiteRow({
  label, base, pct, onBase, onPct,
}: {
  label: string; base: string; pct: string;
  onBase: (v: string) => void; onPct: (v: string) => void;
}) {
  return (
    <div className="grid items-end" style={{
      gridTemplateColumns: '2fr 1.2fr 1fr', gap: 12,
      padding: 16, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)',
    }}>
      <div style={{ alignSelf: 'center', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>
        {label}
      </div>
      <div>
        <FieldLabel>Base de Cálculo</FieldLabel>
        <SelectField options={['Garantia', 'Emissão']} value={base} onChange={onBase} />
      </div>
      <div>
        <FieldLabel>% Atribuído</FieldLabel>
        <Input placeholder="0,00" value={pct} onChange={(e) => onPct(e.target.value)} />
      </div>
    </div>
  );
}

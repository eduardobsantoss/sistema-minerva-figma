import { useState } from 'react';
import {
  X,
  Info,
  Mail,
  FileText,
  Users,
  SlidersHorizontal,
  Network,
  Banknote,
  ClipboardList,
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Search,
  ChevronDown,
  MapPin,
  Phone,
  Wallet,
  UserCheck,
  Percent,
  Users2,
  Crown,
  type LucideIcon,
} from 'lucide-react';
import { gruposEmpresariais } from '@/features/cra/data/craData';

interface Props {
  onClose: () => void;
}

interface Step {
  key: string;
  label: string;
  icon: LucideIcon;
  hint: string;
}

const steps: Step[] = [
  { key: 'info', label: 'Info', icon: Info, hint: 'Identificação inicial' },
  { key: 'contato', label: 'Contato', icon: Mail, hint: 'Endereçamento' },
  { key: 'ativos', label: 'Ativos', icon: FileText, hint: 'Lastros elegíveis' },
  { key: 'partic', label: 'Participantes', icon: Users, hint: 'Prestadores' },
  { key: 'configs', label: 'Configs', icon: SlidersHorizontal, hint: 'Limites' },
  { key: 'grupos', label: 'Grupos', icon: Network, hint: 'Econômicos' },
  { key: 'banco', label: 'Banco', icon: Banknote, hint: 'Domicílio bancário' },
  { key: 'registro', label: 'Registro', icon: ClipboardList, hint: 'Registradoras' },
  { key: 'pdd', label: 'PDD', icon: AlertTriangle, hint: 'Provisão' },
];

const lastroOpts = [
  { key: 'CH', label: 'Cheque' },
  { key: 'DM', label: 'Duplicata Mercantil' },
  { key: 'DS', label: 'Duplicata de Serviço' },
  { key: 'LC', label: 'Letra de Câmbio' },
  { key: 'NP', label: 'Nota Promissória' },
  { key: 'REC', label: 'Recibo' },
  { key: 'FAT', label: 'Fatura' },
  { key: 'CPR', label: 'Cédula de Produto Rural' },
  { key: 'WAR', label: 'Warrant' },
  { key: 'PV', label: 'Pedido de Venda' },
  { key: 'OUT', label: 'Outros' },
  { key: 'NF', label: 'Nota Fiscal' },
  { key: 'CTR', label: 'Contrato' },
  { key: 'CTE', label: 'Conhecimento de Transporte Eletrônico' },
  { key: 'CPRF', label: 'Cédula de Produto Rural Financeira' },
  { key: 'CCB', label: 'Cédula de Crédito Bancário' },
  { key: 'CDCA', label: 'Cert. de Direitos Creditórios do Agronegócio' },
  { key: 'CDA-WA', label: 'Cert. de Depósito Agropecuário e Warrant Agropecuário' },
  { key: 'CDA', label: 'Certificado de Depósito Agropecuário' },
  { key: 'NC', label: 'Nota Comercial' },
  { key: 'CD', label: 'Confissão de Dívida' },
];

const partOpcionais: { key: string; label: string; toggleLabel: string }[] = [
  { key: 'custodiante', label: 'Custodiante', toggleLabel: 'Fundo tem Custodiante' },
  { key: 'cobranca', label: 'Agente de Cobrança', toggleLabel: 'Fundo tem Agente de Cobrança' },
  { key: 'consultor', label: 'Consultor', toggleLabel: 'Fundo tem Consultor' },
  { key: 'benef', label: 'Beneficiário Final', toggleLabel: 'Fundo tem Beneficiário Final' },
];

export function CreateClassModal({ onClose }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [prazo, setPrazo] = useState<'determinado' | 'indeterminado'>('determinado');
  const [ativos, setAtivos] = useState<string[]>(['NF', 'DM']);
  const [cedTipo, setCedTipo] = useState<'mono' | 'multi'>('multi');
  const [sacTipo, setSacTipo] = useState<'mono' | 'multi'>('multi');
  const [ativoLimites, setAtivoLimites] = useState<{ tipo: string; limite: string }[]>([
    { tipo: 'DM', limite: '30,00' },
  ]);
  const [ativoForm, setAtivoForm] = useState<{ tipo: string; limite: string }>({ tipo: 'DM', limite: '' });
  const [topCed, setTopCed] = useState<{ qtd: string; limite: string }[]>([
    { qtd: '5', limite: '40,00' },
  ]);
  const [topCedForm, setTopCedForm] = useState<{ qtd: string; limite: string }>({ qtd: '', limite: '' });
  const [topSac, setTopSac] = useState<{ qtd: string; limite: string }[]>([]);
  const [topSacForm, setTopSacForm] = useState<{ qtd: string; limite: string }>({ qtd: '', limite: '' });
  const [partToggles, setPartToggles] = useState<Record<string, boolean>>({
    custodiante: true,
    cobranca: false,
    consultor: false,
    benef: false,
  });
  const togglePart = (k: string) =>
    setPartToggles((prev) => ({ ...prev, [k]: !prev[k] }));

  const ativoLabel = (k: string) => lastroOpts.find((o) => o.key === k)?.label ?? k;

  const addAtivoLimite = () => {
    if (!ativoForm.limite) return;
    setAtivoLimites((prev) => [...prev, ativoForm]);
    setAtivoForm({ tipo: ativoForm.tipo, limite: '' });
  };
  const addTopCed = () => {
    if (!topCedForm.qtd || !topCedForm.limite) return;
    setTopCed((prev) => [...prev, topCedForm]);
    setTopCedForm({ qtd: '', limite: '' });
  };
  const addTopSac = () => {
    if (!topSacForm.qtd || !topSacForm.limite) return;
    setTopSac((prev) => [...prev, topSacForm]);
    setTopSacForm({ qtd: '', limite: '' });
  };
  type ConfigTab = 'concentracao' | 'totalizadores' | 'topCedente' | 'topSacado';
  const [configTab, setConfigTab] = useState<ConfigTab>('concentracao');

  const [gruposSelecionados, setGruposSelecionados] = useState<string[]>([]);
  const [grupoQ, setGrupoQ] = useState('');
  const toggleGrupo = (nome: string) =>
    setGruposSelecionados((prev) =>
      prev.includes(nome) ? prev.filter((x) => x !== nome) : [...prev, nome],
    );
  const filteredGrupos = gruposEmpresariais.filter(
    (g) => !grupoQ || g.nome.toLowerCase().includes(grupoQ.toLowerCase()),
  );

  const [pddFaixas, setPddFaixas] = useState([
    { de: '0', ate: '30', rating: 'A', pct: '0,5' },
    { de: '31', ate: '60', rating: 'B', pct: '1,0' },
    { de: '61', ate: '90', rating: 'C', pct: '3,0' },
    { de: '91', ate: '180', rating: 'D', pct: '10,0' },
    { de: '181', ate: '360', rating: 'E', pct: '50,0' },
  ]);
  const [pddForm, setPddForm] = useState({ de: '', ate: '', rating: 'A', pct: '' });

  const [regList, setRegList] = useState<
    { registradora: string; idCarteira: string; usuario: string }[]
  >([
    { registradora: 'B3', idCarteira: '000123', usuario: 'minerva.b3' },
  ]);
  const [regForm, setRegForm] = useState({
    registradora: 'B3',
    idCarteira: '',
    usuario: '',
    senha: '',
  });
  const addReg = () => {
    if (!regForm.idCarteira || !regForm.usuario) return;
    setRegList((prev) => [
      ...prev,
      { registradora: regForm.registradora, idCarteira: regForm.idCarteira, usuario: regForm.usuario },
    ]);
    setRegForm({ registradora: regForm.registradora, idCarteira: '', usuario: '', senha: '' });
  };
  const addPdd = () => {
    if (!pddForm.de || !pddForm.ate || !pddForm.pct) return;
    setPddFaixas((prev) => [...prev, pddForm]);
    setPddForm({ de: '', ate: '', rating: 'A', pct: '' });
  };

  const step = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;

  const toggleAtivo = (k: string) =>
    setAtivos((prev) => (prev.includes(k) ? prev.filter((a) => a !== k) : [...prev, k]));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8,60,74,0.55)',
        backdropFilter: 'blur(8px)',
        zIndex: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <style>{`
        .ccm-row .ccm-trash { opacity: 0; transition: opacity 0.15s; }
        .ccm-row:hover .ccm-trash { opacity: 1; }
        .ccm-trash button { background: transparent; color: var(--text-muted); transition: all 0.15s; }
        .ccm-trash button:hover { background: var(--danger-light); color: var(--danger-base); }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: 1280,
          maxHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between" style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-default)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--text-strong)', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 4 }}>
              Nova Classe de Fundo
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
              {step.hint} · Etapa {stepIdx + 1} de {steps.length}
            </p>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex" style={{ background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border-default)' }}>
          {steps.map((s, i) => {
            const Icon = s.icon;
            const done    = i < stepIdx;
            const current = i === stepIdx;
            const color = current ? 'var(--agro-base)' : done ? 'var(--gci-base)' : 'var(--text-muted)';
            return (
              <button
                key={s.key}
                onClick={() => setStepIdx(i)}
                className="flex flex-col items-center justify-center"
                style={{
                  flex: 1,
                  gap: 6,
                  padding: '14px 8px 11px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: current ? '3px solid var(--agro-base)' : '3px solid transparent',
                  cursor: 'pointer',
                  color,
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

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 40 }}>
          {step.key === 'info' && (
            <StepGrid>
              <FormField label="CNPJ do Veículo (Classe)" placeholder="00.000.000/0000-00" span={4} />
              <FormField label="Identificação do Veículo" placeholder="Ex: CLASSE TECH A" span={5} />
              <SelectField label="Tipo de Empresa" options={['Matriz', 'Filial']} span={3} />

              <FormField label="Razão Social" placeholder="Razão social completa" span={8} />
              <FormField label="Nome Fantasia / Classe" placeholder="Ex: Sênior Classe A" span={4} />

              <FormField label="Natureza Legal" placeholder="Fundo" span={4} />
              <FormField label="Atividade Principal" placeholder="Direitos Creditórios" span={5} />
              <FormField label="Código Singulare (CNAB 444)" placeholder="000" span={3} />

              <SelectField
                label="Indicativo de Prazo"
                options={['Prazo Determinado', 'Prazo Indeterminado']}
                onChange={(v) => setPrazo(v === 'Prazo Determinado' ? 'determinado' : 'indeterminado')}
                span={prazo === 'determinado' ? 4 : 6}
              />
              <FormField
                label="Data de Constituição"
                placeholder="dd/mm/aaaa"
                type="date"
                span={prazo === 'determinado' ? 4 : 6}
              />
              {prazo === 'determinado' && (
                <FormField label="Data Fim do Prazo" placeholder="dd/mm/aaaa" type="date" span={4} />
              )}

              <FormField label="Categoria CVM" placeholder="FIDC" disabled defaultValue="FIDC" span={12} />
            </StepGrid>
          )}

          {step.key === 'contato' && (
            <div className="flex flex-col" style={{ gap: 20 }}>
              <div>
                <SectionTitle icon={Phone}>Contato</SectionTitle>
                <StepGrid>
                  <FormField
                    label="Email do Veículo"
                    placeholder="contato@classe.com.br"
                    type="email"
                    span={6}
                  />
                  <FormField label="DDI" placeholder="+55" span={2} />
                  <FormField label="DDD" placeholder="11" span={1} />
                  <FormField label="Telefone" placeholder="0000-0000" span={3} />
                </StepGrid>
              </div>
              <div>
                <SectionTitle icon={MapPin}>Endereço</SectionTitle>
                <StepGrid>
                  <FormField label="CEP" placeholder="00000-000" span={3} />
                  <FormField label="Endereço" placeholder="Av. ..." span={7} />
                  <FormField label="Número" placeholder="—" span={2} />
                  <FormField label="Complemento" placeholder="Sala 101" span={4} />
                  <FormField label="Bairro" placeholder="—" span={4} />
                  <FormField label="Cidade" placeholder="—" span={4} />
                  <FormField label="Estado" placeholder="SP" span={2} />
                  <FormField label="País" placeholder="Brasil" defaultValue="Brasil" span={4} />
                </StepGrid>
              </div>
            </div>
          )}

          {step.key === 'ativos' && (
            <div>
              <SectionHelp>
                Selecione os tipos de direitos creditórios aceitos por esta classe.
              </SectionHelp>
              <div
                className="grid"
                style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}
              >
                {lastroOpts.map((o) => {
                  const on = ativos.includes(o.key);
                  return (
                    <button
                      key={o.key}
                      onClick={() => toggleAtivo(o.key)}
                      style={{
                        padding: 16,
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderColor: on ? 'var(--agro-base)' : 'var(--border-default)',
                        borderRadius: 'var(--radius-lg)',
                        background: on ? 'var(--agro-light)' : 'var(--surface-card)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all var(--duration-base)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--weight-bold)',
                          letterSpacing: '0.12em',
                          color: on ? 'var(--agro-base)' : 'var(--text-muted)',
                          marginBottom: 6,
                        }}
                      >
                        {o.key.replace('_', '-')}
                      </div>
                      <div
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--weight-semibold)',
                          color: 'var(--text-strong)',
                        }}
                      >
                        {o.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step.key === 'partic' && (
            <div className="flex flex-col" style={{ gap: 16 }}>
              <SectionHelp>
                Cadastre os prestadores de serviço da classe. Administradora e Gestor são
                obrigatórios; os demais participantes podem ser ativados conforme a estrutura
                operacional do fundo.
              </SectionHelp>

              <ParticipantBlock
                title="Identificação de Administradora"
                nameLabel="Administradora"
                docLabel="Documento"
                dateLabel="Administradora do fundo desde"
                required
              />

              <ParticipantBlock
                title="Identificação de Gestor"
                nameLabel="Gestor"
                docLabel="Documento"
                dateLabel="Gestor do fundo desde"
                required
              />

              {partOpcionais.map((p) => (
                <ParticipantBlock
                  key={p.key}
                  title={`Identificação de ${p.label}`}
                  nameLabel={p.label}
                  docLabel="Documento"
                  dateLabel={`${p.label} do fundo desde`}
                  toggle={{
                    label: p.toggleLabel,
                    enabled: partToggles[p.key],
                    onToggle: () => togglePart(p.key),
                  }}
                />
              ))}
            </div>
          )}

          {step.key === 'configs' && (
            <div className="flex flex-col" style={{ gap: 20 }}>
              {/* Tab bar */}
              <div className="flex" style={{ gap: 4, padding: 4, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)', alignSelf: 'flex-start', flexWrap: 'wrap' }}>
                {([
                  ['concentracao',  'Concentração'],
                  ['totalizadores', 'Totalizadores de ativos'],
                  ['topCedente',    'TOP Cedente'],
                  ['topSacado',     'TOP Sacado'],
                ] as [ConfigTab, string][]).map(([k, label]) => (
                  <button key={k} onClick={() => setConfigTab(k)} style={{
                    padding: '8px 16px', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em',
                    border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)',
                    background: configTab === k ? 'var(--surface-card)' : 'transparent',
                    color: configTab === k ? 'var(--text-strong)' : 'var(--text-muted)',
                    boxShadow: configTab === k ? 'var(--shadow-xs)' : 'none',
                    transition: 'all var(--duration-base)',
                  }}>{label}</button>
                ))}
              </div>

              {/* Tab 1 — Concentração (diversificação do pool) */}
              {configTab === 'concentracao' && (
                <SectionGroup icon={Users2} title="Diversificação do Pool">
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div>
                      <FieldLabel>Tipo de Cedente</FieldLabel>
                      <div className="flex" style={{ gap: 8, marginTop: 8 }}>
                        <RadioPill active={cedTipo === 'mono'} onClick={() => setCedTipo('mono')}>Monocedente</RadioPill>
                        <RadioPill active={cedTipo === 'multi'} onClick={() => setCedTipo('multi')}>Multicedente</RadioPill>
                      </div>
                    </div>
                    <div>
                      <FieldLabel>Tipo de Sacado</FieldLabel>
                      <div className="flex" style={{ gap: 8, marginTop: 8 }}>
                        <RadioPill active={sacTipo === 'mono'} onClick={() => setSacTipo('mono')}>Monosacado</RadioPill>
                        <RadioPill active={sacTipo === 'multi'} onClick={() => setSacTipo('multi')}>Multissacado</RadioPill>
                      </div>
                    </div>
                  </div>
                  <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 16 }}>
                    <div>
                      <FieldLabel>Conc. Sacados Novos (%)</FieldLabel>
                      <Input placeholder="5,00" />
                    </div>
                    <div>
                      <FieldLabel>Conc. Sacados Elegíveis (%)</FieldLabel>
                      <Input placeholder="20,00" />
                    </div>
                    <div>
                      <FieldLabel>Conc. Total Novos (%)</FieldLabel>
                      <Input placeholder="3,00" />
                    </div>
                    <div>
                      <FieldLabel>Conc. Total Elegíveis (%)</FieldLabel>
                      <Input placeholder="100,00" />
                    </div>
                  </div>
                </SectionGroup>
              )}

              {/* Tab 2 — Totalizadores de ativos */}
              {configTab === 'totalizadores' && (
                <DynamicConcentration
                  icon={Percent}
                  title="% Concentração por Tipo de Ativo"
                  qtdLabel="Tipo de Ativo"
                  qtdPlaceholder="Selecione"
                  qtdOptions={ativos.length ? ativos : lastroOpts.map((o) => o.key)}
                  limitePlaceholder="0,00"
                  rows={ativoLimites.map((r) => ({
                    tipo: r.tipo,
                    descricao: ativoLabel(r.tipo),
                    limite: r.limite,
                  }))}
                  form={ativoForm}
                  onFormChange={(v) => setAtivoForm(v)}
                  onAdd={addAtivoLimite}
                  onRemove={(i) => setAtivoLimites((prev) => prev.filter((_, idx) => idx !== i))}
                />
              )}

              {/* Tab 3 — TOP Cedente */}
              {configTab === 'topCedente' && (
                <DynamicConcentration
                  icon={Crown}
                  title="Concentração de TOP's Cedentes"
                  qtdLabel="Quantidade"
                  qtdPlaceholder="Ex: 5"
                  qtdNumeric
                  limitePlaceholder="0,00"
                  rows={topCed.map((r) => ({
                    tipo: `TOP ${r.qtd}`,
                    descricao: `TOP ${r.qtd}`,
                    limite: r.limite,
                  }))}
                  form={{ tipo: topCedForm.qtd, limite: topCedForm.limite }}
                  onFormChange={(v) => setTopCedForm({ qtd: v.tipo, limite: v.limite })}
                  onAdd={addTopCed}
                  onRemove={(i) => setTopCed((prev) => prev.filter((_, idx) => idx !== i))}
                />
              )}

              {/* Tab 4 — TOP Sacado */}
              {configTab === 'topSacado' && (
                <DynamicConcentration
                  icon={Crown}
                  title="Concentração de TOP's Sacados"
                  qtdLabel="Quantidade"
                  qtdPlaceholder="Ex: 10"
                  qtdNumeric
                  limitePlaceholder="0,00"
                  rows={topSac.map((r) => ({
                    tipo: `TOP ${r.qtd}`,
                    descricao: `TOP ${r.qtd}`,
                    limite: r.limite,
                  }))}
                  form={{ tipo: topSacForm.qtd, limite: topSacForm.limite }}
                  onFormChange={(v) => setTopSacForm({ qtd: v.tipo, limite: v.limite })}
                  onAdd={addTopSac}
                  onRemove={(i) => setTopSac((prev) => prev.filter((_, idx) => idx !== i))}
                />
              )}
            </div>
          )}

          {step.key === 'grupos' && (
            <div>
              <SectionHelp>
                Selecione quais grupos econômicos estão aptos a operar nesta classe.
              </SectionHelp>
              <div className="relative" style={{ background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)', marginBottom: 16 }}>
                <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
                <input
                  placeholder="Pesquisar grupos empresariais..."
                  value={grupoQ}
                  onChange={(e) => setGrupoQ(e.target.value)}
                  style={{ width: '100%', height: 44, paddingLeft: 40, paddingRight: 14, background: 'transparent', border: 'none', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }}
                />
              </div>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {filteredGrupos.map((g) => {
                  const selected = gruposSelecionados.includes(g.nome);
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

          {step.key === 'banco' && (
            <div className="flex flex-col" style={{ gap: 20 }}>
              <div>
                <SectionTitle icon={Wallet}>Dados da Carteira</SectionTitle>
                <StepGrid>
                  <FormField label="Nome da Carteira" placeholder="Ex: Agrovita FIDC - Santander" span={6} />
                  <SelectField
                    label="Selecione o Banco"
                    options={['033 - Santander', '237 - Bradesco', '341 - Itaú', '001 - Banco do Brasil', '104 - Caixa']}
                    placeholder="Selecione"
                    span={6}
                  />
                  <SelectField
                    label="Selecione a Carteira"
                    options={['Carteira 1', 'Carteira 2', 'Carteira 3']}
                    placeholder="Selecione"
                    span={4}
                  />
                  <SelectField
                    label="Selecione o CNAB"
                    options={['CNAB 240', 'CNAB 400']}
                    placeholder="Selecione"
                    span={4}
                  />
                  <FormField label="Código da Empresa" placeholder="—" span={4} />
                  <FormField label="Número da Conta" placeholder="000000-0" span={4} />
                  <FormField label="Número da Agência" placeholder="0000-0" span={4} />
                  <FormField label="Campo Extra 1" placeholder="—" span={4} />
                  <FormField
                    label="Configuração de dados padrões para Boleto"
                    placeholder="Texto de instrução para impressão"
                    span={12}
                  />
                  <div
                    className="flex items-center"
                    style={{
                      gap: 12,
                      padding: 14,
                      background: 'var(--surface-sunken)',
                      borderRadius: 'var(--radius-lg)',
                      gridColumn: 'span 12',
                    }}
                  >
                    <input
                      type="checkbox"
                      defaultChecked
                      style={{ accentColor: 'var(--gci-base)' }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--weight-bold)',
                          color: 'var(--text-strong)',
                        }}
                      >
                        Permitir Vencimento em Finais de Semana e Feriado
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                        Se ativo, parcelas podem ser liquidadas sem prorrogação para o próximo dia útil.
                      </div>
                    </div>
                  </div>
                </StepGrid>
              </div>

              <div>
                <SectionTitle icon={UserCheck}>Dados do Beneficiário</SectionTitle>
                <StepGrid>
                  <FormField label="CNPJ" placeholder="00.000.000/0000-00" span={4} />
                  <FormField label="Nome" placeholder="Razão social do beneficiário" span={8} />
                  <FormField label="CEP" placeholder="00000-000" span={3} />
                  <FormField label="Endereço" placeholder="Rua / Avenida" span={7} />
                  <FormField label="Número" placeholder="—" span={2} />
                  <FormField label="Complemento" placeholder="Sala / Andar" span={4} />
                  <FormField label="Bairro" placeholder="—" span={4} />
                  <FormField label="Cidade" placeholder="—" span={4} />
                  <SelectField
                    label="Estado"
                    options={['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'MT', 'MS', 'DF']}
                    placeholder="UF"
                    span={12}
                  />
                </StepGrid>
              </div>
            </div>
          )}

          {step.key === 'registro' && (
            <div className="flex flex-col" style={{ gap: 16 }}>
              <SectionHelp>
                Cadastre as registradoras homologadas e suas credenciais de acesso.
              </SectionHelp>

              <SectionGroup icon={ClipboardList} title="Configuração de Registradoras">
                <div
                  className="grid items-end"
                  style={{
                    gridTemplateColumns: '1.1fr 1.4fr 1.4fr 1.4fr auto',
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <FieldLabel>Registradora</FieldLabel>
                    <SelectField
                      options={['B3', 'CERC', 'TAG', 'CIP']}
                      onChange={(v) => setRegForm((p) => ({ ...p, registradora: v }))}
                    />
                  </div>
                  <div>
                    <FieldLabel>ID Carteira</FieldLabel>
                    <Input
                      placeholder="Identificador"
                      value={regForm.idCarteira}
                      onChange={(e) => setRegForm((p) => ({ ...p, idCarteira: e.target.value }))}
                    />
                  </div>
                  <div>
                    <FieldLabel>Usuário</FieldLabel>
                    <Input
                      placeholder="Usuário API/SFTP"
                      value={regForm.usuario}
                      onChange={(e) => setRegForm((p) => ({ ...p, usuario: e.target.value }))}
                    />
                  </div>
                  <div>
                    <FieldLabel>Senha</FieldLabel>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={regForm.senha}
                      onChange={(e) => setRegForm((p) => ({ ...p, senha: e.target.value }))}
                    />
                  </div>
                  <AddButton onClick={addReg} />
                </div>

                <DataTable
                  cols={[
                    { key: 'registradora', label: 'Registradora', width: '1fr' },
                    { key: 'idCarteira', label: 'ID Carteira', width: '1.4fr' },
                    { key: 'usuario', label: 'Usuário', width: '1.4fr' },
                  ]}
                  rows={regList}
                  empty="Nenhuma registradora cadastrada."
                  onRemove={(i) => setRegList((prev) => prev.filter((_, idx) => idx !== i))}
                />
              </SectionGroup>
            </div>
          )}

          {step.key === 'pdd' && (
            <div className="flex flex-col" style={{ gap: 16 }}>
              <SectionHelp>
                Defina as faixas de aging e o percentual de provisão para cada classificação de risco.
              </SectionHelp>

              <SectionGroup icon={AlertTriangle} title="Provisão para Devedores Duvidosos">
                <div
                  className="grid items-end"
                  style={{
                    gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <FieldLabel>Dias Mín.</FieldLabel>
                    <Input
                      type="number"
                      placeholder="0"
                      value={pddForm.de}
                      onChange={(e) => setPddForm((p) => ({ ...p, de: e.target.value }))}
                    />
                  </div>
                  <div>
                    <FieldLabel>Dias Máx.</FieldLabel>
                    <Input
                      type="number"
                      placeholder="30"
                      value={pddForm.ate}
                      onChange={(e) => setPddForm((p) => ({ ...p, ate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <FieldLabel>% de PDD</FieldLabel>
                    <Input
                      placeholder="0,50"
                      value={pddForm.pct}
                      onChange={(e) => setPddForm((p) => ({ ...p, pct: e.target.value }))}
                    />
                  </div>
                  <div>
                    <FieldLabel>Classificação</FieldLabel>
                    <SelectField
                      options={['A', 'B', 'C', 'D', 'E', 'F']}
                      onChange={(v) => setPddForm((p) => ({ ...p, rating: v }))}
                    />
                  </div>
                  <AddButton onClick={addPdd} />
                </div>

                <DataTable
                  cols={[
                    { key: 'de', label: 'Dias Mín.', width: '1fr' },
                    { key: 'ate', label: 'Dias Máx.', width: '1fr' },
                    { key: 'rating', label: 'Classificação', width: '1fr' },
                    { key: 'pct', label: '% Provisão', width: '1fr', format: (v) => `${v}%` },
                  ]}
                  rows={pddFaixas}
                  empty="Nenhuma faixa cadastrada."
                  onRemove={(i) => setPddFaixas((prev) => prev.filter((_, idx) => idx !== i))}
                />
              </SectionGroup>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between" style={{ padding: '16px 32px', borderTop: '1px solid var(--border-default)', background: 'var(--surface-card)' }}>
          <button
            onClick={() => (stepIdx === 0 ? onClose() : setStepIdx((i) => Math.max(0, i - 1)))}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 600, fontSize: 'var(--text-sm)', padding: '10px 4px' }}
          >
            {stepIdx === 0 ? 'Cancelar' : '← Voltar'}
          </button>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            {stepIdx + 1} / {steps.length}
          </span>
          <button
            onClick={() => (isLast ? onClose() : setStepIdx((i) => i + 1))}
            className="flex items-center"
            style={{
              gap: 8, padding: '12px 28px',
              background: isLast ? 'var(--success-base)' : 'var(--action-primary-bg)',
              color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
              fontWeight: 700, fontSize: 'var(--text-sm)', letterSpacing: '0.04em',
              boxShadow: isLast ? '0 8px 20px -8px rgba(5,150,105,0.40)' : '0 8px 20px -8px rgba(8,60,74,0.30)',
            }}
          >
            {isLast ? 'Finalizar Cadastro' : 'Próxima Etapa'}
            {isLast ? <Check size={15} /> : <ChevronRight size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function StepGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
      {children}
    </div>
  );
}

function SectionTitle({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div
      className="flex items-center"
      style={{
        gap: 8,
        fontSize: 10,
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.18em',
        color: 'var(--accent)',
        textTransform: 'uppercase',
        marginTop: 8,
        marginBottom: 10,
      }}
    >
      {Icon && (
        <span
          className="flex items-center justify-center"
          style={{
            width: 24,
            height: 24,
            borderRadius: 'var(--radius-md)',
            background: 'var(--agro-light)',
            color: 'var(--agro-base)',
          }}
        >
          <Icon size={13} strokeWidth={2} />
        </span>
      )}
      {children}
    </div>
  );
}

function SelectField({
  label,
  options,
  span,
  onChange,
  placeholder,
}: {
  label?: string;
  options: string[];
  span?: number;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div style={{ gridColumn: span ? `span ${span}` : undefined }}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className="relative" style={{ position: 'relative' }}>
        <select
          onChange={(e) => onChange?.(e.target.value)}
          defaultValue=""
          style={{
            height: 40,
            paddingLeft: 14,
            paddingRight: 40,
            background: 'var(--surface-card)',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: 'var(--border-default)',
            borderRadius: 'var(--radius-md)',
            outline: 'none',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-strong)',
            width: '100%',
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
          }}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          style={{
            position: 'absolute',
            right: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.14em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

function Input({
  disabled,
  style,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...rest}
      disabled={disabled}
      style={{
        height: 40,
        padding: '0 14px',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'var(--border-default)',
        borderRadius: 'var(--radius-md)',
        outline: 'none',
        fontSize: 'var(--text-sm)',
        color: disabled ? 'var(--text-muted)' : 'var(--text-strong)',
        width: '100%',
        ...style,
      }}
    />
  );
}

function FormField({
  label,
  placeholder,
  type,
  span,
  disabled,
  defaultValue,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  span?: number;
  disabled?: boolean;
  defaultValue?: string;
}) {
  return (
    <div style={{ gridColumn: span ? `span ${span}` : undefined }}>
      <FieldLabel>{label}</FieldLabel>
      <Input placeholder={placeholder} type={type} disabled={disabled} defaultValue={defaultValue} />
    </div>
  );
}

function RadioPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 18px',
        borderRadius: 'var(--radius-full)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: active ? 'var(--gci-base)' : 'var(--border-default)',
        background: active ? 'var(--gci-light)' : 'var(--surface-card)',
        color: active ? 'var(--gci-base)' : 'var(--text-muted)',
        fontWeight: 'var(--weight-bold)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.10em',
        cursor: 'pointer',
        transition: 'all var(--duration-base)',
      }}
    >
      {children}
    </button>
  );
}

function SectionHelp({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginBottom: 16,
        lineHeight: 'var(--leading-relaxed)',
      }}
    >
      {children}
    </div>
  );
}

function ParticipantBlock({
  title,
  nameLabel,
  docLabel,
  dateLabel,
  required,
  toggle,
}: {
  title: string;
  nameLabel: string;
  docLabel: string;
  dateLabel: string;
  required?: boolean;
  toggle?: { label: string; enabled: boolean; onToggle: () => void };
}) {
  const disabled = toggle ? !toggle.enabled : false;
  return (
    <div
      style={{
        padding: 20,
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: disabled ? 'var(--border-default)' : 'var(--border-strong, var(--border-default))',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div className="flex items-center" style={{ gap: 12, marginBottom: 16 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.18em',
            color: required || (toggle && toggle.enabled) ? 'var(--accent)' : 'var(--text-muted)',
            textTransform: 'uppercase',
            flex: 1,
          }}
        >
          {title}
        </div>
        {required && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.12em',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--danger-light)',
              color: 'var(--danger-dark)',
            }}
          >
            OBRIGATÓRIO
          </span>
        )}
        {toggle && (
          <button
            onClick={toggle.onToggle}
            className="flex items-center"
            style={{ gap: 10, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.10em',
                color: toggle.enabled ? 'var(--gci-base)' : 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              {toggle.label}
            </span>
            <span
              style={{
                width: 36,
                height: 20,
                borderRadius: 9999,
                background: toggle.enabled ? 'var(--gci-base)' : 'var(--neutral-300, #d4d4d8)',
                position: 'relative',
                transition: 'background var(--duration-base)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  left: toggle.enabled ? 18 : 2,
                  width: 16,
                  height: 16,
                  background: '#fff',
                  borderRadius: '9999px',
                  transition: 'left var(--duration-base)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            </span>
          </button>
        )}
      </div>
      {!disabled && (
        <div className="flex flex-col" style={{ gap: 12 }}>
          <div>
            <FieldLabel>{nameLabel}</FieldLabel>
            <Input placeholder="Razão social / nome comercial" />
          </div>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <FieldLabel>{docLabel}</FieldLabel>
              <Input placeholder="00.000.000/0000-00" />
            </div>
            <div>
              <FieldLabel>{dateLabel}</FieldLabel>
              <Input type="date" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionGroup({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: 20,
        background: 'var(--surface-card)',
      }}
    >
      <SectionTitle icon={icon}>{title}</SectionTitle>
      {children}
    </div>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center"
      style={{
        height: 40,
        padding: '0 18px',
        background: 'var(--success-base)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        fontWeight: 'var(--weight-bold)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.10em',
        gap: 8,
        whiteSpace: 'nowrap',
      }}
    >
      <Plus size={14} /> ADICIONAR
    </button>
  );
}

function RowTrash({ onClick }: { onClick: () => void }) {
  return (
    <div className="ccm-trash" style={{ display: 'inline-flex' }}>
      <button
        onClick={onClick}
        aria-label="Remover"
        style={{
          width: 32,
          height: 32,
          borderRadius: 'var(--radius-md)',
          border: 'none',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
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
  cols: { key: keyof T; label: string; width: string; format?: (v: string) => string }[];
  rows: T[];
  empty: string;
  onRemove: (idx: number) => void;
}) {
  const template = `${cols.map((c) => c.width).join(' ')} 36px`;
  return (
    <div
      style={{
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: template,
          padding: '10px 14px',
          background: 'var(--surface-sunken)',
          fontSize: 10,
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.14em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }}
      >
        {cols.map((c) => (
          <div key={String(c.key)}>{c.label}</div>
        ))}
        <div />
      </div>
      {rows.length === 0 ? (
        <div
          style={{
            padding: 20,
            textAlign: 'center',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)',
          }}
        >
          {empty}
        </div>
      ) : (
        rows.map((r, i) => (
          <div
            key={i}
            className="ccm-row grid items-center"
            style={{
              gridTemplateColumns: template,
              padding: '12px 14px',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-strong)',
              borderTop: '1px solid var(--border-default)',
            }}
          >
            {cols.map((c) => (
              <div
                key={String(c.key)}
                style={{
                  fontVariantNumeric: 'tabular-nums',
                  fontWeight: c.key === cols[0].key ? 'var(--weight-bold)' : 'var(--weight-regular)',
                  color: c.key === cols[0].key ? 'var(--text-strong)' : 'var(--text-default)',
                }}
              >
                {c.format ? c.format(r[c.key] as string) : (r[c.key] as string)}
              </div>
            ))}
            <div style={{ textAlign: 'center' }}>
              <RowTrash onClick={() => onRemove(i)} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function DynamicConcentration({
  title,
  icon,
  qtdLabel,
  qtdPlaceholder,
  qtdOptions,
  qtdNumeric,
  limitePlaceholder,
  rows,
  form,
  onFormChange,
  onAdd,
  onRemove,
}: {
  title: string;
  icon?: LucideIcon;
  qtdLabel: string;
  qtdPlaceholder: string;
  qtdOptions?: string[];
  qtdNumeric?: boolean;
  limitePlaceholder: string;
  rows: { tipo: string; descricao: string; limite: string }[];
  form: { tipo: string; limite: string };
  onFormChange: (v: { tipo: string; limite: string }) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
}) {
  return (
    <SectionGroup title={title} icon={icon}>
      <div
        className="grid items-end"
        style={{ gridTemplateColumns: '1fr 1fr auto', gap: 12, marginBottom: 16 }}
      >
        <div>
          <FieldLabel>{qtdLabel}</FieldLabel>
          {qtdOptions ? (
            <SelectField
              options={qtdOptions}
              onChange={(v) => onFormChange({ ...form, tipo: v })}
            />
          ) : (
            <Input
              placeholder={qtdPlaceholder}
              value={form.tipo}
              type={qtdNumeric ? 'number' : 'text'}
              onChange={(e) => onFormChange({ ...form, tipo: e.target.value })}
            />
          )}
        </div>
        <div>
          <FieldLabel>Limite de Concentração (%)</FieldLabel>
          <Input
            placeholder={limitePlaceholder}
            value={form.limite}
            onChange={(e) => onFormChange({ ...form, limite: e.target.value })}
          />
        </div>
        <AddButton onClick={onAdd} />
      </div>

      <DataTable
        cols={[
          { key: 'tipo', label: 'Tipo', width: '0.7fr' },
          { key: 'descricao', label: 'Descrição', width: '1.6fr' },
          { key: 'limite', label: 'Limite (%)', width: '1fr', format: (v) => `${v}%` },
        ]}
        rows={rows}
        empty="Nenhum registro adicionado."
        onRemove={onRemove}
      />
    </SectionGroup>
  );
}

function SimpleTable({
  title,
  cols,
  rows,
}: {
  title: string;
  cols: string[];
  rows: string[][];
}) {
  return (
    <div>
      <FieldLabel>{title}</FieldLabel>
      <div
        style={{
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: cols.map(() => '1fr').join(' '),
            padding: '10px 14px',
            background: 'var(--surface-sunken)',
            fontSize: 10,
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.14em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }}
        >
          {cols.map((c) => (
            <div key={c}>{c}</div>
          ))}
        </div>
        {rows.map((r, i) => (
          <div
            key={i}
            className="grid"
            style={{
              gridTemplateColumns: cols.map(() => '1fr').join(' '),
              padding: '12px 14px',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
              borderTop: '1px solid var(--border-default)',
            }}
          >
            {r.map((cell, j) => (
              <div key={j}>{cell}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

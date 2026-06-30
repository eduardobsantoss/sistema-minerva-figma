import { useMemo, useState } from 'react';
import {
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  Trash2,
  Shield,
  ShieldCheck,
  FileText,
  Paperclip,
  Inbox,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';
import { ESTEIRAS } from '../data/operacaoData';

export interface NewPedidoData {
  tipoOperacao: string;
  esteira: string;
  tipoContrato: string;
  unidadeNegocio: string;
  gerenteComercial: string;
  fundo: string;
  grupoEmpresarial: string;
  contaBancaria: string;
  tipoTaxa: string;
  taxaOperacao: string;
  indicePos: string;
  operadorPos: string;
  valorTaxaPos: string;
  fee: string;
  valorOperacao: string;
  quitacaoVencidos: boolean;
  requerGarantia: boolean;
}

interface Props {
  onClose: () => void;
  onCreate: (data: NewPedidoData) => void;
}

interface Step {
  key: 'dados' | 'garantia' | 'anexos';
  label: string;
  icon: LucideIcon;
  hint: string;
}

const steps: Step[] = [
  { key: 'dados',    label: 'Dados Gerais', icon: FileText,  hint: 'Parâmetros comerciais e financeiros da operação' },
  { key: 'garantia', label: 'Garantia',     icon: ShieldCheck, hint: 'Garantias vinculadas à operação' },
  { key: 'anexos',   label: 'Anexos',       icon: Paperclip, hint: 'Documentação comprobatória' },
];

interface GarantiaItem { tipo: string; nome: string; valor: string; }

const TIPO_OPERACAO_OPTS = [
  'Desconto Duplicata', 'Contrato NC', 'Contrato NP', 'Contrato CCB',
  'Contrato CPR', 'Contrato CPRF', 'Contrato CDCA',
];
const TIPO_CONTRATO_OPTS = ['CCB', 'CPR-F', 'CDCA', 'CDA-WA', 'NCE'];
const UNIDADE_OPTS = ['Ceres Trading', 'Ceres Confina', 'Ceres Investimentos'];
const GERENTE_OPTS = ['Ana Martins', 'Carlos Eduardo', 'Fernanda Lima', 'Roberto Alves'];
const FUNDO_OPTS = ['CRA Semeagro', 'CRA Ceres Agro', 'CRA BTG Agro', 'FIDC Boa Safra'];
const GRUPO_OPTS = ['Grupo Ceres', 'Semeagro', 'BTG Agro', 'Raízen', 'Cargill Brasil', 'Coamo', 'Castrolanda'];
const CONTA_OPTS = ['001 - BB · Ag 1234 · CC 56789-0', '341 - Itaú · Ag 4567 · CC 12345-6'];
const TIPO_TAXA_OPTS = ['Pré-fixado', 'Pós-fixado', 'Híbrido'];
const TIPO_GARANTIA_OPTS = ['Penhor Agrícola', 'Alienação Fiduciária', 'Aval', 'Hipoteca', 'CPR Física'];

const DOCS_GERAIS: { id: string; nome: string; obrigatorio: boolean }[] = [
  { id: 'contrato-social', nome: 'Contrato Social', obrigatorio: true },
  { id: 'cartao-cnpj',     nome: 'Cartão CNPJ', obrigatorio: true },
  { id: 'balanco',         nome: 'Balanço Patrimonial', obrigatorio: true },
  { id: 'end',             nome: 'Comprovante de Endereço', obrigatorio: false },
  { id: 'procuracao',      nome: 'Procuração', obrigatorio: false },
];

export function NovoPedidoModal({ onClose, onCreate }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [form, setForm] = useState<NewPedidoData>({
    tipoOperacao: '', esteira: '', tipoContrato: '',
    unidadeNegocio: '', gerenteComercial: '',
    fundo: '', grupoEmpresarial: '', contaBancaria: '',
    tipoTaxa: 'Pré-fixado', taxaOperacao: '', indicePos: '', operadorPos: '', valorTaxaPos: '', fee: '', valorOperacao: '',
    quitacaoVencidos: false, requerGarantia: false,
  });

  const [garantiaItens, setGarantiaItens] = useState<GarantiaItem[]>([]);
  const [garantiaForm, setGarantiaForm] = useState<GarantiaItem>({ tipo: '', nome: '', valor: '' });

  const [docFiles, setDocFiles] = useState<Record<string, boolean>>({});

  const set = (f: keyof NewPedidoData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [f]: e.target.value }));
  const setVal = (f: keyof NewPedidoData) => (v: string) =>
    setForm((prev) => ({ ...prev, [f]: v }));

  const addGarantia = () => {
    if (!garantiaForm.tipo || !garantiaForm.nome) return;
    setGarantiaItens((prev) => [...prev, garantiaForm]);
    setGarantiaForm({ tipo: '', nome: '', valor: '' });
  };

  // Documentos por garantia adicionada
  const docsGarantia = useMemo(
    () =>
      garantiaItens.map((g, i) => ({
        id: `garantia-${i}`,
        nome: `Laudo de Avaliação — ${g.nome}`,
        obrigatorio: true,
      })),
    [garantiaItens],
  );

  const requiredDocs = useMemo(
    () => [...DOCS_GERAIS, ...docsGarantia].filter((d) => d.obrigatorio),
    [docsGarantia],
  );
  const pendingRequired = requiredDocs.filter((d) => !docFiles[d.id]).length;
  const canConfirm = pendingRequired === 0;

  const toggleDoc = (id: string) =>
    setDocFiles((prev) => ({ ...prev, [id]: !prev[id] }));

  const step = steps[stepIdx];
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === steps.length - 1;

  const goNext = () => {
    if (isLast) {
      if (canConfirm) onCreate(form);
    } else {
      setStepIdx((i) => i + 1);
    }
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
      <style>{`
        .npm-row .npm-trash { opacity: 0; transition: opacity 0.15s; }
        .npm-row:hover .npm-trash { opacity: 1; }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)',
          width: '100%', maxWidth: 980, height: '85vh',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between" style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-default)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>
              Novo Pedido de Operação
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
              {step.hint} · Etapa {stepIdx + 1} de {steps.length}
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

        {/* ── Stepper (informativo, não clicável) ── */}
        <div className="flex" style={{ background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border-default)' }}>
          {steps.map((s, i) => {
            const Icon = s.icon;
            const done = i < stepIdx;
            const current = i === stepIdx;
            const color = current ? 'var(--agro-base)' : done ? 'var(--stepper-done)' : 'var(--text-muted)';
            return (
              <div
                key={s.key}
                className="flex items-center justify-center"
                style={{
                  flex: 1, gap: 8, padding: '16px 8px 13px',
                  borderBottom: current ? '3px solid var(--agro-base)' : '3px solid transparent',
                  color,
                  opacity: !current && !done ? 0.6 : 1,
                }}
              >
                {done ? <Check size={16} strokeWidth={2.5} /> : <Icon size={16} strokeWidth={current ? 2.25 : 1.75} />}
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          {step.key === 'dados' && (
            <DadosGeraisStep
              form={form}
              set={set}
              setVal={setVal}
              onToggleQuitacao={() => setForm((p) => ({ ...p, quitacaoVencidos: !p.quitacaoVencidos }))}
            />
          )}

          {step.key === 'garantia' && (
            <GarantiaStep
              requer={form.requerGarantia}
              onToggleRequer={() => setForm((p) => ({ ...p, requerGarantia: !p.requerGarantia }))}
              itens={garantiaItens}
              gForm={garantiaForm}
              setGForm={setGarantiaForm}
              onAdd={addGarantia}
              onRemove={(i) => setGarantiaItens((prev) => prev.filter((_, idx) => idx !== i))}
            />
          )}

          {step.key === 'anexos' && (
            <AnexosStep
              docsGerais={DOCS_GERAIS}
              docsGarantia={docsGarantia}
              docFiles={docFiles}
              onToggleDoc={toggleDoc}
            />
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between" style={{ padding: '16px 32px', borderTop: '1px solid var(--border-default)', background: 'var(--surface-card)' }}>
          <button
            onClick={isFirst ? onClose : () => setStepIdx((i) => i - 1)}
            className="flex items-center"
            style={{ gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)', padding: '10px 4px' }}
          >
            {isFirst ? 'Cancelar' : (<><ChevronLeft size={15} /> Voltar</>)}
          </button>

          <div className="flex items-center" style={{ gap: 16 }}>
            {isLast && !canConfirm && (
              <span className="flex items-center" style={{ gap: 6, fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--warning-base)' }}>
                <AlertTriangle size={14} />
                {pendingRequired} {pendingRequired === 1 ? 'documento obrigatório pendente' : 'documentos obrigatórios pendentes'}
              </span>
            )}
            <button
              onClick={goNext}
              disabled={isLast && !canConfirm}
              className="flex items-center"
              style={{
                gap: 8, height: 44, padding: '0 22px', border: 'none',
                borderRadius: 'var(--radius-lg)',
                cursor: isLast && !canConfirm ? 'not-allowed' : 'pointer',
                fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em',
                background: isLast
                  ? (canConfirm ? 'var(--success-base)' : 'var(--neutral-200)')
                  : 'var(--action-primary-bg)',
                color: isLast && !canConfirm ? 'var(--text-disabled)' : '#fff',
                transition: 'background var(--duration-base)',
              }}
            >
              {isLast ? (<>Confirmar solicitação <Check size={15} /></>) : (<>Próxima etapa <ChevronRight size={15} /></>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Step 1 ───────────────────────── */

function DadosGeraisStep({ form, set, setVal, onToggleQuitacao }: {
  form: NewPedidoData;
  set: (f: keyof NewPedidoData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  setVal: (f: keyof NewPedidoData) => (v: string) => void;
  onToggleQuitacao: () => void;
}) {
  return (
    <div className="flex flex-col" style={{ gap: 16 }}>
      <BentoBox title="Identificação">
        <BentoGrid cols={3}>
          <SelectField label="Tipo de operação" options={TIPO_OPERACAO_OPTS} placeholder="Selecione" value={form.tipoOperacao} onChange={setVal('tipoOperacao')} />
          <SelectField label="Esteira" options={ESTEIRAS.map((e) => e.label)} placeholder="Selecione" value={form.esteira} onChange={setVal('esteira')} />
          <SelectField label="Tipo de contrato" options={TIPO_CONTRATO_OPTS} placeholder="Selecione" value={form.tipoContrato} onChange={setVal('tipoContrato')} />
        </BentoGrid>
      </BentoBox>

      <BentoBox title="Responsáveis">
        <BentoGrid cols={2}>
          <SelectField label="Unidade de negócio" options={UNIDADE_OPTS} placeholder="Selecione" value={form.unidadeNegocio} onChange={setVal('unidadeNegocio')} />
          <SelectField label="Gerente comercial" options={GERENTE_OPTS} placeholder="Selecione" value={form.gerenteComercial} onChange={setVal('gerenteComercial')} />
        </BentoGrid>
      </BentoBox>

      <BentoBox title="Veículo">
        <BentoGrid cols={3}>
          <SelectField label="Fundo" options={FUNDO_OPTS} placeholder="Selecione" value={form.fundo} onChange={setVal('fundo')} />
          <SelectField label="Grupo empresarial" options={GRUPO_OPTS} placeholder="Selecione" value={form.grupoEmpresarial} onChange={setVal('grupoEmpresarial')} />
          <div>
            <FieldLabel>Conta bancária</FieldLabel>
            <div className="flex items-center" style={{ gap: 8 }}>
              <div style={{ flex: 1 }}>
                <SelectField options={CONTA_OPTS} placeholder="Selecione" value={form.contaBancaria} onChange={setVal('contaBancaria')} />
              </div>
              <button
                aria-label="Adicionar conta"
                className="flex items-center justify-center"
                style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', background: 'var(--surface-card)', color: 'var(--gci-base)', cursor: 'pointer' }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </BentoGrid>
      </BentoBox>

      <BentoBox title="Taxas">
        <BentoGrid cols={form.tipoTaxa === 'Pós-fixado' ? 4 : 3}>
          <SelectField label="Tipo de taxa" options={TIPO_TAXA_OPTS} value={form.tipoTaxa} onChange={setVal('tipoTaxa')} />
          {form.tipoTaxa === 'Pós-fixado' ? (
            <>
              <SelectField label="Índice" options={['CDI', 'IPCA', 'Selic']} placeholder="Selecione" value={form.indicePos} onChange={setVal('indicePos')} />
              <SelectField label="Operador" options={['Percentual', 'Spread']} placeholder="Selecione" value={form.operadorPos} onChange={setVal('operadorPos')} />
              <FormField label="Valor da taxa" placeholder="100%" value={form.valorTaxaPos} onChange={set('valorTaxaPos')} />
            </>
          ) : (
            <FormField label="Taxa operação (%)" placeholder="0,00" value={form.taxaOperacao} onChange={set('taxaOperacao')} />
          )}
          <FormField label="FEE da Operação (%)" placeholder="0,00" value={form.fee} onChange={set('fee')} />
        </BentoGrid>
      </BentoBox>

      {/* Toggle quitação de vencidos — linha própria */}
      <ToggleRow
        label="Operação para quitação de vencidos"
        on={form.quitacaoVencidos}
        onToggle={onToggleQuitacao}
      />

      {/* Tabela de Agrupamento — empty state discreto */}
      <BentoBox title="Agrupamento">
        <div
          style={{
            borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--surface-card)',
          }}
        >
          <div
            className="grid"
            style={{
              gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr', padding: '10px 14px',
              background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase',
            }}
          >
            <div>Agrupamento</div>
            <div>Limite</div>
            <div>Risco</div>
            <div>Risco c/ Solicitação</div>
          </div>
          {[
            { agrupamento: 'Confina', limite: 'R$ 1.000.000', risco: 'R$ 500.000', riscoSolic: 'R$ 540.000' },
            { agrupamento: 'Multicedentes', limite: 'R$ 4.000.000', risco: 'R$ 0', riscoSolic: 'R$ 40.000' },
          ].map((row) => (
            <div
              key={row.agrupamento}
              className="grid"
              style={{
                gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr', padding: '12px 14px',
                borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{row.agrupamento}</div>
              <div style={{ color: 'var(--text-default)' }}>{row.limite}</div>
              <div style={{ color: 'var(--text-default)' }}>{row.risco}</div>
              <div style={{ color: 'var(--text-default)' }}>{row.riscoSolic}</div>
            </div>
          ))}
        </div>
      </BentoBox>
    </div>
  );
}

/* ───────────────────────── Step 2 ───────────────────────── */

function GarantiaStep({ requer, onToggleRequer, itens, gForm, setGForm, onAdd, onRemove }: {
  requer: boolean;
  onToggleRequer: () => void;
  itens: GarantiaItem[];
  gForm: GarantiaItem;
  setGForm: (g: GarantiaItem) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div className="flex flex-col" style={{ gap: 20 }}>
      {/* Toggle em destaque */}
      <div
        onClick={onToggleRequer}
        className="flex items-center justify-between"
        style={{
          padding: '16px 20px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
          borderWidth: 1, borderStyle: 'solid',
          borderColor: requer ? 'var(--gci-base)' : 'var(--border-default)',
          background: requer ? 'var(--gci-light)' : 'var(--surface-card)',
          transition: 'all var(--duration-base)',
        }}
      >
        <div className="flex items-center" style={{ gap: 12 }}>
          <Shield size={20} color={requer ? 'var(--gci-base)' : 'var(--text-muted)'} />
          <div>
            <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>
              Requer garantia
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
              Ative para vincular garantias reais ou fidejussórias à operação.
            </div>
          </div>
        </div>
        <Switch on={requer} />
      </div>

      {!requer ? (
        // Empty state orientativo
        <div className="flex flex-col items-center justify-center" style={{ gap: 12, padding: '48px 24px', textAlign: 'center' }}>
          <div className="flex items-center justify-center" style={{ width: 64, height: 64, borderRadius: '9999px', background: 'var(--surface-sunken)', color: 'var(--neutral-400)' }}>
            <Shield size={28} strokeWidth={1.5} />
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', maxWidth: 360, lineHeight: 1.5 }}>
            Esta operação não requer garantia. Clique em <strong style={{ color: 'var(--text-default)' }}>"Próxima etapa"</strong> para continuar.
          </div>
        </div>
      ) : (
        <>
          <SectionGroup title="Adicionar garantia" icon={ShieldCheck}>
            <div className="grid items-end" style={{ gridTemplateColumns: '1fr 1.4fr 1fr auto', gap: 12 }}>
              <div>
                <FieldLabel>Tipo de garantia</FieldLabel>
                <SelectField options={TIPO_GARANTIA_OPTS} placeholder="Selecione" value={gForm.tipo} onChange={(v) => setGForm({ ...gForm, tipo: v })} />
              </div>
              <div>
                <FieldLabel>Nome da garantia</FieldLabel>
                <Input placeholder="Ex: Penhor Safra 2026" value={gForm.nome} onChange={(e) => setGForm({ ...gForm, nome: e.target.value })} />
              </div>
              <div>
                <FieldLabel>Valor da garantia</FieldLabel>
                <Input placeholder="R$ 0,00" value={gForm.valor} onChange={(e) => setGForm({ ...gForm, valor: e.target.value })} />
              </div>
              <AddButton onClick={onAdd} />
            </div>
          </SectionGroup>

          <DataTable
            cols={[
              { key: 'tipo', label: 'Tipo', width: '1fr' },
              { key: 'nome', label: 'Nome', width: '1.6fr' },
              { key: 'valor', label: 'Valor', width: '1fr' },
            ]}
            rows={itens}
            empty="Nenhuma garantia adicionada."
            onRemove={onRemove}
          />
        </>
      )}
    </div>
  );
}

/* ───────────────────────── Step 3 ───────────────────────── */

function AnexosStep({ docsGerais, docsGarantia, docFiles, onToggleDoc }: {
  docsGerais: { id: string; nome: string; obrigatorio: boolean }[];
  docsGarantia: { id: string; nome: string; obrigatorio: boolean }[];
  docFiles: Record<string, boolean>;
  onToggleDoc: (id: string) => void;
}) {
  return (
    <div className="flex flex-col" style={{ gap: 20 }}>
      <DocGroup title="Documentos gerais" docs={docsGerais} docFiles={docFiles} onToggleDoc={onToggleDoc} />
      {docsGarantia.length > 0 && (
        <DocGroup title="Documentos das garantias" docs={docsGarantia} docFiles={docFiles} onToggleDoc={onToggleDoc} />
      )}
    </div>
  );
}

function DocGroup({ title, docs, docFiles, onToggleDoc }: {
  title: string;
  docs: { id: string; nome: string; obrigatorio: boolean }[];
  docFiles: Record<string, boolean>;
  onToggleDoc: (id: string) => void;
}) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12 }}>
        {title}
      </div>
      <div className="flex flex-col" style={{ gap: 10 }}>
        {docs.map((doc) => {
          const hasFile = !!docFiles[doc.id];
          const pendingRequired = doc.obrigatorio && !hasFile;
          return (
            <div
              key={doc.id}
              className="flex items-center"
              style={{
                gap: 14, padding: '12px 16px',
                background: 'var(--surface-card)',
                borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)',
                borderLeft: pendingRequired ? '3px solid var(--warning-base)' : '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div className="flex items-center justify-center" style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 'var(--radius-md)', background: hasFile ? 'var(--success-light)' : 'var(--surface-sunken)', color: hasFile ? 'var(--success-base)' : 'var(--text-muted)' }}>
                {hasFile ? <CheckCircle2 size={18} /> : <FileText size={18} />}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex items-center" style={{ gap: 8 }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>{doc.nome}</span>
                  <span
                    style={{
                      fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em',
                      padding: '2px 7px', borderRadius: '9999px',
                      background: doc.obrigatorio ? 'var(--status-warning-bg)' : 'var(--status-neutral-bg)',
                      color: doc.obrigatorio ? 'var(--status-warning-text)' : 'var(--status-neutral-text)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {doc.obrigatorio ? 'Obrigatório' : 'Opcional'}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: hasFile ? 'var(--success-dark)' : 'var(--text-muted)', marginTop: 2 }}>
                  {hasFile ? 'Arquivo anexado · documento.pdf' : 'Nenhum arquivo anexado'}
                </div>
              </div>

              <div className="flex items-center" style={{ gap: 6 }}>
                {hasFile ? (
                  <>
                    <IconAction icon={Download} label="Baixar" />
                    <IconAction icon={Trash2} label="Excluir" danger onClick={() => onToggleDoc(doc.id)} />
                  </>
                ) : (
                  <button
                    onClick={() => onToggleDoc(doc.id)}
                    className="flex items-center"
                    style={{
                      gap: 6, padding: '8px 14px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                      border: '1px solid var(--border-default)', background: 'var(--surface-card)',
                      color: 'var(--text-strong)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
                    }}
                  >
                    <Upload size={14} /> Enviar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function IconAction({ icon: Icon, label, danger, onClick }: { icon: LucideIcon; label: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex items-center justify-center"
      style={{
        width: 34, height: 34, borderRadius: 'var(--radius-md)', cursor: 'pointer',
        border: '1px solid var(--border-default)', background: 'var(--surface-card)',
        color: danger ? 'var(--danger-base)' : 'var(--text-muted)',
      }}
    >
      <Icon size={15} />
    </button>
  );
}

/* ───────────────────────── Helpers (file-local) ───────────────────────── */

function BentoBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
      <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 14 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function BentoGrid({ cols, children }: { cols: number; children: React.ReactNode }) {
  return <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 14 }}>{children}</div>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
      {children}
    </div>
  );
}

function Input({ style, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...rest}
      style={{
        width: '100%', height: 40, padding: '0 14px',
        background: 'var(--surface-card)', border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)', outline: 'none',
        fontSize: 'var(--text-sm)', color: 'var(--text-strong)',
        ...style,
      }}
    />
  );
}

function FormField({ label, placeholder, value, onChange }: {
  label: string; placeholder?: string; value?: string; onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <Input placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}

function SelectField({ label, options, placeholder, value, onChange }: {
  label?: string; options: string[]; placeholder?: string; value?: string; onChange?: (v: string) => void;
}) {
  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          style={{
            width: '100%', height: 40, padding: '0 36px 0 14px',
            background: 'var(--surface-card)', border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)', outline: 'none', cursor: 'pointer',
            fontSize: 'var(--text-sm)', color: value ? 'var(--text-strong)' : 'var(--text-muted)',
            appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
          }}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

function Switch({ on }: { on: boolean }) {
  return (
    <div style={{ position: 'relative', width: 44, height: 24, borderRadius: '9999px', background: on ? 'var(--gci-base)' : 'var(--border-strong)', transition: 'background var(--duration-base)', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: '9999px', background: '#fff', transition: 'left var(--duration-base)', boxShadow: 'var(--shadow-xs)' }} />
    </div>
  );
}

function ToggleRow({ label, on, onToggle }: {
  label: string; on: boolean; onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className="flex items-center justify-between"
      style={{
        padding: '14px 18px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
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

function SectionGroup({ title, icon: Icon, children }: { title: string; icon?: LucideIcon; children: React.ReactNode }) {
  return (
    <div style={{ padding: 20, background: 'var(--surface-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-lg)' }}>
      <div className="flex items-center" style={{ gap: 8, fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 16 }}>
        {Icon && <Icon size={14} strokeWidth={2} />}
        {title}
      </div>
      {children}
    </div>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center"
      style={{ height: 40, minWidth: 40, padding: '0 16px', gap: 6, background: 'var(--success-base)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em' }}
    >
      <Plus size={14} /> ADICIONAR
    </button>
  );
}

function DataTable<T extends Record<string, string>>({ cols, rows, empty, onRemove }: {
  cols: { key: keyof T; label: string; width: string }[];
  rows: T[];
  empty: string;
  onRemove: (i: number) => void;
}) {
  const template = `${cols.map((c) => c.width).join(' ')} 36px`;
  return (
    <div style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div
        className="grid"
        style={{ gridTemplateColumns: template, padding: '10px 14px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}
      >
        {cols.map((c) => <div key={String(c.key)}>{c.label}</div>)}
        <div />
      </div>
      {rows.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{empty}</div>
      ) : (
        rows.map((r, i) => (
          <div
            key={i}
            className="npm-row grid items-center"
            style={{ gridTemplateColumns: template, padding: '12px 14px', fontSize: 'var(--text-sm)', color: 'var(--text-strong)', borderTop: '1px solid var(--border-default)' }}
          >
            {cols.map((c) => (
              <div key={String(c.key)} style={{ fontVariantNumeric: 'tabular-nums', fontWeight: c.key === cols[0].key ? 'var(--weight-bold)' : 'var(--weight-regular)' }}>
                {(r[c.key] as string) || '—'}
              </div>
            ))}
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => onRemove(i)} className="npm-trash" aria-label="Remover" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-base)', display: 'inline-flex' }}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

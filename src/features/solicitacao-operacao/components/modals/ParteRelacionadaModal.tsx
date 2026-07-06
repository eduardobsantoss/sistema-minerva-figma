import { useState } from 'react';
import { X, Tag, User, Building2, Phone } from 'lucide-react';
import { UF_OPTIONS, PAISES_DDI, type ParteTipo, type ParteRelacionada } from '../../data/operacaoData';

export interface NewParteRelacionadaData {
  tipoPessoa: 'FISICA' | 'JURIDICA';
  // Pessoa Física
  cpf: string;
  nomeFisica: string;
  rg: string;
  inscricaoProdutorRural: string;
  nacionalidade: string;
  dataNascimento: string;
  profissao: string;
  estadoCivil: string;
  // Pessoa Jurídica
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  dataAbertura: string;
  tipoEmpresa: string;
  porte: string;
  atividadePrincipal: string;
  naturezaJuridica: string;
  inscricaoMunicipal: string;
  inscricaoEstadual: string;
  // Endereço
  cep: string;
  localidade: string;
  numero: string;
  bairro: string;
  infoAdicionais: string;
  cidade: string;
  estado: string;
  pais: string;
  // Contato
  nomeContato: string;
  email: string;
  ddi: string;
  telefone: string;
  // Tipos
  tipos: string[];
}

interface Props {
  onClose: () => void;
  onCreate: (data: ParteRelacionada) => void;
}

const NACIONALIDADE_OPTS = ['Brasileira', 'Estrangeira'];
const ESTADO_CIVIL_OPTS = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável'];
const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const DDI_OPTS = PAISES_DDI.map((p) => p.ddi);

const TIPOS_OPTS: { label: string; codigo: ParteTipo }[] = [
  { label: 'Cônjuge',               codigo: 'CON' },
  { label: 'Avalista',              codigo: 'AVA' },
  { label: 'Sócio',                 codigo: 'SOC' },
  { label: 'Interveniente Anuente', codigo: 'ITA' },
  { label: 'Representante Legal',   codigo: 'REP' },
  { label: 'Procurador',            codigo: 'PROC' },
];

const initialForm: NewParteRelacionadaData = {
  tipoPessoa: 'FISICA',
  cpf: '', nomeFisica: '', rg: '', inscricaoProdutorRural: '',
  nacionalidade: '', dataNascimento: '', profissao: '', estadoCivil: '',
  cnpj: '', razaoSocial: '', nomeFantasia: '', dataAbertura: '',
  tipoEmpresa: '', porte: '', atividadePrincipal: '', naturezaJuridica: '',
  inscricaoMunicipal: '', inscricaoEstadual: '',
  cep: '', localidade: '', numero: '', bairro: '', infoAdicionais: '',
  cidade: '', estado: '', pais: 'Brasil',
  nomeContato: '', email: '', ddi: '+55', telefone: '',
  tipos: [],
};

export function ParteRelacionadaModal({ onClose, onCreate }: Props) {
  const [form, setForm] = useState<NewParteRelacionadaData>(initialForm);

  const set = (f: keyof NewParteRelacionadaData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [f]: e.target.value }));
  const setVal = (f: keyof NewParteRelacionadaData) => (v: string) =>
    setForm((prev) => ({ ...prev, [f]: v }));

  const toggleTipo = (label: string) =>
    setForm((prev) => ({
      ...prev,
      tipos: prev.tipos.includes(label) ? prev.tipos.filter((t) => t !== label) : [...prev.tipos, label],
    }));

  const nome = form.tipoPessoa === 'FISICA' ? form.nomeFisica : (form.razaoSocial || form.nomeFantasia);
  const documento = form.tipoPessoa === 'FISICA' ? form.cpf : form.cnpj;
  const canSubmit = nome.trim() !== '' && documento.trim() !== '';

  const handleSubmit = () => {
    if (!canSubmit) return;
    const codigos = TIPOS_OPTS.filter((t) => form.tipos.includes(t.label)).map((t) => t.codigo);
    onCreate({
      nome,
      documento,
      email: form.email,
      telefone: form.telefone,
      tipos: codigos,
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
          width: '100%', maxWidth: 860, height: '85vh',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between" style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-default)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>
              Nova Parte Relacionada
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
              Identificação, endereço, contato e vínculo com a solicitação
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
            <BentoBox title="Identificação">
              <div className="flex flex-col" style={{ gap: 14 }}>
                <div style={{ maxWidth: 280 }}>
                  <SelectField
                    label="Natureza"
                    options={['Pessoa Física', 'Pessoa Jurídica']}
                    value={form.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    onChange={(v) => setVal('tipoPessoa')(v === 'Pessoa Física' ? 'FISICA' : 'JURIDICA')}
                  />
                </div>

                {form.tipoPessoa === 'FISICA' ? (
                  <BentoGrid cols={3}>
                    <FormField label="CPF" placeholder="000.000.000-00" value={form.cpf} onChange={set('cpf')} />
                    <FormField label="Nome" placeholder="Nome completo" value={form.nomeFisica} onChange={set('nomeFisica')} />
                    <FormField label="RG" placeholder="0000000" value={form.rg} onChange={set('rg')} />
                    <FormField label="Inscrição do produtor rural" placeholder="—" value={form.inscricaoProdutorRural} onChange={set('inscricaoProdutorRural')} />
                    <SelectField label="Nacionalidade" options={NACIONALIDADE_OPTS} placeholder="Selecione" value={form.nacionalidade} onChange={setVal('nacionalidade')} />
                    <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" value={form.dataNascimento} onChange={set('dataNascimento')} />
                    <FormField label="Profissão" placeholder="—" value={form.profissao} onChange={set('profissao')} />
                    <SelectField label="Estado Civil" options={ESTADO_CIVIL_OPTS} placeholder="Selecione" value={form.estadoCivil} onChange={setVal('estadoCivil')} />
                  </BentoGrid>
                ) : (
                  <BentoGrid cols={3}>
                    <FormField label="CNPJ" placeholder="00.000.000/0000-00" value={form.cnpj} onChange={set('cnpj')} />
                    <FormField label="Razão Social" placeholder="—" value={form.razaoSocial} onChange={set('razaoSocial')} />
                    <FormField label="Nome Fantasia" placeholder="—" value={form.nomeFantasia} onChange={set('nomeFantasia')} />
                    <FormField label="Data de abertura" placeholder="dd/mm/aaaa" value={form.dataAbertura} onChange={set('dataAbertura')} />
                    <FormField label="Tipo" placeholder="—" value={form.tipoEmpresa} onChange={set('tipoEmpresa')} />
                    <FormField label="Porte" placeholder="—" value={form.porte} onChange={set('porte')} />
                    <FormField label="Atividade principal" placeholder="—" value={form.atividadePrincipal} onChange={set('atividadePrincipal')} />
                    <FormField label="Natureza Jurídica" placeholder="—" value={form.naturezaJuridica} onChange={set('naturezaJuridica')} />
                    <FormField label="Inscrição municipal" placeholder="—" value={form.inscricaoMunicipal} onChange={set('inscricaoMunicipal')} />
                    <FormField label="Inscrição estadual" placeholder="—" value={form.inscricaoEstadual} onChange={set('inscricaoEstadual')} />
                  </BentoGrid>
                )}
              </div>
            </BentoBox>

            <BentoBox title="Endereço" icon={Tag}>
              <BentoGrid cols={2}>
                <FormField label="CEP" placeholder="00000-000" value={form.cep} onChange={set('cep')} />
                <FormField label="Localidade" placeholder="—" value={form.localidade} onChange={set('localidade')} />
                <FormField label="Número" placeholder="—" value={form.numero} onChange={set('numero')} />
                <FormField label="Bairro" placeholder="—" value={form.bairro} onChange={set('bairro')} />
                <div style={{ gridColumn: 'span 2' }}>
                  <FormField label="Informações adicionais" placeholder="—" value={form.infoAdicionais} onChange={set('infoAdicionais')} />
                </div>
                <FormField label="Cidade" placeholder="—" value={form.cidade} onChange={set('cidade')} />
                <SelectField label="Estado" options={UF_OPTIONS} placeholder="UF" value={form.estado} onChange={setVal('estado')} />
                <SelectField label="País" options={PAIS_OPTS} placeholder="Selecione" value={form.pais} onChange={(v) => {
                  setVal('pais')(v);
                  const match = PAISES_DDI.find((p) => p.pais === v);
                  if (match) setVal('ddi')(match.ddi);
                }} />
              </BentoGrid>
            </BentoBox>

            <BentoBox title="Contato" icon={Phone}>
              <BentoGrid cols={2}>
                <FormField label="Nome" placeholder="—" value={form.nomeContato} onChange={set('nomeContato')} />
                <FormField label="E-mail" placeholder="contato@email.com" value={form.email} onChange={set('email')} />
                <SelectField label="DDI" options={DDI_OPTS} value={form.ddi} onChange={setVal('ddi')} />
                <FormField label="Telefone" placeholder="(00) 00000-0000" value={form.telefone} onChange={set('telefone')} />
              </BentoGrid>
            </BentoBox>

            <BentoBox title="Tipos" icon={User}>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {TIPOS_OPTS.map((t) => (
                  <label key={t.label} className="flex items-center" style={{ gap: 10, cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>
                    <Checkbox checked={form.tipos.includes(t.label)} onChange={() => toggleTipo(t.label)} />
                    {t.label}
                  </label>
                ))}
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
            <Building2 size={15} /> CADASTRAR
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Primitivas locais (padrão replicado dos demais modais) ──────── */

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
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={onChange}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onChange(); } }}
      style={{
        width: 16, height: 16, borderRadius: 4, border: 'none', outline: 'none', flexShrink: 0, cursor: 'pointer',
        background: checked ? 'var(--gci-base)' : '#fff',
        boxShadow: checked ? '0 0 0 2px rgba(8,60,74,0.18)' : '0 1px 3px rgba(15,23,42,0.14), 0 1px 2px rgba(15,23,42,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background var(--duration-fast), box-shadow var(--duration-fast)',
      }}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

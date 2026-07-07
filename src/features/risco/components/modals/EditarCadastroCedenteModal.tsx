import { useState } from 'react';
import { X } from 'lucide-react';
import { NACIONALIDADE_OPTS, ESTADO_CIVIL_OPTS, type Cedente } from '../../data/riscoData';
import { FieldLabel, FormField, SelectField } from '../../screens/detail-tabs/shared';

interface Props {
  cedente: Cedente;
  onClose: () => void;
  onUpdate: (cedente: Cedente) => void;
}

function Cell({ span, children }: { span: number; children: React.ReactNode }) {
  return <div style={{ gridColumn: `span ${span}` }}>{children}</div>;
}

function ReadonlyField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div
        style={{
          height: 40, display: 'flex', alignItems: 'center', padding: '0 14px',
          background: 'var(--surface-sunken)', border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)', color: 'var(--text-disabled)', fontSize: 'var(--text-sm)',
          cursor: 'not-allowed', fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value || '—'}
      </div>
    </div>
  );
}

export function EditarCadastroCedenteModal({ cedente, onClose, onUpdate }: Props) {
  const isPF = cedente.tipo === 'Pessoa Física';

  const [rg, setRg] = useState(cedente.rg ?? '');
  const [inscricaoProdutorRural, setInscricaoProdutorRural] = useState(cedente.inscricaoProdutorRural ?? '');
  const [nacionalidade, setNacionalidade] = useState(cedente.nacionalidade ?? '');
  const [profissao, setProfissao] = useState(cedente.profissao ?? '');
  const [estadoCivil, setEstadoCivil] = useState(cedente.estadoCivil ?? '');

  const [nomeFantasia, setNomeFantasia] = useState(cedente.nomeFantasia ?? '');
  const [tipoEmpresa, setTipoEmpresa] = useState(cedente.tipoEmpresa ?? '');
  const [porte, setPorte] = useState(cedente.porte ?? '');
  const [atividadePrincipal, setAtividadePrincipal] = useState(cedente.atividadePrincipal ?? '');
  const [naturezaJuridica, setNaturezaJuridica] = useState(cedente.naturezaJuridica ?? '');
  const [inscricaoMunicipal, setInscricaoMunicipal] = useState(cedente.inscricaoMunicipal ?? '');
  const [inscricaoEstadual, setInscricaoEstadual] = useState(cedente.inscricaoEstadual ?? '');

  const handleAtualizar = () => {
    if (isPF) {
      onUpdate({ ...cedente, rg, inscricaoProdutorRural, nacionalidade, profissao, estadoCivil });
    } else {
      onUpdate({ ...cedente, nomeFantasia, tipoEmpresa, porte, atividadePrincipal, naturezaJuridica, inscricaoMunicipal, inscricaoEstadual });
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(8,60,74,0.55)', backdropFilter: 'blur(8px)',
        zIndex: 450, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 32, animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col"
        style={{
          background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)',
          width: '100%', maxWidth: 760, maxHeight: '90vh',
          overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between" style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>
            Editar Cadastro
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex items-center justify-center"
            style={{ width: 32, height: 32, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', background: 'var(--surface-card)', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24, overflow: 'auto' }}>
          {isPF ? (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
              <Cell span={4}><ReadonlyField label="CPF" value={cedente.documento} /></Cell>
              <Cell span={5}><ReadonlyField label="Nome" value={cedente.nome} /></Cell>
              <Cell span={3}><FormField label="RG" placeholder="—" value={rg} onChange={(e) => setRg(e.target.value)} /></Cell>

              <Cell span={4}><FormField label="Inscrição do produtor rural" placeholder="—" value={inscricaoProdutorRural} onChange={(e) => setInscricaoProdutorRural(e.target.value)} /></Cell>
              <Cell span={4}><SelectField label="Nacionalidade" options={NACIONALIDADE_OPTS} placeholder="Selecione" value={nacionalidade} onChange={(e) => setNacionalidade(e.target.value)} /></Cell>
              <Cell span={4}><ReadonlyField label="Data de nascimento" value={cedente.dataNascimento} /></Cell>

              <Cell span={6}><FormField label="Profissão" placeholder="—" value={profissao} onChange={(e) => setProfissao(e.target.value)} /></Cell>
              <Cell span={6}><SelectField label="Estado Civil" options={ESTADO_CIVIL_OPTS} placeholder="Selecione" value={estadoCivil} onChange={(e) => setEstadoCivil(e.target.value)} /></Cell>
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
              <Cell span={4}><ReadonlyField label="CNPJ" value={cedente.documento} /></Cell>
              <Cell span={5}><ReadonlyField label="Razão Social" value={cedente.razaoSocial ?? cedente.nome} /></Cell>
              <Cell span={3}><FormField label="Nome Fantasia" placeholder="—" value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} /></Cell>

              <Cell span={4}><ReadonlyField label="Data de abertura" value={cedente.dataAbertura} /></Cell>
              <Cell span={4}><FormField label="Tipo" placeholder="—" value={tipoEmpresa} onChange={(e) => setTipoEmpresa(e.target.value)} /></Cell>
              <Cell span={4}><FormField label="Porte" placeholder="—" value={porte} onChange={(e) => setPorte(e.target.value)} /></Cell>

              <Cell span={6}><FormField label="Atividade principal" placeholder="—" value={atividadePrincipal} onChange={(e) => setAtividadePrincipal(e.target.value)} /></Cell>
              <Cell span={6}><FormField label="Natureza Jurídica" placeholder="—" value={naturezaJuridica} onChange={(e) => setNaturezaJuridica(e.target.value)} /></Cell>

              <Cell span={6}><FormField label="Inscrição municipal" placeholder="—" value={inscricaoMunicipal} onChange={(e) => setInscricaoMunicipal(e.target.value)} /></Cell>
              <Cell span={6}><FormField label="Inscrição estadual" placeholder="—" value={inscricaoEstadual} onChange={(e) => setInscricaoEstadual(e.target.value)} /></Cell>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end" style={{ gap: 12, padding: '16px 28px', borderTop: '1px solid var(--border-default)', flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{ height: 40, padding: '0 20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleAtualizar}
            style={{ height: 40, padding: '0 24px', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', background: 'var(--action-primary-bg)', color: '#fff' }}
          >
            ATUALIZAR
          </button>
        </div>
      </div>
    </div>
  );
}

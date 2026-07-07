import { useState } from 'react';
import {
  X, Pencil, FileUp, TrendingUp, MapPin, CalendarDays,
  Trash2, Phone, Home, FileText, Paperclip, Download,
} from 'lucide-react';
import {
  brl, statusCedenteColor,
  UF_OPTIONS, PAIS_OPTS, DDI_OPTS, TIPO_ARQUIVO_OPTS,
  type Cedente, type ContatoCedente, type EnderecoCedente, type DocumentoCedente,
} from '../../data/riscoData';
import { TabPill, FormField, SelectField, EmptyState, AddButton } from '../../screens/detail-tabs/shared';
import { EditarCadastroCedenteModal } from './EditarCadastroCedenteModal';

type Tab = 'contatos' | 'enderecos' | 'documentos';

const TABS: { key: Tab; label: string; icon: typeof Phone }[] = [
  { key: 'contatos', label: 'Contatos', icon: Phone },
  { key: 'enderecos', label: 'Endereços', icon: Home },
  { key: 'documentos', label: 'Documentos', icon: FileText },
];

interface Props {
  cedente: Cedente;
  onClose: () => void;
  onUpdate: (cedente: Cedente) => void;
}

export function CedenteDetailModal({ cedente, onClose, onUpdate }: Props) {
  const [tab, setTab] = useState<Tab>('contatos');
  const [editando, setEditando] = useState(false);
  const cor = statusCedenteColor(cedente.status);

  return (
    <>
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
          className="flex flex-col"
          style={{
            background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)',
            width: '100%', maxWidth: 1000, maxHeight: '92vh',
            overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between" style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-default)', flexShrink: 0, gap: 16 }}>
            <div style={{ minWidth: 0 }}>
              <div className="flex items-center" style={{ gap: 10, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>
                  {cedente.nome}
                </h2>
                <span className="flex items-center" style={{ gap: 6, fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '4px 10px', borderRadius: '9999px', background: `color-mix(in srgb, ${cor} 14%, transparent)`, color: cor, flexShrink: 0 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '9999px', background: cor }} />
                  {cedente.status.toUpperCase()}
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
                {cedente.documento}
              </p>
            </div>
            <div className="flex items-center" style={{ gap: 10, flexShrink: 0 }}>
              <button
                onClick={() => setEditando(true)}
                className="flex items-center"
                style={{ gap: 8, height: 38, padding: '0 16px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', cursor: 'pointer', color: 'var(--text-strong)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}
              >
                <Pencil size={13} /> EDITAR CADASTRO
              </button>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="flex items-center justify-center"
                style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', background: 'var(--surface-card)', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col" style={{ padding: 24, gap: 20, overflow: 'auto' }}>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              <KpiCard icon={FileUp} label="Qtd. de títulos em aberto" value={String(cedente.qtdTitulosAberto)} />
              <KpiCard icon={TrendingUp} label="Risco tomado" value={brl(cedente.riscoTomado)} />
              <KpiCard icon={MapPin} label="Cidade - UF" value={`${cedente.cidade} - ${cedente.uf}`} />
              <KpiCard icon={CalendarDays} label="Data de abertura" value={cedente.dataAbertura} />
            </div>

            <div className="flex items-center" style={{ gap: 4, padding: 4, background: 'var(--surface-sunken)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', width: 'fit-content' }}>
              {TABS.map((t) => (
                <TabPill key={t.key} active={tab === t.key} onClick={() => setTab(t.key)} icon={t.icon}>
                  {t.label}
                </TabPill>
              ))}
            </div>

            {tab === 'contatos' && <ContatosPanel cedente={cedente} onUpdate={onUpdate} />}
            {tab === 'enderecos' && <EnderecosPanel cedente={cedente} onUpdate={onUpdate} />}
            {tab === 'documentos' && <DocumentosPanel cedente={cedente} onUpdate={onUpdate} />}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end" style={{ gap: 12, padding: '14px 28px', borderTop: '1px solid var(--border-default)', background: 'var(--surface-card)', flexShrink: 0 }}>
            <button
              onClick={onClose}
              style={{ height: 40, padding: '0 20px', background: 'var(--surface-card)', color: 'var(--text-strong)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)' }}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      {editando && (
        <EditarCadastroCedenteModal
          cedente={cedente}
          onClose={() => setEditando(false)}
          onUpdate={(updated) => { onUpdate(updated); setEditando(false); }}
        />
      )}
    </>
  );
}

function KpiCard({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '14px 16px', background: 'var(--surface-sunken)' }}>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 8 }}>{label}</div>
      <div className="flex items-center" style={{ gap: 7 }}>
        <Icon size={15} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      </div>
    </div>
  );
}

/* ─── Aba Contatos ────────────────────────────────────────────────── */

function ContatosPanel({ cedente, onUpdate }: { cedente: Cedente; onUpdate: (c: Cedente) => void }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [ddi, setDdi] = useState('+55');
  const [telefone, setTelefone] = useState('');

  const add = () => {
    if (!nome.trim() || !email.trim()) return;
    const novo: ContatoCedente = { id: `cont-${Date.now()}`, nome, email, ddi, telefone };
    onUpdate({ ...cedente, contatos: [...cedente.contatos, novo] });
    setNome(''); setEmail(''); setTelefone('');
  };

  const remove = (id: string) => onUpdate({ ...cedente, contatos: cedente.contatos.filter((c) => c.id !== id) });

  return (
    <div className="flex flex-col" style={{ gap: 16 }}>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormField label="Nome" placeholder="—" value={nome} onChange={(e) => setNome(e.target.value)} />
        <FormField label="E-mail" placeholder="contato@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="grid items-end" style={{ gridTemplateColumns: '140px 1fr auto', gap: 14 }}>
        <SelectField label="DDI" options={DDI_OPTS} value={ddi} onChange={(e) => setDdi(e.target.value)} />
        <FormField label="Telefone" placeholder="(00) 00000-0000" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        <AddButton onClick={add} />
      </div>

      {cedente.contatos.length === 0 ? (
        <EmptyState icon={Phone} title="Nenhum contato cadastrado" hint="Use o formulário acima para cadastrar um contato deste cedente." />
      ) : (
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div className="grid items-center" style={{ gridTemplateColumns: '1.2fr 1.6fr 1.2fr 40px', padding: '10px 16px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            <div>Nome</div><div>E-mail</div><div>Telefone</div><div />
          </div>
          {cedente.contatos.map((c) => (
            <div key={c.id} className="grid items-center" style={{ gridTemplateColumns: '1.2fr 1.6fr 1.2fr 40px', padding: '10px 16px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }}>
              <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{c.nome}</div>
              <div style={{ color: 'var(--text-muted)' }}>{c.email}</div>
              <div style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{c.ddi} {c.telefone}</div>
              <div className="flex justify-end">
                <button onClick={() => remove(c.id)} aria-label="Remover" className="flex items-center justify-center" style={{ width: 26, height: 26, border: 'none', background: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--action-danger-text-only)' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Aba Endereços ───────────────────────────────────────────────── */

function EnderecosPanel({ cedente, onUpdate }: { cedente: Cedente; onUpdate: (c: Cedente) => void }) {
  const [cep, setCep] = useState('');
  const [localidade, setLocalidade] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [infoAdicionais, setInfoAdicionais] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [pais, setPais] = useState('Brasil');

  const add = () => {
    if (!cep.trim() || !cidade.trim()) return;
    const novo: EnderecoCedente = { id: `end-${Date.now()}`, cep, localidade, numero, bairro, infoAdicionais, cidade, uf, pais };
    onUpdate({ ...cedente, enderecos: [...cedente.enderecos, novo] });
    setCep(''); setLocalidade(''); setNumero(''); setBairro(''); setInfoAdicionais(''); setCidade(''); setUf('');
  };

  const remove = (id: string) => onUpdate({ ...cedente, enderecos: cedente.enderecos.filter((e) => e.id !== id) });

  return (
    <div className="flex flex-col" style={{ gap: 16 }}>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormField label="CEP" placeholder="00000-000" value={cep} onChange={(e) => setCep(e.target.value)} />
        <FormField label="Localidade" placeholder="—" value={localidade} onChange={(e) => setLocalidade(e.target.value)} />
      </div>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormField label="Número" placeholder="—" value={numero} onChange={(e) => setNumero(e.target.value)} />
        <FormField label="Bairro" placeholder="—" value={bairro} onChange={(e) => setBairro(e.target.value)} />
      </div>
      <FormField label="Informações adicionais" placeholder="—" value={infoAdicionais} onChange={(e) => setInfoAdicionais(e.target.value)} />
      <div className="grid items-end" style={{ gridTemplateColumns: '1fr 140px 160px auto', gap: 14 }}>
        <FormField label="Cidade" placeholder="—" value={cidade} onChange={(e) => setCidade(e.target.value)} />
        <SelectField label="Estado" options={UF_OPTIONS} placeholder="UF" value={uf} onChange={(e) => setUf(e.target.value)} />
        <SelectField label="País" options={PAIS_OPTS} value={pais} onChange={(e) => setPais(e.target.value)} />
        <AddButton onClick={add} />
      </div>

      {cedente.enderecos.length === 0 ? (
        <EmptyState icon={Home} title="Nenhum endereço cadastrado" hint="Use o formulário acima para cadastrar um endereço deste cedente." />
      ) : (
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'auto' }}>
          <div className="grid items-center" style={{ gridTemplateColumns: '1fr 1.4fr 0.7fr 1fr 1fr 0.6fr 1fr 40px', padding: '10px 16px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            <div>CEP</div><div>Localidade</div><div>Número</div><div>Bairro</div><div>Cidade</div><div>UF</div><div>País</div><div />
          </div>
          {cedente.enderecos.map((e) => (
            <div key={e.id} className="grid items-center" style={{ gridTemplateColumns: '1fr 1.4fr 0.7fr 1fr 1fr 0.6fr 1fr 40px', padding: '10px 16px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}>
              <div style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-muted)' }}>{e.cep}</div>
              <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{e.localidade || '—'}</div>
              <div style={{ color: 'var(--text-muted)' }}>{e.numero || '—'}</div>
              <div style={{ color: 'var(--text-muted)' }}>{e.bairro || '—'}</div>
              <div style={{ color: 'var(--text-default)' }}>{e.cidade}</div>
              <div style={{ color: 'var(--text-default)' }}>{e.uf}</div>
              <div style={{ color: 'var(--text-default)' }}>{e.pais}</div>
              <div className="flex justify-end">
                <button onClick={() => remove(e.id)} aria-label="Remover" className="flex items-center justify-center" style={{ width: 26, height: 26, border: 'none', background: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--action-danger-text-only)' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Aba Documentos ──────────────────────────────────────────────── */

function DocumentosPanel({ cedente, onUpdate }: { cedente: Cedente; onUpdate: (c: Cedente) => void }) {
  const [tipo, setTipo] = useState('');
  const [arquivo, setArquivo] = useState('');
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  const add = () => {
    if (!tipo || !arquivo.trim()) return;
    const novo: DocumentoCedente = { id: `doc-${Date.now()}`, nome: arquivo, tipo };
    onUpdate({ ...cedente, documentos: [...cedente.documentos, novo] });
    setArquivo(''); setTipo('');
  };

  const remove = (id: string) => onUpdate({ ...cedente, documentos: cedente.documentos.filter((d) => d.id !== id) });

  const documentosFiltrados = cedente.documentos.filter((d) => {
    if (filtroNome.trim() && !d.nome.toLowerCase().includes(filtroNome.trim().toLowerCase())) return false;
    if (filtroTipo && d.tipo !== filtroTipo) return false;
    return true;
  });

  return (
    <div className="flex flex-col" style={{ gap: 16 }}>
      <div className="grid items-end" style={{ gridTemplateColumns: '1fr 1.4fr auto', gap: 14 }}>
        <SelectField label="Tipo do arquivo" options={TIPO_ARQUIVO_OPTS} placeholder="Selecione" value={tipo} onChange={(e) => setTipo(e.target.value)} />
        <FormField label="Insira o arquivo" placeholder="Nome do arquivo" value={arquivo} onChange={(e) => setArquivo(e.target.value)} />
        <AddButton onClick={add} />
      </div>

      <div className="flex items-end" style={{ gap: 14, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 200 }}>
          <FormField label="Nome" placeholder="Buscar por nome" value={filtroNome} onChange={(e) => setFiltroNome(e.target.value)} />
        </div>
        <div style={{ minWidth: 180 }}>
          <SelectField label="Tipo" options={TIPO_ARQUIVO_OPTS} placeholder="Todos" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} />
        </div>
        <button
          disabled={cedente.documentos.length === 0}
          className="flex items-center"
          style={{
            gap: 8, height: 40, padding: '0 16px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-card)', cursor: cedente.documentos.length === 0 ? 'not-allowed' : 'pointer',
            color: cedente.documentos.length === 0 ? 'var(--text-disabled)' : 'var(--text-strong)',
            fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em', whiteSpace: 'nowrap',
          }}
        >
          <Download size={14} /> BAIXAR TODOS
        </button>
      </div>

      {documentosFiltrados.length === 0 ? (
        <EmptyState icon={FileText} title="Nenhum documento encontrado" hint="Use o formulário acima para anexar um documento deste cedente." />
      ) : (
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div className="grid items-center" style={{ gridTemplateColumns: '1.6fr 1fr 40px', padding: '10px 16px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            <div>Nome</div><div>Tipo</div><div />
          </div>
          {documentosFiltrados.map((d) => (
            <div key={d.id} className="grid items-center" style={{ gridTemplateColumns: '1.6fr 1fr 40px', padding: '10px 16px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }}>
              <div className="flex items-center" style={{ gap: 8, fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>
                <Paperclip size={13} style={{ color: 'var(--text-muted)' }} /> {d.nome}
              </div>
              <div style={{ color: 'var(--text-muted)' }}>{d.tipo}</div>
              <div className="flex justify-end">
                <button onClick={() => remove(d.id)} aria-label="Remover" className="flex items-center justify-center" style={{ width: 26, height: 26, border: 'none', background: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--action-danger-text-only)' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

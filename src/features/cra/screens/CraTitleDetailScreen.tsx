import { useState } from 'react';
import {
  ArrowLeft, FileText, Paperclip, CreditCard, Activity,
  CheckCircle2, Clock, Download, Mail, Phone, Building2, User,
  TrendingUp, BadgeCheck, ArrowLeftRight,
  Copy, Check as CheckIcon,
} from 'lucide-react';
import { brl, type Cra, type CraOperacao, type CraTitulo, type TituloStatus } from '../data/craData';

interface Props {
  cra: Cra;
  operacao: CraOperacao;
  titulo: CraTitulo;
  onBack: () => void;
}

type Tab = 'detalhes' | 'anexos' | 'accrual' | 'pagamentos' | 'confirmacoes' | 'movimentacoes' | 'historico';
type MovSub = 'registro' | 'cessao';

const statusTone: Record<TituloStatus, { bg: string; fg: string; iconBg: string }> = {
  CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)', iconBg: 'var(--success-base)' },
  PENDENTE:   { bg: 'var(--warning-light)', fg: 'var(--warning-dark)', iconBg: 'var(--warning-base)' },
  VENCIDO:    { bg: 'var(--danger-light)',  fg: 'var(--danger-dark)',  iconBg: 'var(--danger-base)' },
};

export function CraTitleDetailScreen({ cra, operacao, titulo, onBack }: Props) {
  const [tab, setTab] = useState<Tab>('detalhes');
  const tone = statusTone[titulo.status];

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      {/* Header */}
      <div className="flex items-center" style={{ gap: 16 }}>
        <button onClick={onBack} aria-label="Voltar" className="flex items-center justify-center" style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', cursor: 'pointer', color: 'var(--text-strong)' }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.18em', color: 'var(--agro-base)', textTransform: 'uppercase', marginBottom: 4 }}>
            {cra.nome} · {operacao.nome}
          </div>
          <h2 className="flex items-center" style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.01em', lineHeight: 1.2, gap: 8 }}>
            Título #{titulo.numero}
            <CopyButton value={`Título #${titulo.numero}`} />
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
            Auditoria e ciclo de vida do direito creditório
          </p>
        </div>
        <span className="flex items-center" style={{ gap: 8, fontSize: 11, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', padding: '8px 14px', background: tone.bg, color: tone.fg, borderRadius: '9999px' }}>
          {titulo.status === 'CONFIRMADO' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
          {titulo.status}
        </span>
      </div>

      {/* Value hero */}
      <div className="relative overflow-hidden flex items-center" style={{ background: 'var(--gci-base)', borderRadius: 'var(--radius-xl)', padding: '28px 32px', color: '#fff', boxShadow: '0 20px 40px -20px rgba(8,60,74,0.40)' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 320, height: 320, borderRadius: '9999px', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 'var(--weight-bold)', letterSpacing: '0.18em', color: 'var(--agro-base)', textTransform: 'uppercase', marginBottom: 10 }}>
            Valor Nominal do Título
          </div>
          <div style={{ fontSize: 36, fontWeight: 'var(--weight-bold)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
            {brl(titulo.vrNominal)}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.65)', marginTop: 8 }}>
            Tipo: {titulo.tipo} · Emissão: {titulo.emissao} · Vencimento: {titulo.vencimento}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center" style={{ gap: 4, padding: 4, background: 'var(--surface-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-xl)', alignSelf: 'flex-start', flexWrap: 'wrap' }}>
        <TabPill active={tab === 'detalhes'}      onClick={() => setTab('detalhes')}      icon={FileText}>Detalhes</TabPill>
        <TabPill active={tab === 'anexos'}        onClick={() => setTab('anexos')}        icon={Paperclip}>Anexos</TabPill>
        <TabPill active={tab === 'accrual'}       onClick={() => setTab('accrual')}       icon={TrendingUp}>Accrual</TabPill>
        <TabPill active={tab === 'pagamentos'}    onClick={() => setTab('pagamentos')}    icon={CreditCard}>Pagamentos</TabPill>
        <TabPill active={tab === 'confirmacoes'}  onClick={() => setTab('confirmacoes')}  icon={BadgeCheck}>Confirmações</TabPill>
        <TabPill active={tab === 'movimentacoes'} onClick={() => setTab('movimentacoes')} icon={ArrowLeftRight}>Movimentações</TabPill>
        <TabPill active={tab === 'historico'}     onClick={() => setTab('historico')}     icon={Activity}>Histórico</TabPill>
      </div>

      <div style={{ background: 'var(--surface-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-xl)', padding: 24 }}>
        {tab === 'detalhes'      && <DetailsTab titulo={titulo} operacao={operacao} />}
        {tab === 'anexos'        && <AnexosTab titulo={titulo} />}
        {tab === 'accrual'       && <AccrualTab titulo={titulo} />}
        {tab === 'pagamentos'    && <PagamentosTab />}
        {tab === 'confirmacoes'  && <ConfirmacoesTab titulo={titulo} />}
        {tab === 'movimentacoes' && <MovimentacoesTab titulo={titulo} />}
        {tab === 'historico'     && <MovimentoTab titulo={titulo} />}
      </div>
    </div>
  );
}

/* ─── Shared helpers ─────────────────────────────────────────────── */

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} title={copied ? 'Copiado!' : 'Copiar'} style={{
      background: 'none', border: 'none', cursor: 'pointer', padding: 2,
      color: copied ? 'var(--success-base)' : 'var(--text-muted)',
      display: 'inline-flex', alignItems: 'center', borderRadius: 4, flexShrink: 0,
      transition: 'color var(--duration-fast)',
    }}>
      {copied ? <CheckIcon size={13} /> : <Copy size={13} />}
    </button>
  );
}

function TabPill({ active, onClick, icon: Icon, children }: { active: boolean; onClick: () => void; icon: typeof FileText; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex items-center" style={{ gap: 8, padding: '10px 16px', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-lg)', background: active ? 'var(--gci-base)' : 'transparent', color: active ? '#fff' : 'var(--text-muted)', transition: 'all var(--duration-base)' }}>
      <Icon size={14} />{children}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{value}</div>
    </div>
  );
}

function Participant({ role, name, cnpj, icon: Icon }: { role: string; name: string; cnpj: string; icon: typeof Building2 }) {
  return (
    <div className="flex items-center" style={{ gap: 14, padding: 16, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)' }}>
      <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', color: 'var(--gci-base)', flexShrink: 0 }}>
        <Icon size={20} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>{role}</div>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>{name}</div>
        <div className="flex items-center" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2, gap: 4 }}>{cnpj}<CopyButton value={cnpj} /></div>
      </div>
    </div>
  );
}

/* ─── Tab content ────────────────────────────────────────────────── */

function DetailsTab({ titulo, operacao }: { titulo: CraTitulo; operacao: CraOperacao }) {
  return (
    <div className="flex flex-col" style={{ gap: 32 }}>
      <Section title="Informações do Título">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          <Field label="Operação de Origem" value={operacao.nome} />
          <Field label="Número" value={<span className="flex items-center" style={{ gap: 6 }}>#{titulo.numero}<CopyButton value={titulo.numero} /></span>} />
          <Field label="Tipo de Ativo" value={titulo.tipo} />
          <Field label="Status" value={titulo.status} />
        </div>
      </Section>
      <Section title="Datas e Prazos">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          <Field label="Data de Emissão" value={titulo.emissao} />
          <Field label="Data de Vencimento" value={titulo.vencimento} />
          <Field label="Prorrogação" value="Não aplicável" />
          <Field label="Protesto" value="—" />
        </div>
      </Section>
      <Section title="Participantes">
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Participant role="Cedente" name={titulo.cedente} cnpj={titulo.cedenteCnpj} icon={Building2} />
          <Participant role="Sacado"  name={titulo.sacado}  cnpj={titulo.sacadoCnpj}  icon={User} />
        </div>
      </Section>
      <Section title="Contato Regulatório">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          <Field label="Email" value={<span className="flex items-center" style={{ gap: 6 }}><Mail size={14} color="var(--text-muted)" /> cobranca@cedente.com.br<CopyButton value="cobranca@cedente.com.br" /></span>} />
          <Field label="Telefone" value={<span className="flex items-center" style={{ gap: 6 }}><Phone size={14} color="var(--text-muted)" /> +55 (11) 4002-8922<CopyButton value="+55 (11) 4002-8922" /></span>} />
        </div>
      </Section>
    </div>
  );
}

function AccrualTab({ titulo }: { titulo: CraTitulo }) {
  const rows = [
    { data: titulo.emissao,    taxa: '1,8500%', base: '252', accrual: brl(titulo.vrNominal * 0.0185 / 252), acumulado: brl(titulo.vrNominal * 0.0185 / 252 * 3) },
    { data: titulo.emissao,    taxa: '1,8500%', base: '252', accrual: brl(titulo.vrNominal * 0.0185 / 252), acumulado: brl(titulo.vrNominal * 0.0185 / 252 * 2) },
    { data: titulo.vencimento, taxa: '1,8500%', base: '252', accrual: brl(titulo.vrNominal * 0.0185 / 252), acumulado: brl(titulo.vrNominal * 0.0185 / 252) },
  ];
  return (
    <Section title="Cálculo de Accrual">
      <div style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', padding: '12px 16px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          <div>Data</div><div>Taxa</div><div>Base</div><div>Accrual Diário</div><div style={{ textAlign: 'right' }}>Acumulado</div>
        </div>
        {rows.map((r, i) => (
          <div key={i} className="grid items-center" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', padding: '14px 16px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', fontVariantNumeric: 'tabular-nums' }}>
            <div style={{ color: 'var(--text-muted)' }}>{r.data}</div>
            <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{r.taxa}</div>
            <div style={{ color: 'var(--text-muted)' }}>{r.base}</div>
            <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{r.accrual}</div>
            <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', textAlign: 'right' }}>{r.acumulado}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ConfirmacoesTab({ titulo }: { titulo: CraTitulo }) {
  const items = [
    { data: titulo.emissao,    tipo: 'Confirmação do Sacado',  resultado: titulo.status === 'CONFIRMADO' ? 'CONFIRMADO' : 'PENDENTE', obs: 'Via portal eletrônico' },
    { data: titulo.emissao,    tipo: 'Validação de Lastro',    resultado: 'CONFIRMADO', obs: 'Documento verificado' },
    { data: titulo.emissao,    tipo: 'Registro Registradora',  resultado: 'CONFIRMADO', obs: 'B3 — protocolo #82341' },
  ];
  const toneMap: Record<string, { bg: string; fg: string }> = {
    CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
    PENDENTE:   { bg: 'var(--warning-light)', fg: 'var(--warning-base)' },
  };
  return (
    <Section title="Histórico de Confirmações">
      <div className="flex flex-col" style={{ gap: 10 }}>
        {items.map((c, i) => (
          <div key={i} className="flex items-center" style={{ gap: 14, padding: 14, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>{c.tipo}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{c.data} · {c.obs}</div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '5px 10px', borderRadius: '9999px', background: (toneMap[c.resultado] ?? toneMap['PENDENTE']).bg, color: (toneMap[c.resultado] ?? toneMap['PENDENTE']).fg }}>
              {c.resultado}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function AnexosTab({ titulo }: { titulo: CraTitulo }) {
  const files = [
    { name: `CPR-${titulo.numero}.xml`, size: '14 KB', type: 'XML' },
    { name: `Laudo-${titulo.numero}.pdf`, size: '210 KB', type: 'PDF' },
    { name: `Nota-${titulo.numero}.jpg`, size: '88 KB', type: 'IMG' },
  ];
  return (
    <Section title="Evidências e Lastro Físico">
      <div className="flex flex-col" style={{ gap: 12 }}>
        {files.map((f) => (
          <div key={f.name} className="flex items-center" style={{ gap: 14, padding: 14, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)' }}>
            <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--gci-light)', color: 'var(--gci-base)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em' }}>{f.type}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>{f.name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{f.size}</div>
            </div>
            <button className="flex items-center" style={{ gap: 8, padding: '8px 14px', background: 'var(--surface-card)', color: 'var(--text-strong)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)' }}>
              <Download size={14} /> Baixar
            </button>
          </div>
        ))}
      </div>
    </Section>
  );
}

function PagamentosTab() {
  return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Histórico de repasses e custódias indisponível para este título.</div>;
}

function MovimentoTab({ titulo }: { titulo: CraTitulo }) {
  const events = [
    { date: titulo.emissao,    label: 'Título emitido pelo cedente',           tone: 'info' },
    { date: titulo.emissao,    label: 'Registro enviado à registradora (B3)',  tone: 'info' },
    { date: titulo.emissao,    label: 'Confirmação física do sacado',          tone: titulo.status === 'CONFIRMADO' ? 'success' : 'warning' },
    { date: titulo.vencimento, label: titulo.status === 'VENCIDO' ? 'Inadimplência identificada' : 'Vencimento programado', tone: titulo.status === 'VENCIDO' ? 'danger' : 'neutral' },
  ];
  const toneMap: Record<string, string> = { info: 'var(--gci-base)', success: 'var(--success-base)', warning: 'var(--warning-base)', danger: 'var(--danger-base)', neutral: 'var(--neutral-300)' };
  return (
    <Section title="Linha do Tempo">
      <div className="flex flex-col" style={{ gap: 0, position: 'relative' }}>
        {events.map((e, i) => (
          <div key={i} className="flex items-start" style={{ gap: 16, padding: '12px 0', position: 'relative' }}>
            <div style={{ position: 'relative', width: 12 }}>
              <span style={{ display: 'block', width: 12, height: 12, borderRadius: '9999px', background: toneMap[e.tone], marginTop: 6 }} />
              {i < events.length - 1 && <span style={{ position: 'absolute', left: 5, top: 18, bottom: -12, width: 2, background: 'var(--border-default)' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{e.label}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{e.date}</div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function MovimentacoesTab({ titulo }: { titulo: CraTitulo }) {
  const [sub, setSub] = useState<MovSub>('registro');
  return (
    <div className="flex flex-col" style={{ gap: 20 }}>
      <div className="flex" style={{ gap: 4, padding: 4, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)', alignSelf: 'flex-start' }}>
        {(['registro', 'cessao'] as MovSub[]).map((s) => (
          <button key={s} onClick={() => setSub(s)} style={{ padding: '8px 16px', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)', background: sub === s ? 'var(--surface-card)' : 'transparent', color: sub === s ? 'var(--text-strong)' : 'var(--text-muted)', boxShadow: sub === s ? 'var(--shadow-xs)' : 'none', transition: 'all var(--duration-base)' }}>
            {s === 'registro' ? 'MOVIMENTAÇÕES DE REGISTRO' : 'MOVIMENTO DE CESSÃO'}
          </button>
        ))}
      </div>
      {sub === 'registro' && (
        <Section title="Movimentações de Registro">
          <div style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', padding: '12px 16px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <div>Data</div><div>Operação</div><div>Registradora</div><div>Protocolo</div><div style={{ textAlign: 'right' }}>Valor</div>
            </div>
            {[{ data: titulo.emissao, operacao: 'Inclusão', registradora: 'B3', protocolo: '#82341', valor: brl(titulo.vrNominal) }].map((r, i) => (
              <div key={i} className="grid items-center" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', padding: '14px 16px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }}>
                <div style={{ color: 'var(--text-muted)' }}>{r.data}</div>
                <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{r.operacao}</div>
                <div style={{ color: 'var(--text-default)' }}>{r.registradora}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{r.protocolo}</div>
                <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.valor}</div>
              </div>
            ))}
          </div>
        </Section>
      )}
      {sub === 'cessao' && (
        <Section title="Movimento de Cessão">
          <div style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1.4fr 1.4fr 1fr 1fr', padding: '12px 16px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <div>Data</div><div>Cedente</div><div>Cessionário</div><div>Valor</div><div style={{ textAlign: 'right' }}>Status</div>
            </div>
            {[{ data: titulo.emissao, cedente: titulo.cedente, cessionario: 'CRA Operação', valor: brl(titulo.vrNominal) }].map((r, i) => (
              <div key={i} className="grid items-center" style={{ gridTemplateColumns: '1fr 1.4fr 1.4fr 1fr 1fr', padding: '14px 16px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }}>
                <div style={{ color: 'var(--text-muted)' }}>{r.data}</div>
                <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{r.cedente}</div>
                <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{r.cessionario}</div>
                <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{r.valor}</div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '4px 8px', borderRadius: '9999px', background: 'var(--success-light)', color: 'var(--success-dark)' }}>LIQUIDADO</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

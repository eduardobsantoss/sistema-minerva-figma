import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, FileText, Boxes, ShieldCheck, CheckCircle2, Paperclip,
  MessageSquare, Activity, MoreVertical, ChevronRight, AlertTriangle,
  XCircle, Clock, Copy, Check as CheckIcon, Download, Trash2, User,
  Send, FolderOpen, Plus, Search, Banknote, ArrowRightLeft, RefreshCw,
  Layers, Wallet, AlertCircle,
} from 'lucide-react';
import {
  brl, etapaCor, etapaLabel, esteiraLabel, detalheSolicitacao,
  type Solicitacao, type ParteTipo, type ValidacaoStatus, type ItemValidacao,
} from '../data/operacaoData';

interface Props {
  solicitacao: Solicitacao;
  onBack: () => void;
}

type Tab = 'gerais' | 'ativos' | 'garantias' | 'validacoes' | 'anexos' | 'ata' | 'historico';
type SubView = null | 'validacoes-detalhe';

const TABS: { key: Tab; label: string; icon: typeof FileText }[] = [
  { key: 'gerais',     label: 'Dados Gerais',       icon: FileText },
  { key: 'ativos',     label: 'Ativos',             icon: Boxes },
  { key: 'garantias',  label: 'Garantias',          icon: ShieldCheck },
  { key: 'validacoes', label: 'Validações',         icon: CheckCircle2 },
  { key: 'anexos',     label: 'Anexos',             icon: Paperclip },
  { key: 'ata',        label: 'Ata de Deliberação', icon: MessageSquare },
  { key: 'historico',  label: 'Histórico',          icon: Activity },
];

/** Defaults de exibição quando o mock não trouxe os campos opcionais. */
function display(s: Solicitacao) {
  return {
    unidadeNegocio: s.unidadeNegocio ?? 'Ceres Investimentos',
    documento: s.documento ?? '07.366.063/0001-05',
    banco: s.banco ?? '341 - Itaú Unibanco S.A.',
    agencia: s.agencia ?? '1475-0',
    conta: s.conta ?? '43810-5',
    tipoTaxa: s.tipoTaxa ?? 'Pré-fixado',
    frequencia: s.frequencia ?? 'Mensal',
    fee: s.fee ?? 2,
    valorFee: s.valorFee ?? s.valor * 0.02,
    percSeguro: s.percSeguro ?? 0,
    valorSeguro: s.valorSeguro ?? 0,
    quitacaoVencidos: s.quitacaoVencidos ?? false,
  };
}

export function SolicitacaoDetailScreen({ solicitacao: s, onBack }: Props) {
  const [tab, setTab] = useState<Tab>('gerais');
  const [subView, setSubView] = useState<SubView>(null);
  const [confirmReject, setConfirmReject] = useState(false);
  const det = detalheSolicitacao(s);
  const cor = etapaCor(s.etapa);

  if (subView === 'validacoes-detalhe') {
    return <ValidacoesFullView det={det} onBack={() => setSubView(null)} solicitacaoId={s.id} />;
  }

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      {/* ── Header + barra de ações ── */}
      <div className="flex items-center" style={{ gap: 16 }}>
        <button onClick={onBack} aria-label="Voltar" className="flex items-center justify-center" style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', border: '1px solid var(--border-default)', cursor: 'pointer', color: 'var(--text-strong)', flexShrink: 0 }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 4 }}>
            Solicitação de Operação
          </div>
          <h2 className="flex items-center" style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.01em', lineHeight: 1.2, gap: 8 }}>
            {s.id}
            <CopyButton value={s.id} />
            <span className="flex items-center" style={{ gap: 6, fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '5px 11px', borderRadius: '9999px', background: `color-mix(in srgb, ${cor} 14%, transparent)`, color: cor }}>
              <span style={{ width: 7, height: 7, borderRadius: '9999px', background: cor }} />
              {etapaLabel(s.etapa).toUpperCase()}
            </span>
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
            {s.cedente} · {s.tipoContrato} · {esteiraLabel(s.esteira)}
          </p>
        </div>

        {/* Ação primária + menu overflow */}
        <div className="flex items-center" style={{ gap: 10, flexShrink: 0 }}>
          <button
            className="flex items-center"
            style={{ gap: 8, height: 44, padding: '0 20px', background: 'var(--action-primary-bg)', color: 'var(--action-primary-text)', borderRadius: 'var(--radius-lg)', border: 'none', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', boxShadow: '0 10px 24px -10px rgba(8,60,74,0.45)', transition: 'background var(--duration-base)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--action-primary-bg-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--action-primary-bg)')}
          >
            ANÁLISE OPERAÇÕES
            <ChevronRight size={16} />
          </button>
          <ActionMenu onReject={() => setConfirmReject(true)} />
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center" style={{ gap: 4, padding: 4, background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <TabPill key={t.key} active={tab === t.key} onClick={() => setTab(t.key)} icon={t.icon}>
            {t.label}
          </TabPill>
        ))}
      </div>

      {/* ── Conteúdo ── */}
      <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', padding: 24 }}>
        {tab === 'gerais'     && <GeraisTab s={s} det={det} />}
        {tab === 'ativos'     && <AtivosTab det={det} />}
        {tab === 'garantias'  && <GarantiasTab det={det} />}
        {tab === 'validacoes' && <ValidacoesTab det={det} onOpenFullView={() => setSubView('validacoes-detalhe')} />}
        {tab === 'anexos'     && <AnexosTab det={det} />}
        {tab === 'ata'        && <AtaTab />}
        {tab === 'historico'  && <HistoricoTab det={det} />}
      </div>

      {confirmReject && (
        <RejectModal id={s.id} onClose={() => setConfirmReject(false)} />
      )}
    </div>
  );
}

/* ─── Action menu (overflow) ─────────────────────────────────────── */

function ActionMenu({ onReject }: { onReject: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const secondary = [
    { label: 'Transferir solicitação', icon: ArrowRightLeft },
    { label: 'Atualizar cessão', icon: RefreshCw },
    { label: 'Mesclar ativos entre pedidos', icon: Layers },
    { label: 'Transferir conta bancária', icon: Wallet },
  ];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Mais ações"
        className="flex items-center justify-center"
        style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', border: '1px solid var(--border-default)', cursor: 'pointer', color: 'var(--text-strong)' }}
      >
        <MoreVertical size={20} />
      </button>
      {open && (
        <div
          className="flex flex-col"
          style={{
            position: 'absolute', top: 52, right: 0, zIndex: 50, minWidth: 260,
            background: 'var(--surface-card)', border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 48px -16px rgba(8,60,74,0.28)',
            padding: 6,
          }}
        >
          {secondary.map((a) => (
            <button
              key={a.label}
              onClick={() => setOpen(false)}
              className="flex items-center"
              style={{ gap: 10, padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-default)', width: '100%', transition: 'background var(--duration-fast)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <a.icon size={16} style={{ color: 'var(--text-muted)' }} />
              {a.label}
            </button>
          ))}
          <div style={{ height: 1, background: 'var(--border-default)', margin: '6px 4px' }} />
          <button
            onClick={() => { setOpen(false); onReject(); }}
            className="flex items-center"
            style={{ gap: 10, padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--action-danger-text-only)', width: '100%', transition: 'background var(--duration-fast)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--status-danger-bg)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <XCircle size={16} />
            Rejeitar solicitação
          </button>
        </div>
      )}
    </div>
  );
}

function RejectModal({ id, onClose }: { id: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-center" style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440, background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)', boxShadow: '0 30px 60px -20px rgba(8,60,74,0.4)', padding: 28 }}>
        <div className="flex items-center justify-center" style={{ width: 52, height: 52, borderRadius: '9999px', background: 'var(--status-danger-bg)', color: 'var(--danger-base)', marginBottom: 18 }}>
          <AlertTriangle size={26} />
        </div>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', marginBottom: 8 }}>
          Rejeitar a solicitação {id}?
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 24 }}>
          Esta ação encerra o fluxo da operação e move a solicitação para a etapa <strong>Rejeitada</strong>. Você poderá consultá-la no histórico, mas não poderá retomá-la por aqui.
        </p>
        <div className="flex items-center justify-end" style={{ gap: 10 }}>
          <button onClick={onClose} style={{ height: 42, padding: '0 18px', background: 'var(--surface-card)', color: 'var(--text-strong)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)' }}>
            Cancelar
          </button>
          <button onClick={onClose} style={{ height: 42, padding: '0 18px', background: 'var(--action-danger-bg)', color: 'var(--action-danger-text)', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)' }}>
            Confirmar rejeição
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared helpers ─────────────────────────────────────────────── */

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(value).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      title={copied ? 'Copiado!' : 'Copiar'}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: copied ? 'var(--success-base)' : 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', borderRadius: 4, flexShrink: 0 }}
    >
      {copied ? <CheckIcon size={13} /> : <Copy size={13} />}
    </button>
  );
}

function TabPill({ active, onClick, icon: Icon, children }: { active: boolean; onClick: () => void; icon: typeof FileText; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex items-center" style={{ gap: 8, padding: '10px 14px', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-lg)', background: active ? 'var(--gci-base)' : 'transparent', color: active ? '#fff' : 'var(--text-muted)', transition: 'all var(--duration-base)' }}>
      <Icon size={14} />{children}
    </button>
  );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 16, gap: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase' }}>{title}</div>
        {action}
      </div>
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

function Card({ title, icon: Icon, children }: { title: string; icon: typeof FileText; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
      <div className="flex items-center" style={{ gap: 8, marginBottom: 16 }}>
        <Icon size={15} style={{ color: 'var(--gci-base)' }} />
        <span style={{ fontSize: 11, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', color: 'var(--text-strong)', textTransform: 'uppercase' }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ icon: Icon, title, hint }: { icon: typeof FolderOpen; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center" style={{ gap: 10, padding: '48px 24px', textAlign: 'center', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-default)' }}>
      <Icon size={30} strokeWidth={1.5} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-default)' }}>{title}</div>
      {hint && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', maxWidth: 360 }}>{hint}</div>}
    </div>
  );
}

function GhostButton({ icon: Icon, children }: { icon: typeof Plus; children: React.ReactNode }) {
  return (
    <button className="flex items-center" style={{ gap: 8, height: 38, padding: '0 16px', background: 'var(--surface-card)', color: 'var(--text-strong)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em' }}>
      <Icon size={15} />{children}
    </button>
  );
}

/* ─── Aba: Dados Gerais ──────────────────────────────────────────── */

const parteTone: Record<ParteTipo, { bg: string; fg: string }> = {
  AVA: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  ITA: { bg: 'var(--status-active-bg)', fg: '#2563EB' },
  SOC: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  REP: { bg: 'var(--warning-light)', fg: 'var(--warning-dark)' },
};
const PARTE_LEGENDA: Record<ParteTipo, string> = { AVA: 'Avalista', ITA: 'Interveniente', SOC: 'Sócio', REP: 'Representante' };

function GeraisTab({ s, det }: { s: Solicitacao; det: ReturnType<typeof detalheSolicitacao> }) {
  const d = display(s);
  return (
    <div className="flex flex-col" style={{ gap: 32 }}>
      {/* Valor em destaque */}
      <div className="flex items-center justify-between" style={{ gap: 16, flexWrap: 'wrap', background: 'var(--gci-base)', borderRadius: 'var(--radius-xl)', padding: '22px 26px', color: '#fff' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.18em', color: 'var(--agro-base)', textTransform: 'uppercase', marginBottom: 8 }}>
            Valor da Operação (Nominal)
          </div>
          <div style={{ fontSize: 32, fontWeight: 'var(--weight-bold)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
            {brl(s.valor)}
          </div>
        </div>
        <div className="flex items-center" style={{ gap: 28, flexWrap: 'wrap' }}>
          <HeroMeta label="Taxa" value={`${s.taxa.toFixed(2).replace('.', ',')}%`} />
          <HeroMeta label="FEE" value={`${d.fee}%`} />
          <HeroMeta label="Valor FEE" value={brl(d.valorFee)} />
        </div>
      </div>

      <Section title="Identificação">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          <Field label="Tipo de Operação" value={s.tipoContrato} />
          <Field label="Unidade de Negócio" value={d.unidadeNegocio} />
          <Field label="Veículo" value={s.veiculo || '—'} />
          <Field label="Grupo Empresarial" value={s.grupoEmpresarial} />
          <Field label="Documento" value={<span className="flex items-center" style={{ gap: 6 }}>{d.documento}<CopyButton value={d.documento} /></span>} />
          <Field label="Gerente" value={s.gerente} />
        </div>
      </Section>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card title="Dados Bancários" icon={Banknote}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            <Field label="Banco" value={d.banco} />
            <Field label="Agência" value={d.agencia} />
            <Field label="Conta" value={d.conta} />
          </div>
        </Card>
        <Card title="Configuração" icon={ArrowRightLeft}>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <Field label="Esteira" value={esteiraLabel(s.esteira)} />
            <Field label="Quitação de Vencidos" value={d.quitacaoVencidos ? 'Sim' : 'Não'} />
          </div>
        </Card>
      </div>

      <Section title="Condições Financeiras">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          <Field label="Tipo de Taxa" value={d.tipoTaxa} />
          <Field label="Frequência" value={d.frequencia} />
          <Field label="Taxa de Operação" value={`${s.taxa.toFixed(2).replace('.', ',')}%`} />
          <Field label="FEE" value={`${d.fee}%`} />
          <Field label="Valor FEE" value={brl(d.valorFee)} />
          <Field label="% Seguro Prestamista" value={`${d.percSeguro}%`} />
          <Field label="Valor Seguro Prestamista" value={brl(d.valorSeguro)} />
        </div>
      </Section>

      <Section title="Agrupamento de Limites">
        {det.limites.length === 0 ? (
          <EmptyState icon={Layers} title="Nenhum limite agrupado" hint="Os agrupamentos de limite aparecerão aqui quando vinculados a esta solicitação." />
        ) : null}
      </Section>

      <Section title="Partes Relacionadas">
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div className="grid" style={{ gridTemplateColumns: '1.6fr 1.1fr 1.4fr 1fr 0.9fr', padding: '12px 16px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            <div>Nome</div><div>Documento</div><div>E-mail</div><div>Telefone</div><div>Tipo</div>
          </div>
          {det.partes.map((p) => (
            <div key={p.documento} className="grid items-center" style={{ gridTemplateColumns: '1.6fr 1.1fr 1.4fr 1fr 0.9fr', padding: '12px 16px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }}>
              <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{p.nome}</div>
              <div style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{p.documento}</div>
              <div style={{ color: 'var(--text-default)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.email}</div>
              <div style={{ color: 'var(--text-default)', fontVariantNumeric: 'tabular-nums' }}>{p.telefone}</div>
              <div className="flex items-center" style={{ gap: 4, flexWrap: 'wrap' }}>
                {p.tipos.map((t) => (
                  <span key={t} title={PARTE_LEGENDA[t]} style={{ fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em', padding: '3px 7px', borderRadius: 'var(--radius-sm)', background: parteTone[t].bg, color: parteTone[t].fg }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center" style={{ gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
          {(Object.keys(PARTE_LEGENDA) as ParteTipo[]).map((t) => (
            <span key={t} className="flex items-center" style={{ gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: 9, fontWeight: 'var(--weight-bold)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', background: parteTone[t].bg, color: parteTone[t].fg }}>{t}</span>
              {PARTE_LEGENDA[t]}
            </span>
          ))}
        </div>
      </Section>
    </div>
  );
}

function HeroMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-bold)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

/* ─── Aba: Ativos ────────────────────────────────────────────────── */

function AtivosTab({ det }: { det: ReturnType<typeof detalheSolicitacao> }) {
  return (
    <Section title="Ativos Vinculados" action={<GhostButton icon={Plus}>Adicionar contrato</GhostButton>}>
      <div className="flex items-center" style={{ gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <FilterInput placeholder="Lastros" />
        <FilterInput placeholder="Número" />
        <FilterInput placeholder="Sacado" />
      </div>
      {det.ativos.length === 0 ? (
        <EmptyState icon={Boxes} title="Nenhum ativo vinculado" hint="Use “Adicionar contrato” para vincular lastros a esta solicitação. O valor total será calculado automaticamente." />
      ) : null}
      <div className="flex items-center justify-between" style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-default)' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Valor total</span>
        <span style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{brl(0)}</span>
      </div>
    </Section>
  );
}

function FilterInput({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative" style={{ flex: 1, minWidth: 160 }}>
      <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
      <input placeholder={placeholder} style={{ width: '100%', height: 40, paddingLeft: 36, paddingRight: 12, background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }} />
    </div>
  );
}

/* ─── Aba: Garantias ─────────────────────────────────────────────── */

function GarantiasTab({ det }: { det: ReturnType<typeof detalheSolicitacao> }) {
  return (
    <Section title="Garantias" action={<GhostButton icon={Plus}>Adicionar garantia</GhostButton>}>
      {det.garantias.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="Nenhuma garantia cadastrada" hint="Adicione garantias reais ou fidejussórias para fortalecer a operação." />
      ) : null}
    </Section>
  );
}

/* ─── Aba: Validações ────────────────────────────────────────────── */

const valTone: Record<ValidacaoStatus, { bg: string; fg: string; icon: typeof CheckCircle2 }> = {
  OK:     { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)', icon: CheckCircle2 },
  ALERTA: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)', icon: AlertCircle },
  ERRO:   { bg: 'var(--status-danger-bg)',  fg: 'var(--status-danger-text)',  icon: XCircle },
};

function ValidacoesTab({ det, onOpenFullView }: { det: ReturnType<typeof detalheSolicitacao>; onOpenFullView: () => void }) {
  const pendentes = det.validacoes.filter((v) => v.status !== 'OK');
  const ok = det.validacoes.filter((v) => v.status === 'OK');
  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      <div className="flex items-center justify-between" style={{ gap: 12, flexWrap: 'wrap' }}>
        <div className="flex items-center" style={{ gap: 8, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          <AlertCircle size={15} style={{ color: 'var(--text-muted)' }} />
          As validações só rodam quando a operação tiver título e veículo vinculado.
        </div>
        <div className="flex items-center" style={{ gap: 8 }}>
          <button
            onClick={onOpenFullView}
            className="flex items-center"
            style={{ gap: 6, height: 38, padding: '0 14px', background: 'none', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.04em', color: 'var(--text-strong)' }}
          >
            <CheckCircle2 size={14} /> Ver tela de validações
          </button>
          <GhostButton icon={RefreshCw}>Revalidar</GhostButton>
        </div>
      </div>

      {pendentes.length > 0 && (
        <Section title={`Pendentes (${pendentes.length})`}>
          <div className="flex flex-col" style={{ gap: 10 }}>
            {pendentes.map((v) => <ValidacaoRow key={v.titulo} v={v} />)}
          </div>
        </Section>
      )}
      {ok.length > 0 && (
        <Section title={`Aprovadas (${ok.length})`}>
          <div className="flex flex-col" style={{ gap: 10 }}>
            {ok.map((v) => <ValidacaoRow key={v.titulo} v={v} />)}
          </div>
        </Section>
      )}
    </div>
  );
}

function ValidacaoRow({ v }: { v: ItemValidacao }) {
  const tone = valTone[v.status];
  const Icon = tone.icon;
  return (
    <div style={{ borderRadius: 'var(--radius-lg)', border: `1px solid ${v.status === 'ERRO' ? 'var(--danger-light)' : 'var(--border-default)'}`, background: v.status === 'ERRO' ? 'var(--status-danger-bg)' : 'var(--surface-card)', padding: 16 }}>
      <div className="flex items-center justify-between" style={{ gap: 12 }}>
        <div className="flex items-center" style={{ gap: 12, minWidth: 0 }}>
          <span className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: tone.bg, color: tone.fg, flexShrink: 0 }}>
            <Icon size={17} />
          </span>
          <div style={{ minWidth: 0 }}>
            <div className="flex items-center" style={{ gap: 8 }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>{v.titulo}</span>
              <span style={{ fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em', padding: '2px 7px', borderRadius: 'var(--radius-sm)', background: 'var(--status-active-bg)', color: 'var(--gci-base)', textTransform: 'uppercase' }}>{v.area}</span>
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 3 }}>{v.descricao}</div>
          </div>
        </div>
        {v.exigeAutorizacao && (
          <div className="flex items-center" style={{ gap: 8, flexShrink: 0 }}>
            <GhostButton icon={Send}>Solicitar autorização</GhostButton>
            <button className="flex items-center" style={{ gap: 6, height: 38, padding: '0 16px', background: 'var(--action-primary-bg)', color: 'var(--action-primary-text)', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em' }}>
              <CheckCircle2 size={15} /> Autorizar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Aba: Anexos ────────────────────────────────────────────────── */

function AnexosTab({ det }: { det: ReturnType<typeof detalheSolicitacao> }) {
  return (
    <Section title="Documentos Anexados" action={<GhostButton icon={Download}>Baixar todos</GhostButton>}>
      {/* Linha de upload */}
      <div className="flex items-center" style={{ gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <div className="flex items-center" style={{ gap: 8, flex: 1, minWidth: 220, height: 42, padding: '0 14px', background: 'var(--surface-sunken)', border: '1px dashed var(--border-default)', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          <Paperclip size={15} /> Selecionar arquivo...
        </div>
        <div style={{ minWidth: 180, height: 42, padding: '0 14px', display: 'flex', alignItems: 'center', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Tipo</div>
        <button className="flex items-center" style={{ gap: 8, height: 42, padding: '0 18px', background: 'var(--action-primary-bg)', color: 'var(--action-primary-text)', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em' }}>
          <Plus size={15} /> Inserir
        </button>
      </div>

      <div className="flex flex-col" style={{ gap: 10 }}>
        {det.anexos.map((a) => (
          <div key={a.arquivo} className="flex items-center" style={{ gap: 14, padding: 14, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)' }}>
            <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--gci-light)', color: 'var(--gci-base)', flexShrink: 0 }}>
              <FileText size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="flex items-center" style={{ gap: 8 }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>{a.nome}</span>
                <span style={{ fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em', padding: '2px 7px', borderRadius: 'var(--radius-sm)', background: a.obrigatorio ? 'var(--status-warning-bg)' : 'var(--status-neutral-bg)', color: a.obrigatorio ? 'var(--status-warning-text)' : 'var(--status-neutral-text)', textTransform: 'uppercase' }}>
                  {a.obrigatorio ? 'Obrigatório' : 'Opcional'}
                </span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.arquivo}</div>
            </div>
            <button aria-label="Baixar" className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', border: '1px solid var(--border-default)', cursor: 'pointer', color: 'var(--gci-base)' }}>
              <Download size={15} />
            </button>
            <button aria-label="Excluir" className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', border: '1px solid var(--border-default)', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ─── Aba: Ata de Deliberação ────────────────────────────────────── */

function AtaTab() {
  return (
    <Section title="Ata de Deliberação">
      <div className="flex" style={{ gap: 14 }}>
        <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: '9999px', background: 'var(--gci-light)', color: 'var(--gci-base)', flexShrink: 0, fontWeight: 'var(--weight-bold)' }}>
          <User size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <textarea
            placeholder="Escreva uma mensagem para a ata de deliberação..."
            rows={3}
            style={{ width: '100%', padding: 14, background: 'var(--surface-sunken)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none', resize: 'vertical', fontSize: 'var(--text-sm)', color: 'var(--text-strong)', fontFamily: 'inherit' }}
          />
          <div className="flex items-center justify-between" style={{ marginTop: 12 }}>
            <button className="flex items-center" style={{ gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em' }}>
              <Paperclip size={15} /> ANEXAR
            </button>
            <button className="flex items-center" style={{ gap: 8, height: 40, padding: '0 18px', background: 'var(--action-primary-bg)', color: 'var(--action-primary-text)', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em' }}>
              <Send size={14} /> Postar
            </button>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 28 }}>
        <EmptyState icon={MessageSquare} title="Nenhuma mensagem ainda" hint="As deliberações e comentários do time aparecerão aqui em ordem cronológica." />
      </div>
    </Section>
  );
}

/* ─── Aba: Histórico ─────────────────────────────────────────────── */

function HistoricoTab({ det }: { det: ReturnType<typeof detalheSolicitacao> }) {
  return (
    <Section title="Linha do Tempo">
      <div className="flex flex-col" style={{ position: 'relative' }}>
        {det.historico.map((ev, i) => (
          <div key={i} className="flex items-start" style={{ gap: 16, padding: '12px 0', position: 'relative' }}>
            <div style={{ position: 'relative', width: 12 }}>
              <span style={{ display: 'block', width: 12, height: 12, borderRadius: '9999px', background: 'var(--gci-base)', marginTop: 4 }} />
              {i < det.historico.length - 1 && <span style={{ position: 'absolute', left: 5, top: 16, bottom: -12, width: 2, background: 'var(--border-default)' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>
                <strong>{ev.autor}</strong> {ev.acao}
              </div>
              <div className="flex items-center" style={{ gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                <Clock size={12} /> {ev.data}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ─── Tela dedicada de Validações ────────────────────────────────── */

function ValidacoesFullView({
  det,
  onBack,
  solicitacaoId,
}: {
  det: ReturnType<typeof detalheSolicitacao>;
  onBack: () => void;
  solicitacaoId: string;
}) {
  const erros   = det.validacoes.filter((v) => v.status === 'ERRO');
  const alertas = det.validacoes.filter((v) => v.status === 'ALERTA');
  const ok      = det.validacoes.filter((v) => v.status === 'OK');

  const kpis = [
    { label: 'Erros',     count: erros.length,   bg: 'var(--status-danger-bg)',  fg: 'var(--status-danger-text)',  icon: XCircle },
    { label: 'Alertas',   count: alertas.length, bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)', icon: AlertCircle },
    { label: 'Aprovadas', count: ok.length,      bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)', icon: CheckCircle2 },
  ];

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      {/* Header */}
      <div className="flex items-center" style={{ gap: 16 }}>
        <button onClick={onBack} aria-label="Voltar" className="flex items-center justify-center" style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', border: '1px solid var(--border-default)', cursor: 'pointer', color: 'var(--text-strong)', flexShrink: 0 }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 4 }}>
            {solicitacaoId} · Solicitação de Operação
          </div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            Validações
          </h2>
        </div>
        <GhostButton icon={RefreshCw}>Revalidar todas</GhostButton>
      </div>

      {/* KPI cards */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {kpis.map(({ label, count, bg, fg, icon: Icon }) => (
          <div key={label} className="flex items-center" style={{ gap: 16, padding: '20px 24px', background: bg, borderRadius: 'var(--radius-xl)' }}>
            <div className="flex items-center justify-center" style={{ width: 48, height: 48, borderRadius: '9999px', background: 'rgba(255,255,255,0.60)', color: fg, flexShrink: 0 }}>
              <Icon size={22} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: fg, textTransform: 'uppercase', marginBottom: 6, opacity: 0.8 }}>{label}</div>
              <div style={{ fontSize: 32, fontWeight: 'var(--weight-bold)', color: fg, lineHeight: 1 }}>{count}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Dica */}
      <div className="flex items-center" style={{ gap: 8, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', padding: '10px 14px', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)' }}>
        <AlertCircle size={14} />
        As validações só rodam quando a operação tiver título e veículo vinculado. Use "Revalidar todas" para atualizar.
      </div>

      {/* Listas por status */}
      <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', padding: 24 }}>
        <div className="flex flex-col" style={{ gap: 32 }}>
          {erros.length > 0 && (
            <Section title={`Erros (${erros.length})`}>
              <div className="flex flex-col" style={{ gap: 10 }}>
                {erros.map((v) => <ValidacaoRow key={v.titulo} v={v} />)}
              </div>
            </Section>
          )}
          {alertas.length > 0 && (
            <Section title={`Alertas (${alertas.length})`}>
              <div className="flex flex-col" style={{ gap: 10 }}>
                {alertas.map((v) => <ValidacaoRow key={v.titulo} v={v} />)}
              </div>
            </Section>
          )}
          {ok.length > 0 && (
            <Section title={`Aprovadas (${ok.length})`}>
              <div className="flex flex-col" style={{ gap: 10 }}>
                {ok.map((v) => <ValidacaoRow key={v.titulo} v={v} />)}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

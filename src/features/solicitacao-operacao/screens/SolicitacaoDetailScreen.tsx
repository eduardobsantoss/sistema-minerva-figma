import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, FileText, Boxes, ShieldCheck, CheckCircle2, Paperclip,
  MessageSquare, Activity, MoreVertical, ChevronRight, AlertTriangle,
  XCircle, ArrowRightLeft, RefreshCw, Layers, Wallet,
} from 'lucide-react';
import {
  etapaCor, etapaLabel, esteiraLabel, detalheSolicitacao,
  type Solicitacao,
} from '../data/operacaoData';
import { CopyButton, TabPill } from './detail-tabs/shared';
import { DadosGeraisTab } from './detail-tabs/DadosGeraisTab';
import { AtivosTab } from './detail-tabs/AtivosTab';
import { GarantiasTab } from './detail-tabs/GarantiasTab';
import { ValidacoesTab, ValidacoesFullView } from './detail-tabs/ValidacoesTab';
import { AnexosTab } from './detail-tabs/AnexosTab';
import { AtaTab } from './detail-tabs/AtaTab';
import { HistoricoTab } from './detail-tabs/HistoricoTab';
import { ParteRelacionadaModal } from '../components/modals/ParteRelacionadaModal';
import { AdicionarContratoModal } from '../components/modals/AdicionarContratoModal';

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

export function SolicitacaoDetailScreen({ solicitacao: s, onBack }: Props) {
  const [tab, setTab] = useState<Tab>('gerais');
  const [subView, setSubView] = useState<SubView>(null);
  const [confirmReject, setConfirmReject] = useState(false);
  const [det, setDet] = useState(() => detalheSolicitacao(s));
  const [showParteModal, setShowParteModal] = useState(false);
  const [showContratoModal, setShowContratoModal] = useState(false);
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
        {tab === 'gerais'     && <DadosGeraisTab s={s} det={det} onAddParte={() => setShowParteModal(true)} />}
        {tab === 'ativos'     && <AtivosTab det={det} onAddContrato={() => setShowContratoModal(true)} />}
        {tab === 'garantias'  && <GarantiasTab det={det} />}
        {tab === 'validacoes' && <ValidacoesTab det={det} onOpenFullView={() => setSubView('validacoes-detalhe')} />}
        {tab === 'anexos'     && <AnexosTab det={det} />}
        {tab === 'ata'        && <AtaTab />}
        {tab === 'historico'  && <HistoricoTab det={det} />}
      </div>

      {confirmReject && (
        <RejectModal id={s.id} onClose={() => setConfirmReject(false)} />
      )}

      {showParteModal && (
        <ParteRelacionadaModal
          onClose={() => setShowParteModal(false)}
          onCreate={(parte) => {
            setDet((prev) => ({ ...prev, partes: [...prev.partes, parte] }));
            setShowParteModal(false);
          }}
        />
      )}

      {showContratoModal && (
        <AdicionarContratoModal
          onClose={() => setShowContratoModal(false)}
          valorOperacao={s.valor}
          tipoCalculo={s.tipoTaxa ?? 'Pré-fixado'}
          onCreate={(ativo) => {
            setDet((prev) => ({ ...prev, ativos: [...prev.ativos, ativo] }));
            setShowContratoModal(false);
          }}
        />
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

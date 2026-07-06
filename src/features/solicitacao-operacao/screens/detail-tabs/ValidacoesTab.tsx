import {
  AlertCircle, CheckCircle2, XCircle, RefreshCw, Send, ArrowLeft,
} from 'lucide-react';
import { detalheSolicitacao, type ValidacaoStatus, type ItemValidacao } from '../../data/operacaoData';
import { Section, GhostButton } from './shared';

const valTone: Record<ValidacaoStatus, { bg: string; fg: string; icon: typeof CheckCircle2 }> = {
  OK:     { bg: 'var(--status-success-bg)', fg: 'var(--status-success-text)', icon: CheckCircle2 },
  ALERTA: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-text)', icon: AlertCircle },
  ERRO:   { bg: 'var(--status-danger-bg)',  fg: 'var(--status-danger-text)',  icon: XCircle },
};

export function ValidacoesTab({ det, onOpenFullView }: { det: ReturnType<typeof detalheSolicitacao>; onOpenFullView: () => void }) {
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

/* ─── Tela dedicada de Validações ────────────────────────────────── */

export function ValidacoesFullView({
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

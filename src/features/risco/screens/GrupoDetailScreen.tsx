import { useRef, useState, useEffect } from 'react';
import { ArrowLeft, MoreVertical, Settings2, Users, History, UserCog, BellRing, ShieldCheck } from 'lucide-react';
import { statusOperacaoColor, detalheGrupo, type GrupoEmpresarial } from '../data/riscoData';
import { TabPill } from './detail-tabs/shared';
import { ParametrizacoesTab } from './detail-tabs/ParametrizacoesTab';
import { CedentesTab } from './detail-tabs/CedentesTab';
import { HistoricoTab } from './detail-tabs/HistoricoTab';
import { TransferirGerenteModal } from '../components/modals/TransferirGerenteModal';
import { ConfigurarNotificacoesModal } from '../components/modals/ConfigurarNotificacoesModal';
import { HabilitarOperarModal } from '../components/modals/HabilitarOperarModal';

interface Props {
  grupo: GrupoEmpresarial;
  onBack: () => void;
}

type Tab = 'parametrizacoes' | 'cedentes' | 'historico';

const TABS: { key: Tab; label: string; icon: typeof Settings2 }[] = [
  { key: 'parametrizacoes', label: 'Parametrizações', icon: Settings2 },
  { key: 'cedentes', label: 'Cedentes', icon: Users },
  { key: 'historico', label: 'Histórico', icon: History },
];

export function GrupoDetailScreen({ grupo, onBack }: Props) {
  const [tab, setTab] = useState<Tab>('parametrizacoes');
  const [det, setDet] = useState(() => detalheGrupo(grupo));
  const cor = statusOperacaoColor(grupo.statusOperacao);

  const [transferindo, setTransferindo] = useState(false);
  const [configurandoNotif, setConfigurandoNotif] = useState(false);
  const [habilitando, setHabilitando] = useState(false);

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      {/* Header */}
      <div className="flex items-center" style={{ gap: 16 }}>
        <button onClick={onBack} aria-label="Voltar" className="flex items-center justify-center" style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', border: '1px solid var(--border-default)', cursor: 'pointer', color: 'var(--text-strong)', flexShrink: 0 }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 4 }}>
            Risco · Grupo Empresarial
          </div>
          <h2 className="flex items-center" style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.01em', lineHeight: 1.2, gap: 10 }}>
            {grupo.nome}
            <span className="flex items-center" style={{ gap: 6, fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '5px 11px', borderRadius: '9999px', background: `color-mix(in srgb, ${cor} 14%, transparent)`, color: cor }}>
              <span style={{ width: 7, height: 7, borderRadius: '9999px', background: cor }} />
              {grupo.statusOperacao.toUpperCase()}
            </span>
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
            {grupo.documento} · Gerente: {grupo.gerente}
          </p>
        </div>

        <ActionMenu
          onTransferir={() => setTransferindo(true)}
          onConfigurar={() => setConfigurandoNotif(true)}
          onHabilitar={() => setHabilitando(true)}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center" style={{ gap: 4, padding: 4, background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <TabPill key={t.key} active={tab === t.key} onClick={() => setTab(t.key)} icon={t.icon}>
            {t.label}
          </TabPill>
        ))}
      </div>

      {/* Conteúdo */}
      {tab === 'parametrizacoes' && (
        <ParametrizacoesTab data={det.parametrizacoes} onChange={(parametrizacoes) => setDet({ ...det, parametrizacoes })} />
      )}
      {tab === 'cedentes' && (
        <CedentesTab
          cedentes={det.cedentes}
          onUpdateCedente={(cedente) =>
            setDet({ ...det, cedentes: det.cedentes.map((c) => (c.id === cedente.id ? cedente : c)) })
          }
        />
      )}
      {tab === 'historico' && <HistoricoTab eventos={det.historico} />}

      {transferindo && (
        <TransferirGerenteModal grupoNome={grupo.nome} gerenteAtual={grupo.gerente} onClose={() => setTransferindo(false)} onConfirm={() => setTransferindo(false)} />
      )}
      {configurandoNotif && (
        <ConfigurarNotificacoesModal grupoNome={grupo.nome} onClose={() => setConfigurandoNotif(false)} onConfirm={() => setConfigurandoNotif(false)} />
      )}
      {habilitando && (
        <HabilitarOperarModal grupoNome={grupo.nome} onClose={() => setHabilitando(false)} onConfirm={() => setHabilitando(false)} />
      )}
    </div>
  );
}

function ActionMenu({ onTransferir, onConfigurar, onHabilitar }: { onTransferir: () => void; onConfigurar: () => void; onHabilitar: () => void }) {
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

  const actions = [
    { label: 'Transferir gerente', icon: UserCog, onClick: onTransferir },
    { label: 'Configurar notificações', icon: BellRing, onClick: onConfigurar },
    { label: 'Habilitar para operar', icon: ShieldCheck, onClick: onHabilitar },
  ];

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
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
          style={{ position: 'absolute', top: 52, right: 0, zIndex: 50, minWidth: 240, background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 6 }}
        >
          {actions.map((a) => (
            <button
              key={a.label}
              onClick={() => { setOpen(false); a.onClick(); }}
              className="flex items-center"
              style={{ gap: 10, padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-default)', width: '100%', transition: 'background var(--duration-fast)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <a.icon size={16} style={{ color: 'var(--text-muted)' }} />
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

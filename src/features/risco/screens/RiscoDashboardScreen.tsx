import { useMemo, useState } from 'react';
import {
  Search, Wallet, AlertOctagon, FileWarning, TrendingDown, ChevronRight,
  Clock, XCircle, Building2,
} from 'lucide-react';
import { GRUPOS_SEED, brl, statusOperacaoColor, parecerLabel, parecerColor } from '../data/riscoData';
import { GrupoDetailScreen } from './GrupoDetailScreen';

type Route = { level: 'dashboard' } | { level: 'detail'; grupoId: string };

export function RiscoDashboardScreen() {
  const [route, setRoute] = useState<Route>({ level: 'dashboard' });
  const [query, setQuery] = useState('');

  if (route.level === 'detail') {
    const grupo = GRUPOS_SEED.find((g) => g.id === route.grupoId);
    if (grupo) return <GrupoDetailScreen grupo={grupo} onBack={() => setRoute({ level: 'dashboard' })} />;
  }

  const openGrupo = (id: string) => setRoute({ level: 'detail', grupoId: id });

  const limiteTotal = GRUPOS_SEED.reduce((sum, g) => sum + g.limite, 0);
  const riscoTotal = GRUPOS_SEED.reduce((sum, g) => sum + g.riscoTotal, 0);
  const parecerVencidoCount = GRUPOS_SEED.filter((g) => g.parecerCredito === 'EXPIRADO').length;
  const recoverySpecialCount = GRUPOS_SEED.filter((g) => g.statusOperacao === 'Recovery' || g.statusOperacao === 'Special-Sit').length;

  const pareceresFila = GRUPOS_SEED
    .filter((g) => g.parecerCredito === 'EXPIRADO' || g.parecerCredito === 'EXPIRANDO')
    .sort((a, b) => (a.parecerCredito === 'EXPIRADO' ? -1 : 1) - (b.parecerCredito === 'EXPIRADO' ? -1 : 1));

  const recoveryFila = GRUPOS_SEED.filter((g) => g.statusOperacao === 'Recovery' || g.statusOperacao === 'Special-Sit');

  const prioridade = [...GRUPOS_SEED].sort((a, b) => b.riscoTotal - a.riscoTotal).slice(0, 5);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return GRUPOS_SEED.filter((g) => g.nome.toLowerCase().includes(q) || g.documento.includes(q)).slice(0, 6);
  }, [query]);

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      {/* Identificação + busca rápida */}
      <div className="flex items-start justify-between" style={{ gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--accent)', fontWeight: 'var(--weight-bold)', marginBottom: 6 }}>
            Risco
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Dashboard
          </h1>
        </div>

        <div style={{ position: 'relative', width: 320 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar grupo por nome ou documento"
            style={{ width: '100%', height: 42, padding: '0 14px 0 38px', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }}
          />
          {searchResults.length > 0 && (
            <div style={{ position: 'absolute', top: 46, left: 0, right: 0, zIndex: 40, background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
              {searchResults.map((g) => (
                <button
                  key={g.id}
                  onClick={() => { openGrupo(g.id); setQuery(''); }}
                  className="flex items-center justify-between"
                  style={{ width: '100%', padding: '10px 14px', background: 'none', border: 'none', borderTop: '1px solid var(--border-default)', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{g.nome}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{g.documento}</div>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        <KpiCard icon={Wallet} label="Limite Total" value={brl(limiteTotal, { compact: true })} tone="var(--gci-base)" />
        <KpiCard icon={TrendingDown} label="Risco Total" value={brl(riscoTotal, { compact: true })} tone="var(--agro-base)" />
        <KpiCard icon={FileWarning} label="Grupos com Parecer Vencido" value={String(parecerVencidoCount)} tone="var(--danger-base)" />
        <KpiCard icon={AlertOctagon} label="Grupos em Recovery/Special-Sit" value={String(recoverySpecialCount)} tone="var(--warning-base)" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        {/* Filas de ação */}
        <div className="flex flex-col" style={{ gap: 16 }}>
          <QueueCard title="Pareceres a vencer/vencidos" icon={FileWarning}>
            {pareceresFila.length === 0 ? (
              <EmptyQueue text="Nenhum parecer pendente de atenção." />
            ) : (
              pareceresFila.map((g) => (
                <QueueRow key={g.id} onClick={() => openGrupo(g.id)}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.nome}</div>
                    <div className="flex items-center" style={{ gap: 6, marginTop: 2, color: parecerColor(g.parecerCredito) }}>
                      {g.parecerCredito === 'EXPIRADO' ? <XCircle size={12} /> : <Clock size={12} />}
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)' }}>{parecerLabel(g.parecerCredito)}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </QueueRow>
              ))
            )}
          </QueueCard>

          <QueueCard title="Grupos em Recovery/Special-Sit" icon={AlertOctagon}>
            {recoveryFila.length === 0 ? (
              <EmptyQueue text="Nenhum grupo em recuperação ou situação especial." />
            ) : (
              recoveryFila.map((g) => (
                <QueueRow key={g.id} onClick={() => openGrupo(g.id)}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.nome}</div>
                    <span
                      className="flex items-center"
                      style={{ gap: 6, width: 'fit-content', fontSize: 10, fontWeight: 'var(--weight-bold)', padding: '2px 8px', borderRadius: '9999px', background: `color-mix(in srgb, ${statusOperacaoColor(g.statusOperacao)} 14%, transparent)`, color: statusOperacaoColor(g.statusOperacao), marginTop: 4 }}
                    >
                      {g.statusOperacao}
                    </span>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </QueueRow>
              ))
            )}
          </QueueCard>
        </div>

        {/* Lista de prioridade */}
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', background: 'var(--surface-card)', overflow: 'hidden' }}>
          <div className="flex items-center" style={{ gap: 10, padding: '16px 20px', borderBottom: '1px solid var(--border-default)' }}>
            <Building2 size={16} style={{ color: 'var(--text-muted)' }} />
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>Top grupos por risco</h3>
          </div>
          {prioridade.map((g, i) => (
            <QueueRow key={g.id} onClick={() => openGrupo(g.id)}>
              <div className="flex items-center" style={{ gap: 12, minWidth: 0 }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: 'var(--text-muted)', width: 16, flexShrink: 0 }}>{i + 1}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.nome}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                    Limite {brl(g.limite, { compact: true })}
                  </div>
                </div>
              </div>
              <div className="flex items-center" style={{ gap: 10, flexShrink: 0 }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--danger-base)', fontVariantNumeric: 'tabular-nums' }}>
                  {brl(g.riscoTotal, { compact: true })}
                </span>
                <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
            </QueueRow>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, tone }: { icon: typeof Wallet; label: string; value: string; tone: string }) {
  return (
    <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', background: 'var(--surface-card)', padding: 18 }}>
      <div className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', background: `color-mix(in srgb, ${tone} 14%, transparent)`, color: tone, marginBottom: 12 }}>
        <Icon size={17} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{value}</div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function QueueCard({ title, icon: Icon, children }: { title: string; icon: typeof FileWarning; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', background: 'var(--surface-card)', overflow: 'hidden' }}>
      <div className="flex items-center" style={{ gap: 10, padding: '16px 20px', borderBottom: '1px solid var(--border-default)' }}>
        <Icon size={16} style={{ color: 'var(--text-muted)' }} />
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function QueueRow({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between"
      style={{ width: '100%', padding: '14px 20px', background: 'none', border: 'none', borderTop: '1px solid var(--border-default)', cursor: 'pointer', textAlign: 'left' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </button>
  );
}

function EmptyQueue({ text }: { text: string }) {
  return <div style={{ padding: '24px 20px', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', textAlign: 'center' }}>{text}</div>;
}

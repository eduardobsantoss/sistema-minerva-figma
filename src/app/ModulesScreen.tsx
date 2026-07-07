import { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { ModuleCard, modules } from '@/features/dashboard';
import { FidcScreen } from '@/features/fidc';
import { CraScreen } from '@/features/cra';
import { CobrancaScreen } from '@/features/cobranca';
import { SolicitacaoScreen } from '@/features/solicitacao-operacao';
import { RatingsScreen, AgrupamentosScreen, GruposScreen, RelatoriosScreen, RiscoDashboardScreen } from '@/features/risco';

type View =
  | 'dashboard'
  | 'solicitacoes'
  | 'fidcs'
  | 'cras'
  | 'cobranca'
  | 'cobranca-notif'
  | 'risco-dashboard'
  | 'risco-grupos'
  | 'risco-ratings'
  | 'risco-agrupamentos'
  | 'risco-rel'
  | 'passivo'
  | 'colab'
  | 'rel'
  | 'conf';

const titleMap: Record<View, string> = {
  dashboard: 'Bem-vindo(a) ao Minerva Gestão',
  solicitacoes: 'Solicitação de Operação',
  fidcs: "Gestão de FIDC's",
  cras: "Gestão de CRA's",
  cobranca: 'Cobrança',
  'cobranca-notif': 'Notificações de Cobrança',
  'risco-dashboard': 'Risco',
  'risco-grupos': 'Grupos Empresariais',
  'risco-ratings': 'Cadastro de Rating',
  'risco-agrupamentos': 'Agrupamentos de Limite',
  'risco-rel': 'Relatórios de Risco',
  passivo: 'Passivo',
  colab: 'Colaboradores',
  rel: 'Relatórios',
  conf: 'Configurações',
};

const VALID_VIEWS = new Set<View>([
  'dashboard','solicitacoes','fidcs','cras','cobranca','cobranca-notif',
  'risco-dashboard','risco-grupos','risco-ratings','risco-agrupamentos','risco-rel',
  'passivo','colab','rel','conf',
]);

function getViewFromUrl(): View {
  const v = new URLSearchParams(window.location.search).get('view') as View;
  return VALID_VIEWS.has(v) ? v : 'dashboard';
}

const LAPTOP_BREAKPOINT = 1366;

export function ModulesScreen() {
  const [view, setView] = useState<View>(getViewFromUrl);
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= LAPTOP_BREAKPOINT);
  const [openMenu, setOpenMenu] = useState<string | null>(() => {
    const v = new URLSearchParams(window.location.search).get('view') ?? '';
    if (v.startsWith('cobranca')) return 'cobranca';
    if (v.startsWith('risco')) return 'risco';
    return null;
  });
  const userToggledSidebar = useRef(false);

  useEffect(() => {
    const handler = () => {
      const v = new URLSearchParams(window.location.search).get('view') as View;
      if (VALID_VIEWS.has(v)) setView(v);
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  // Responsividade: colapsa automaticamente o menu lateral em telas de notebook,
  // sem sobrescrever uma escolha manual do usuário.
  useEffect(() => {
    const handleResize = () => {
      if (userToggledSidebar.current) return;
      setCollapsed(window.innerWidth <= LAPTOP_BREAKPOINT);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigate = (key: string) => {
    setView(key as View);
  };

  const onToggleMenu = (key: string) =>
    setOpenMenu((prev) => (prev === key ? null : key));

  const handleToggleSidebar = () => {
    userToggledSidebar.current = true;
    setCollapsed((v) => !v);
  };

  const handleModuleClick = (title: string) => {
    if (title === 'Solicitação de Operação') {
      setView('solicitacoes');
    } else if (title === "FIDC's") {
      setView('fidcs');
    } else if (title === "CRA's") {
      setView('cras');
    } else if (title === 'Cobrança') {
      setView('cobranca-notif');
      setOpenMenu('cobranca');
    } else if (title === 'Risco') {
      setView('risco-grupos');
      setOpenMenu('risco');
    }
  };

  return (
    <div className="flex h-full w-full" style={{ background: 'var(--surface-page)' }}>
      <Sidebar
        active={view}
        onNavigate={handleNavigate}
        collapsed={collapsed}
        onToggle={handleToggleSidebar}
        openMenu={openMenu}
        onToggleMenu={onToggleMenu}
      />

      <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
        <Topbar title={titleMap[view]} />

        <main className="overflow-auto" style={{ flex: 1, padding: 'var(--main-padding)' }}>
          <div style={{ maxWidth: 1456, margin: '0 auto' }}>
            {view === 'dashboard' && <DashboardView onModuleClick={handleModuleClick} />}
            {view === 'solicitacoes' && <SolicitacaoScreen />}
            {view === 'fidcs' && <FidcScreen />}
            {view === 'cras' && <CraScreen />}
            {view === 'cobranca-notif' && <CobrancaScreen />}
            {view === 'risco-ratings' && <RatingsScreen />}
            {view === 'risco-agrupamentos' && <AgrupamentosScreen />}
            {view === 'risco-grupos' && <GruposScreen />}
            {view === 'risco-rel' && <RelatoriosScreen />}
            {view === 'risco-dashboard' && <RiscoDashboardScreen />}
            {view !== 'dashboard' && view !== 'solicitacoes' && view !== 'fidcs' && view !== 'cras' && view !== 'cobranca-notif' && view !== 'risco-ratings' && view !== 'risco-agrupamentos' && view !== 'risco-grupos' && view !== 'risco-rel' && view !== 'risco-dashboard' && (
              <Placeholder name={titleMap[view]} />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardView({ onModuleClick }: { onModuleClick: (title: string) => void }) {
  return (
    <>
      <div
        style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          color: 'var(--accent)',
          fontWeight: 'var(--weight-bold)',
          marginBottom: 12,
        }}
      >
        Visão Geral
      </div>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 'var(--weight-bold)',
          color: 'var(--text-strong)',
          letterSpacing: '-0.02em',
          marginBottom: 8,
        }}
      >
        Módulos do Sistema
      </h1>
      <p
        style={{
          fontSize: 'var(--text-base)',
          color: 'var(--text-muted)',
          marginBottom: 40,
        }}
      >
        Selecione um módulo para começar seu fluxo de trabalho.
      </p>

      <div
        className="grid"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(var(--dashboard-grid-min), 1fr))', gap: 24 }}
      >
        {modules.map((m) => (
          <div key={m.title} onClick={() => onModuleClick(m.title)}>
            <ModuleCard item={m} />
          </div>
        ))}
      </div>
    </>
  );
}

function Placeholder({ name }: { name: string }) {
  return (
    <div
      style={{
        padding: 60,
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)',
        background: 'var(--surface-card)',
        borderRadius: 'var(--radius-xl)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'var(--border-default)',
      }}
    >
      O módulo "{name}" será implementado em breve.
    </div>
  );
}

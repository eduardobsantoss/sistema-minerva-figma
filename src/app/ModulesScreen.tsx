import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { ModuleCard, modules } from '@/features/dashboard';
import { FidcScreen } from '@/features/fidc';
import { CraScreen } from '@/features/cra';
import { CobrancaScreen } from '@/features/cobranca';

type View =
  | 'dashboard'
  | 'fidcs'
  | 'fidcs-cedentes'
  | 'fidcs-notif'
  | 'fidcs-rel'
  | 'cras'
  | 'cras-cedentes'
  | 'cras-rel'
  | 'cobranca'
  | 'cobranca-notif'
  | 'passivo'
  | 'colab'
  | 'rel'
  | 'conf';

const titleMap: Record<View, string> = {
  dashboard: 'Bem-vindo(a) ao Minerva Gestão',
  fidcs: "Gestão de FIDC's",
  'fidcs-cedentes': 'Cedentes & Contrapartes',
  'fidcs-notif': "Notificações de FIDC's",
  'fidcs-rel': "Relatórios de FIDC's",
  cras: "Gestão de CRA's",
  'cras-cedentes': "Cedentes de CRA's",
  'cras-rel': "Relatórios de CRA's",
  cobranca: 'Cobrança',
  'cobranca-notif': 'Notificações de Cobrança',
  passivo: 'Passivo',
  colab: 'Colaboradores',
  rel: 'Relatórios',
  conf: 'Configurações',
};

const VALID_VIEWS = new Set<View>([
  'dashboard','fidcs','fidcs-cedentes','fidcs-notif','fidcs-rel',
  'cras','cras-cedentes','cras-rel','cobranca','cobranca-notif',
  'passivo','colab','rel','conf',
]);

function getViewFromUrl(): View {
  const v = new URLSearchParams(window.location.search).get('view') as View;
  return VALID_VIEWS.has(v) ? v : 'dashboard';
}

export function ModulesScreen() {
  const [view, setView] = useState<View>(getViewFromUrl);
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(() => {
    const v = new URLSearchParams(window.location.search).get('view') ?? '';
    if (v.startsWith('fidcs')) return 'fidcs';
    if (v.startsWith('cras')) return 'cras';
    if (v.startsWith('cobranca')) return 'cobranca';
    return 'fidcs';
  });

  useEffect(() => {
    const handler = () => {
      const v = new URLSearchParams(window.location.search).get('view') as View;
      if (VALID_VIEWS.has(v)) setView(v);
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const handleNavigate = (key: string) => {
    setView(key as View);
  };

  const onToggleMenu = (key: string) =>
    setOpenMenu((prev) => (prev === key ? null : key));

  const handleModuleClick = (title: string) => {
    if (title === "FIDC's") {
      setView('fidcs');
      setOpenMenu('fidcs');
    } else if (title === "CRA's") {
      setView('cras');
      setOpenMenu('cras');
    } else if (title === 'Cobrança') {
      setView('cobranca-notif');
      setOpenMenu('cobranca');
    }
  };

  return (
    <div className="flex h-full w-full" style={{ background: 'var(--surface-page)' }}>
      <Sidebar
        active={view}
        onNavigate={handleNavigate}
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        openMenu={openMenu}
        onToggleMenu={onToggleMenu}
      />

      <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
        <Topbar title={titleMap[view]} />

        <main className="overflow-auto" style={{ flex: 1, padding: 40 }}>
          <div style={{ maxWidth: 1456, margin: '0 auto' }}>
            {view === 'dashboard' && <DashboardView onModuleClick={handleModuleClick} />}
            {view === 'fidcs' && <FidcScreen />}
            {view === 'cras' && <CraScreen />}
            {view === 'cobranca-notif' && <CobrancaScreen />}
            {view !== 'dashboard' && view !== 'fidcs' && view !== 'cras' && view !== 'cobranca-notif' && (
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
        style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 24 }}
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

/**
 * Gera dissecção curada do shell (Login + Topbar + Sidebar + Home).
 * Preview vive em src/features/shell/; o MD/catalog embute o source canônico.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'src/features/configuracoes/disseccoes');

const COMPONENTS = [
  {
    section: 'Screens',
    id: 'screens__LoginScreen',
    name: 'LoginScreen',
    path: 'screens/LoginScreen.vue',
    sourceFile: 'src/features/auth/screens/LoginScreen.vue',
  },
  {
    section: 'Screens',
    id: 'screens__DashboardView',
    name: 'DashboardView',
    path: 'screens/DashboardView.vue',
    sourceFile: 'src/app/DashboardView.vue',
  },
  {
    section: 'Screens',
    id: 'screens__ErrorScreen',
    name: 'ErrorScreen',
    path: 'screens/ErrorScreen.vue',
    sourceFile: 'src/features/errors/screens/ErrorScreen.vue',
  },
  {
    section: 'Layout',
    id: 'components__Topbar',
    name: 'Topbar',
    path: 'components/Topbar.vue',
    sourceFile: 'src/components/layout/Topbar.vue',
  },
  {
    section: 'Layout',
    id: 'components__Sidebar',
    name: 'Sidebar',
    path: 'components/Sidebar.vue',
    sourceFile: 'src/components/layout/Sidebar.vue',
  },
  {
    section: 'Components',
    id: 'components__ModuleCard',
    name: 'ModuleCard',
    path: 'components/ModuleCard.vue',
    sourceFile: 'src/features/dashboard/components/ModuleCard.vue',
  },
  {
    section: 'Components',
    id: 'components__ToastCard',
    name: 'ToastCard',
    path: 'components/ToastCard.vue',
    sourceFile: 'src/components/feedback/ToastCard.vue',
  },
  {
    section: 'Components',
    id: 'components__ToastStack',
    name: 'ToastStack',
    path: 'components/ToastStack.vue',
    sourceFile: 'src/components/feedback/ToastStack.vue',
  },
  {
    section: 'Components',
    id: 'components__Alert',
    name: 'Alert',
    path: 'components/Alert.vue',
    sourceFile: 'src/components/feedback/Alert.vue',
  },
];

function readSource(relFromRoot) {
  const full = path.join(root, relFromRoot);
  return fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n').trimEnd();
}

const title = 'Login / Shell / Home';
const lines = [
  `# ${title}`,
  '',
  '> Shell global do Minerva: login, topbar, sidebar, home (DashboardView), ModuleCard, toasts, alerts e tela de erro.',
  '> Preview em `src/features/shell/`; source canônico nos caminhos originais.',
  '> Handoff: `docs/handoff/login-header-sidebar.md` · `docs/handoff/layout-shell.md`.',
  '',
];

/** @type {Map<string, { id: string; name: string; path: string; source: string }[]>} */
const bySection = new Map();

for (const c of COMPONENTS) {
  const source = readSource(c.sourceFile);
  if (!bySection.has(c.section)) bySection.set(c.section, []);
  bySection.get(c.section).push({
    id: c.id,
    name: c.name,
    path: c.path,
    source,
  });
}

for (const [sectionTitle, comps] of bySection) {
  lines.push(`## ${sectionTitle}`, '');
  for (const c of comps) {
    lines.push(`### ${c.name}`, '', '```vue', c.source, '```', '');
  }
}

const catalogSections = [...bySection.entries()].map(([sectionTitle, components]) => ({
  title: sectionTitle,
  components,
}));

fs.mkdirSync(outDir, { recursive: true });
const mdPath = path.join(outDir, 'shell.md');
const jsonPath = path.join(outDir, 'shell.catalog.json');
fs.writeFileSync(mdPath, lines.join('\n'), 'utf8');
fs.writeFileSync(
  jsonPath,
  JSON.stringify({ title, feature: 'shell', sections: catalogSections }, null, 2),
  'utf8',
);

const n = catalogSections.reduce((a, s) => a + s.components.length, 0);
console.log(`Wrote shell: ${n} components → ${jsonPath}`);

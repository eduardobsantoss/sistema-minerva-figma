/**
 * Gera src/features/configuracoes/disseccoes/solicitacao-operacao.md
 * a partir dos .vue da feature (imports + SFC + style como no fonte).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const feature = path.join(root, 'src/features/solicitacao-operacao');
const outDir = path.join(root, 'src/features/configuracoes/disseccoes');
const outFile = path.join(outDir, 'solicitacao-operacao.md');
const outCatalog = path.join(outDir, 'solicitacao-operacao.catalog.json');

/** @type {{ section: string; files: string[] }[]} */
const SECTIONS = [
  {
    section: 'Lista',
    files: [
      'screens/SolicitacaoScreen.vue',
      'screens/solicitacao-screen/SolicitacaoFiltersPanel.vue',
      'screens/solicitacao-screen/FilterSelect.vue',
      'components/SolicitacaoCard.vue',
      'components/SolicitacaoTable.vue',
      'components/SolicitacaoKanban.vue',
    ],
  },
  {
    section: 'Detalhe',
    files: [
      'screens/SolicitacaoDetailScreen.vue',
      'screens/solicitacao-detail/ActionMenu.vue',
      'screens/solicitacao-detail/RejectModal.vue',
    ],
  },
  {
    section: 'Detalhe / Dados Gerais',
    files: [
      'screens/detail-tabs/DadosGeraisTab.vue',
      'screens/detail-tabs/shared/Section.vue',
      'screens/detail-tabs/shared/Field.vue',
      'screens/detail-tabs/shared/Card.vue',
      'screens/detail-tabs/shared/EmptyState.vue',
      'screens/detail-tabs/shared/GhostButton.vue',
      'screens/detail-tabs/shared/CopyButton.vue',
    ],
  },
  {
    section: 'Detalhe / Ativos',
    files: [
      'screens/detail-tabs/AtivosTab.vue',
      'screens/detail-tabs/ativos/AtivosTable.vue',
    ],
  },
  {
    section: 'Detalhe / Ativo',
    files: [
      'screens/detail-tabs/ativo/AtivoDetailView.vue',
      'screens/detail-tabs/ativo/PessoaDetailTabs.vue',
      'screens/detail-tabs/ativo/pessoa/DadosSubTab.vue',
      'screens/detail-tabs/ativo/pessoa/EnderecosSubTab.vue',
      'screens/detail-tabs/ativo/pessoa/ContatosSubTab.vue',
      'screens/detail-tabs/ativo/pessoa/HistoricoSubTab.vue',
      'screens/detail-tabs/ativo/TituloTab.vue',
      'screens/detail-tabs/ativo/titulo/DetalhesTituloTab.vue',
      'screens/detail-tabs/ativo/titulo/PagamentosTituloTab.vue',
      'screens/detail-tabs/ativo/titulo/ConfirmacoesTituloTab.vue',
      'screens/detail-tabs/ativo/titulo/MovimentacoesTituloTab.vue',
      'screens/detail-tabs/ativo/titulo/AnexosTituloTab.vue',
      'screens/detail-tabs/ativo/titulo/ObservacoesCobrancaTab.vue',
      'screens/detail-tabs/ativo/titulo/DynamicPagamentoFormGrid.vue',
      'screens/detail-tabs/ativo/titulo/DynamicConfigGrid.vue',
      'screens/detail-tabs/ativo/titulo/Participant.vue',
    ],
  },
  {
    section: 'Detalhe / Parte relacionada',
    files: [
      'screens/detail-tabs/parte-relacionada/ParteRelacionadaDetailView.vue',
      'screens/detail-tabs/parte-relacionada/DynamicFieldGrid.vue',
    ],
  },
  {
    section: 'Detalhe / Garantias',
    files: ['screens/detail-tabs/GarantiasTab.vue'],
  },
  {
    section: 'Detalhe / Validações',
    files: [
      'screens/detail-tabs/ValidacoesTab/ValidacoesTab.vue',
      'screens/detail-tabs/ValidacoesTab/ValidacoesFullView.vue',
      'screens/detail-tabs/ValidacoesTab/ValidacaoRow.vue',
    ],
  },
  {
    section: 'Detalhe / Anexos · Ata · Histórico',
    files: [
      'screens/detail-tabs/AnexosTab.vue',
      'screens/detail-tabs/AtaTab.vue',
      'screens/detail-tabs/HistoricoTab.vue',
    ],
  },
  {
    section: 'Novo Pedido',
    files: [
      'components/NovoPedidoModal.vue',
      'components/novo-pedido/DadosGeraisStep.vue',
      'components/novo-pedido/AtivosDuplicataStep.vue',
      'components/novo-pedido/GarantiaStep.vue',
      'components/novo-pedido/AnexosStep.vue',
      'components/novo-pedido/FormField.vue',
      'components/novo-pedido/SelectField.vue',
      'components/novo-pedido/FieldLabel.vue',
      'components/novo-pedido/DataTable.vue',
      'components/novo-pedido/AddButton.vue',
      'components/novo-pedido/ToggleRow.vue',
      'components/novo-pedido/Switch.vue',
      'components/novo-pedido/IconAction.vue',
      'components/novo-pedido/SectionGroup.vue',
      'components/novo-pedido/BentoGrid.vue',
      'components/novo-pedido/BentoBox.vue',
      'components/novo-pedido/DocGroup.vue',
    ],
  },
  {
    section: 'Modais',
    files: [
      'components/MoverEtapaModal.vue',
      'components/modals/AdicionarContratoModal.vue',
      'components/modals/VincularAtivosModal.vue',
      'components/modals/CadastrarGarantiaModal.vue',
      'components/modals/ExcluirGarantiaModal.vue',
      'components/modals/ParteRelacionadaModal.vue',
      'components/modals/NovaContaBancariaModal.vue',
      'components/modals/InserirEvidenciaModal.vue',
      'components/modals/DetalheEvidenciaModal.vue',
      'components/modals/DetalheValidacaoModal.vue',
      'components/modals/GerarTermoCessaoModal.vue',
      'components/modals/GerarCnabModal.vue',
      'components/modals/AtualizarCessaoModal.vue',
      'components/modals/ProrrogarVencimentoModal.vue',
      'components/modals/ConfirmarTituloModal.vue',
      'components/modals/EditarValorOperacaoModal.vue',
      'components/modals/adicionar-contrato/FormField.vue',
      'components/modals/adicionar-contrato/SelectField.vue',
      'components/modals/adicionar-contrato/FieldLabel.vue',
      'components/modals/adicionar-contrato/ToggleRow.vue',
      'components/modals/adicionar-contrato/AddButton.vue',
      'components/modals/adicionar-contrato/EmptyState.vue',
      'components/modals/adicionar-contrato/BentoGrid.vue',
      'components/modals/adicionar-contrato/BentoBox.vue',
      'components/modals/adicionar-contrato/StepGrid.vue',
      'components/modals/parte-relacionada/FormField.vue',
      'components/modals/parte-relacionada/SelectField.vue',
      'components/modals/parte-relacionada/FieldLabel.vue',
      'components/modals/parte-relacionada/BentoGrid.vue',
      'components/modals/parte-relacionada/BentoBox.vue',
      'components/modals/minuta/MinutaWizard.vue',
      'components/modals/minuta/MinutaStepper.vue',
      'components/modals/minuta/EmissaoStep.vue',
      'components/modals/minuta/CredoraStep.vue',
      'components/modals/minuta/EmitenteStep.vue',
      'components/modals/minuta/EndossatarioStep.vue',
      'components/modals/minuta/AvalistaStep.vue',
      'components/modals/minuta/EscrituradorStep.vue',
      'components/modals/minuta/ProdutoStep.vue',
      'components/modals/minuta/TituloMinutaStep.vue',
      'components/modals/minuta/GarantiaMinutaStep.vue',
      'components/modals/minuta/InformacaoPagamentoStep.vue',
      'components/modals/minuta/CetStep.vue',
      'components/modals/minuta/BoletimSubscricaoStep.vue',
      'components/modals/minuta/SpouseFields.vue',
    ],
  },
  {
    section: 'Relatórios',
    files: ['screens/RelatorioPedidosScreen.vue'],
  },
  {
    section: 'Fundo Padrão',
    files: [
      'screens/FundoPadraoScreen.vue',
      'components/fundo-padrao/OperationFundRankList.vue',
      'components/fundo-padrao/OperationFundRankEditor.vue',
    ],
  },
  {
    section: 'Taxas dos Veículos',
    files: [
      'screens/TaxasVeiculosScreen.vue',
      'components/taxas-veiculos/VehicleRateDetailView.vue',
    ],
  },
  {
    section: 'Validações Config',
    files: [
      'screens/ValidacoesConfigScreen.vue',
      'components/validacoes-config/ValidationDetailView.vue',
    ],
  },
];

function walkVue(dir, base = '') {
  /** @type {string[]} */
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name).replace(/\\/g, '/');
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkVue(full, rel));
    else if (entry.isFile() && entry.name.endsWith('.vue')) out.push(rel);
  }
  return out;
}

function componentName(relPath) {
  return path.basename(relPath, '.vue');
}

function readVue(relPath) {
  const full = path.join(feature, relPath);
  if (!fs.existsSync(full)) {
    console.warn('MISSING:', relPath);
    return null;
  }
  return fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n').trimEnd();
}

const used = new Set();
const lines = ['# Solicitação de Operação', ''];
/** @type {{ title: string; components: { id: string; name: string; path: string; source: string }[] }[]} */
const catalogSections = [];

function pushComponent(sectionTitle, file, src) {
  const name = componentName(file);
  const id = file.replace(/\\/g, '/').replace(/\.vue$/, '').replace(/\//g, '__');
  lines.push(`### ${name}`, '');
  lines.push('```vue');
  lines.push(src);
  lines.push('```');
  lines.push('');
  let sec = catalogSections.find((s) => s.title === sectionTitle);
  if (!sec) {
    sec = { title: sectionTitle, components: [] };
    catalogSections.push(sec);
  }
  sec.components.push({ id, name, path: file.replace(/\\/g, '/'), source: src });
}

for (const { section, files } of SECTIONS) {
  lines.push(`## ${section}`, '');
  for (const file of files) {
    const src = readVue(file);
    if (src == null) continue;
    used.add(file.replace(/\\/g, '/'));
    pushComponent(section, file, src);
  }
}

const allVue = walkVue(feature).map((f) => f.replace(/\\/g, '/'));
const leftovers = allVue.filter((f) => !used.has(f)).sort();
if (leftovers.length) {
  lines.push('## Outros', '');
  for (const file of leftovers) {
    const src = readVue(file);
    if (src == null) continue;
    pushComponent('Outros', file, src);
  }
  console.log('Outros:', leftovers.length, leftovers.join(', '));
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, lines.join('\n'), 'utf8');
fs.writeFileSync(
  outCatalog,
  JSON.stringify(
    { title: 'Solicitação de Operação', feature: 'solicitacao-operacao', sections: catalogSections },
    null,
    2,
  ),
  'utf8',
);
const compCount = catalogSections.reduce((n, s) => n + s.components.length, 0);
console.log('Wrote', outFile);
console.log('Wrote', outCatalog);
console.log('Components:', compCount);
console.log('Bytes md:', fs.statSync(outFile).size);

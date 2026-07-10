# Handoff — Módulo CRA

> Fonte de verdade complementar: `guidelines/Guidelines.md` (design tokens e padrão estrutural de telas de detalhe). Este documento cobre **todo o módulo** em `src/features/cra/` — navegação interna, dados mockados, telas, modais e convenções de UI.

---

## 1. Onde fica e como o módulo é montado

### Entrada no app

O módulo é registrado em `src/features/cra/index.ts` e montado em `ModulesScreen.vue` quando `view === 'cras'` (sidebar: **CRA's**, título do topbar: *Gestão de CRA's*).

Não usa Vue Router — a navegação interna é um `ref<Route>` em `CraScreen.vue`.

### Hierarquia de telas

```
list          → CraListScreen          (grid de CRA's)
  └─ cra      → CraDetailScreen        (operações + títulos agregados)
       └─ operacao → CraOperacaoDetailScreen  (títulos da operação)
            └─ titulo → CraTitleDetailScreen   (7 abas do título)
```

### Árvore de pastas

```
src/features/cra/
├── index.ts
├── data/
│   └── craData.ts                    → tipos, seeds, brl/num, gruposEmpresariais
├── screens/
│   ├── CraScreen.vue                 → roteador interno + estado da lista
│   ├── CraListScreen.vue
│   ├── CraDetailScreen.vue
│   ├── CraOperacaoDetailScreen.vue
│   ├── CraTitleDetailScreen.vue
│   ├── cra-detail/                   → CraHero, TabBtn, OperacoesTable, TitulosTable, StatusKPI, ColPanel
│   └── cra-title-detail/           → 7 abas + TabPill, Field, Section, CopyButton...
└── components/
    ├── CraCard.vue                   → card da listagem
    ├── CreateCraModal.vue            → wizard 1 etapa (novo CRA)
    ├── CreateCraOperacaoModal.vue    → wizard 9 etapas (nova operação)
    ├── create-cra-modal/             → FormField, SelectField, StepGrid...
    └── create-cra-operacao-modal/    → ToggleRow, LimiteRow, DataTable, SectionGroup...
```

---

## 2. De onde vêm os dados

Hoje **tudo é mock** em `src/features/cra/data/craData.ts`. O estado mutável da lista vive em `CraScreen.vue` (`craList = ref(initialCras)`).

### Hierarquia de entidades

```
Cra
└── operacoes: CraOperacao[]
    └── titulos: CraTitulo[]
```

### a) `Cra` — listagem

```ts
interface Cra {
  id: string;
  nome: string;
  cnpj: string;
  cessionaria: string;
  status: 'EM ANDAMENTO' | 'ENCERRADO';
  tipo?: 'MONO CRA' | 'MULTI CRA';
  operacoes: CraOperacao[];
}
```

**Seeds:** 3 CRA's — `cra-semeagro` (2 operações), `cra-ceres-agro` (1), `cra-btg-agro` (1).

KPIs da listagem (`CraListScreen`) são **calculados** somando todas as operações de todos os CRA's (carteira, vencido, títulos).

### b) `CraOperacao` — detalhe da operação

Campos de KPI, emissão, prestador, custodiante e arrays de títulos. Cada operação tem 5 títulos gerados por `makeTitulos(prefix, operacaoId)`.

### c) `CraTitulo` — detalhe do título

Campos de listagem + fiscais (NFe, CFOP, série) + valores (aquisição, presente, aberto) + bloco `cessao` (cessionário, data, valor, status).

**Não há** função `detalheTitulo()` — abas como Pagamentos usam placeholder ou dados inline nos componentes filhos.

### d) `gruposEmpresariais`

Array auxiliar usado no modal **Nova Operação** (etapa Grupos) para seleção de grupos econômicos — 25 entradas mock.

### Helpers

- `brl(n, compact?)` — formatação BRL; compact usa K/M
- `num(n)` — separador de milhar pt-BR

---

## 3. Navegação e fluxos

### `CraScreen.vue` — roteador

```ts
type Route =
  | { level: 'list' }
  | { level: 'cra'; craId: string }
  | { level: 'operacao'; craId: string; operacaoId: string }
  | { level: 'titulo'; craId: string; operacaoId: string; tituloId: string };
```

| Evento | Origem | Destino |
|---|---|---|
| Clique no card | `CraListScreen` | `{ level: 'cra', craId }` |
| Voltar (CRA) | `CraDetailScreen` | `{ level: 'list' }` |
| Abrir operação | `OperacoesTable` / `CraDetailScreen` | `{ level: 'operacao', ... }` |
| Abrir título (CRA) | `TitulosTable` (aba títulos) | `{ level: 'titulo', ... }` |
| Abrir título (operação) | `CraOperacaoDetailScreen` | `{ level: 'titulo', ... }` |
| Voltar (operação) | `CraOperacaoDetailScreen` | `{ level: 'cra', craId }` |
| Voltar (título) | `CraTitleDetailScreen` | `{ level: 'operacao', ... }` |

### Criação (estado local)

| Ação | Modal | Resultado |
|---|---|---|
| Novo CRA | `CreateCraModal` | `buildCraFromForm()` → append em `craList` |
| Nova Operação | `CreateCraOperacaoModal` | `buildOperacaoFromForm()` → append em `cra.operacoes` |

Novos CRA's entram com `operacoes: []`, status `EM ANDAMENTO`, CNPJ/cessionária `—`.

---

## 4. Telas em detalhe

### 4.1 Listagem (`CraListScreen`)

- Barra de busca (nome, CNPJ, cessionária) + botão **Novo CRA**
- 4 KPIs: Total de Carteiras, Valor em Carteira, Valor Vencido, Total de Títulos
- Grid responsivo de `CraCard`

### 4.2 Card (`CraCard`)

- Badge CRA + tipo derivado (MONO se todas operações MONO, senão MULTI)
- Donut de concentração (partes relacionadas / novos sacados)
- KPIs: carteira, vencido, títulos
- Hover: elevação + borda teal

### 4.3 Detalhe do CRA (`CraDetailScreen`)

**Header:** botão voltar 48×48 + nome + subtítulo (cessionária · CNPJ).

**Hero (`CraHero`):** painel teal — *Valor Total de Emissão* (soma `valorEmissao` das operações).

**Carteira colapsável:** faixa verde com 5 `StatusKPI` (Pendente, Análise Documental, Rejeitado, Validado, Em Carteira) — quantidades derivadas dos status dos títulos.

**Painel Operações/Títulos:**
- Abas segmentadas: `VISUALIZAR OPERAÇÕES` | `VISUALIZAR TÍTULOS`
- Botão **NOVA OPERAÇÃO** (laranja)
- `ColPanel` para visibilidade de colunas (ícone Settings2)
- Busca só na aba títulos
- `OperacoesTable` ou `TitulosTable`
- Footer com contagem e badge "TODAS"

### 4.4 Detalhe da Operação (`CraOperacaoDetailScreen`)

- Eyebrow: nome do CRA
- 4 KPIs: Valor de Emissão, Carteira, Vencido, Títulos Ativos
- Tabela de títulos com painel de colunas (`Checkbox` padrão em `ColPanel` inline)
- Colunas: Classe, Nº Título, Tipo, Cedente, Sacado, Vencimento, VR. Nominal, Status
- Clique na linha → detalhe do título

### 4.5 Detalhe do Título (`CraTitleDetailScreen`)

**Hero valor:** painel teal com VR. Nominal.

**Abas (`TabPill` em faixa pill):**

| Aba | Componente | Estado |
|---|---|---|
| Detalhes | `DetailsTab` | fiscal + cedente/sacado + cessão |
| Anexos | `AnexosTab` | mock |
| Accrual | `AccrualTab` | mock |
| Pagamentos | `PagamentosTab` | **placeholder** ("indisponível") |
| Confirmações | `ConfirmacoesTab` | mock |
| Movimentações | `MovimentacoesTab` | mock |
| Histórico | `MovimentoTab` | mock |

Badge de status no header (CONFIRMADO / PENDENTE / VENCIDO) com cores semânticas.

---

## 5. Modais

### `CreateCraModal` — 1 etapa

Campos: `tipoOperacao`, `tipoOperacaoCra`, `numeroEmissao`, `nomeFantasia`.

Emite `create: [NewCraData]` → `CraScreen` monta o CRA.

### `CreateCraOperacaoModal` — 9 etapas

| # | key | Conteúdo principal |
|---|---|---|
| 1 | `info` | Cadastrais (tipo cliente, emissão, prestador, custodiante...) |
| 2 | `veiculo` | 7 toggles (`ToggleRow`) de validações do veículo |
| 3 | `config` | Datas, valor emissão, taxas |
| 4 | `limites` | 4 sub-abas: concentração, totalizadores, top cedente, top sacado |
| 5 | `cobranca` | Carteira de cobrança (banco, CNAB, taxas) |
| 6 | `registro` | Registradora + API |
| 7 | `pdd` | Parametrização PDD |
| 8 | `grupos` | Busca + seleção em `gruposEmpresariais` |
| 9 | `resumo` | Resumo read-only |

> Etapa **Ativos** (`ativos`) existe comentada no código — visual preservado para reuso futuro.

Reutiliza `gruposEmpresariais` de `craData.ts` e `Checkbox` padrão na etapa grupos.

---

## 6. Componentes compartilhados do módulo

Cada feature mantém cópias locais de formulário (não usa `risco/screens/detail-tabs/shared/`):

| Pasta | Uso |
|---|---|
| `create-cra-modal/` | Wizard novo CRA |
| `create-cra-operacao-modal/` | Wizard nova operação |
| `cra-detail/` | Tabelas, hero, KPIs, colunas |
| `cra-title-detail/` | Abas do título |

**Checkbox global:** `src/components/ui/Checkbox.vue` — usado em `CraOperacaoDetailScreen` (painel de colunas).

---

## 7. Tipografia e espaçamento

Mesmos tokens de `src/styles/theme.css`.

| Contexto | Valor típico |
|---|---|
| Título de tela (CRA/operação/título) | `--text-xl` (20px), bold |
| Eyebrow breadcrumb | `10px`, `letter-spacing: 0.18em`, uppercase, `--agro-base` |
| Hero valor (emissão / nominal) | `36px`, bold, `tabular-nums` |
| KPI label | `10px`, uppercase, `letter-spacing: 0.14em` |
| Cabeçalho de tabela | `10px`, uppercase |
| Gap entre blocos | `24px` |
| Botão primário "Nova Operação" | padding `10px 18px`, `--agro-base`, sombra laranja |
| Botão voltar | `48×48`, card com borda |

Números monetários: sempre `font-variant-numeric: tabular-nums` + `brl()`.

Badges de status de título: fundo semântico light + texto dark/base.

---

## 8. O que ainda é mock / fora de escopo

- Nenhuma chamada HTTP;
- Filtros (ícone Filter) sem lógica;
- Aba Pagamentos do título CRA é placeholder (FIDC já tem implementação completa);
- `CreateCraOperacaoModal` não popula títulos na operação criada;
- Anexos, accrual, confirmações, movimentações e histórico são visuais;
- Status "Análise Documental" no painel carteira sempre 0;
- Coluna "Classe" na operação é fixa `'1'` para todos os títulos.

---

## 9. Checklist para evoluir o módulo

1. **Tipos primeiro** — estender `craData.ts` (interfaces + seeds + `makeTitulos`).
2. **Roteador** — novos níveis de tela → estender `Route` em `CraScreen.vue`.
3. **Listagem vs. detalhe** — KPIs do card derivam de `operacoes`; não duplicar totais no `Cra`.
4. **Pagamentos** — portar padrão do FIDC (`detalhePagamentos` + `PagamentosTab` com `v-model:det`).
5. **Wizard** — ao reativar etapa Ativos, descomentar entrada em `steps` e bloco no template.
6. **API futura** — `craList` vira fetch; manter props `cra`, `operacao`, `titulo` nas telas filhas.

---

## 10. Referências rápidas de arquivos

| Arquivo | Conteúdo |
|---|---|
| `src/features/cra/screens/CraScreen.vue` | Roteador + CRUD local |
| `src/features/cra/data/craData.ts` | Seeds, tipos, helpers |
| `src/features/cra/screens/CraListScreen.vue` | Listagem + KPIs |
| `src/features/cra/screens/CraDetailScreen.vue` | Operações/títulos agregados |
| `src/features/cra/screens/CraOperacaoDetailScreen.vue` | Títulos da operação |
| `src/features/cra/screens/CraTitleDetailScreen.vue` | 7 abas do título |
| `src/features/cra/components/CreateCraOperacaoModal.vue` | Wizard nova operação |
| `docs/handoff/layout-shell.md` | Sidebar, topbar, dashboard |
| `docs/handoff/fidc.md` | Módulo irmão (estrutura paralela) |

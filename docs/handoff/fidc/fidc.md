# Handoff — Módulo FIDC

> Fonte de verdade complementar: `guidelines/Guidelines.md` (design tokens e padrão estrutural de telas de detalhe). Este documento cobre **todo o módulo** em `src/features/fidc/` — navegação interna, dados mockados, telas, modais (incluindo Pagamentos) e convenções de UI.

---

## 1. Onde fica e como o módulo é montado

### Entrada no app

O módulo é registrado em `src/features/fidc/index.ts` e montado em `ModulesScreen.vue` quando `view === 'fidcs'` (sidebar: **FIDC's**, título do topbar: *Gestão de FIDC's*).

Não usa Vue Router — a navegação interna é um `ref<Route>` em `FidcScreen.vue`.

### Hierarquia de telas

```
list          → FidcListScreen          (grid de fundos)
  └─ fidc     → FidcDetailScreen        (classes + títulos agregados)
       └─ class → ClassDetailScreen     (KPIs da classe + títulos)
            └─ title → TitleDetailScreen (7 abas do título)
```

### Árvore de pastas

```
src/features/fidc/
├── index.ts
├── data/
│   └── fidcsData.ts                  → tipos, seeds, detalhePagamentos(), brl/num
├── screens/
│   ├── FidcScreen.vue                → roteador interno + estado da lista
│   ├── FidcListScreen.vue
│   ├── FidcDetailScreen.vue
│   ├── ClassDetailScreen.vue
│   ├── TitleDetailScreen.vue
│   ├── fidc-detail/                  → TabBtn, ClassesTable, FidcColPanel, SubKPI
│   ├── class-detail/                 → ClassKPI
│   ├── title-detail/                 → 7 abas + TabPill, Field, Section...
│   └── detail-tabs/
│       └── PagamentosTab.vue         → aba pagamentos (completa)
│           └── pagamentos/           → FormField, ToggleRow, HeaderStat...
└── components/
    ├── FidcCard.vue
    ├── TitlesTable.vue               → tabela reutilizada (fidc + class)
    ├── PLHero.vue                    → painel PL + PLAuditModal
    ├── CreateFidcModal.vue           → wizard 2 etapas (novo fundo)
    ├── CreateClassModal.vue          → wizard 10 etapas (nova classe)
    ├── create-fidc/ / create-class/  → primitives de formulário
    └── modals/
        ├── SimularValorizacaoModal.vue
        ├── EditarParcelasModal.vue
        └── EstornoPagamentoModal.vue
```

---

## 2. De onde vêm os dados

Hoje **tudo é mock** em `src/features/fidc/data/fidcsData.ts`. O estado mutável da lista vive em `FidcScreen.vue` (`fidcList = ref(initialFidcs)`).

### Hierarquia de entidades

```
Fidc
└── classes: FidcClass[]
    └── titulos: Title[]
```

### a) `Fidc` — listagem e detalhe do fundo

```ts
interface Fidc {
  id: string;
  name: string;
  cnpj: string;
  category: 'MONOCLASSE' | 'MULTICLASSE';
  status: 'EM ANDAMENTO';
  carteira: { valor: number; titulos: number };
  vencido: { valor: number; titulos: number };
  vencendoHoje: number;
  vencendoMes: number;
  confirmacaoPct: number;
  pl: number;
  plRef: string;           // ex. '20/03/2025'
  plRefAgo: string;         // ex. '11 meses atrás'
  carteiraSummaryTitles: number;
  classes: FidcClass[];
}
```

**Seeds:** 3 fundos — `agro25` (sem classes), `ti-tec` (MULTICLASSE, 2 classes, 5 títulos), `ceres-btg` (MONOCLASSE, sem classes).

### b) `FidcClass` — detalhe da classe

Valores nominais/aberto/presente/vencido + array de títulos. Usado em `ClassDetailScreen` e como contexto no detalhe do título.

### c) `Title` — listagem e detalhe do título

```ts
interface Title {
  id: string;
  numero: string;
  lastro: 'NFE' | 'DM' | 'CPR_F' | 'NC' | 'CTE' | 'CH' | 'DS';
  cedente: string; cedenteCnpj: string;
  sacado: string; sacadoCnpj: string;
  emissao: string; vencimento: string;  // formato dd/mm/aaaa nos seeds
  vrNominal: number;
  status: 'CONFIRMADO' | 'PENDENTE' | 'VENCIDO';
  classId: string;
}
```

### d) `DetalhePagamentos` — dados ricos só na aba Pagamentos

Partes de pagamento/cronograma **não existem** em `Title`. São derivados na hora:

```ts
// TitleDetailScreen.vue
const det = ref(detalhePagamentos(props.title));
```

```ts
// fidcsData.ts
export function detalhePagamentos(title: Title): DetalhePagamentos {
  // gera cronograma de 5 parcelas a partir de vrNominal e datas do título
  return { jurosRemuneratorioAberto, configuracao, pagamentos: [], cronograma };
}
```

`det` é reativo e mutado em `PagamentosTab` (novos pagamentos, estorno, edição de parcelas).

### Helpers

- `brl(n, { compact? })` — formatação BRL
- `num(n)` — separador de milhar pt-BR
- `TIPO_PAGAMENTO_OPTS` — 10 tipos de baixa/pagamento

---

## 3. Navegação e fluxos

### `FidcScreen.vue` — roteador

```ts
type Route =
  | { level: 'list' }
  | { level: 'fidc'; fidcId: string }
  | { level: 'class'; fidcId: string; classId: string }
  | { level: 'title'; fidcId: string; classId: string; titleId: string };
```

| Evento | Origem | Destino |
|---|---|---|
| Clique no card | `FidcListScreen` | `{ level: 'fidc', fidcId }` |
| Voltar (fundo) | `FidcDetailScreen` | `{ level: 'list' }` |
| Abrir classe | `ClassesTable` | `{ level: 'class', ... }` |
| Abrir título (fundo) | `TitlesTable` (aba títulos) | `{ level: 'title', ... }` |
| Abrir título (classe) | `ClassDetailScreen` | `{ level: 'title', ... }` |
| Voltar (classe) | `ClassDetailScreen` | `{ level: 'fidc', fidcId }` |
| Voltar (título) | `TitleDetailScreen` | `{ level: 'class', ... }` |

### Criação (estado local)

| Ação | Modal | Resultado |
|---|---|---|
| Novo FIDC | `CreateFidcModal` | `buildFidcFromForm()` → append em `fidcList` |
| Nova Classe | `CreateClassModal` | `buildClassFromForm()` → append em `fidc.classes` |

Novos FIDCs entram com `classes: []`, métricas zeradas, `category: 'MULTICLASSE'`.

---

## 4. Telas em detalhe

### 4.1 Listagem (`FidcListScreen`)

- Busca por nome/CNPJ + botão **Novo FIDC**
- 4 KPIs no topo — **valores hardcoded** (`'3'`, `'R$ 552,1M'`, etc.), não calculados dos seeds
- Grid de `FidcCard`

### 4.2 Card (`FidcCard`)

- Badge FIDC + categoria (MONOCLASSE laranja / MULTICLASSE teal)
- Status `EM ANDAMENTO`
- KPIs: PL, carteira, vencido, confirmação %
- Hover: elevação + borda laranja

### 4.3 Detalhe do FIDC (`FidcDetailScreen`)

**Header:** voltar + nome do fundo + CNPJ.

**`PLHero`:** painel teal clicável — exibe PL, data de referência; abre `PLAuditModal` ao clicar.

**Carteira colapsável:** faixa verde com `SubKPI` (vencendo hoje, vencendo no mês, confirmação %, carteira, vencido).

**Painel Classes/Títulos:**
- Visível sobretudo em `MULTICLASSE` (`isMulticlasse`)
- Abas: `VISUALIZAR CLASSES` | `VISUALIZAR TÍTULOS`
- Botão **NOVA CLASSE**
- `FidcColPanel` para colunas
- `ClassesTable` ou `TitlesTable`
- Busca na aba títulos

### 4.4 Detalhe da Classe (`ClassDetailScreen`)

- Breadcrumb: nome do FIDC (eyebrow) + nome da classe
- `PLHero` repetido (contexto do fundo)
- 4 `ClassKPI`: Valor Nominal, Em Aberto, Presente, Vencido
- Tabela de títulos (`TitlesTable`) com busca

### 4.5 Detalhe do Título (`TitleDetailScreen`)

**Hero valor:** painel teal com VR. Nominal + lastro/datas.

**Abas (`TabPill`):**

| Aba | Componente | Estado |
|---|---|---|
| Detalhes | `DetailsTab` | cedente/sacado + metadados |
| Anexos | `AnexosTab` | mock |
| Accrual | `AccrualTab` | mock |
| Pagamentos | `PagamentosTab` | **implementação completa** (`v-model:det`) |
| Confirmações | `ConfirmacoesTab` | mock |
| Movimentações | `MovimentacoesTab` | mock |
| Histórico | `MovimentoTab` | mock |

---

## 5. Aba Pagamentos (`PagamentosTab.vue`)

Referência para replicar em CRA ou Solicitação/Ativos.

### Seções

1. **Header stats** — total pago, juros em aberto, parcelas do cronograma
2. **Configuração do título** — collapsible (`configOpen`): tipo cálculo, taxa, fluxos
3. **Cronograma** — tabela de parcelas com status (`PAGO`, `PAGO_PARCIAL_VENCIDO`, `DESCONHECIDO`); botão editar → `EditarParcelasModal`
4. **Registrar pagamento** — formulário com `FormField`, `SelectField`, `ToggleRow` (transferência parcial)
5. **Lista de pagamentos** — histórico com estorno → `EstornoPagamentoModal`
6. **Ações** — simular valorização → `SimularValorizacaoModal`

### Estado

- Recebe `title` + `v-model:det` (`DetalhePagamentos`)
- `handleSalvar` prepend pagamento em `det.pagamentos`
- `handleConfirmEstorno` marca `estornado` + justificativa
- `handleUpdateCronograma` substitui `det.cronograma`

### Modais auxiliares

| Modal | Função |
|---|---|
| `SimularValorizacaoModal` | Simulação visual de valorização |
| `EditarParcelasModal` | Edição inline de parcelas (`EditableCell`) |
| `EstornoPagamentoModal` | Justificativa de estorno |
| `PLAuditModal` | Histórico de PL (via `PLHero`) |

---

## 6. Modais de cadastro

### `CreateFidcModal` — 2 etapas (+ classe se Mono)

| key | Conteúdo |
|---|---|
| `info` | Tipo de Fundo (MULTICLASSE/MONOCLASSE), CNPJ do Veículo, Tipo de Empresa, Razão Social, Nome Fantasia, Data de Constituição, Natureza Legal, Atividade Principal, Categoria CVM |
| `contato` | Email, telefone, endereço, UF |

- **MULTICLASSE:** finaliza após `contato` → só cria o fundo (`classes: []`).
- **MONOCLASSE:** após `contato`, embute `CreateClassModal` (`naked`) no mesmo overlay → ao finalizar, emite `NewFidcData` com `classData` → `buildFidcFromForm` monta o fundo já com **1 classe**.

Emite `create: [NewFidcData]` → `FidcScreen.buildFidcFromForm()` (`category` a partir de `tipoFundo`; classe via `buildClassFromForm` quando Mono).

### `CreateClassModal` — 10 etapas

| # | key | Conteúdo |
|---|---|---|
| 1 | `info` | Identificação da classe |
| 2 | `contato` | Endereçamento |
| 3 | `partic` | Participantes/prestadores |
| 4 | `limites` | Concentração e limites |
| 5 | `grupos` | Grupos econômicos |
| 6 | `banco` | Domicílio bancário |
| 7 | `registro` | Registradoras |
| 8 | `pdd` | Provisão PDD |
| 9 | `resumo` | Resumo read-only |

> Etapa **Ativos** comentada (mesmo padrão do CRA).

Props: `naked` (sem overlay, para embutir no Novo FIDC Mono), `title`. Emite `create: [NewClassData]` (também no fluxo standalone “Nova Classe” no detalhe).

---

## 7. Componentes compartilhados do módulo

| Componente | Papel |
|---|---|
| `TitlesTable.vue` | Tabela de títulos (fundo + classe) |
| `PLHero.vue` | Painel PL + modal de auditoria |
| `FidcColPanel.vue` | Visibilidade de colunas |
| `detail-tabs/pagamentos/*` | Primitivos da aba Pagamentos |
| `create-class/*`, `create-fidc/*` | Wizards |

**Checkbox global:** `src/components/ui/Checkbox.vue` — usado em `FidcColPanel.vue`.

---

## 8. Tipografia e espaçamento

Mesmos tokens de `src/styles/theme.css`.

| Contexto | Valor típico |
|---|---|
| Título de tela | `--text-xl`, bold |
| Eyebrow breadcrumb | `10px`, `letter-spacing: 0.18em`, `--agro-base` |
| Hero PL / valor nominal | `36px`, bold, `tabular-nums` |
| KPI label | `10px`, uppercase |
| Gap entre blocos | `24px` |
| Botão "Nova Classe" | `--agro-base`, sombra laranja |
| Painel carteira (header) | fundo `--success-base`, texto branco |

Números: `brl()` + `tabular-nums`. Datas nos seeds em `dd/mm/aaaa` (atenção ao parse em `detalhePagamentos`).

---

## 9. Paralelo com CRA

| Conceito CRA | Equivalente FIDC |
|---|---|
| `Cra` | `Fidc` |
| `CraOperacao` | `FidcClass` |
| `CraTitulo` | `Title` |
| `CraHero` (emissão) | `PLHero` (PL) |
| `CreateCraOperacaoModal` | `CreateClassModal` |
| Pagamentos placeholder | `PagamentosTab` + `detalhePagamentos()` |

---

## 10. O que ainda é mock / fora de escopo

- Nenhuma chamada HTTP;
- KPIs da listagem FIDC hardcoded;
- Filtros sem lógica;
- Anexos, accrual, confirmações, movimentações e histórico são visuais;
- `detalhePagamentos` gera cronograma sintético (5 parcelas) — não reflete API real;
- Fundos MONOCLASSE sem classes mostram painel de classes vazio.

---

## 11. Checklist para evoluir o módulo

1. **Tipos primeiro** — `fidcsData.ts` antes de novos campos.
2. **Listagem vs. detalhe** — métricas do card vêm do `Fidc`; títulos aninhados em `classes`.
3. **Pagamentos** — manter `det` separado via `detalhePagamentos()`; aba já usa `v-model:det`.
4. **Nova classe** — já grava via `buildClassFromForm` (standalone e Mono no Novo FIDC).
5. **KPIs listagem** — calcular a partir de `fidcList` (como CRA faz).
6. **Replicar Pagamentos** — usar este módulo como referência para CRA/Solicitação.
7. **API futura** — substituir seeds; manter props `fidc`, `klass`, `title`, `det`.

---

## 12. Referências rápidas de arquivos

| Arquivo | Conteúdo |
|---|---|
| `src/features/fidc/screens/FidcScreen.vue` | Roteador + CRUD local (só FIDC) |
| `src/features/fidc/data/fidcsData.ts` | Seeds, `detalhePagamentos`, tipos |
| `src/features/fidc/screens/FidcDetailScreen.vue` | Classes/títulos agregados |
| `src/features/fidc/screens/ClassDetailScreen.vue` | KPIs + títulos da classe |
| `src/features/fidc/screens/TitleDetailScreen.vue` | 7 abas + `det` pagamentos |
| `src/features/fidc/screens/detail-tabs/PagamentosTab.vue` | Fluxo completo de pagamentos |
| `src/features/fidc/components/CreateClassModal.vue` | Wizard nova classe |
| `src/features/fidc/components/PLHero.vue` | Painel PL |
| `docs/handoff/layout-shell.md` | Sidebar, topbar, dashboard |
| `docs/handoff/cra/gestao.md` | Módulo irmão (estrutura paralela) |

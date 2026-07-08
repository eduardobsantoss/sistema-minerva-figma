# Handoff — Detalhes da Solicitação de Operação

> Fonte de verdade complementar: `guidelines/Guidelines.md` (design tokens e padrão estrutural de telas de detalhe). Este documento é específico da tela `Solicitação de Operação` e explica também **de onde vêm os dados**, já que essa é a parte que mais gera dúvida ao mexer no código.

---

## 1. Onde fica e como a tela é montada

Ponto de entrada: `SolicitacaoScreen.vue` renderiza `SolicitacaoDetailScreen.vue` quando o usuário abre um card/linha (`selectedId` vira o id da solicitação selecionada).

```vue
<!-- src/features/solicitacao-operacao/screens/SolicitacaoScreen.vue -->
<SolicitacaoDetailScreen v-if="selected" :solicitacao="selected" @back="selectedId = null" />
```

Árvore de componentes da tela de detalhe:

```
SolicitacaoDetailScreen.vue          → header + tabs + shell do conteúdo
├─ detail-tabs/DadosGeraisTab.vue    → aba "Dados Gerais"
├─ detail-tabs/AtivosTab.vue
├─ detail-tabs/GarantiasTab.vue
├─ detail-tabs/ValidacoesTab/*
├─ detail-tabs/AnexosTab.vue
├─ detail-tabs/AtaTab.vue
├─ detail-tabs/HistoricoTab.vue
└─ detail-tabs/shared/*              → Section, Field, Card, TabPill, CopyButton, GhostButton, EmptyState
```

Todos os arquivos ficam em `src/features/solicitacao-operacao/`.

---

## 2. De onde vêm os dados (a parte confusa)

Esse é o ponto-chave. Hoje **tudo é mock**, mas a estrutura já simula como vai funcionar com API real. Existem duas fontes de dados que descem como props:

### a) `Solicitacao` — dados "básicos"

São os dados que já existem no card/linha da listagem (id, cedente, valor, taxa, etapa, esteira, etc). Vêm do array `solicitacoes: Solicitacao[]` em `operacaoData.ts` e chegam via prop:

```ts
// src/features/solicitacao-operacao/screens/SolicitacaoDetailScreen.vue
const props = defineProps<{ solicitacao: Solicitacao }>();
```

### b) `DetalheSolicitacao` — dados "ricos" (só existem na tela de detalhe)

Partes relacionadas, ativos vinculados, garantias, validações, anexos e histórico **não existem no objeto `Solicitacao`**. Eles são derivados na hora, chamando `detalheSolicitacao(s)`:

```ts
// src/features/solicitacao-operacao/screens/SolicitacaoDetailScreen.vue
const det = reactive(detalheSolicitacao(props.solicitacao));
```

```ts
// src/features/solicitacao-operacao/data/operacaoData.ts
export function detalheSolicitacao(s: Solicitacao): DetalheSolicitacao {
  const validacoes: ItemValidacao[] = [ /* ... */ ];
  return {
    partes: PARTES_BASE,
    limites: [],
    ativos: [],
    garantias: [],
    validacoes,
    anexos: [ /* ... */ ],
    historico: [ /* ... */ ],
  };
}
```

Esse `det` reativo é passado como prop para praticamente todas as abas (`:det="det"`).

> **Quando a API real existir**, basta transformar `detalheSolicitacao` numa chamada HTTP (ex.: `GET /solicitacoes/{id}/detalhe`). O restante da árvore de componentes não precisa mudar, porque todas as abas já consomem os dados via prop `det`.

### c) Defaults de exibição (fallback local)

Como o mock de `Solicitacao` não tem todos os campos que a tela de detalhe exibe (banco, agência, fee, etc.), `DadosGeraisTab.vue` tem uma função local `display()` que preenche defaults só para exibição, quando o campo opcional não veio:

```ts
// src/features/solicitacao-operacao/screens/detail-tabs/DadosGeraisTab.vue
function display(s: Solicitacao) {
  return {
    unidadeNegocio: s.unidadeNegocio ?? 'Ceres Investimentos',
    documento: s.documento ?? '07.366.063/0001-05',
    banco: s.banco ?? '341 - Itaú Unibanco S.A.',
    agencia: s.agencia ?? '1475-0',
    conta: s.conta ?? '43810-5',
    tipoTaxa: s.tipoTaxa ?? 'Pré-fixado',
    frequencia: s.frequencia ?? 'Mensal',
    fee: s.fee ?? 2,
    valorFee: s.valorFee ?? s.valor * 0.02,
    percSeguro: s.percSeguro ?? 0,
    valorSeguro: s.valorSeguro ?? 0,
    quitacaoVencidos: s.quitacaoVencidos ?? false,
  };
}
```

### Regra prática para achar um campo

Se um campo aparece na tela e você não sabe de onde ele vem, procure nesta ordem:

1. Prop `s` / `solicitacao` (tipo `Solicitacao`);
2. Prop `det` (tipo `DetalheSolicitacao`, vindo de `detalheSolicitacao()`);
3. Função `display()` local, com fallback hardcoded.

Os tipos completos de tudo isso estão no topo de `src/features/solicitacao-operacao/data/operacaoData.ts` (interfaces `Solicitacao`, `DetalheSolicitacao`, `ParteRelacionada`, `ContratoAtivo`, `ItemValidacao`, `AnexoDoc`, `EventoHistorico`) — é o melhor lugar para consultar "quais campos existem e qual o tipo de cada um".

---

## 3. Tipografia

Tudo usa os tokens de `src/styles/theme.css` (fonte `Inter`), nunca `px` fixo para texto de conteúdo — exceto os poucos casos "fora da escala" listados abaixo (labels/eyebrows muito pequenos, que são intencionalmente menores que `--text-xs`).

| Token / valor | Tamanho real | Onde aparece na tela |
|---|---|---|
| `--text-xl` | 20px | Título principal (nº da solicitação) |
| `--text-md` | 16px | Valores de destaque no hero (Taxa, FEE, Valor FEE) |
| `--text-sm` | 13px | Corpo padrão — valor dos `Field`, linhas de tabela, texto do `EmptyState` |
| `--text-xs` | 12px | Textos auxiliares, botões (`GhostButton`, badges de aviso) |
| `10px` (fixo) | 10px | Labels de campo (`Field`), títulos de `Section`, cabeçalho de tabela |
| `9px` (fixo) | 9px | Badges pequenos (tipo de parte relacionada, obrigatório/opcional, área da validação) |
| `32px` (fixo) | 32px | Valor da operação em destaque no hero card |

Pesos:
- `--weight-bold` (700) → títulos, labels, valores fortes, botões;
- `--weight-semibold` (600) → valor do `Field`, nomes em linhas de tabela.

Padrão de "eyebrow"/rótulo: `letter-spacing` largo (`0.10em` a `0.18em`) + `text-transform: uppercase` + `font-weight: var(--weight-bold)` em **todo** label de campo e título de seção. Essa combinação é a assinatura visual do design system para rótulos — reutilizem sempre que criarem um novo label.

Números (valores monetários, datas, taxas) sempre com `font-variant-numeric: tabular-nums`, para não "dançar" a largura dos dígitos.

---

## 4. Espaçamento

Grid de 4px (ver `--space-*` em `theme.css`). Valores usados nesta tela:

| Contexto | Valor |
|---|---|
| Gap entre blocos principais da tela (header → tabs → conteúdo) | `24px` |
| Padding do container branco de conteúdo das tabs | `24px` |
| Gap entre seções dentro de uma aba (ex: `DadosGeraisTab`) | `32px` |
| Gap dos grids de `Field` (Identificação, Condições Financeiras) | `24px` |
| Padding interno de `Card` (Dados Bancários / Configuração) | `20px` |
| Gap interno do grid dentro de um `Card` | `18px` |
| Padding de linha/célula de tabela (partes, ativos) | `12px 16px` |
| Gap do header (botão voltar + título + ações) | `16px` |

---

## 5. Cores, raio e superfícies

| Uso | Token |
|---|---|
| Fundo do container de conteúdo, cards de tabela | `--surface-card` |
| Fundo de thead de tabela, `EmptyState`, `Card` interno | `--surface-sunken` |
| Texto forte (nomes, valores) | `--text-strong` |
| Texto secundário / label | `--text-muted` |
| Borda padrão | `--border-default` |
| Título de `Section` / tarja de eyebrow | `--accent` (laranja Agro) |
| Hero do valor da operação | fundo sólido `--gci-base`, texto branco |
| Botão de ação primária | `--action-primary-bg` / `--action-primary-text` |
| Badges de status/validação | par `--status-{tom}-bg` / `--status-{tom}-text` |
| Chip de etapa (RASCUNHO, PENDENTE...) | cor definida por item em `ETAPAS` (`etapaCor()`) |

| Raio | Token | Onde |
|---|---|---|
| `--radius-xl` (12px) | Cards/containers grandes (conteúdo das tabs, tabs pill) |
| `--radius-lg` (8px) | Inputs, botões, linhas de tabela, botão voltar |
| `--radius-md` (6px) | Ícone de card, botões pequenos de ação |
| `--radius-sm` (4px) | Badges pequenos |
| `--radius-full` | Chips/pills (status, tabs de esteira) |

Essa tabela é um resumo — a fonte de verdade completa (com regras de uso, mapeamento de status por processo, etc.) é `guidelines/Guidelines.md`, seção 4.

---

## 6. Componentes reutilizáveis (`detail-tabs/shared/`)

Em vez de repetir `style="font-size: 10px; ..."` em todo campo, a tela usa componentes pequenos — reaproveitem em telas novas de detalhe:

| Componente | Props principais | O que resolve |
|---|---|---|
| `Section.vue` | `title` + slot `#action` | Título uppercase laranja + conteúdo da seção |
| `Field.vue` | `label` + slot padrão | Par label pequeno (em cima) / valor forte (embaixo) |
| `Card.vue` | `title`, `icon` | Bloco cinza (`--surface-sunken`) com ícone + título, para agrupar sub-blocos |
| `TabPill.vue` | `active`, `icon` | Botão de aba (barra de 7 tabs no topo da tela) |
| `GhostButton.vue` | `icon` | Botão secundário com borda ("Nova parte", "Adicionar contrato", "Revalidar"...) |
| `EmptyState.vue` | `icon`, `title`, `hint?` | Placeholder tracejado para listas vazias (Garantias, Limites, Ativos) |
| `CopyButton.vue` | `value` | Ícone de copiar ao lado de valores copiáveis (ID, CNPJ) |

Se uma próxima tela de detalhe precisar de "rótulo + valor", **não escrevam o `style` na mão** — importem `Field` de `./shared` (ou copiem a pasta `shared` como esqueleto para a nova feature).

---

## 7. Como fazer sozinho da próxima vez (checklist)

1. **Ache o padrão estrutural primeiro.** `guidelines/Guidelines.md`, seção 10 ("Padrão de tela de detalhes de entidade") já documenta o layout, o `Section`/`Field`/`Participant` de referência e as regras gerais (botão voltar 48×48, badge de status como pill, container de conteúdo com `--radius-xl` + `padding: 24px`, etc.). Toda tela nova de detalhe (título, operação, cedente...) deve seguir esse mesmo esqueleto.
2. **Nunca hardcode cor/espaçamento.** Sempre `var(--token)`. Se o token que vocês precisam não existir, procurem primeiro em `src/styles/theme.css` antes de inventar um valor novo.
3. **Separem "dado bruto" de "dado de exibição".** Sigam o padrão desta tela: `Solicitacao` (dado real) → `detalheSolicitacao()` (dado derivado, hoje mockado) → `display()` local (defaults só de exibição). Isso deixa óbvio, quando a API real chegar, qual função vira uma chamada HTTP e qual é só fallback de UI.
4. **Componentizem rótulo+valor, seção e badge antes de escrever a tela.** Copiem a pasta `detail-tabs/shared` como ponto de partida em vez de reescrever os estilos inline em cada aba nova.
5. **Para saber o tipo de cada campo**, olhem o topo de `operacaoData.ts` — as interfaces documentam exatamente o que cada aba espera receber (`Solicitacao`, `DetalheSolicitacao`, `ParteRelacionada`, `ContratoAtivo`, `ItemValidacao`, `AnexoDoc`, `EventoHistorico`).

---

## 8. Referências rápidas de arquivos

| Arquivo | Conteúdo |
|---|---|
| `src/features/solicitacao-operacao/screens/SolicitacaoDetailScreen.vue` | Header, tabs, orquestração das abas |
| `src/features/solicitacao-operacao/screens/detail-tabs/DadosGeraisTab.vue` | Aba "Dados Gerais" (hero de valor, identificação, dados bancários, condições financeiras, partes relacionadas) |
| `src/features/solicitacao-operacao/screens/detail-tabs/AtivosTab.vue` | Aba "Ativos" |
| `src/features/solicitacao-operacao/screens/detail-tabs/GarantiasTab.vue` | Aba "Garantias" |
| `src/features/solicitacao-operacao/screens/detail-tabs/ValidacoesTab/` | Aba "Validações" + tela cheia de validações |
| `src/features/solicitacao-operacao/screens/detail-tabs/AnexosTab.vue` | Aba "Anexos" |
| `src/features/solicitacao-operacao/screens/detail-tabs/AtaTab.vue` | Aba "Ata de Deliberação" |
| `src/features/solicitacao-operacao/screens/detail-tabs/HistoricoTab.vue` | Aba "Histórico" |
| `src/features/solicitacao-operacao/screens/detail-tabs/shared/` | Componentes reutilizáveis (Section, Field, Card, TabPill, GhostButton, EmptyState, CopyButton) |
| `src/features/solicitacao-operacao/data/operacaoData.ts` | Tipos, mocks e funções (`detalheSolicitacao`, `brl`, `etapaCor`, `esteiraLabel`, etc.) |
| `src/styles/theme.css` | Tokens de design (cor, tipografia, espaçamento, raio, sombra) |
| `guidelines/Guidelines.md` | Fonte de verdade do design system e do padrão estrutural de telas de detalhe |

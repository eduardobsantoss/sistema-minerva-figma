# Handoff — Tela inicial de Solicitação de Operação (Listagem)

> Fonte de verdade complementar: `guidelines/Guidelines.md` (design tokens) e `src/styles/theme.css`. Este documento cobre **a tela de listagem/workflow** — header, filtros, esteiras, toggle de visualização e as três views (Kanban, Cards, Tabela). Para o drill-down, ver `solicitacao-detalhes.md` e `solicitacao-ativos.md`.
>
> Telas admin do módulo (submenu):
> - [solicitacao-fundo-padrao.md](./solicitacao-fundo-padrao.md)
> - [solicitacao-relatorio-pedidos.md](./solicitacao-relatorio-pedidos.md)
> - [solicitacao-taxas-veiculos.md](./solicitacao-taxas-veiculos.md)
> - [solicitacao-validacoes-config.md](./solicitacao-validacoes-config.md)

---

## 1. Onde fica e como a tela é montada

### Entrada no app

```
ModulesScreen.vue  (view === 'solicitacoes')
└─ SolicitacaoScreen.vue
    ├─ [lista]  →  header + filtros + view (kanban/cards/tabela)
    └─ [detalhe]  →  SolicitacaoDetailScreen.vue  (quando selectedId !== null)
```

Export: `src/features/solicitacao-operacao/index.ts` → `SolicitacaoScreen`.

### Árvore de arquivos

```
src/features/solicitacao-operacao/
├── screens/
│   ├── SolicitacaoScreen.vue           → orquestrador (estado, filtros, views)
│   └── solicitacao-screen/
│       ├── SolicitacaoFiltersPanel.vue → popover de filtros avançados
│       ├── FilterSelect.vue            → select estilizado (não usado na tela principal hoje)
│       └── index.ts
├── components/
│   ├── SolicitacaoKanban.vue
│   ├── SolicitacaoCard.vue
│   ├── SolicitacaoTable.vue
│   └── NovoPedidoModal.vue
└── data/
    └── operacaoData.ts                 → Solicitacao, ETAPAS, ESTEIRAS, seeds, helpers
```

### Layout geral (container)

A listagem vive dentro do `<main>` do shell (`max-width: 1456px`, `padding: var(--main-padding)`). O bloco raiz usa:

```vue
<div class="flex flex-col" style="gap: 24px">
```

Ou seja, **24px** entre cada camada vertical (header → esteiras → barra de filtros → conteúdo).

---

## 2. Anatomia da tela (camadas verticais)

```
┌─────────────────────────────────────────────────────────────┐
│ Camada 1: Eyebrow + H1 + botão NOVA SOLICITAÇÃO (48px)      │
├─────────────────────────────────────────────────────────────┤
│ Camada 2: Pills de esteira (Todas + 5 esteiras)             │
├─────────────────────────────────────────────────────────────┤
│ Camada 3: [ Busca flex ] [ Filtros popover ] [ Kanban|Cards|Tabela ] │
├─────────────────────────────────────────────────────────────┤
│ Camada 4: SolicitacaoKanban | grid Cards | SolicitacaoTable │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. De onde vêm os dados

### `Solicitacao` — objeto da listagem

```ts
interface Solicitacao {
  id: string;              // ex. '#1384'
  cedente: string;
  tipoContrato: string;    // CCB, CPR-F, CDCA, NC...
  validacao: 'VALIDO' | 'INVALIDO';
  valor: number;
  vinculo: string;         // grupo vinculado ou ''
  veiculo: string;
  etapa: Etapa;            // 15 etapas do workflow
  esteira: Esteira;        // filtro de pills
  tipoOperacao: string;
  grupoEmpresarial: string;
  abertura: string;        // ISO date 'YYYY-MM-DD'
  tempoTotalHoras: number;
  tempoEtapaHoras: number;
  slaEtapaHoras: number;
  taxa: number;
  gerente: string;
  atendente: string;
}
```

### Estado mutável

```ts
const lista = reactive<Solicitacao[]>([...initialSolicitacoes]);
```

- Seed: **20 solicitações** (`#1383`–`#1402`) em `operacaoData.ts`, distribuídas em várias etapas/esteiras.
- Nova solicitação: `lista.unshift(buildFromForm(data))` — etapa `RASCUNHO`, id aleatório `#1397–#1996`.

### Helpers usados na UI

| Função | Uso |
|---|---|
| `brl(n)` | Valor monetário nos cards/tabela |
| `fmtDuracao(horas)` | `"3d 4h"` ou `"5h"` |
| `slaRatio(s)` | `tempoEtapaHoras / slaEtapaHoras` — **> 1 = atrasado** |
| `groupByEtapa(list)` | Kanban — agrupa por `s.etapa` |
| `etapaLabel` / `etapaCor` | Badge de etapa na tabela |
| `esteiraLabel` | Labels das pills (via `ESTEIRAS`) |

---

## 4. Filtros e busca

Três camadas de filtro aplicadas em série no `computed` `filtered`:

### 4.1 Pills de esteira

| key | Label |
|---|---|
| `TODAS` | Todas |
| `CRA_MONOCEDENTE` | CRA Monocedente |
| `ESPECIAL` | Especial |
| `CONVENCIONAL` | Convencional |
| `FIDC_MONOCEDENTE` | FIDC Monocedente |
| `CLIENTE` | Cliente |

**Estilo pill ativa:** `background: var(--gci-base)`, `color: #fff`, `border-color: var(--gci-base)`.

**Inativa:** `background: var(--surface-card)`, `color: var(--text-muted)`, `border: 1px solid var(--border-default)`.

**Dimensões:** `padding: 8px 16px`, `border-radius: 9999px`, `font-size: var(--text-xs)`, bold, `letter-spacing: 0.04em`, `gap: 6px` entre pills.

### 4.2 Busca rápida (`q`)

- Input com ícone `Search` 16px, `left: 14px`
- Altura **42px**, `flex: 1`, `min-width: 240px`
- Placeholder: *"Buscar por ID, cedente ou veículo..."*
- Busca em: `id`, `cedente`, `veiculo`, `vinculo` (case insensitive)

### 4.3 Filtros avançados (popover)

Botão **Filtros** abre painel absoluto; overlay `fixed inset: 0` z-index 30 fecha ao clicar fora.

**Posicionamento inteligente:** se espaço abaixo do botão < 520px e há mais espaço acima → painel abre **acima** (`bottom: calc(100% + 8px)`); senão abaixo (`top: calc(100% + 8px)`).

**Painel:**

| Propriedade | Valor |
|---|---|
| width | `440px` |
| max-width | `calc(100vw - 48px)` |
| padding | `16px 20px` |
| border-radius | `var(--radius-xl)` |
| box-shadow | `var(--shadow-lg)` |
| z-index | `31` |

**Campos (`SolicitacaoFilters`):**

| Campo | Tipo | Match |
|---|---|---|
| `idPedido` | text (full width) | `includes` no id |
| `veiculo` | select (full width) | igualdade exata |
| `tipoPedido` | select | `tipoContrato` |
| `dataAbertura` | `input type="date"` | `abertura` |
| `grupoEmpresarial` | select (full width) | igualdade |
| `gerenteComercial` | select (full width) | `gerente` |
| `requerente` | select | `cedente` |
| `usuarioAtendimento` | select | `atendente` |

Grid interno: **2 colunas**, `gap: 14px`. Inputs/selects: altura **38px**.

Botão Filtros mostra **badge contador** (círculo 18px, fundo `--gci-base`) quando `activeFilterCount > 0`.

Estados do botão Filtros:
- Repouso: fundo card, borda default, texto muted
- Aberto ou com filtros: fundo `--gci-light`, borda `--gci-base`, texto `--gci-base`

**Apply** fecha o popover; **Limpar** zera todos os campos.

Opções dos selects derivadas de `initialSolicitacoes` (únicos por campo).

---

## 5. Toggle de visualização

Segmented control à direita da barra de filtros:

| key | Label | Ícone |
|---|---|---|
| `kanban` | Kanban | `Columns3` |
| `cards` | Cards | `LayoutGrid` |
| `tabela` | Tabela | `Table2` |

**Container:** `padding: 4px`, fundo `--surface-sunken`, `border-radius: var(--radius-lg)`.

**Botão ativo:** fundo `--surface-card`, texto `--text-strong`, `box-shadow: var(--shadow-xs)`.

**Inativo:** fundo transparente, texto `--text-muted`.

Cada botão: `padding: 8px 14px`, ícone 15px, `font-size: var(--text-xs)`, bold, `letter-spacing: 0.04em`.

**Default:** `viewMode = 'kanban'`.

---

## 6. View: Kanban (`SolicitacaoKanban.vue`)

### Container

```css
display: flex;
gap: 16px;
overflow-x: auto;
padding-bottom: 12px;
```

Scroll horizontal — **15 colunas** fixas (uma por etapa em `ETAPAS`).

### Coluna

| Propriedade | Valor |
|---|---|
| width / flex | `280px` fixo (`flex: 0 0 280px`) |
| background | `var(--surface-sunken)` |
| border-radius | `var(--radius-lg)` |
| border-top | `3px solid {etapa.cor}` |
| padding | `12px` |
| gap interno | `12px` |
| min-height | `200px` |

### Header da coluna

- Dot 8×8px cor da etapa
- Label: `11px`, bold, uppercase, `letter-spacing: 0.06em`, ellipsis
- Contador: pill com `color-mix(in srgb, {cor} 16%, transparent)`, texto na cor da etapa, `11px` bold, min-width 22px

### Empty state da coluna

Ícone `FolderOpen` 22px + texto `"Nenhuma solicitação"`, `11px`, padding `28px 8px`.

### Cards na coluna

Reutiliza `SolicitacaoCard` com prop **`compact`**.

> **Drag-and-drop:** comentário TODO no código — colunas são drop targets futuros; hoje **não há DnD**.

### Cores das etapas (`ETAPAS`)

| Etapa | Cor |
|---|---|
| Rascunho | `var(--neutral-400)` |
| Pendente | `#D97706` |
| Comercial | `var(--gci-base)` |
| Crédito | `#CA8A04` |
| Cadastro | `#0891B2` |
| Análise | `#7C3AED` |
| Análise Jurídica | `#4F46E5` |
| Análise Fundo | `#9333EA` |
| Validado | `var(--success-base)` |
| Abono | `#14B8A6` |
| Assinatura do Cliente | `var(--agro-base)` |
| Desembolso | `#2563EB` |
| Desembolso Cliente | `#0EA5E9` |
| Solucionada | `var(--success-dark)` |
| Rejeitada | `var(--danger-base)` |

---

## 7. View: Cards (`SolicitacaoCard.vue`)

### Grid (em `SolicitacaoScreen`)

```css
grid-template-columns: repeat(3, 1fr);
gap: 16px;
```

**3 colunas fixas** — não usa `auto-fit`. Em telas estreitas o grid comprime (sem breakpoint alternativo no código).

### Empty state

Padding `60px`, card branco com borda, mensagem: *"Nenhuma solicitação encontrada para os filtros selecionados."*

### Card — estrutura (de cima para baixo)

1. **Bookmark** (só `esteira === 'CLIENTE'`) — `Bookmark` 18px, `--agro-base` preenchido, canto superior direito absoluto
2. **Badges:** tipo contrato (esq., max 60% width) + VÁLIDO/INVÁLIDO (dir.)
3. **Cedente** (2 linhas clamp) + ID `11px` muted
4. **Valor** — `brl(valor)`
5. **Vínculo** — pill sunken com `Building2`, ou *"Sem vínculo"*
6. **Divisor** 1px
7. **Grid 2 colunas:** TOTAL e ETAPA (ícone + label 9px uppercase + valor + barra 3px)
8. **Detalhes expandidos** (opcional): Veículo, Taxa, Gerente, Atendente
9. **Toggle** Mais/Menos detalhes

### Prop `compact` (Kanban)

| Propriedade | Normal | Compact |
|---|---|---|
| padding | `16px` | `12px` |
| gap | `12px` | `10px` |
| cedente font | `--text-base` | `--text-sm` |
| valor font | `--text-lg` | `--text-md` |
| hover translateY | `-3px` | `0` (sem elevação) |
| bookmark offset | 10px | 8px |

### Badge tipo contrato (`contratoTone`)

| Condição | Fundo | Texto |
|---|---|---|
| contém `CDCA` | `--success-light` | `--success-dark` |
| contém `CPR` ou `NC` | `--warning-light` | `--warning-dark` |
| demais | `--surface-sunken` | `--text-default` |

Tamanho badge: `9px`, bold, `letter-spacing: 0.08em`, `padding: 3px 8px`.

### Badge validação

- VÁLIDO: `--status-success-bg` / `--status-success-text` + `CheckCircle2` 10px
- INVÁLIDO: `--status-danger-bg` / `--status-danger-text` + `XCircle` 10px
- `border-radius: 9999px`, `padding: 3px 8px`

### Barra de tempo (TOTAL / ETAPA)

Cor da barra inferior 3px:
- `--danger-base` se `slaRatio > 1`
- `--success-base` caso contrário

Valor da coluna ETAPA em vermelho quando atrasado.

### Interação

- Clique no card → `emit('open', id)` → `selectedId` na tela pai
- Toggle expandir → `@click.stop` (não abre detalhe)

### Hover (modo cards)

- Borda: `rgba(8,60,74,0.25)`
- Sombra: `0 12px 28px -14px rgba(8,60,74,0.18)`
- `translateY(-3px)` (só não-compact)

---

## 8. View: Tabela (`SolicitacaoTable.vue`)

### Container

Card único: `border-radius: var(--radius-xl)`, fundo card, overflow hidden.

### Grid de colunas

```ts
const COLS = '90px 1.6fr 0.9fr 1.2fr 1fr 1.1fr 1fr';
```

| Coluna | Alinhamento | Conteúdo |
|---|---|---|
| ID | — | `#xxxx`, bold muted, tabular-nums |
| Cedente | — | ícone validação 15px + nome ellipsis |
| Tipo | — | `tipoContrato` |
| Veículo | — | ellipsis |
| Valor | **right** | `brl`, bold, tabular-nums |
| Etapa | — | pill com dot 6px + `etapaLabel` |
| SLA da Etapa | — | barra 5px + texto `fmtDuracao / fmtDuracao` |

### Header

`padding: 12px 20px`, fundo `--surface-sunken`, `10px` uppercase, `letter-spacing: 0.12em`.

### Linhas

`padding: 14px 20px`, hover `--surface-sunken`, cursor pointer.

### Barra SLA

- Track: `--danger-light` ou `--success-light` (5px altura)
- Fill: largura `min(slaRatio, 1) * 100%`, cor danger/success
- Texto: vermelho bold se atrasado; formato `"408h / 120h"` via `fmtDuracao`

### Badge etapa (célula)

`color-mix(in srgb, {etapaCor} 14%, transparent)` no fundo, `padding: 4px 9px`, `10px` bold.

---

## 9. Header da página e ação primária

### Eyebrow + título

| Elemento | Spec |
|---|---|
| Eyebrow | `"Workflow Operacional"`, `11px`, uppercase, `letter-spacing: 0.18em`, `--accent`, bold, `margin-bottom: 6px` |
| H1 | `"Solicitação de Operação"`, `26px`, bold, `letter-spacing: -0.02em`, line-height `1.15` |

### Botão NOVA SOLICITAÇÃO

| Propriedade | Valor |
|---|---|
| height | `48px` |
| padding | `0 22px` |
| background | `--agro-base` (hover: `--agro-hover`) |
| border-radius | `var(--radius-lg)` |
| font | `--text-xs`, bold, `letter-spacing: 0.10em` |
| shadow | `0 10px 24px -8px rgba(242, 125, 38, 0.4)` |
| ícone Plus | círculo 22px, `rgba(255,255,255,0.2)` |

Abre `NovoPedidoModal` (wizard 3 etapas: Dados Gerais, Garantia, Anexos).

---

## 10. Navegação para detalhe

```ts
const selectedId = ref<string | null>(null);
const selected = computed(() => lista.find(s => s.id === selectedId));
```

```vue
<SolicitacaoDetailScreen v-if="selected" :solicitacao="selected" @back="selectedId = null" />
```

Qualquer view emite `@open` com o `id` string. O objeto passado ao detalhe é **referência viva** em `lista` (mutações no detalhe refletem na listagem se o mesmo objeto for alterado).

---

## 11. Novo pedido (resumo)

`NovoPedidoModal` → `buildFromForm()`:

- `id`: `#${1397 + random até 1996}`
- `etapa`: `'RASCUNHO'`
- `validacao`: `'VALIDO'`
- `abertura`: data de hoje ISO
- `tempoTotalHoras` / `tempoEtapaHoras`: `0`
- `slaEtapaHoras`: `24`

Insere no topo da lista (`unshift`).

---

## 12. Especificação pixel-perfect (resumo)

| Elemento | Medida chave |
|---|---|
| Gap entre seções da tela | `24px` |
| H1 | `26px` |
| Busca / botão Filtros | altura `42px` |
| Pills esteira | `8px 16px`, pill 9999px |
| Segmented view | padding container `4px`, botão `8px 14px` |
| Coluna kanban | `280px` largura, top border `3px` |
| Grid cards | 3 colunas, gap `16px` |
| Card padding | `16px` / `12px` compact |
| Tabela header/row | `12px 20px` / `14px 20px` |
| Popover filtros | `440px` largura |
| Botão Nova Solicitação | `48px` altura |

**Fontes:** tokens `--text-xs` (11–12px), `--text-sm` (13px), `--text-base`, `--text-lg`, `--text-md`.

**Números:** sempre `font-variant-numeric: tabular-nums` em valores e IDs.

**Transições:** `--duration-fast` (120ms) em hovers de pills/filtros; `--duration-base` em cards.

---

## 13. O que ainda é mock / fora de escopo

- Kanban sem drag-and-drop entre etapas;
- Exportar / ações em lote inexistentes na listagem;
- Filtros não persistem em URL ou localStorage;
- Grid de cards sem responsividade (sempre 3 colunas);
- `FilterSelect.vue` existe mas **não** é usado em `SolicitacaoScreen` (filtros avançados usam `<select>` nativo no painel);
- Nenhuma API — CRUD só em `lista` reativa;
- Contagem de pills de esteira não exibe número de itens (só filtram).

---

## 14. Checklist para evoluir a listagem

1. **Nova coluna kanban** — adicionar em `Etapa` type + entrada em `ETAPAS` (ordem define posição da coluna).
2. **Nova esteira** — estender `Esteira` + `ESTEIRAS` + pill em `ESTEIRA_FILTERS`.
3. **Novo campo filtrável** — `SolicitacaoFilters` + lógica em `filtered` + campo no painel.
4. **Card/table** — reutilizar `SolicitacaoCard` com/sem `compact`; não duplicar lógica de SLA/validação.
5. **Cores de etapa** — usar `etapaCor()` / `ETAPAS[].cor`, não hex solto.
6. **Responsividade** — se quebrar grid 3 colunas, alterar só o wrapper em `SolicitacaoScreen` (cards view).
7. **DnD kanban** — mover `s.etapa` em `lista` ao soltar; colunas já têm estrutura de drop target comentada.
8. **API futura** — substituir `lista` por fetch paginado; manter shape `Solicitacao` e `filtered` computed.

---

## 15. Referências rápidas de arquivos

| Arquivo | Conteúdo |
|---|---|
| `screens/SolicitacaoScreen.vue` | Estado, filtros, views, navegação |
| `components/SolicitacaoKanban.vue` | 15 colunas por etapa |
| `components/SolicitacaoCard.vue` | Card compartilhado kanban + grid |
| `components/SolicitacaoTable.vue` | 7 colunas + SLA bar |
| `screens/solicitacao-screen/SolicitacaoFiltersPanel.vue` | Popover filtros |
| `data/operacaoData.ts` | Seeds, ETAPAS, ESTEIRAS, helpers |
| `components/NovoPedidoModal.vue` | Criar solicitação |
| `screens/SolicitacaoDetailScreen.vue` | Destino do clique |
| `docs/handoff/solicitacao-detalhes.md` | Detalhe da solicitação |
| `docs/handoff/solicitacao-ativos.md` | Aba Ativos no detalhe |
| `docs/handoff/layout-shell.md` | Shell (topbar, sidebar) |

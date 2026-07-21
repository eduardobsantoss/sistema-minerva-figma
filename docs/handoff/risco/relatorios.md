# Handoff — Relatórios de Risco + Parecer de Crédito (pixel-perfect)

> Fonte de verdade: `src/features/risco/screens/RelatoriosScreen.vue` + helpers/seeds em `data/riscoData.ts`.  
> Módulo: [risco.md](./risco.md). Índice: [README.md](./README.md).

**Objetivo:** reimplementar o catálogo de Relatórios e a tela do **Relatório de Parecer de Crédito** (filtros → gerar → tabela → CSV) pixel-perfect.

Tudo vive num único componente com estado in-memory (`selected`). Hoje o catálogo tem **1** relatório.

---

## 1. Entrada

| Item | Valor |
|---|---|
| View | `?view=risco-rel` |
| Sidebar | Risco → Relatórios |
| Topbar | Relatórios de Risco |
| Componente | `RelatoriosScreen.vue` |
| Dados | `GRUPOS_SEED`, `GERENTES_SEED`, opts de filtro em `riscoData.ts` |

### Fluxo

```
Catálogo (selected = null)
  └─ clique no card
       └─ Detalhe Parecer de Crédito (selected = 'parecer-credito')
            ├─ Filtros + GERAR RELATÓRIO  → applied = draft
            ├─ Tabela paginada (se applied)
            └─ EXPORTAR CSV (blob no browser)
```

Voltar (48×48) → `selected = null` (limpa visualmente o detalhe; ao reabrir o card, filtros/resultados são resetados em `selectReport`).

---

## 2. Catálogo — Relatórios

Root: `flex flex-col; gap: 24px`

### Header

| Peça | Spec |
|---|---|
| Eyebrow | `11px` bold uppercase `letter-spacing: 0.18em`, `--accent`, `margin-bottom: 6px` — **"Risco"** |
| H1 | `26px` bold `--text-strong`, `letter-spacing: -0.02em`, `line-height: 1.15` — **"Relatórios"** |
| Subtitle | `--text-sm` muted, `margin-top: 4px` — *"Selecione um relatório para configurar filtros e exportar."* |

### Grid de cards

```
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
gap: 16px;
```

### Card (único hoje)

| Spec | Valor |
|---|---|
| Layout | coluna flex, `gap: 14px`, `text-align: left` |
| Pad | **22px** |
| Chrome | card + border `radius-xl` |
| Cursor | pointer |
| Ícone box | **42×42**, `radius-lg`, `--accent-bg` / `--accent`, `ClipboardCheck` **20** |
| Título | `--text-sm` bold strong, `margin-bottom: 6px` |
| Descrição | `--text-xs` muted, `line-height: 1.5` |
| Spacer | `flex: 1` (empurra CTA para baixo) |

**Hover** (`hoveredKey`):

| Prop | Idle | Hover |
|---|---|---|
| border | `--border-default` | `rgba(242,125,38,0.30)` |
| shadow | none | `0 20px 40px -16px rgba(8,60,74,0.10)` |
| transform | `translateY(0)` | `translateY(-4px)` |
| CTA “Configurar e exportar” | opacity 0, `translateY(4px)` | opacity 1, `translateY(0)` |

Transições: `transform` / `box-shadow` / `border-color` / CTA opacity+transform com `--duration-base` + `--ease-standard`.

CTA do card: xs bold `--accent`, gap 4, texto **"Configurar e exportar"** + `ChevronRight` 14.

### Conteúdo do card atual

| Campo | Valor |
|---|---|
| `key` | `'parecer-credito'` |
| `title` | Relatório de Parecer de Crédito |
| `description` | Situação do parecer de crédito por grupo empresarial, filtrável por status do grupo, gerente e vencimento do parecer. |

Para novos relatórios: estender `ReportKey` + array `REPORTS` (mesmo visual de card).

---

## 3. Detalhe — Relatório de Parecer de Crédito

Root: `gap: 24px`

### Header

`flex items-center; gap: 16px`

| Peça | Spec |
|---|---|
| Voltar | **48×48**, `radius-lg`, card + border, `ArrowLeft` 20 → `selected = null` |
| Eyebrow | `11px` bold uppercase `0.18em` accent, `margin-bottom: 4px` — **"Relatórios · Risco"** |
| H2 | `--text-xl` bold strong, `letter-spacing: -0.01em` — título do relatório |

### Card de filtros

| Spec | Valor |
|---|---|
| Chrome | border, `radius-xl`, card, **padding: 22px** |
| Grid | `repeat(4, 1fr)`, **gap: 14px** |
| Labels | `10px` bold uppercase `letter-spacing: 0.10em` muted, `margin-bottom: 6px` |
| Inputs/selects | h **38**, pad `0 12px`, card + border, `radius-lg`, `--text-sm` strong |

#### Campos

| Label | Modelo | Controle | Opções |
|---|---|---|---|
| Nome do grupo | `draft.nomeGrupo` | input text | placeholder `"Buscar por nome"` |
| Status do grupo | `draft.statusGrupo` | select | Todos + `STATUS_GRUPO_RELATORIO_OPTS` |
| Gerente | `draft.gerente` | select | Todos + `GERENTES_SEED[].nome` |
| Status do parecer | `draft.statusParecer` | select | Todos + `STATUS_PARECER_RELATORIO_OPTS` |

**Opts em `riscoData.ts`:**

```ts
STATUS_GRUPO_RELATORIO_OPTS = ['Normal', 'Recovery', 'Terceiro']
STATUS_PARECER_RELATORIO_OPTS = ['Vencido', 'A vencer']
```

> Status do grupo no filtro usa o valor de `statusOperacao` do grupo (não o label de parecer).  
> Status do parecer no filtro **não** mapeia 1:1 para `ParecerStatus` — ver §4.

#### Ação

`margin-top: 18px`, `justify-end`, gap 10

| Botão | Spec |
|---|---|
| **GERAR RELATÓRIO** | h **42**, pad `0 20px`, `--action-primary-bg`, `#fff`, `radius-lg`, xs bold `letter-spacing: 0.08em`, ícone `FileSpreadsheet` 15 |

`handleGerar`: `applied = { ...draft }`, `setPage(1)`.

`selectReport`: zera draft + `applied = null`.

---

## 4. Lógica de filtro (após Gerar)

Fonte: `GRUPOS_SEED`.

| Filtro | Regra |
|---|---|
| `nomeGrupo` | `g.nome` includes (case-insensitive) |
| `statusGrupo` | `g.statusOperacao === statusGrupo` |
| `gerente` | `g.gerente === gerente` |
| `statusParecer === 'Vencido'` | `g.parecerCredito === 'EXPIRADO'` |
| `statusParecer === 'A vencer'` | `CONFORME` **ou** `EXPIRANDO` |
| vazio | não filtra |

**Não** inclui filtro explícito para `AUSENTE` no select — grupos sem parecer só aparecem se o filtro de parecer estiver em “Todos”.

Resultados só renderizam se `applied !== null` (antes de Gerar, nenhuma tabela).

---

## 5. Resultado — tabela + CSV

Card: border, `radius-xl`, card, `overflow: hidden` — **só se `applied`**.

### Toolbar

`padding: 14px 20px`, border-bottom, `justify-between`

| Peça | Spec |
|---|---|
| Contador | sm bold strong — `"{n} resultado(s)"` |
| **EXPORTAR CSV** | h **34**, pad `0 14px`, ghost (border), `radius-lg`, xs bold, `Download` 13 |
| Disabled | `results.length === 0` → `not-allowed`, `--text-disabled` |

### Empty

`padding: 40px`, center, sm muted — *"Nenhum grupo encontrado para os filtros selecionados."*

### Header da tabela

```
grid: 2fr 1fr 1fr 1fr 1fr
padding: 10px 20px
background: var(--surface-sunken)
font: 10px bold uppercase letter-spacing 0.10em muted
```

Colunas: **Nome do Grupo** · **Documento** · **Status do Grupo** · **Gerente** · **Parecer de Crédito**

### Rows (`pageItems`)

```
padding: 12px 20px
border-top: 1px solid var(--border-default)
font-size: var(--text-sm)
```

| Coluna | Spec |
|---|---|
| Nome | semibold `--text-strong` |
| Documento | `tabular-nums` muted |
| Status do grupo | `statusOperacaoColor(g.statusOperacao)`, semibold — texto cru (`Normal`, `Terceiro`, …) |
| Gerente | `--text-default` |
| Parecer | `parecerColor` + `parecerLabel`, semibold |

### Labels / cores de parecer

| `ParecerStatus` | Label na UI | Cor |
|---|---|---|
| CONFORME | Em conformidade | `--success-base` |
| EXPIRANDO | Prestes a expirar | `--warning-base` |
| EXPIRADO | Expirado | `--danger-base` |
| AUSENTE | Não possui | (via `parecerColor` — text-disabled no helper) |

### Cores de status operação (texto da célula)

| Status | Cor |
|---|---|
| Normal | `--success-base` |
| Terceiro | `--gci-base` |
| Pré-Recovery | `--agro-base` |
| Recovery | `--warning-base` |
| Especial | `--neutral-500` |
| Special-Sit | `--danger-base` |

> Na tabela do relatório o status **não** usa badge pill com bolinha (só texto colorido) — diferente da listagem de Grupos.

### Paginação

`TablePagination` + `useTablePagination`, default **10**, options típicas 5/10/25/50.

---

## 6. Export CSV

`handleExportCsv`:

1. Mapeia `results` (todos filtrados, **não** só a página) → `{ nome, documento, statusGrupo, gerente, parecer: parecerLabel(...) }`
2. `toCsv`: header + linhas, campos entre aspas, sep **`;`**, escape `"` → `""`
3. Blob com BOM `\uFEFF`, `text/csv;charset=utf-8`
4. Download: **`relatorio-parecer-de-credito.csv`**

Header CSV:

```
Nome do Grupo;Documento;Status do Grupo;Gerente;Status do Parecer
```

---

## 7. Anatomia visual (resumo)

```
CATÁLOGO                          DETALHE
┌─────────────────────┐           ┌──────────────────────────────┐
│ Risco               │           │ [←] Relatórios · Risco       │
│ Relatórios          │           │     Relatório de Parecer…    │
│ grid cards 280+     │  click    │                              │
│ ┌─ card ─────────┐  │ ───────►  │ ┌─ filtros 4 cols ─────────┐ │
│ │ icon accent    │  │           │ │ …  [GERAR RELATÓRIO]     │ │
│ │ title + desc   │  │           │ └──────────────────────────┘ │
│ │ CTA hover →    │  │           │ ┌─ N resultados | CSV ─────┐ │
│ └────────────────┘  │           │ │ tabela 5 cols + pages    │ │
└─────────────────────┘           │ └──────────────────────────┘ │
                                  └──────────────────────────────┘
```

---

## 8. Checklist visual

- [ ] Eyebrow accent 0.18em; H1 26px no catálogo; H2 `--text-xl` no detalhe
- [ ] Card: pad 22, ícone 42 accent-bg, hover border agro 30% + lift -4px + CTA fade
- [ ] Voltar 48×48; filtros card pad 22, grid 4×38px, GERAR h 42 primary
- [ ] Resultado só após Gerar; empty 40px; header sunken 10px uppercase
- [ ] Status/parecer coloridos via helpers (sem badges)
- [ ] CSV com `;` + BOM + nome `relatorio-parecer-de-credito.csv`
- [ ] Paginação default 10

---

## 9. Referências

| Arquivo | Papel |
|---|---|
| `screens/RelatoriosScreen.vue` | Catálogo + detalhe + CSV |
| `data/riscoData.ts` | `GRUPOS_SEED`, `GERENTES_SEED`, opts, `parecerLabel/Color`, `statusOperacaoColor` |
| `@/components/ui/TablePagination.vue` | Paginação |
| [grupos.md](./grupos.md) | Mesmos helpers de status/parecer (listagem usa badges) |
| [../cra/relatorios.md](../cra/relatorios.md) | Padrão visual irmão (catálogo → filtros → CSV) |
| [../solicitacao/relatorio-pedidos.md](../solicitacao/relatorio-pedidos.md) | Mesmo padrão em Solicitações |

# Handoff — CRA / Gestão (pixel-perfect)

> Fonte de verdade: `src/features/cra/` + tokens em `src/styles/theme.css` + `guidelines/Guidelines.md`.  
> Este documento cobre a **Gestão de CRA's** (`?view=cras`): listagem → detalhe → operação → título → sacado → grupo, com Setup, Cessões e modais.  
> Telas irmãs: [simulador.md](./simulador.md) · [relatorios.md](./relatorios.md).  
> Módulo paralelo: [../fidc/fidc.md](../fidc/fidc.md). Shell: [../layout-shell.md](../layout-shell.md).

**Objetivo:** reimplementação pixel-perfect em outro Cursor sem Figma — medidas, tokens, grids e estados exatamente como no Vue.

---

## 1. Entrada e montagem

### Sidebar

Parent **CRA's** (`key: 'cras'`, ícone `Briefcase`):

| key | label | view |
|---|---|---|
| `cras` | Gestão | `CraScreen` |
| `cras-simulador` | Simulador | `CraSimuladorScreen` |
| `cras-relatorios` | Relatórios | `CraRelatoriosScreen` |

### ModulesScreen

| `?view=` | Topbar | Componente |
|---|---|---|
| `cras` | Gestão de CRA's | `CraScreen` |
| `cras-simulador` | Simulador | `CraSimuladorScreen` |
| `cras-relatorios` | Relatórios | `CraRelatoriosScreen` |

- Shell: `<main>` padding `var(--main-padding)`; conteúdo `max-width: 1456px`
- Fundo: `var(--surface-page)`
- Dashboard tile **"CRA's"** → `view = 'cras'`, `openMenu = 'cras'`
- Exports: `src/features/cra/index.ts` (as 3 telas)

### Árvore de pastas

```
src/features/cra/
├── index.ts
├── data/
│   ├── craData.ts
│   ├── simuladorData.ts
│   └── relatoriosData.ts
├── components/
│   ├── CraCard.vue
│   ├── cra-card/DonutRing.vue
│   ├── CreateCraModal.vue
│   ├── create-cra-modal/
│   ├── CreateCraOperacaoModal.vue
│   ├── create-cra-operacao-modal/
│   └── modals/
│       ├── CessaoFormModal.vue
│       └── SubirContratoMaeModal.vue
└── screens/
    ├── CraScreen.vue                 ← roteador in-memory
    ├── CraListScreen.vue
    ├── CraDetailScreen.vue
    ├── CraOperacaoDetailScreen.vue
    ├── CraTitleDetailScreen.vue
    ├── SacadoDetailScreen.vue
    ├── GrupoEmpresarialDetailScreen.vue
    ├── CraSimuladorScreen.vue
    ├── CraRelatoriosScreen.vue
    ├── cra-detail/                   → CraHero, TabBtn, OperacoesTable, TitulosTable, StatusKPI, ColPanel
    ├── cra-detail-tabs/              → CessoesTab, SacadosTab, GruposEmpresariaisTab, SetupTab
    ├── cra-title-detail/             → 7 abas + Field, Section, CopyButton, Participant
    ├── sacado-detail/
    └── grupo-detail/
```

**Não existe `TabCard` no CRA.** Usar `SegmentedToggle`, `TabBtn` local ou underline.

---

## 2. Roteamento in-memory (`CraScreen.vue`)

```ts
type Route =
  | { level: 'list' }
  | { level: 'cra'; craId: string }
  | { level: 'operacao'; craId: string; operacaoId: string }
  | { level: 'titulo'; craId: string; operacaoId: string; tituloId: string }
  | { level: 'sacado'; craId: string; sacadoId: string }
  | { level: 'grupo'; craId: string; grupoId: string };
```

```
list ──card──► cra ──op──► operacao ──row──► titulo
                 │              ▲               │
                 │              └───── back ────┘
                 ├── Cessão modal (fica em cra)
                 ├── sacado row ──► sacado ──back──► cra
                 └── grupo row ──► grupo ──back──► cra
```

| Evento | Destino |
|---|---|
| Card / Novo CRA | `cra` / fica em list + modal |
| Back no CRA | `list` |
| Abrir operação / título | `operacao` / `titulo` |
| Abrir sacado / grupo | `sacado` / `grupo` |
| Back sacado/grupo/op | `cra` |
| Back título | `operacao` |

Estado mutável: `craList = ref(initialCras)`. Sem URL para níveis internos.

---

## 3. Tokens e ritmo visual

| Token / medida | Uso |
|---|---|
| Page gap | **24px** (quase todas as telas) |
| Back | **48×48**, `radius-lg`, card + border, ArrowLeft 20 |
| Título H2 | `--text-xl` bold, `letter-spacing: -0.01em` |
| Eyebrow | **10px** bold uppercase `letter-spacing: 0.18em` — accent / agro / muted conforme tela |
| `--gci-base` `#083C4A` | Pill SegmentedToggle, focus ring, left border ops |
| `--agro-base` / `--accent` `#F27D26` | CTAs laranja, underline ativa, eyebrows |
| `--radius-xl` 12px | Cards, painéis, busca |
| `--radius-lg` 8px | Botões 40–48, inputs 38–44 |
| Modal overlay | `rgba(8,60,74,0.55)` + `blur(8px)`, **z-index 400**, pad 32 |
| Conteúdo max | 1456px |

### Três padrões de abas

| Padrão | Onde | Spec |
|---|---|---|
| **`SegmentedToggle` `variant="brand"`** | Seções do CRA, título (7), sacado, grupo | Shell: card + border + radius-xl, pad 4, gap 4; pill ativa `--gci-base`; btn `10px 14px`, `--text-sm` bold, ícone 14 |
| **`TabBtn`** (pill sunken) | Só Operações ↔ Títulos | Parent: pad 4, `surface-sunken`, radius-lg; btn `8px 14px`, **10px** bold `letter-spacing: 0.10em`; ativo: card + `shadow-xs` |
| **Underline** | Setup (6), Dados Contatos/Endereços, Simulador Termo | `padding: 10px 4px`, `marginRight: 22px`, ativa `2px solid var(--accent)`, `marginBottom: -1px` |

---

## 4. Listagem — `CraListScreen.vue`

### Anatomia

```
gap: 24px
┌─────────────────────────────────────────────────────────────┐
│ [Busca 56px flex:1]                    [NOVO CRA 56px]      │
├─────────────────────────────────────────────────────────────┤
│ 4 KPI cards (grid 4 cols, gap 16)                           │
├─────────────────────────────────────────────────────────────┤
│ Grid 3 cols gap 20 → CraCard                                │
└─────────────────────────────────────────────────────────────┘
```

### Busca

- Container: card, radius-xl, border; focus → border `--gci-base` + ring `0 0 0 4px rgba(8,60,74,0.06)`
- Ícone Search 18, left 20, `neutral-400`
- Input: height **56**, pl 52, pr 160, `--text-base`
- Placeholder: `"Pesquisar por nome da operação, cessionária ou CNPJ..."`
- Botão **PESQUISAR** inset right 8 / top-bottom 8, pad `0 24px`, `--action-primary-*`, radius-lg, xs bold `letter-spacing: 0.10em`

### NOVO CRA

- Height 56, pad `0 24px`, **`--agro-base`**, texto branco, radius-xl
- Shadow: `0 10px 24px -8px rgba(242,125,38,0.4)`
- Plus em círculo 22px

### KPIs (calculados de todas as operações)

| Label | Valor | Tom ícone |
|---|---|---|
| Total de Carteiras | `cras.length` | gci-light / gci-base |
| Valor em Carteira | `brl(sum carteira, compact)` | success |
| Valor Vencido | `brl(sum vencido, compact)` | danger |
| Total de Títulos | `num(sum titulos)` | `#EEF0FF` / `#4F46E5` |

- Card: pad **20**, radius-xl, border
- Ícone box **48**, radius-lg
- Label: 10px bold uppercase `letter-spacing: 0.14em` muted
- Value: `--text-xl` bold tabular

### `CraCard.vue`

- Pad **20**, gap **14**, radius-xl, `shadow-xs`
- Hover: border `rgba(8,60,74,0.25)`, shadow `0 20px 40px -16px rgba(8,60,74,0.12)`, `translateY(-5px)`
- Chip nome CRA: 10px, pad `3px 8px`, gci-light/base
- Status pill: 9px, pad `5px 10px`, success tones
- Tipo: MONO=`agro` / MULTI=`gci`
- Metrics strip: sunken, pad 12, radius-lg, 2 cols
- Donuts: Partes `--danger-*`; Novos Sacados `#7C3AED` / `#EDE9FE`

---

## 5. Detalhe do CRA — `CraDetailScreen.vue`

### Header

- Gap 16: back 48×48 + bloco título
- H2: nome do CRA
- Subtitle muted: `cessionaria · cnpj · Gestão…` (`--text-sm`)

### `CraHero`

- Fundo `--gci-base`, pad **28×32**, radius-xl, shadow teal
- Label: 11px agro uppercase (Valor Total de Emissão)
- Value: **36px** bold tabular branco
- Ícone box 56

### Accordion Carteira

- Header `--success-base`, pad **20×24**, ícone 44
- Body: 5× `StatusKPI`, gap 12, pad 20 (aberto por default)

### Seções — `SegmentedToggle` brand

| Key | Label | Ícone |
|---|---|---|
| `operacoes` | Operações | Briefcase |
| `cessoes` | Cessões | ArrowLeftRight |
| `sacados` | Sacados | Users |
| `grupos` | Grupos Empresariais | Building2 |
| `setup` | Setup | Settings2 |

Default: `operacoes`. Painéis em card `radius-xl` + border.

---

## 6. Seção Operações

### Toolbar

- Pad **20**; ícone 44 sunken; título `--text-lg`
- **NOVA OPERAÇÃO**: pad `10px 18px`, agro + shadow laranja, Plus
- Botões ícone **40×40** (colunas / filter — filter **sem lógica**)

### Nested `TabBtn`

- **VISUALIZAR OPERAÇÕES** | **VISUALIZAR TÍTULOS**

### Operações (`OperacoesTable`)

- Header: pad `14px 20px`, sunken, 10px / `letter-spacing: 0.14em`
- Rows: pad `18px 20px`, **border-left 3px `--gci-base`**, badge emissão 32
- Clique → `openOperacao`

### Títulos agregados (`TitulosTable`)

- Busca: pad 20; input h **44**, sunken, ícone left 16, pl 44
- Filtra número / cedente / sacado
- Clique linha → `openTitulo(operacaoId, tituloId)`
- Footer: pad `16px 20px`; badge TODAS gci branco, pad `6px 12px`, radius-sm

### `ColPanel`

- Absolute top 48 right 0, z-20, min-width 200–220, pad 16
- Overlay fixed inset z-10

---

## 7. Seção Cessões — `CessoesTab.vue`

- Filtro strip: sunken, pad `16px 20px`, gap 12; inputs h **38**
- Tabela + **Nova Cessão** → `CessaoFormModal`
- Row actions: editar / excluir
- Status: `RoundStatus` = ABERTA | FECHADA | CANCELADA | EM ANDAMENTO
- Tipos: COMPOSIÇÃO DE GARANTIA | DESEMBOLSO | DESEMBOLSO PARCIAL | INTEGRALIZAÇÃO

---

## 8. Seção Sacados — `SacadosTab.vue`

- Mesmo chrome de filtros (sunken strip)
- Colunas: documento, nome, tipo, limite (editável inline), especial (toggle), parte relacionada, grupo, notificação
- Clique linha → `openSacado`
- Updates via `updateSacados`

---

## 9. Seção Grupos — `GruposEmpresariaisTab.vue`

- Toggle **apto**, data contrato mãe, upload → `SubirContratoMaeModal`
- Clique linha → `openGrupo`
- Status operação: EM ANÁLISE | APROVADO | REJEITADO | PENDENTE

---

## 10. Seção Setup — `SetupTab.vue`

Underline **fora** do form (padrão nível 2), padding container `20px`:

| Sub-aba | Conteúdo |
|---|---|
| Dados gerais | Nome, custodiante, cessionária, prestador, beneficiário, grupo op |
| Limites | Tipo cálculo elegibilidade, concentração %, venc min/max, toggles accrual/IE/tops… |
| Tipos de título | Lista `bondTypes` com Checkbox ativo |
| Carteira | Nome, banco, slug, CNAB, conta, agência |
| Cobrança | Vencimento fim de semana, beneficiário endereço, juros/multa boleto |
| Elegibilidade | `eligibilityTops` (CEDENTE/SACADO + qtd + %) |

Reusa `FormField` / `SelectField` / `ToggleRow` / `SectionGroup` / `StepGrid` de `create-cra-operacao-modal/`. Botão salvar emite `updateSetup`.

---

## 11. Detalhe da Operação — `CraOperacaoDetailScreen.vue`

- Header: back + eyebrow agro `CRA · Operação` + nome
- 4 KPI cards, gap 16, pad **16**, ícone **40**, value `--text-lg`
- Tabela de títulos (mesmo chrome) + `TablePagination` default **10**
- Clique título → nível `titulo`

---

## 12. Detalhe do Título — `CraTitleDetailScreen.vue`

- Header + hero valor + status pill pad `8px 14px`
- **7 abas** `SegmentedToggle` brand:

| Aba | Componente | Notas |
|---|---|---|
| Detalhes | `DetailsTab` | Fields + participantes |
| Anexos | `AnexosTab` | — |
| Accrual | `AccrualTab` | — |
| Pagamentos | `PagamentosTab` | **placeholder** (sem fluxo FIDC) |
| Confirmações | `ConfirmacoesTab` | — |
| Movimentações | `MovimentacoesTab` | — |
| Histórico | `MovimentoTab` | timeline |

- Conteúdo: card pad **24**, radius-xl

Helpers locais: `Field`, `Section`, `CopyButton`, `Participant`.

---

## 13. Detalhe Sacado — `SacadoDetailScreen.vue`

- Eyebrow accent: `CRA · Sacado`
- Subtitle: documento · nome do CRA
- Abas brand: **Títulos** | **Dados** | **Histórico**

### Dados

- Form PF/PJ + underline **Contatos** / **Endereços**
- Emite `update` → `CraScreen` atualiza `cra.sacados`

### Títulos

- Filtra títulos do CRA cujo sacado casa com o registro

---

## 14. Detalhe Grupo — `GrupoEmpresarialDetailScreen.vue`

- Eyebrow: `CRA · Grupo Empresarial`
- Subtitle: Gerente · nome CRA
- **4 KPIs** gap **12**, pad **20**, `radius-lg` (não xl): Limite, Risco tomado, Faturamento, Data cadastro
- Abas brand:

| Key | Label |
|---|---|
| cedentes | Cedentes |
| partes | Partes Relacionadas |
| documentos | Documentos |
| conta | Conta Bancária |
| faturamento | Faturamento |
| garantias | Garantias |
| historico | Histórico |

Pastas: `screens/grupo-detail/*`.

---

## 15. Modais

Overlay padrão (exceto onde notado):

```
background: rgba(8, 60, 74, 0.55);
backdrop-filter: blur(8px);
z-index: 400;
padding: 32px;
```

Painel: radius-xl, shadow-lg, `max-height: calc(100vh - 64px)` (quando aplicável).

| Modal | Max-width | Notas |
|---|---|---|
| `CreateCraModal` | **900px** | 1 etapa: `tipoOperacao` (Mono/Multi) + `nomeFantasia` only |
| `CreateCraOperacaoModal` | **1100px** | 9 steps: info → veiculo → config → limites → cobranca → registro → pdd → grupos → resumo (ativos comentado) |
| `CessaoFormModal` | **900px** | criar/editar; `@click.self` fecha |
| `SubirContratoMaeModal` | **520px** | upload mock contrato mãe |

Wizard stepper: barra sunken; ativa `3px solid var(--agro-base)`; label **9px**/800/`letter-spacing: 0.20em`.

Novo CRA via form → `buildCraFromForm` (operacoes/cessoes/sacados/grupos vazios + `defaultSetup`).  
Nova operação → `buildOperacaoFromForm` (**não** seeda títulos).

---

## 16. Dados — `craData.ts`

### Hierarquia

```
Cra {
  operacoes: CraOperacao[]
  cessoes: Cessao[]
  sacados: Sacado[]
  grupos: GrupoEmpresarialVinculo[]
  setup: CraSetup
}
CraOperacao { titulos: CraTitulo[] }
```

### Seeds

3 CRA's: `cra-semeagro` (2 ops), `cra-ceres-agro` (1), `cra-btg-agro` (1).  
Cada um com `makeCessoes` / `makeSacados` / `makeGrupos` / `makeSetup`; ~5 títulos/op via `makeTitulos`.  
Picklist wizard: `gruposEmpresariais` (~25).

### Helpers

`brl(n, compact?)`, `num(n)`.

### Tipos-chave

Ver interfaces `Cra`, `CraOperacao`, `CraTitulo`, `Cessao`, `Sacado`, `GrupoEmpresarialVinculo`, `CraSetup` no arquivo — **não** omitir `cessoes`/`sacados`/`grupos`/`setup` no tipo `Cra`.

---

## 17. Limitações conhecidas (mock)

- Sem HTTP; tudo em memória
- Ícone Filter em Operações: **no-op**
- Aba Pagamentos do título: placeholder
- Análise Documental / alguns KPIs podem ficar 0
- Classe/emissão display mapeada por índice (`'1'`, `'2'`…)
- Wizard nova operação não cria títulos

---

## 18. Checklist visual

- [ ] Busca listagem 56px + PESQUISAR inset + NOVO CRA agro 56px
- [ ] 4 KPIs + grid 3 cards com hover translateY(-5px)
- [ ] CraHero teal pad 28×32 / value 36px
- [ ] SegmentedToggle brand nas 5 seções
- [ ] TabBtn só em Operações/Títulos; underline só em Setup (e análogos)
- [ ] Rows de operação com border-left 3px gci
- [ ] Drill-down: cra → op → título; cra → sacado; cra → grupo
- [ ] Modais 520 / 900 / 1100 com overlay teal blur z400
- [ ] CreateCra só Mono/Multi + nome fantasia

---

## 19. Referências

| Arquivo | Papel |
|---|---|
| `screens/CraScreen.vue` | Roteador + estado |
| `screens/CraListScreen.vue` | Listagem |
| `screens/CraDetailScreen.vue` | Hub 5 seções |
| `screens/cra-detail-tabs/*` | Cessões, Sacados, Grupos, Setup |
| `screens/CraOperacaoDetailScreen.vue` | Op |
| `screens/CraTitleDetailScreen.vue` | Título 7 abas |
| `screens/SacadoDetailScreen.vue` | Sacado |
| `screens/GrupoEmpresarialDetailScreen.vue` | Grupo |
| `data/craData.ts` | Tipos + seeds |
| `components/CraCard.vue` | Card |
| `components/CreateCraModal.vue` | Novo CRA |
| `components/CreateCraOperacaoModal.vue` | Nova op |
| `components/modals/*` | Cessão + Contrato mãe |
| `@/components/ui/SegmentedToggle.vue` | Abas brand |

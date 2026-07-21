# Handoff — Risco / Grupos Empresariais (pixel-perfect)

> Fonte de verdade: código em `src/features/risco/` + tokens em `src/styles/theme.css` + `guidelines/Guidelines.md`.  
> Este documento cobre **somente** listagem + detalhe de Grupos Empresariais (incluindo abas, sub-abas, shared e modais disparados daqui). Para o módulo inteiro (Dashboard, Ratings, Agrupamentos, Relatórios), ver [risco.md](./risco.md). Índice geral: [../README.md](../README.md).

**Objetivo:** permitir reimplementação pixel-perfect em outro Cursor sem abrir o Figma — copiar medidas, tokens, grids e estados exatamente como estão no Vue.

---

## 1. Entrada e roteamento

### App shell

| Item | Valor |
|---|---|
| View | `?view=risco-grupos` |
| Montagem | `ModulesScreen.vue` → `GruposScreen` |
| Sidebar | Risco → **Grupos Empresariais** |
| Container página | `<main>` com `max-width: 1456px`, `padding: var(--main-padding)` |
| Fundo | `var(--surface-page)` |

### Árvore

```
src/features/risco/
├── screens/
│   ├── GruposScreen.vue              → roteador list ↔ detail (em memória)
│   ├── GruposListScreen.vue          → listagem
│   ├── GrupoDetailScreen.vue         → detalhe (4 abas)
│   └── detail-tabs/
│       ├── DetalhesTab.vue
│       ├── ParametrizacoesTab.vue    → sub-abas underline (fora do card)
│       ├── LimiteSubTab.vue
│       ├── AutoatendimentoSubTab.vue
│       ├── GeralSubTab.vue
│       ├── GarantiaSubTab.vue
│       ├── CedentesTab.vue
│       ├── HistoricoTab.vue
│       └── shared/                   → TabCard, FormField, ToggleRow, …
├── data/
│   ├── riscoData.ts                  → tipos, GRUPOS_SEED, detalheGrupo()
│   └── vinculosStore.ts              → operações CRA/FIDC vinculadas ao grupo
└── components/modals/                → Transferir, Notificações, Habilitar, Vincular, Cedente…
```

### `GruposScreen.vue` — roteamento

```ts
type Route = { level: 'list' } | { level: 'detail'; grupoId: string };
```

| Estado | Render |
|---|---|
| `list` | `GruposListScreen` |
| `detail` + grupo em `GRUPOS_SEED` | `GrupoDetailScreen :grupo` |
| `detail` + id inválido | fallback para listagem |

- Clique na linha / menu “Parametrizações” → `openDetail(id)`
- Botão voltar no detalhe → `{ level: 'list' }`
- **Sem URL** para o detalhe (estado só em memória)

---

## 2. Tokens obrigatórios (não inventar hex)

| Token | Valor típico | Uso |
|---|---|---|
| `--gci-base` | `#083C4A` | Pill ativa do SegmentedToggle, action primary |
| `--agro-base` / `--accent` | `#F27D26` | Eyebrow, sub-aba underline, badges de filtro |
| `--accent-bg` | `#FDF1E7` | Fundo claro do accent |
| `--action-primary-bg` | `var(--gci-base)` | Botões FILTRAR / SALVAR / INCLUIR |
| `--success-base` | `#059669` | Status Normal, AddButton, Habilitar confirmar |
| `--warning-base` | `#D97706` | Parecer EXPIRANDO, Recovery |
| `--danger-base` | `#DC2626` | Parecer EXPIRADO, Special-Sit |
| `--surface-card` | branco | Cards, tabela, botões ghost |
| `--surface-sunken` | `neutral-100` | Header de tabela, hover de linha |
| `--surface-page` | fundo da página | Shell |
| `--text-strong` / `--text-default` / `--text-muted` / `--text-disabled` | hierarquia de texto | — |
| `--border-default` | borda 1px | Cards, inputs, tabela |
| `--text-xs` | 12px | Botões uppercase, badges |
| `--text-sm` | 13px | Corpo, células |
| `--text-xl` | 20px | Título do detalhe |
| `--radius-md` | 6px | Botões ícone 32px |
| `--radius-lg` | 8px | Inputs, botões 38–48px |
| `--radius-xl` | 12px | Cards, tabela, popovers |
| `--shadow-md` | `0 4px 12px rgba(15,23,42,0.10)` | Menus |
| `--shadow-lg` | `0 12px 32px rgba(15,23,42,0.16)` | Popover filtros, modais |
| `--duration-fast` | 120ms | Hover de linha |
| `--duration-base` | 200ms | Chevron, pill do SegmentedToggle |
| `--weight-bold` | 700 | Títulos, headers, pills |

**Fórmula de badge de status (listagem e header de detalhe):**

```css
background: color-mix(in srgb, ${cor} 14%, transparent);
color: ${cor};
```

Quick filter de parecer ativo usa **12%** (não 14%).

---

## 3. Listagem — `GruposListScreen.vue`

### 3.1 Anatomia vertical

```
gap: 20px entre blocos
┌─────────────────────────────────────────────────────────────┐
│ Header: eyebrow + H1 + “N grupo(s) encontrado(s)”           │
├─────────────────────────────────────────────────────────────┤
│ Toolbar: [Busca 50%] …… [Quick parecer] [Filtros] [Colunas] │
├─────────────────────────────────────────────────────────────┤
│ Tabela (card) + TablePagination                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Header

| Elemento | Spec |
|---|---|
| Eyebrow `Risco` | `11px`, uppercase, `letter-spacing: 0.18em`, `color: var(--accent)`, bold, `margin-bottom: 6px` |
| H1 `Grupos Empresariais` | `26px`, bold, `color: var(--text-strong)`, `letter-spacing: -0.02em`, `line-height: 1.15` |
| Subtitle | `--text-sm`, `--text-muted`, `margin-top: 4px` — texto dinâmico `"N grupo(s) encontrado(s)"` |

### 3.3 Toolbar

Container: `flex items-center justify-between; gap: 10px; flex-wrap: wrap`

#### Busca (esquerda)

- Wrapper: `flex: 1 1 50%; min-width: 240px; max-width: 50%; position: relative`
- Ícone Lucide `Search` 15px, `left: 12px`, `color: var(--text-muted)`
- Input: `height: 38px`, `padding: 0 12px 0 36px`, `background: var(--surface-card)`, `border: 1px solid var(--border-default)`, `border-radius: var(--radius-lg)`, `--text-sm`, `--text-strong`
- Placeholder: `"Buscar por nome"` — filtra `g.nome` (case-insensitive)

#### Cluster direita (`gap: 10px`)

**Quick filters de parecer** (3 pills, `gap: 6px`):

| Label | `ParecerStatus` |
|---|---|
| Vencido | `EXPIRADO` |
| Próximo a Vencer | `EXPIRANDO` |
| Em Dia | `CONFORME` |

- Cada pill: `height: 38px`, `padding: 0 14px`, `border-radius: var(--radius-lg)`, `--text-xs`, bold
- Inativo: border `--border-default`, bg `--surface-card`, text `--text-muted`
- Ativo: `border: 1px solid ${parecerColor}`, `background: color-mix(in srgb, ${parecerColor} 12%, transparent)`, `color: ${parecerColor}`
- Toggle: clicar de novo limpa o filtro

**Botão Filtros**

- `height: 38px`, `padding: 0 16px`, `gap: 8px`, card + border, `--text-sm` bold `--text-strong`
- Ícones: Filter 15px muted + ChevronDown 14px (rota 180° quando aberto)
- Badge de filtros ativos: `10px` bold, `padding: 2px 8px`, pill, `background: var(--accent-bg)`, `color: var(--accent)`

**Popover de filtros**

- Auto acima/abaixo (altura estimada ~380px; offset `8px`)
- `width: 440px`, `max-width: calc(100vw - 48px)`, `padding: 20px`
- `background: var(--surface-card)`, border, `border-radius: var(--radius-xl)`, `box-shadow: var(--shadow-lg)`, `z-index: 31`
- Backdrop full-screen `z-index: 30`
- Grid `2 colunas`, `gap: 14px`
- Labels: `10px` bold uppercase `letter-spacing: 0.10em` muted, `margin-bottom: 6px`
- Inputs/selects: `height: 38px`, `padding: 0 12px`, mesmos tokens da busca
- Campos: Nome, Gerente (`GERENTES_SEED`), Tipo Cliente, Status Operação, Possui Parecer (Sim/Não), Vencimento Limite min/max (`type=date`)
- Footer `margin-top: 18px`, `gap: 10px`:
  - Limpar — ghost 38px, border, muted
  - **FILTRAR** — primary `var(--action-primary-bg)`, branco, `--text-xs` bold `letter-spacing: 0.06em`, ícone Filter 13px

**Botão Colunas**

- `height: 38px`, `padding: 0 14px`, ghost, muted semibold
- Dropdown: `top: calc(100% + 8px)`, `right: 0`, `min-width: 220px`, `padding: 8px`, radius lg, shadow-md
- Itens com `@/components/ui/Checkbox.vue`; hover `var(--surface-sunken)`

### 3.4 Tabela

Container: `border: 1px solid var(--border-default)`, `border-radius: var(--radius-xl)`, `background: var(--surface-card)`, `overflow: hidden`  
Scroll interno: `overflow-x: auto` com conteúdo `width: max-content; min-width: 100%`

#### Grid

- Coluna fixa 1ª: `minmax(220px, 2.2fr)` — **Grupo Empresarial**
- Coluna fixa última: `56px` — **Ações** (header right-aligned)
- Colunas toggleáveis:

| Key | Label | Align | Largura |
|---|---|---|---|
| `statusOperacao` | Status de Operação | — | `minmax(130px, 1.3fr)` |
| `limite` | Limite | right | `minmax(88px, 1fr)` |
| `limiteAutoatendimento` | Limite Autoatend. | right | `minmax(100px, 1fr)` |
| `riscoTotal` | Risco Total | right | `minmax(96px, 1.1fr)` |
| `gerente` | Gerente | — | `minmax(140px, 1.4fr)` + **cell `padding-left: 20px`** |
| `vencimentoParecer` | Vencimento do Parecer | — | `minmax(150px, 1.4fr)` |

#### Header / linhas

| Parte | Spec |
|---|---|
| Header | `padding: 12px 20px`, bg sunken, `10px` bold uppercase `letter-spacing: 0.10em` muted |
| Linha | `padding: 14px 20px`, `column-gap: 16px`, `--text-sm`, `border-top: 1px solid var(--border-default)`, `cursor: pointer`, `white-space: nowrap` |
| Hover linha | `background: var(--surface-sunken)`, transition `var(--duration-fast)` |

#### Células

**Grupo Empresarial**

- Nome: bold `--text-strong`
- Chip documento: `margin-top: 4px`, `10px` semibold, `padding: 2px 8px`, pill, bg sunken, muted, `tabular-nums`

**Status Operação** (badge)

- `gap: 6px`, `10px` bold `letter-spacing: 0.04em`, `padding: 4px 9px`, pill
- Fundo: `color-mix(… 14%)`; bolinha `6×6` solid
- Cores (`statusOperacaoColor`):

| Status | Cor |
|---|---|
| Normal | `--success-base` |
| Terceiro | `--gci-base` |
| Pré-Recovery | `--agro-base` |
| Recovery | `--warning-base` |
| Especial | `--neutral-500` |
| Special-Sit | `--danger-base` |

**Moeda:** `brl(n, { compact: true })`, `tabular-nums`; Limite bold strong; demais `--text-default`

**Vencimento do Parecer:** data ou `"Não Informado"` muted + ícone 15px com Tooltip (`parecerLabel`)

| Parecer | Ícone | Cor |
|---|---|---|
| CONFORME | CheckCircle2 | success |
| EXPIRANDO | Clock | warning |
| EXPIRADO | XCircle | danger |
| AUSENTE | Minus | text-disabled |

Stroke ícones: `2.25`

#### Menu ⋮ da linha

- Trigger `32×32`, radius md; ícone MoreVertical 16px muted; ativo bg sunken
- Menu: `top: 36px`, `right: 0`, `min-width: 200px`, radius lg, shadow-md
- Itens (`padding: 10px 14px`, `gap: 10px`, ícone 15px):
  1. Parametrizações → abre detalhe
  2. Vincular a um veículo
  3. Transferir gerente
  4. Configurar notificações
  5. Habilitar para operar
- Hover item: sunken

### 3.5 Empty state

- `padding: 48px 24px`, centralizado, `gap: 10px`
- Ícone Building2 30px, stroke 1.5, muted opacity 0.5
- Título sm semibold: “Nenhum grupo encontrado”
- Hint xs muted: “Ajuste os filtros para ver outros resultados.”

### 3.6 Paginação

- `TablePagination` + `useTablePagination`, default **10**, opções **5 / 10 / 25 / 50**
- Footer: `padding: 12px 16px`, border-top, `--text-xs` muted
- Botões nav `28×28`, select page-size `height: 30px`

---

## 4. Detalhe — `GrupoDetailScreen.vue`

### 4.1 Shell

Root: `flex flex-col; gap: 24px`

### 4.2 Header

`flex items-center; gap: 16px`

| Peça | Spec |
|---|---|
| Voltar | `48×48`, radius lg, card + border, ArrowLeft 20px |
| Eyebrow | `Risco · Grupo Empresarial` — `10px` bold uppercase `letter-spacing: 0.18em` accent, `margin-bottom: 4px` |
| H2 | `--text-xl` bold strong `letter-spacing: -0.01em` + badge status inline (`gap: 10px`) |
| Badge status | `10px` bold `letter-spacing: 0.10em`, `padding: 5px 11px`, pill, mix 14%, bolinha `7×7`, label **UPPERCASE** (diferente da listagem) |
| Subtitle | documento `tabular-nums` + `CopyButton`, sm muted, `gap: 6px` |
| Menu ⋮ | `44×44`, MoreVertical 20px; dropdown `top: 52px`, `right: 0`, `z-index: 50`, `min-width: 240px`, `padding: 6px` |

**Ações do menu no detalhe** (sem “Parametrizações”):

1. Vincular a um veículo  
2. Transferir gerente  
3. Configurar notificações  
4. Habilitar para operar  

### 4.3 Abas principais — `SegmentedToggle` `variant="brand"`

> **Não** usar TabPill (não existe no código). Usar `@/components/ui/SegmentedToggle.vue`.

| Key | Label | Ícone |
|---|---|---|
| `detalhes` | Detalhes | Info |
| `parametrizacoes` | Parametrizações | Settings2 |
| `cedentes` | Cedentes | Users |
| `historico` | Histórico | History |

**Shell brand:** `padding: 4px`, `gap: 4px`, card + border, radius xl, wrap  
**Pill deslizante:** `background: var(--gci-base)`, radius lg, animação `duration-base`  
**Opção:** `padding: 10px 14px`, `gap: 8px`, sm bold; inativa muted; ativa `#fff`; ícone 14px  

Default: `detalhes`

### 4.4 Dados do detalhe

```ts
const det = reactive(detalheGrupo(props.grupo));
det.parametrizacoes.autoatendimento.veiculosOperacao = veiculosFromVinculos(props.grupo.id);
```

- `GrupoEmpresarial` → header / KPIs da listagem  
- `DetalheGrupo` → abas (partes, parametrizações, cedentes, histórico)  
- Mutações locais via emits das abas

---

## 5. Aba Detalhes — `DetalhesTab.vue`

Root `gap: 20px`

1. **TabCard “Partes Relacionadas”** (Users)  
   - Tabela grid `1.4fr 1fr 1.2fr 1fr 1fr`, header `padding: 10px 16px` sunken, rows `12px 16px`  
   - Paginação sunken compact, page sizes `[5,10,25]`, default 5  

2. Grid `1fr 1fr` gap 16  
   - **Parecer de Crédito** (FileText): arquivo com Eye/RefreshCw 28×28; empty dashed danger  
   - **Rating do Cliente** (Star, `has-save`): SelectField com `RATINGS_SEED` + `"NÃO SE APLICA"`  

3. **Gerente do Grupo** (UserCog) — se `gerentePorNome` achar: grid 3 cols (Nome, Documento, Telefone, Cidade, Estado)

---

## 6. Aba Parametrizações — `ParametrizacoesTab.vue`

### 6.1 Sub-abas underline (padrão nível 2)

**Regra dura:** barra **fora** do card branco; cada `*SubTab` monta `TabCard`(s) por dentro.

```
gap: 20px
┌────────────────────────────────────────┐
│ Limite | Autoatendimento | Geral | Garantia   ← underline
├────────────────────────────────────────┤
│ [ TabCard … ]                          │
└────────────────────────────────────────┘
```

Botão de sub-aba:

- `padding: 10px 4px`, `margin-right: 22px`, `margin-bottom: -1px`
- Ativa: `color: var(--text-strong)`, `border-bottom: 2px solid var(--accent)`
- Inativa: muted, border transparente
- Font: `--text-sm` bold  
- Default: **Limite**

### 6.2 Limite — `LimiteSubTab.vue`

- Banner warning se `reparametrizacaoData`: padding `14px 18px`, radius lg, `status-warning-bg` + border warning, AlertTriangle 18px  
- TabCard “Limites por Agrupamento” (Layers)  
- CTA **INCLUIR LIMITE**: height 36px, primary, Plus 14px, xs bold `letter-spacing: 0.06em`  
- Tabelas agrupadas: header sunken `12px 16px`; grid `minmax(140px,2fr) minmax(88px,1fr) minmax(100px,1.1fr) 40px`  
- Menu linha: Edit / Deletar (danger)  
- Modais: `IncluirLimiteModal`, `EditarLimiteModal`

### 6.3 Autoatendimento — `AutoatendimentoSubTab.vue`

- TabCard (Zap, `has-save`)  
- Grid 3 cols: limite automático, taxa fee %, taxa risco %  
- Tabela veículos (ou EmptyState): grid `1fr 1.4fr 110px 44px`  
- Toggle preferencial: track `34×20`, off `--border-strong`, on `--success-base`, knob 16px  
- Menu → “Alterar Taxa de Cessão” → mini-modal inline (z-index 450, overlay `rgba(8,60,74,0.45)` blur 6px, max-width 420px)  
- Save → `rememberVeiculosMeta(grupoId, veiculos)`

### 6.4 Geral — `GeralSubTab.vue`

Stack de TabCards (`gap: 20px` entre cards):

| Card | Ícone | Destaques |
|---|---|---|
| Confirmações | ClipboardCheck | grid 12-col |
| Notificações | Users | spans |
| Concentração de Sacados | UserCheck | exceções + AddButton |
| Partes Relacionadas | Users | tabela min-width 900px, has-save |
| Ativos Não Performados | Truck | ToggleRow + PctInput |
| Crédito e Serasa | ShieldCheck | ToggleRow + DiasInput, has-save |

### 6.5 Garantia — `GarantiaSubTab.vue`

- TabCard (ShieldCheck, has-save)  
- ToggleRows + % condicional  
- Form add + tabela de tipos; `EditarGarantiaModal`

---

## 7. Aba Cedentes — `CedentesTab.vue`

- Empty: EmptyState Users — “Nenhum cedente vinculado”  
- Tabela: border xl, header `12px 20px`, grid `1.2fr 1.8fr 1.6fr 1fr 1fr`  
- Colunas: Documento, Nome, E-mail, Cidade-UF, Tipo  
- Row `14px 20px`, hover sunken, click → `CedenteDetailModal`  
- Paginação default 10  

### `CedenteDetailModal`

- Max-width **1000px**, max-height 92vh  
- Overlay padrão: `rgba(8,60,74,0.55)` + blur 8px, z-index 400  
- Header: nome + badge status + **EDITAR CADASTRO** 38px + fechar 36px  
- KPIs: 4× `KpiCard` (sunken, label xs muted, value md bold)  
- SegmentedToggle brand: Contatos / Endereços / Documentos  
- Editar → `EditarCadastroCedenteModal` (z 450, max-width 760px, PF/PJ 12-col, **ATUALIZAR**)

---

## 8. Aba Histórico — `HistoricoTab.vue`

- Empty: EmptyState History  
- Timeline em `Section` “Linha do Tempo”  
- Eyebrow Section: 10px accent uppercase `letter-spacing: 0.18em`, `margin-bottom: 16px`  
- Evento: `gap: 16px`, `padding: 12px 0`  
- Dot: `12×12`, `background: var(--gci-base)`, `margin-top: 4px`  
- Conector: `2px` `--border-default`  
- Descrição sm semibold; timestamp xs muted + Clock 12px

---

## 9. Shared — `detail-tabs/shared/`

| Componente | Visual / comportamento |
|---|---|
| **TabCard** | Border xl card; header `16px 22px` + ícone 16 muted + título sm bold; body `22px`; footer save `14px 22px`; botão **SALVAR** `40px` h, primary, xs bold `letter-spacing: 0.08em` |
| **Section** | Eyebrow 10px accent `0.18em`, `margin-bottom: 16px`; slot `action` |
| **FieldLabel** | 10px bold muted uppercase `0.10em`, `margin-bottom: 6px` |
| **FormField** | Label + input `40px` h, `padding: 0 14px`, radius lg |
| **SelectField** | Idem FormField, select 40px |
| **PctInput** | Exibe `n.toFixed(2)%`; disabled → sunken + text-disabled |
| **DiasInput** | number, 40px |
| **ToggleRow** | Full: `padding: 14px 18px`; on → border/success-light; track 44×24 (compact 34×20); knob 18/16 |
| **EmptyState** | Sunken + dashed, `padding: 32px 24px`, ícone 26 opacity 0.5 |
| **AddButton** | `40px` h, **`background: var(--success-base)`** (verde, não primary), Plus 14px, “ADICIONAR” |
| **CopyButton** | Ícone 13px; muted → success 1.5s ao copiar |

Checkbox de sistema: `@/components/ui/Checkbox.vue` (`checked`, `indeterminate?`, `disabled?`, emit `change`).

---

## 10. Modais disparados de Grupos

### Overlay padrão (maioria)

```
background: rgba(8, 60, 74, 0.55);
backdrop-filter: blur(8px);
z-index: 400;
padding: 32px;
```

Painel: radius xl, shadow-lg, header/footer com border-default.  
Ícone header comum: `40×40` accent-bg / accent.

| Modal | Max-width | Notas |
|---|---|---|
| `TransferirGerenteModal` | 460px | Select exclui gerente atual; **TRANSFERIR** |
| `ConfigurarNotificacoesModal` | 480px | 3 ToggleRows; **SALVAR** |
| `HabilitarOperarModal` | 440px | Overlay **diferente**: `rgba(15,23,42,0.45)`, **z-index 600**, sem blur; confirm **verde** `--success-base`; ícone círculo 52px success-bg |
| `VincularAgrupamentoModal` | 1100px | Altura `calc(100vh - 64px)`; busca 44px; pills CRA/FIDC; grade **3 cols** cards; check circular 20px; footer 44px; props `linkKey: 'grupoIds'` |
| `CedenteDetailModal` | 1000px | Ver §7 |
| `EditarCadastroCedenteModal` | 760px | z 450 |
| `IncluirLimiteModal` | 560px | Scroll body; rows dashed empty |
| `EditarLimiteModal` | 480px | Valor + vencimento |
| `EditarGarantiaModal` | 520px | Campos garantia |

Primary desabilitado: `background: var(--neutral-200)`, `color: var(--text-disabled)`.

---

## 11. Dados e estado

### `GrupoEmpresarial` (listagem / header)

```ts
interface GrupoEmpresarial {
  id: string;
  documento: string;
  nome: string;
  tipoCliente: 'Monocedente' | 'Multicedente';
  statusOperacao: StatusOperacao;
  limite: number;
  limiteAutoatendimento: number;
  riscoTotal: number;
  riscoUraStt: number;
  gerente: string;
  vencimentoLimite: string | null;   // dd/mm/aaaa
  vencimentoParecer: string | null;
  parecerCredito: ParecerStatus;
  rating: string;
  valorVencido: number;
}
```

### `detalheGrupo(grupo)` → `DetalheGrupo`

```ts
{
  partesRelacionadas,
  parametrizacoes: { limite, autoatendimento, geral, garantia },
  cedentes,   // ~2 mock por grupo
  historico,  // ~3 eventos
}
```

### `vinculosStore.ts` (sincroniza list ↔ detail)

| Export | Papel |
|---|---|
| `operacoesVinculaveis` | ref compartilhada de CRA/FIDC |
| `veiculosFromVinculos(grupoId)` | → veículos do Autoatendimento |
| `rememberVeiculosMeta` | persiste taxa/preferencial em memória |
| `applyGrupoVinculos` | após Vincular modal |

### Helpers obrigatórios

`brl`, `statusOperacaoColor`, `parecerLabel`, `parecerColor`, `gerentePorNome`, seeds `GRUPOS_SEED`, `GERENTES_SEED`, `RATINGS_SEED`, opts de limite/garantia.

---

## 12. Regras de implementação (para o outro Cursor)

1. **Abas nível 1** = `SegmentedToggle variant="brand"` (pill gci).  
2. **Sub-abas nível 2** = underline `2px solid var(--accent)` **fora** do TabCard.  
3. **Não** recriar TabPill — não existe.  
4. Reutilizar `shared/` (TabCard, FormField, ToggleRow, AddButton verde).  
5. Badges de status: `color-mix` 14% + helpers de cor — sem hex solto.  
6. Moeda e datas: sempre `tabular-nums`.  
7. Listagem gap vertical **20px**; detalhe **24px**.  
8. Menu da listagem inclui “Parametrizações”; menu do detalhe **não**.  
9. HabilitarOperarModal tem overlay/z-index/cor próprios — não copiar o overlay teal.  
10. Tudo mock em memória; sem HTTP.

---

## 13. Checklist de validação visual

- [ ] Eyebrow accent 0.18em; H1 26px listagem; H2 `--text-xl` detalhe  
- [ ] Quick parecer pills 38px com mix 12% ativo  
- [ ] Popover filtros 440px + backdrop FILTRAR primary  
- [ ] Tabela: 1ª coluna grupo+chip doc; gerente com `padding-left: 20px`  
- [ ] Status badge listagem (não uppercase) vs detalhe (UPPERCASE + bolinha 7px)  
- [ ] SegmentedToggle brand com pill `#083C4A`  
- [ ] Sub-abas Parametrizações underline laranja fora do card  
- [ ] TabCard paddings 16/22/22/14; SALVAR 40px  
- [ ] AddButton verde success (não gci)  
- [ ] Empty states dashed sunken  
- [ ] Vincular modal full-height 1100px grade 3 cols  

---

## 14. Referências de arquivo

| Arquivo | Papel |
|---|---|
| `screens/GruposScreen.vue` | Roteador |
| `screens/GruposListScreen.vue` | Listagem pixel |
| `screens/GrupoDetailScreen.vue` | Shell detalhe |
| `screens/detail-tabs/*` | Abas / sub-abas |
| `screens/detail-tabs/shared/*` | Design system local |
| `data/riscoData.ts` | Tipos + seeds + helpers |
| `data/vinculosStore.ts` | Vínculos CRA/FIDC |
| `components/modals/*` | Modais |
| `src/components/ui/SegmentedToggle.vue` | Abas nível 1 |
| `src/components/ui/TablePagination.vue` | Paginação |
| `src/components/ui/Checkbox.vue` | Checkbox |
| `src/styles/theme.css` | Tokens |

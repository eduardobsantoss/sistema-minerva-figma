# Handoff — Shell do App (Sidebar, Header e Dashboard)

> Fonte de verdade complementar: `guidelines/Guidelines.md` (design tokens) e `src/styles/theme.css` (variáveis de layout responsivo). Este documento cobre o **esqueleto global** da aplicação — login → shell principal → menu lateral, topbar e tela inicial de módulos.

---

## 1. Onde fica e como o shell é montado

### Fluxo de entrada

```
App.vue
├─ LoginScreen.vue          → tela de login (mock; emite submit)
└─ ModulesScreen.vue        → shell principal após login
    ├─ Sidebar.vue          → menu lateral fixo
    ├─ Topbar.vue           → header com título dinâmico
    └─ <main>               → conteúdo da view ativa
        ├─ DashboardView.vue        → view === 'dashboard'
        ├─ *Screen (features)       → módulos implementados
        └─ Placeholder.vue          → módulos ainda não implementados
```

- `App.vue` decide entre `login` e `modules` com um `ref` local.
- Se a URL já tiver `?view=`, o login é **pulado** (`SKIP_LOGIN`) — útil para capturas e deep links manuais.
- Após submit do login, `screen` vira `'modules'` e `ModulesScreen` assume o layout completo.
- Na tela de módulos, `App.vue` aplica `overflow: hidden` no wrapper raiz para evitar scroll duplo no `body`.

### Modelo de altura e scroll (notebook / telas menores)

O shell ocupa **exatamente a viewport** e concentra o scroll no conteúdo principal:

```
┌─────────────────────────────────────────────────────────────┐
│ App.vue (size-full, overflow:hidden quando modules)         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ModulesScreen (height:100vh, overflow:hidden)           │ │
│ │ ┌──────────┬──────────────────────────────────────────┐ │ │
│ │ │ Sidebar  │ Coluna principal (flex:1, min-height:0)  │ │ │
│ │ │ height   │ ┌ Topbar (fixo) ───────────────────────┐ │ │ │
│ │ │ 100%     │ └ Main (overflow-auto) ← ÚNICO SCROLL │ │ │ │
│ │ │ z-index:2│    conteúdo da view ativa              │ │ │ │
│ │ │          │                                        │ │ │ │
│ │ │ nav      │                                        │ │ │ │
│ │ │ scroll   │                                        │ │ │ │
│ │ │ interno  │                                        │ │ │ │
│ │ │ (oculto) │                                        │ │ │ │
│ │ │ user card│                                        │ │ │ │
│ │ └──────────┴──────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

| Camada | Scroll | Observação |
|---|---|---|
| `html` / `body` | Não (padrão restaurado) | `theme.css` define `html { overflow-y: visible }` para não reservar barra global do Vuetify |
| `ModulesScreen` | Não | `height: 100vh; overflow: hidden` |
| Sidebar `<nav>` | Sim, interno | `overflow-y: auto` com barra **oculta** (`.sidebar-nav-scroll`) |
| `<main>` | Sim | `overflow-auto` — scroll principal da aplicação |

**Problemas que esse modelo evita:** faixa branca abaixo do menu lateral, sidebar mais alto que a viewport, e dois scrolls simultâneos (página + conteúdo).

### Árvore de arquivos relevante

```
src/app/
├── App.vue                 → gate login / modules
├── ModulesScreen.vue       → orquestra sidebar, topbar, views e estado global
├── DashboardView.vue       → hero + grid de ModuleCard
└── Placeholder.vue         → fallback "será implementado em breve"

src/components/layout/
├── Sidebar.vue             → navegação lateral + user card
└── Topbar.vue              → título, busca, notificações, chip do usuário

src/features/dashboard/
├── index.ts
├── data/modulesData.ts     → lista de módulos do dashboard + toneStyles
└── components/ModuleCard.vue

src/assets/
├── gci-logo-mark.png       → logo compacta (sidebar colapsada)
└── gci-logo-full.png       → logo completa (sidebar expandida)
```

---

## 2. Navegação e estado global

Toda a navegação do shell é controlada em `ModulesScreen.vue` — **não há Vue Router** hoje; a view ativa é um `ref<View>`.

### Views disponíveis

| `view` (interno) | Título no Topbar (`titleMap`) | Componente renderizado |
|---|---|---|
| `dashboard` | Bem-vindo(a) ao Minerva Gestão | `DashboardView` |
| `solicitacoes` | Solicitação de Operação | `SolicitacaoScreen` |
| `fidcs` | Gestão de FIDC's | `FidcScreen` |
| `cras` | Gestão de CRA's | `CraScreen` |
| `cobranca` | Cobrança | `Placeholder` |
| `cobranca-notif` | Notificações de Cobrança | `CobrancaScreen` |
| `risco-dashboard` | Risco | `RiscoDashboardScreen` |
| `risco-grupos` | Grupos Empresariais | `GruposScreen` |
| `risco-ratings` | Cadastro de Rating | `RatingsScreen` |
| `risco-agrupamentos` | Agrupamentos de Limite | `AgrupamentosScreen` |
| `risco-rel` | Relatórios de Risco | `RelatoriosScreen` |
| `passivo` | Passivo | `Placeholder` |
| `colab` | Colaboradores | `Placeholder` |
| `rel` | Relatórios | `Placeholder` |
| `conf` | Configurações | `Placeholder` |

### Query string `?view=`

- **Leitura na carga:** `getViewFromUrl()` lê `?view=` e valida contra `VALID_VIEWS`; valor inválido ou ausente → `dashboard`.
- **Popstate:** `handlePopstate` atualiza `view` quando o usuário usa voltar/avançar do browser — **somente se a URL já tiver sido alterada externamente**.
- **Importante:** `handleNavigate` **não** chama `history.pushState` nem atualiza `window.location.search`. Clicar no menu muda só o `ref` local. Para deep link funcionar de ponta a ponta, falta sincronizar URL na navegação.

### Estado da sidebar

| Estado | Tipo | Comportamento |
|---|---|---|
| `collapsed` | `boolean` | `true` = 80px de largura; `false` = `var(--sidebar-width-expanded)` |
| `openMenu` | `string \| null` | Chave do item pai com submenu aberto (`'cobranca'` ou `'risco'`) |
| `userToggledSidebar` | `boolean` | Após toggle manual, o resize automático deixa de sobrescrever `collapsed` |

**Colapso automático:** em `resize`, se `innerWidth <= 1366` (`LAPTOP_BREAKPOINT`), a sidebar colapsa — a menos que o usuário já tenha clicado no botão de colapsar/expandir.

**Submenu na carga:** se `?view=` começa com `cobranca` ou `risco`, `openMenu` já inicia aberto para o grupo correspondente.

### Eventos Sidebar → ModulesScreen

| Evento | Handler | Efeito |
|---|---|---|
| `navigate` | `handleNavigate(key)` | `view = key` |
| `toggle` | `handleToggleSidebar()` | inverte `collapsed`, marca `userToggledSidebar` |
| `toggleMenu` | `onToggleMenu(key)` | abre/fecha accordion do submenu |

### Clique no dashboard (cards)

`DashboardView` emite `moduleClick(title)`. `handleModuleClick` mapeia **só alguns** títulos para views reais:

| Título do card | View destino | Observação |
|---|---|---|
| Solicitação de Operação | `solicitacoes` | |
| FIDC's | `fidcs` | |
| CRA's | `cras` | |
| Cobrança | `cobranca-notif` | abre submenu `cobranca` |
| Risco | `risco-dashboard` | abre submenu `risco` |

Cards como Admin, Gerencial, Ativos, Passivo, Garantias e Confina **não têm handler** — o clique não navega.

---

## 3. Sidebar (`Sidebar.vue`)

### Estrutura visual (coluna flex, altura fixa)

O `<aside>` preenche **100% da altura** do shell (`height: 100%` dentro do container `100vh`) e usa `flex-direction: column`:

1. **Brand** — botão com logo; clique navega para `dashboard`. `flex-shrink: 0`.
   - Expandida: `gci-logo-full.png` (altura 56px).
   - Colapsada: `gci-logo-mark.png` (42×42px).
2. **Botão colapsar** — círculo 24px, `position: absolute; right: -12px; top: 76px`, fundo `--agro-base`, **`z-index: 30`**. Fica parcialmente fora da borda direita da sidebar; o `<aside>` usa **`z-index: 2`** para empilhar acima da coluna de conteúdo (evita a bolinha laranja ficar atrás do main).
3. **Nav** (`.sidebar-nav-scroll`) — lista `items` hardcoded; **`flex: 1; min-height: 0; overflow-y: auto`**. Quando há muitos itens/submenus abertos (notebook), **só esta área rola**; a barra de scroll é oculta via CSS (`scrollbar-width: none`, `::-webkit-scrollbar { display: none }`).
4. **User card** — rodapé fixo (`flex-shrink: 0`, `margin-top: 12px`): avatar, nome "Eduardo Santos", role "Administrador", botão logout (visual apenas).

**Importante:** não usar `overflow: hidden` no `<aside>` — isso cortava o botão colapsar (`right: -12px`) e/ou empilhava incorretamente com o conteúdo. O contenimento de scroll fica apenas no `<nav>`.

### Itens do menu (`items`)

| key | label | Subitens |
|---|---|---|
| `dashboard` | Dashboard | — |
| `solicitacoes` | Solicitação de Operação | — |
| `fidcs` | FIDC's | — |
| `cras` | CRA's | — |
| `cobranca` | Cobrança | `cobranca-notif` → Notificações de Cobrança |
| `risco` | Risco | dashboard, grupos, ratings, agrupamentos, relatórios |
| `passivo` | Passivo | — |
| `colab` | Colaboradores | — |
| `rel` | Relatórios | — |
| `conf` | Configurações | — |

Ícones: `lucide-vue-next` (18px nos itens principais, 14px nos subitens).

### Comportamento de clique

- Item **sem** filhos → `emit('navigate', it.key)`.
- Item **com** filhos → se expandida, `toggleMenu`; **sempre** navega para o **primeiro** filho (`it.children[0].key`). Ex.: clicar em "Risco" vai para `risco-dashboard`, não só abre o accordion.

### Estados visuais

| Elemento | Inativo | Hover | Ativo |
|---|---|---|---|
| Item principal | `rgba(255,255,255,0.6)` | fundo 5% branco, texto branco | fundo 10% branco, texto `--agro-base` + barra lateral 4px laranja |
| Subitem | `rgba(255,255,255,0.55)` | fundo 4% branco | fundo `rgba(242,125,38,0.12)`, texto `--agro-base` |

- Fundo da sidebar: `--gci-base` (teal escuro).
- Sombra: `6px 0 24px rgba(15,23,42,0.12)`.
- Empilhamento: `position: relative; z-index: 2` no `<aside>`.
- Submenu: animação `max-height` + `opacity`; linha vertical guia `rgba(255,255,255,0.1)` à esquerda dos subitens.
- **Tooltip colapsada:** ao hover com sidebar colapsada, label flutuante à direita do ícone (card branco `--surface-card`, `z-index: 100`).

### Props

```ts
interface Props {
  active: string;        // view atual (destaca item/subitem)
  collapsed: boolean;
  openMenu: string | null;
}
```

---

## 4. Header / Topbar (`Topbar.vue`)

### Layout

Flex horizontal, altura `var(--topbar-height)` (80px desktop; 72px ≤1180px).

```
[ Título h2 ]  ——— flex:1 ———  [ Busca ]  [ Sino ]  |  [ Nome + role ]  [ Avatar ES ]
```

| Zona | Detalhes |
|---|---|
| Título | Prop `title` vinda de `titleMap[view]`; `font-size: --text-xl`, bold, ellipsis |
| Busca | Input 40px, largura 256px, placeholder "Buscar no sistema..."; focus ring `rgba(8,60,74,0.20)` |
| Notificações | Botão 40×40; badge 8px `--agro-base` no canto |
| Usuário | Nome/role à direita + avatar 40×40 com iniciais "ES", fundo `--gci-base` |

Fundo: `--surface-card`; borda inferior `--border-default`.

### Responsividade (via classes em `theme.css`)

| Breakpoint | Comportamento |
|---|---|
| `≤ 1180px` | `.topbar-search { display: none }` — campo de busca some |
| `≤ 900px` | `.topbar-user-meta { display: none }` — nome, role e divisor somem; ficam título + sino + avatar |

Busca e notificações são **somente visuais** — sem lógica de filtro ou painel.

---

## 5. Dashboard inicial (`DashboardView.vue`)

### Conteúdo

1. **Eyebrow** — "Visão Geral" (`11px`, uppercase, `letter-spacing: 0.18em`, `--accent`).
2. **Título** — "Módulos do Sistema" (`28px`, bold).
3. **Subtítulo** — texto muted, `margin-bottom: 40px`.
4. **Grid** — `repeat(auto-fit, minmax(var(--dashboard-grid-min), 1fr))`, gap `24px`, min coluna `240px` (`--dashboard-grid-min`).

Cada célula envolve `ModuleCard` e repassa clique via `@module-click`.

### Dados (`modulesData.ts`)

```ts
interface ModuleItem {
  title: string;
  description: string;
  icon: Component;   // lucide-vue-next
  tone: Tone;        // 'info' | 'success' | 'warning' | 'danger' | 'accent'
}
```

11 módulos no array `modules` (ordem fixa no grid). `toneStyles` mapeia cada tom para `{ bg, color }` usando tokens semânticos (`--gci-light`, `--success-light`, `--agro-light`, etc.).

### `ModuleCard.vue`

Card clicável com micro-interações:

| Estado | Estilo |
|---|---|
| Repouso | borda `--border-default`, sem sombra |
| Hover | borda laranja 30%, `translateY(-4px)`, sombra suave, círculo decorativo no canto muda para laranja 8% |
| CTA | "Acessar módulo →" aparece no hover (opacity + translate) |

- Padding `24px`, **`height: 100%`** + `min-height: 200px` — cards da mesma linha do grid ficam com **altura uniforme** (descrições com 2 ou 3 linhas não desalinham a linha).
- Ícone em caixa 56×56 com fundo do `tone`.
- Título `--text-lg` bold; descrição `--text-sm` muted, `--leading-relaxed`.
- Espaçador flex interno empurra o CTA "Acessar módulo →" para o rodapé do card.

### Container do main e shell

**ModulesScreen** — wrapper do shell:

```vue
<div class="flex w-full" style="height: 100vh; overflow: hidden; background: var(--surface-page)">
  <Sidebar ... />
  <div class="flex flex-col" style="flex: 1; min-width: 0; min-height: 0">
    <Topbar ... />
    <main class="overflow-auto" style="flex: 1; padding: var(--main-padding)">
      ...
    </main>
  </div>
</div>
```

- `min-height: 0` na coluna principal é **obrigatório** para o flex permitir scroll no `<main>` sem estourar o `100vh`.
- Scroll vertical fica **somente** no `<main class="overflow-auto">`, não no `body` nem na sidebar inteira.

---

## 6. Tipografia e espaçamento (shell)

Tokens em `src/styles/theme.css`:

| Token / contexto | Valor padrão | ≤1440px | ≤1180px | ≤900px |
|---|---|---|---|---|
| `--sidebar-width-expanded` | 280px | 240px | — | — |
| `--main-padding` | 40px | 28px | 20px | 16px |
| `--topbar-padding-x` | 32px | 24px | 16px | — |
| `--topbar-height` | 80px | — | 72px | — |

### Global (`html`, `body`, `#root`)

- `html, body, #root { height: 100% }` — cadeia de altura para login e shell.
- `html { overflow-y: visible }` — anula o `overflow-y: scroll` forçado pelo Vuetify; evita barra de scroll global quando o conteúdo cabe na viewport.

| Elemento | Tipografia |
|---|---|
| Título topbar | `--text-xl`, `--weight-bold`, `letter-spacing: -0.01em` |
| Item sidebar (principal) | `--text-sm`, `--weight-medium` |
| Subitem sidebar | `--text-xs`, `--weight-medium` |
| User card sidebar (nome) | `12px` bold; role `10px` 60% branco |
| Dashboard H1 | `28px` bold |
| Dashboard eyebrow | `11px` uppercase, `--accent` |

Durações de transição: `--duration-fast` (120ms), `--duration-base` (200ms), `--duration-slow` (300ms), easing `--ease-standard`.

---

## 7. Placeholder e módulos pendentes

`Placeholder.vue` recebe `name` (do `titleMap`) e exibe card centralizado com mensagem *"O módulo X será implementado em breve."*

Views que caem no placeholder hoje: `cobranca` (item pai sem tela própria), `passivo`, `colab`, `rel`, `conf`.

No **dashboard**, vários cards existem só como vitrine (Admin, Gerencial, Ativos, etc.) — sem rota no `handleModuleClick`.

---

## 8. O que ainda é mock / fora de escopo

- Login não autentica — qualquer submit entra no app;
- Nome do usuário, role e avatar hardcoded em Sidebar e Topbar;
- Botão logout sem ação;
- Busca global e sino de notificações sem backend;
- Sincronização URL ↔ `view` incompleta (leitura inicial + popstate, sem `pushState` na navegação);
- Cards do dashboard sem paridade 1:1 com itens da sidebar (ex.: "Admin" no grid vs "Configurações" no menu);
- Módulos do grid sem handler de clique permanecem estáticos.

---

## 9. Checklist para evoluir o shell

1. **Nova view de módulo** — adicionar em `type View`, `VALID_VIEWS`, `titleMap` e bloco `v-else-if` em `ModulesScreen.vue`; espelhar item em `Sidebar.vue` se necessário.
2. **Submenu** — usar `children` no `NavItem`; lembrar que clique no pai navega para o primeiro filho.
3. **Dashboard** — adicionar entrada em `modulesData.ts` **e** mapear em `handleModuleClick` se o card deve navegar.
4. **Título do header** — sempre via `titleMap`; não hardcodar título dentro das feature screens no shell.
5. **Layout responsivo** — preferir tokens `--main-padding`, `--topbar-height`; classes utilitárias `.topbar-search` / `.topbar-user-meta` para esconder blocos.
6. **Scroll do shell** — manter `ModulesScreen` em `100vh` + `overflow: hidden`; scroll só no `<main>`. Sidebar: scroll interno no `<nav class="sidebar-nav-scroll">`, **sem** `overflow: hidden` no `<aside>`.
7. **Botão colapsar** — permanece `right: -12px`; sidebar precisa `z-index: 2` (botão `z-index: 30`) para não ficar atrás do conteúdo.
8. **Deep links** — ao integrar router ou `history.pushState`, manter `VALID_VIEWS` e lógica de `openMenu` para submenus.
9. **Auth real** — substituir mock em `App.vue` + dados do usuário na Sidebar/Topbar por store/session compartilhada.

---

## 10. Referências rápidas de arquivos

| Arquivo | Conteúdo |
|---|---|
| `src/app/App.vue` | Gate login/modules; skip login com `?view=`; `overflow: hidden` no wrapper quando `modules` |
| `src/app/ModulesScreen.vue` | Shell `100vh`, estado `view`, sidebar, topbar, switch de telas |
| `src/app/DashboardView.vue` | Hero + grid de módulos |
| `src/app/Placeholder.vue` | Fallback de módulo não implementado |
| `src/components/layout/Sidebar.vue` | Menu, collapse (z-index), scroll interno oculto no nav, submenus, user card |
| `src/components/layout/Topbar.vue` | Título, busca, notificações, chip usuário |
| `src/features/dashboard/data/modulesData.ts` | Lista e tons dos cards |
| `src/features/dashboard/components/ModuleCard.vue` | Card interativo do dashboard (altura uniforme por linha) |
| `src/styles/theme.css` | Tokens de layout shell, media queries, `html overflow-y` |
| `docs/handoff/risco.md` | Handoff do módulo Risco (submenu da sidebar) |
| `docs/handoff/solicitacao-listagem.md` | Handoff da listagem de Solicitação de Operação |
| `docs/handoff/solicitacao-detalhes.md` | Handoff do detalhe de Solicitação de Operação |

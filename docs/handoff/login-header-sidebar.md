# Handoff — Login, Header e Menu Lateral (pixel-perfect)

> Fonte de verdade: `src/features/auth/screens/LoginScreen.vue`, `src/components/layout/Topbar.vue`, `src/components/layout/Sidebar.vue`, `src/app/App.vue`, `src/app/ModulesScreen.vue` + tokens em `src/styles/theme.css` e `guidelines/Guidelines.md`.  
> Dissecção no app: **Configurações → Telas → Login / Shell / Home** (`?view=conf`).  
> Shell completo (dashboard, navegação, placeholders): [layout-shell.md](./layout-shell.md).  
> Spec de origem Figma Make: `docs/figma-reference/pasted_text/minerva-login-modules.html`.

**Objetivo:** reimplementação pixel-perfect em outro Cursor sem Figma — medidas, tokens, grids e estados exatamente como no Vue.

---

## 1. Entrada e montagem

### Fluxo

```
App.vue
├─ LoginScreen.vue     → screen === 'login'  (emite submit)
└─ ModulesScreen.vue   → screen === 'modules'
    ├─ Sidebar.vue
    ├─ Topbar.vue
    └─ <main> …views…
```

| Comportamento | Detalhe |
|---|---|
| Gate | `ref<'login' \| 'modules'>` em `App.vue` |
| Skip login | Se URL tem `?view=`, `SKIP_LOGIN = true` → abre direto em `modules` |
| Pós-login | `@submit` → `screen = 'modules'` (mock; qualquer submit entra) |
| Overflow | Em `modules`, wrapper raiz recebe `overflow: hidden` |

### Árvore de arquivos

```
src/app/
├── App.vue
└── ModulesScreen.vue

src/features/auth/
├── index.ts                    → export LoginScreen
└── screens/LoginScreen.vue

src/components/layout/
├── Sidebar.vue
└── Topbar.vue

src/assets/
├── logo-azul-sem-bg.png        → login
├── gci-logo-full.png           → sidebar expandida
└── gci-logo-mark.png           → sidebar colapsada

src/styles/theme.css            → tokens + breakpoints do shell
```

### Tokens de layout (shell)

| Token | Desktop | ≤1440px | ≤1180px | ≤900px |
|---|---|---|---|---|
| `--sidebar-width-expanded` | **280px** | 240px | 240px | 240px |
| Sidebar colapsada | **80px** (constante no JS) | | | |
| `--topbar-height` | **80px** | 80px | **72px** | 72px |
| `--topbar-padding-x` | **32px** | 24px | 16px | 16px |
| `--main-padding` | **40px** | 28px | 20px | 16px |

Colapso automático da sidebar: `window.innerWidth <= 1366` (`LAPTOP_BREAKPOINT`), até o usuário clicar no toggle.

### Cores e raios usados nestas telas

| Token | Valor |
|---|---|
| `--gci-base` | `#083C4A` |
| `--agro-base` | `#F27D26` |
| `--surface-page` | `#F8FAFB` (`--neutral-50`) |
| `--surface-card` | `#FFFFFF` |
| `--surface-sunken` | `#F1F5F7` (`--neutral-100`) |
| `--border-default` | `#E3E9ED` (`--neutral-200`) |
| `--radius-lg` | 8px |
| `--radius-xl` | 12px |
| `--text-xs` / `--text-sm` / `--text-base` / `--text-xl` | 12 / 13 / 14 / 20px (`0.75 / 0.8125 / 0.875 / 1.25rem`) |
| `--duration-fast / base / slow` | 120 / 200 / 300ms |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` |

---

## 2. Login (`LoginScreen.vue`)

### Layout raiz

```
grid · h-full · w-full
grid-template-columns: 560px 1fr
background: var(--surface-page)
```

Frame de referência: desktop **1920×1080**.

### Coluna esquerda (form)

| Propriedade | Valor |
|---|---|
| Fundo | `var(--surface-card)` |
| Padding | `56px 64px 48px` |
| Estrutura vertical | logo topo (`margin-bottom: auto`) → form centro (`margin-top: auto`) → copyright rodapé (`margin-top: auto`, `padding-top: 48px`) |

#### Brand

| Item | Valor |
|---|---|
| Asset | `logo-azul-sem-bg.png` via `ImageWithFallback` |
| Alt | `Grupo Ceres Investimentos` |
| Altura | **96px** · `width: auto` · `object-fit: contain` |

#### Formulário

| Item | Valor |
|---|---|
| Largura | `max-width: 384px` · `width: 100%` |
| Submit | `@submit.prevent` → `emit('submit')` |

| Elemento | Tipografia / espaçamento |
|---|---|
| H1 “Acesso Interno” | **30px** · `--weight-bold` · `--text-strong` · `letter-spacing: -0.02em` · `line-height: 1.2` · `margin-bottom: 12px` |
| Subtítulo | `--text-sm` · `--text-muted` · `--leading-relaxed` · `margin-bottom: 32px` |
| Texto subtítulo | `Bem-vindo à plataforma interna do Grupo Ceres. Acesse para gerenciar as operações do agronegócio.` |

#### Campo e-mail

| Item | Valor |
|---|---|
| Bloco | `margin-bottom: 20px` |
| Label | “E-mail corporativo” · **11px** bold · uppercase · `--neutral-400` · `letter-spacing: 0.08em` · `margin-bottom: 8px` |
| Input altura | **50px** |
| Fundo / borda | `--surface-sunken` / `--border-default` · `border-width: 1` |
| Radius | `--radius-xl` (12px) |
| Padding | `padding-left: 44px` · `padding-right: 16px` |
| Fonte | `--text-base` · cor `--text-strong` |
| Ícone | Lucide `Mail` **18px** · `left: 16px` · `top: 50%` · `translateY(-50%)` · `--neutral-400` |
| Placeholder | `exemplo@empresa.com.br` |
| Focus | borda `--gci-base` + `box-shadow: 0 0 0 4px rgba(8,60,74,0.06)` |
| Transition | `box-shadow` + `border-color` em `--duration-base` |

#### Campo senha

| Item | Valor |
|---|---|
| Bloco | `margin-bottom: 24px` |
| Linha label | flex `space-between` · `margin-bottom: 8px` |
| Label | “Senha” · mesmos tokens do e-mail |
| Link | “Esqueceu a senha?” · `--text-xs` · `--gci-base` · bold · sem underline |
| Input | iguais ao e-mail, com `padding-right: 44px` |
| Ícone esq. | Lucide `Lock` **18px** · mesma posição |
| Toggle olho | `Eye` / `EyeOff` **18px** · `right: 16px` · botão transparente · `--neutral-400` |
| Placeholder | `••••••••` |
| Focus | mesmo ring do e-mail |

#### CTA

| Item | Valor |
|---|---|
| Texto | “Entrar no Sistema” + Lucide `ChevronRight` **18px** |
| Classes | `group btn-animated btn-primary` |
| Dimensões | `width: 100%` · altura **48px** |
| Radius | `--radius-xl` |
| Fundo / texto | `--action-primary-bg` / `--action-primary-text` |
| Fonte | `--text-base` · `--weight-bold` |
| Gap | **8px** |
| Sombra | `0 10px 24px -8px rgba(8,60,74,0.18)` |
| Hover/active | via `.btn-primary` em `theme.css` (`--action-primary-bg-hover` / `-active`) |

#### Ajuda + copyright

| Bloco | Valor |
|---|---|
| Ajuda | `border-top: 1px solid --neutral-100` · `margin-top: 32px` · `padding-top: 20px` · **12px** · `--neutral-400` · `--leading-relaxed` |
| Link TI | “Equipe de TI” · `--gci-base` · bold · sem underline |
| Copyright | “© 2025 Grupo Ceres Investimentos.” · **10px** uppercase · `--neutral-400` · `letter-spacing: 0.18em` |

### Coluna direita (hero)

| Item | Valor |
|---|---|
| Container | `relative overflow-hidden` · fundo `--gci-base` |
| Imagem | Unsplash cover · `absolute inset-0` · `object-fit: cover` |
| Overlay | `linear-gradient(135deg, rgba(8,60,74,0.8) 0%, rgba(8,60,74,0.4) 45%, transparent 100%)` · `z-index: 1` |
| Blob topo | `360×360` · `top: -120px` · `right: -80px` · `rgba(255,255,255,0.05)` · `filter: blur(60px)` · `z-index: 1` |
| Blob baixo | `320×320` · `bottom: -100px` · `right: -60px` · `rgba(242,125,38,0.1)` · `filter: blur(60px)` · `z-index: 1` |
| Conteúdo | `absolute` · `left/right/bottom: 64px` · `z-index: 2` · flex column |
| Régua | `48×4` · `--agro-base` · `border-radius: 2px` · `margin-bottom: 24px` |
| H2 | “Gestão interna e estratégica do agronegócio.” · **52px** · weight **900** · `letter-spacing: -0.025em` · `#fff` · `line-height: 1.05` · `text-shadow: 0 2px 16px rgba(0,0,0,0.25)` · `margin-bottom: 20px` · `max-width: 720px` |
| P | **18px** · `rgba(255,255,255,0.82)` · `--weight-medium` · `--leading-relaxed` · `max-width: 560px` |

### O que é mock

- Sem validação / auth real — qualquer submit entra no app.
- Links “Esqueceu a senha?” e “Equipe de TI” são `href="#"`.

---

## 3. Header / Topbar (`Topbar.vue`)

### Layout

```
<header flex items-center>
  [ Título h2 ]  ——— flex:1 ———  [ Busca ]  [ Sino ]  |  [ Nome + role ]  [ Avatar ]
</header>
```

| Propriedade | Valor |
|---|---|
| Altura | `var(--topbar-height)` |
| Fundo | `var(--surface-card)` |
| Borda | `1px solid var(--border-default)` (bottom) |
| Padding | `0 var(--topbar-padding-x)` |
| Gap | **24px** |
| Transition | `height` + `padding` em `--duration-base` |

Prop: `title: string` (vinda de `titleMap[view]` em `ModulesScreen`).

### Zonas

| Zona | Detalhes |
|---|---|
| Título | `h2` · `--text-xl` · `--weight-bold` · `--text-strong` · `letter-spacing: -0.01em` · nowrap + ellipsis · `min-width: 0` |
| Spacer | `flex: 1` · `min-width: 8px` |
| Busca | classe `.topbar-search` · largura **256px** · `flex-shrink: 1` · `min-width: 140px` |
| Input busca | altura **40px** · bg `--surface-sunken` · sem borda · `--radius-lg` · `padding-left: 36px` · `padding-right: 12px` · `--text-sm` |
| Ícone busca | Lucide `Search` **16px** · `left: 12px` · `--neutral-400` |
| Focus busca | `box-shadow: 0 0 0 3px rgba(8,60,74,0.20)` |
| Placeholder | `Buscar no sistema...` |
| Notificações | botão **40×40** · `--radius-lg` · transparente · Lucide `Bell` **18px** · cor `--neutral-600` |
| Badge | **6×6** círculo · `--agro-base` · `top/right: 11px` · `border: 1.5px solid --surface-card` · `box-sizing: content-box` |
| Divisor | classe `.topbar-user-meta` · `1×32` · `--border-default` |
| Nome | `CURRENT_USER.fullName` (“Eduardo Barbosa dos Santos”) · `--text-sm` bold · ellipsis · `max-width: 200px` |
| Role | `CURRENT_USER.role` · `--text-xs` · `--text-muted` · `margin-top: 2px` |
| Avatar | **40×40** · `--radius-xl` · bg `--gci-base` · iniciais via `getUserInitials` → **ES** · `--text-sm` bold |
| Chip user | gap **12px** entre meta e avatar |
| Iniciais | primeiro + último nome significativo; ignora partículas (`de`, `da`, `dos`, …). Ex.: Eduardo Barbosa dos Santos → **ES** (não EB) |

### Responsividade

| Breakpoint | Classe | Efeito |
|---|---|---|
| ≤1180px | `.topbar-search` | `display: none` |
| ≤900px | `.topbar-user-meta` | `display: none` (nome, role e divisor) |

Busca e sino são **somente visuais** — sem lógica.

---

## 4. Menu lateral (`Sidebar.vue`)

### Container `<aside>`

| Propriedade | Expandida | Colapsada |
|---|---|---|
| Largura | `var(--sidebar-width-expanded)` | **80px** |
| Altura | `100%` | `100%` |
| Padding | `24px 16px 16px` | `24px 12px 16px` |
| Fundo | `var(--gci-base)` | |
| Sombra | `6px 0 24px rgba(15,23,42,0.12)` | |
| Transition | `width` + `padding` em `--duration-slow` | |
| Empilhamento | `position: relative` · `z-index: 2` · `flex-shrink: 0` | |

**Não** aplicar `overflow: hidden` no `<aside>` — corta o botão de colapsar (`right: -12px`).

Estrutura em coluna flex:

1. Brand (`flex-shrink: 0`)
2. Botão colapsar (absolute)
3. Nav scrollável (`flex: 1; min-height: 0`)
4. User card (`flex-shrink: 0`)

### Props / eventos

```ts
interface Props {
  active: string;
  collapsed: boolean;
  openMenu: string | null;
}

// emit
navigate: [key: string]
toggle: []
toggleMenu: [key: string]
```

### Brand

| Item | Expandida | Colapsada |
|---|---|---|
| Botão | altura **56px** · padding `0 4px` · `margin-bottom: 32px` · transparente | justify-content center |
| Logo | `gci-logo-full.png` · altura **56px** · `max-width: 100%` · `--radius-md` | `gci-logo-mark.png` · **42×42** |
| Clique | `emit('navigate', 'dashboard')` | idem |

### Botão colapsar

| Item | Valor |
|---|---|
| Posição | `absolute` · `right: -12px` · `top: 76px` |
| Tamanho | **24×24** círculo |
| Fundo / cor | `--agro-base` / `#fff` |
| Ícone | `ChevronLeft` / `ChevronRight` **14px** |
| Sombra | `0 4px 12px rgba(15,23,42,0.18)` |
| z-index | **30** |
| Clique | `emit('toggle')` |

### Nav

| Item | Valor |
|---|---|
| Classe | `.sidebar-nav-scroll` |
| Layout | flex column · `gap: 4px` · `flex: 1` · `min-height: 0` · `overflow-y: auto` |
| Scrollbar | oculta (`scrollbar-width: none` + `::-webkit-scrollbar { display: none }`) |

#### Item principal

| Estado | Estilo |
|---|---|
| Base | padding **12px** (colapsado: `12px 0`, center) · gap **16px** · `--radius-xl` · `--text-sm` · `--weight-medium` · cor `rgba(255,255,255,0.6)` |
| Ícone | Lucide **18px** |
| Hover | bg `rgba(255,255,255,0.05)` · cor `#fff` |
| Ativo | bg `rgba(255,255,255,0.1)` · cor `--agro-base` |
| Barra ativa (expandida) | `left: 0` · `top/bottom: 8px` · width **4px** · `--agro-base` · `border-radius: 0 4px 4px 0` |
| Barra ativa (colapsada) | `left: -12px` (compensa padding do aside) |
| Chevron submenu | `ChevronDown` **16px** · rotaciona 180° quando `openMenu === key` |

Colapsada: cada item principal envolve `Tooltip` (`variant="light"`, `side="right"`, `block`) com o label.

#### Submenu

| Item | Valor |
|---|---|
| Visível | só se `children` e `!collapsed` |
| Animação | `max-height` = `children.length * 40 + 8` px quando aberto · opacity 0↔1 |
| Container | `padding: 6px 0 6px 36px` · `gap: 2px` · relative |
| Guia vertical | `left: 25px` · `top/bottom: 6px` · width **1px** · `rgba(255,255,255,0.1)` |
| Subitem | padding `8px 12px` · gap **12px** · `--radius-lg` · `--text-xs` medium · cor `rgba(255,255,255,0.55)` |
| Ícone sub | **14px** |
| Hover sub | bg branco 4% · cor `#fff` |
| Ativo sub | bg `rgba(242,125,38,0.12)` · cor `--agro-base` |

#### Clique

- Sem filhos → `navigate(key)`
- Com filhos → se expandida, `toggleMenu(key)`; **sempre** `navigate(children[0].key)`

### Itens do menu (ordem atual)

| key | label | children |
|---|---|---|
| `dashboard` | Dashboard | — |
| `solicitacoes` | Solicitação de Operação | Solicitações, Fundo Padrão, Relatórios, Taxas dos Veículos, Validações |
| `ativos` | Ativos | — |
| `fidcs` | FIDC's | Gestão, Simulador, Relatórios |
| `cras` | CRA's | Gestão, Simulador, Relatórios |
| `cobranca` | Cobrança | Dashboard, Títulos, Notif. Cobrança, Notif. Cessão, Resultado, Relatórios |
| `risco` | Risco | Dashboard, Grupos, Ratings, Agrupamentos, Consultas, Relatórios |
| `passivo` | Passivo | — |
| `colab` | Colaboradores | — |
| `rel` | Relatórios | — |
| `conf` | Configurações | — |

### User card

| Item | Expandida | Colapsada |
|---|---|---|
| Margin | `margin-top: 12px` | idem |
| Padding | **12px** | **8px** · center |
| Fundo / borda | `rgba(255,255,255,0.05)` / `rgba(255,255,255,0.10)` · `--radius-xl` | |
| Gap | **12px** | — |
| Avatar | **32×32** círculo `--agro-base` · Lucide `User` **16px** | só avatar |
| Nome | “Eduardo Santos” · **12px** bold branco · `line-height: 1.2` | oculto |
| Role | “Administrador” · **10px** · branco 60% · `margin-top: 2px` | oculto |
| Logout | Lucide `LogOut` **16px** · botão transparente · branco 60% · visual only | oculto |

---

## 5. Shell após login (`ModulesScreen.vue`)

```vue
<div class="flex w-full" style="height: 100vh; overflow: hidden; background: var(--surface-page)">
  <Sidebar … />
  <div class="flex flex-col" style="flex: 1; min-width: 0; min-height: 0">
    <Topbar :title="titleMap[view]" />
    <main class="overflow-auto" style="flex: 1; padding: var(--main-padding)">
      <div style="max-width: 1456px; margin: 0 auto">
        <!-- view ativa -->
      </div>
    </main>
  </div>
</div>
```

| Camada | Scroll |
|---|---|
| `ModulesScreen` | não (`100vh` + `overflow: hidden`) |
| Sidebar `<nav>` | sim, interno (barra oculta) |
| `<main>` | sim — único scroll da aplicação |

`min-height: 0` na coluna principal é obrigatório para o flex não estourar o viewport.

---

## 6. Checklist pixel-perfect

### Login
1. Grid **560px | 1fr**, não 50/50.
2. Logo **96px**; form **max 384px**; inputs **50px**; CTA **48px**.
3. Focus ring `0 0 0 4px rgba(8,60,74,0.06)` — não o `--focus-ring` global de 3px.
4. Hero: régua **48×4** agro, H2 **52px/900**, conteúdo inset **64px**.
5. Blobs com blur **60px** nas posições negativas especificadas.

### Topbar
1. Altura tokenizada **80 / 72**; padding X **32 / 24 / 16**.
2. Busca **256×40**; bell e avatar **40×40**.
3. Badge do sino **6px** com borda 1.5px da cor do card.
4. Iniciais = primeiro + último nome significativo (`getUserInitials`), não as duas primeiras palavras.
5. Esconder busca ≤1180 e meta do user ≤900 via classes do `theme.css`.

### Sidebar
1. Expandida **280** (240 ≤1440) / colapsada **80**.
2. Botão colapsar fora da borda (`right: -12px`) com `z-index` aside **2** + botão **30**.
3. Barra ativa **4px** agro; ícones **18 / 14**.
4. Scroll só no nav; user card e brand fixos; sem `overflow: hidden` no aside.
5. Tooltip no modo colapsado; submenu animado por `max-height`.

### Integração
1. `?view=` pula login.
2. Título do header sempre via `titleMap` — não hardcodar nas features.
3. Após toggle manual da sidebar, resize não sobrescreve `collapsed`.

---

## 7. Referências rápidas

| Arquivo | Conteúdo |
|---|---|
| `src/app/App.vue` | Gate login/modules + skip `?view=` |
| `src/features/auth/screens/LoginScreen.vue` | Login pixel-perfect |
| `src/components/layout/Topbar.vue` | Header |
| `src/components/layout/Sidebar.vue` | Menu lateral |
| `src/app/ModulesScreen.vue` | Shell 100vh + estado |
| `src/styles/theme.css` | Tokens e media queries |
| [layout-shell.md](./layout-shell.md) | Dashboard, views, navegação completa |
| `docs/figma-reference/pasted_text/minerva-login-modules.html` | Spec Figma Make original |

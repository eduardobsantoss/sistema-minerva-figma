# Minerva Design Tokens (obrigatório)

**Regra dura para implementação:** use EXATAMENTE estes tokens/valores.
Não invente hex, pesos, fontes ou espaçamentos “plausíveis”.
Se o componente usa `var(--token)`, declare o token com o valor resolvido abaixo (ou cole o bloco `:root` completo).

## Fonte

- Família: **Inter** (`--font-sans`)
- Pesos carregados: **400, 500, 600, 700, 800**
- Import:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
```

- Base do documento: `html { font-size: 14px; font-family: var(--font-sans); color: var(--text-default); background: var(--surface-page); }`
- Números/tabelas: preferir `font-variant-numeric: tabular-nums` quando for valor monetário/ID.

## Tabela token → valor resolvido

### Cores primitivas

| Token | Declaração | Valor resolvido |
|---|---|---|
| `--agro-active` | `#BD5E14` | `#BD5E14` |
| `--agro-base` | `#F27D26` | `#F27D26` |
| `--agro-hover` | `#D96E1A` | `#D96E1A` |
| `--agro-light` | `#FDF1E7` | `#FDF1E7` |
| `--danger-base` | `#DC2626` | `#DC2626` |
| `--danger-dark` | `#B91C1C` | `#B91C1C` |
| `--danger-light` | `#FEF2F2` | `#FEF2F2` |
| `--gci-active` | `#04222B` | `#04222B` |
| `--gci-base` | `#083C4A` | `#083C4A` |
| `--gci-hover` | `#062D38` | `#062D38` |
| `--gci-light` | `#F0F4F5` | `#F0F4F5` |
| `--gci-subtle` | `#DCE6E9` | `#DCE6E9` |
| `--info-base` | `var(--gci-base)` | `#083C4A` |
| `--info-light` | `var(--gci-light)` | `#F0F4F5` |
| `--neutral-0` | `#FFFFFF` | `#FFFFFF` |
| `--neutral-100` | `#F1F5F7` | `#F1F5F7` |
| `--neutral-200` | `#E3E9ED` | `#E3E9ED` |
| `--neutral-300` | `#CBD5DB` | `#CBD5DB` |
| `--neutral-400` | `#94A3AC` | `#94A3AC` |
| `--neutral-50` | `#F8FAFB` | `#F8FAFB` |
| `--neutral-500` | `#64748B` | `#64748B` |
| `--neutral-600` | `#475569` | `#475569` |
| `--neutral-700` | `#334155` | `#334155` |
| `--neutral-800` | `#1E293B` | `#1E293B` |
| `--neutral-900` | `#0F172A` | `#0F172A` |
| `--success-base` | `#059669` | `#059669` |
| `--success-dark` | `#047857` | `#047857` |
| `--success-light` | `#ECFDF5` | `#ECFDF5` |
| `--warning-base` | `#D97706` | `#D97706` |
| `--warning-dark` | `#B45309` | `#B45309` |
| `--warning-light` | `#FFFBEB` | `#FFFBEB` |

### Surfaces

| Token | Declaração | Valor resolvido |
|---|---|---|
| `--surface-card` | `var(--neutral-0)` | `#FFFFFF` |
| `--surface-page` | `var(--neutral-50)` | `#F8FAFB` |
| `--surface-raised` | `var(--neutral-0)` | `#FFFFFF` |
| `--surface-selected` | `var(--gci-light)` | `#F0F4F5` |
| `--surface-sunken` | `var(--neutral-100)` | `#F1F5F7` |

### Texto

| Token | Declaração | Valor resolvido |
|---|---|---|
| `--text-default` | `var(--neutral-700)` | `#334155` |
| `--text-disabled` | `var(--neutral-400)` | `#94A3AC` |
| `--text-link` | `var(--gci-base)` | `#083C4A` |
| `--text-muted` | `var(--neutral-500)` | `#64748B` |
| `--text-on-brand` | `var(--neutral-0)` | `#FFFFFF` |
| `--text-on-danger` | `var(--neutral-0)` | `#FFFFFF` |
| `--text-strong` | `var(--neutral-900)` | `#0F172A` |

### Bordas

| Token | Declaração | Valor resolvido |
|---|---|---|
| `--border-default` | `var(--neutral-200)` | `#E3E9ED` |
| `--border-focus` | `var(--gci-base)` | `#083C4A` |
| `--border-strong` | `var(--neutral-300)` | `#CBD5DB` |

### Ações

| Token | Declaração | Valor resolvido |
|---|---|---|
| `--accent` | `var(--agro-base)` | `#F27D26` |
| `--accent-bg` | `var(--agro-light)` | `#FDF1E7` |
| `--action-danger-bg` | `var(--danger-base)` | `#DC2626` |
| `--action-danger-bg-hover` | `var(--danger-dark)` | `#B91C1C` |
| `--action-danger-text` | `var(--text-on-danger)` | `#FFFFFF` |
| `--action-danger-text-only` | `var(--danger-base)` | `#DC2626` |
| `--action-primary-bg` | `var(--gci-base)` | `#083C4A` |
| `--action-primary-bg-active` | `var(--gci-active)` | `#04222B` |
| `--action-primary-bg-hover` | `var(--gci-hover)` | `#062D38` |
| `--action-primary-text` | `var(--text-on-brand)` | `#FFFFFF` |
| `--action-secondary-bg` | `var(--neutral-0)` | `#FFFFFF` |
| `--action-secondary-bg-hover` | `var(--neutral-100)` | `#F1F5F7` |
| `--action-secondary-border` | `var(--border-strong)` | `#CBD5DB` |
| `--action-secondary-text` | `var(--text-default)` | `#334155` |

### Status

| Token | Declaração | Valor resolvido |
|---|---|---|
| `--status-active-bg` | `var(--gci-light)` | `#F0F4F5` |
| `--status-active-text` | `var(--gci-base)` | `#083C4A` |
| `--status-danger-bg` | `var(--danger-light)` | `#FEF2F2` |
| `--status-danger-text` | `var(--danger-dark)` | `#B91C1C` |
| `--status-neutral-bg` | `var(--neutral-100)` | `#F1F5F7` |
| `--status-neutral-text` | `var(--neutral-600)` | `#475569` |
| `--status-success-bg` | `var(--success-light)` | `#ECFDF5` |
| `--status-success-text` | `var(--success-dark)` | `#047857` |
| `--status-warning-bg` | `var(--warning-light)` | `#FFFBEB` |
| `--status-warning-text` | `var(--warning-dark)` | `#B45309` |
| `--stepper-current` | `var(--gci-base)` | `#083C4A` |
| `--stepper-done` | `var(--success-base)` | `#059669` |
| `--stepper-future` | `var(--neutral-300)` | `#CBD5DB` |
| `--stepper-track` | `var(--neutral-200)` | `#E3E9ED` |

### Tipografia — família e pesos

| Token | Declaração | Valor resolvido |
|---|---|---|
| `--font-numeric` | `var(--font-sans)` | `var(--font-sans)` |
| `--leading-normal` | `1.5` | `1.5` |
| `--leading-relaxed` | `1.6` | `1.6` |
| `--leading-snug` | `1.35` | `1.35` |
| `--leading-tight` | `1.2` | `1.2` |
| `--weight-bold` | `700` | `700` |
| `--weight-medium` | `500` | `500` |
| `--weight-regular` | `400` | `400` |
| `--weight-semibold` | `600` | `600` |

### Tipografia — escala de tamanho

| Token | Declaração | Valor resolvido |
|---|---|---|
| `--text-2xl` | `1.5rem` | `1.5rem` |
| `--text-3xl` | `1.875rem` | `1.875rem` |
| `--text-4xl` | `2.25rem` | `2.25rem` |
| `--text-base` | `0.875rem` | `0.875rem` |
| `--text-lg` | `1.125rem` | `1.125rem` |
| `--text-md` | `1rem` | `1rem` |
| `--text-micro` | `0.6875rem` | `0.6875rem` |
| `--text-sm` | `0.8125rem` | `0.8125rem` |
| `--text-xl` | `1.25rem` | `1.25rem` |
| `--text-xs` | `0.75rem` | `0.75rem` |

### Espaçamento

| Token | Declaração | Valor resolvido |
|---|---|---|
| `--space-1` | `4px` | `4px` |
| `--space-10` | `40px` | `40px` |
| `--space-20` | `80px` | `80px` |
| `--space-5` | `20px` | `20px` |

### Raio

| Token | Declaração | Valor resolvido |
|---|---|---|
| `--radius-full` | `9999px` | `9999px` |
| `--radius-lg` | `8px` | `8px` |
| `--radius-md` | `6px` | `6px` |
| `--radius-none` | `0` | `0` |
| `--radius-sm` | `4px` | `4px` |
| `--radius-xl` | `12px` | `12px` |

### Sombra / foco / motion

| Token | Declaração | Valor resolvido |
|---|---|---|
| `--duration-base` | `200ms` | `200ms` |
| `--duration-fast` | `120ms` | `120ms` |
| `--duration-slow` | `300ms` | `300ms` |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | `cubic-bezier(0, 0, 0.2, 1)` |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--focus-ring` | `0 0 0 3px rgba(8, 60, 74, 0.25)` | `0 0 0 3px rgba(8, 60, 74, 0.25)` |
| `--shadow-lg` | `0 12px 32px rgba(15, 23, 42, 0.16)` | `0 12px 32px rgba(15, 23, 42, 0.16)` |
| `--shadow-md` | `0 4px 12px rgba(15, 23, 42, 0.10)` | `0 4px 12px rgba(15, 23, 42, 0.10)` |
| `--shadow-sm` | `0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)` | `0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)` |
| `--shadow-xs` | `0 1px 2px rgba(15, 23, 42, 0.04)` | `0 1px 2px rgba(15, 23, 42, 0.04)` |

### Layout shell

| Token | Declaração | Valor resolvido |
|---|---|---|
| `--dashboard-grid-min` | `240px` | `240px` |
| `--main-padding` | `40px` | `40px` |
| `--sidebar-width-expanded` | `280px` | `280px` |
| `--topbar-height` | `80px` | `80px` |
| `--topbar-padding-x` | `32px` | `32px` |

## Tipografia — mapa de uso (produto)

| Papel | Tamanho | Peso | Extras |
|---|---|---|---|
| Eyebrow / módulo | 11px | `--weight-bold` (700) | uppercase · letter-spacing 0.18em · `--accent` |
| Título de página (H1) | 26px | `--weight-bold` | letter-spacing -0.02em · `--text-strong` |
| Título de detalhe (H2) | `--text-xl` (20px) | `--weight-bold` | letter-spacing -0.01em · `--text-strong` |
| Label de campo | 10px | `--weight-bold` | uppercase · letter-spacing 0.10em · `--text-muted` |
| Corpo / descrição | `--text-sm` (13px) | `--weight-regular` | `--text-muted` · line-height 1.5 |
| Célula de tabela | `--text-sm` | regular/medium | tabular-nums em valores |
| Header de tabela | 10–11px / `--text-xs` | `--weight-bold` | uppercase · `--text-muted` |
| CTA de card | `--text-xs` | `--weight-bold` | `--accent` |
| Botão | `--text-sm` | `--weight-bold` | altura padrão 38px · `--radius-lg` |

## Espaçamento — gaps comuns no produto

| Contexto | Valor típico | Token |
|---|---|---|
| Gap entre cards de hub | 16px | `--space-4` |
| Gap de seção / stack de tela | 24px | `--space-6` |
| Padding de card / bloco | 22px | (próximo de `--space-5`/`--space-6`) |
| Gap de formulário (grid) | 14px | entre `--space-3` e `--space-4` |
| Gap label → campo | 6px | — |
| Padding horizontal input | 12px | `--space-3` |
| Main padding (desktop) | 40px | `--main-padding` |

## Bloco `:root` completo (cole no CSS global do destino)

```css
:root {
  --gci-base: #083C4A;
  --gci-hover: #062D38;
  --gci-active: #04222B;
  --gci-light: #F0F4F5;
  --gci-subtle: #DCE6E9;
  --agro-base: #F27D26;
  --agro-hover: #D96E1A;
  --agro-active: #BD5E14;
  --agro-light: #FDF1E7;
  --neutral-0: #FFFFFF;
  --neutral-50: #F8FAFB;
  --neutral-100: #F1F5F7;
  --neutral-200: #E3E9ED;
  --neutral-300: #CBD5DB;
  --neutral-400: #94A3AC;
  --neutral-500: #64748B;
  --neutral-600: #475569;
  --neutral-700: #334155;
  --neutral-800: #1E293B;
  --neutral-900: #0F172A;
  --success-base: #059669;
  --success-light: #ECFDF5;
  --success-dark: #047857;
  --warning-base: #D97706;
  --warning-light: #FFFBEB;
  --warning-dark: #B45309;
  --danger-base: #DC2626;
  --danger-light: #FEF2F2;
  --danger-dark: #B91C1C;
  --info-base: var(--gci-base);
  --info-light: var(--gci-light);
  --surface-page: var(--neutral-50);
  --surface-card: var(--neutral-0);
  --surface-raised: var(--neutral-0);
  --surface-sunken: var(--neutral-100);
  --surface-selected: var(--gci-light);
  --text-strong: var(--neutral-900);
  --text-default: var(--neutral-700);
  --text-muted: var(--neutral-500);
  --text-disabled: var(--neutral-400);
  --text-on-brand: var(--neutral-0);
  --text-on-danger: var(--neutral-0);
  --text-link: var(--gci-base);
  --border-default: var(--neutral-200);
  --border-strong: var(--neutral-300);
  --border-focus: var(--gci-base);
  --action-primary-bg: var(--gci-base);
  --action-primary-bg-hover: var(--gci-hover);
  --action-primary-bg-active: var(--gci-active);
  --action-primary-text: var(--text-on-brand);
  --action-secondary-bg: var(--neutral-0);
  --action-secondary-bg-hover: var(--neutral-100);
  --action-secondary-text: var(--text-default);
  --action-secondary-border: var(--border-strong);
  --action-danger-bg: var(--danger-base);
  --action-danger-bg-hover: var(--danger-dark);
  --action-danger-text: var(--text-on-danger);
  --action-danger-text-only: var(--danger-base);
  --accent: var(--agro-base);
  --accent-bg: var(--agro-light);
  --status-neutral-bg: var(--neutral-100);
  --status-neutral-text: var(--neutral-600);
  --status-active-bg: var(--gci-light);
  --status-active-text: var(--gci-base);
  --status-success-bg: var(--success-light);
  --status-success-text: var(--success-dark);
  --status-warning-bg: var(--warning-light);
  --status-warning-text: var(--warning-dark);
  --status-danger-bg: var(--danger-light);
  --status-danger-text: var(--danger-dark);
  --stepper-done: var(--success-base);
  --stepper-current: var(--gci-base);
  --stepper-future: var(--neutral-300);
  --stepper-track: var(--neutral-200);
  --font-numeric: var(--font-sans);
  --text-micro: 0.6875rem;
  --text-xs: 0.75rem;
  --text-sm: 0.8125rem;
  --text-base: 0.875rem;
  --text-md: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --leading-tight: 1.2;
  --leading-snug: 1.35;
  --leading-normal: 1.5;
  --leading-relaxed: 1.6;
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
  --space-1: 4px;
  --space-5: 20px;
  --space-10: 40px;
  --space-20: 80px;
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;
  --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.10);
  --shadow-lg: 0 12px 32px rgba(15, 23, 42, 0.16);
  --focus-ring: 0 0 0 3px rgba(8, 60, 74, 0.25);
  --duration-fast: 120ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --sidebar-width-expanded: 280px;
  --main-padding: 40px;
  --topbar-padding-x: 32px;
  --topbar-height: 80px;
  --dashboard-grid-min: 240px;
}
```

## Classes utilitárias de botão (theme.css)

```css
.btn-animated { /* transition padrão */ }
.btn-primary:hover:not(:disabled) { background: var(--action-primary-bg-hover) !important; }
.btn-primary:active:not(:disabled) { background: var(--action-primary-bg-active) !important; }
.btn-agro:hover:not(:disabled) { background: var(--agro-hover) !important; }
.btn-agro:active:not(:disabled) { background: var(--agro-active) !important; }
```

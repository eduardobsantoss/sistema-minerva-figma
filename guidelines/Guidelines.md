# Minerva — Design System Guidelines

**v1 · Fonte de verdade para Figma MCP e Cursor**

---

## 1. Produto

Minerva é uma plataforma operacional corporativa de gestão securitária e financeira do agronegócio. É um ERP de uso intenso e diário. A experiência deve transmitir **confiabilidade, segurança operacional e maturidade** — não é um app de marketing ou consumo.

---

## 2. Princípios obrigatórios

**Eficiência acima de estética.** Densidade organizada, leitura rápida, zero ruído visual desnecessário.

**Hierarquia explícita de ações.** Cada tela tem exatamente uma ação primária. Ações secundárias têm menor peso visual. Ações destrutivas são isoladas.

**Status não é ação.** O estado do processo (ex: "Em Crédito") é sempre um chip informativo, nunca um botão.

**Stepper é indicador, não navegação.** O stepper comunica progresso. Mudança de etapa ocorre por ação explícita, nunca por clique direto nas etapas.

**Consistência replicável.** Cada módulo segue o mesmo Padrão Estrutural: Identificação → Stepper → Barra de Ações → Tabs → Blocos de Conteúdo.

---

## 3. Identidade visual

**Cor primária:** GCI Blue `#083C4A` — ação primária, links, stepper atual, borda de foco.
**Cor de acento:** Agro Orange `#F27D26` — destaque, indicador de step ativo em wizards, realce. Nunca usar como fundo de botão com texto branco (contraste insuficiente para AA).
**Tipografia:** Inter em tudo. Números e tabelas: Inter com `font-variant-numeric: tabular-nums` (algarismos de largura fixa, sem fonte monoespaçada).
**Fundo de página:** `#F8FAFB` (cinza-azulado suave).
**Grid de espaçamento:** múltiplos de 4px.

---

## 4. Regras de uso da camada semântica

Componentes consomem **sempre** os tokens semânticos, nunca os primitivos diretamente.

| Situação                                | Token correto                                     |
| --------------------------------------- | ------------------------------------------------- |
| Fundo de página                         | `--surface-page`                                  |
| Fundo de card/painel                    | `--surface-card`                                  |
| Fundo de área recuada / thead de tabela | `--surface-sunken`                                |
| Linha ou aba selecionada                | `--surface-selected`                              |
| Título / texto forte                    | `--text-strong`                                   |
| Texto de corpo                          | `--text-default`                                  |
| Label / texto secundário                | `--text-muted`                                    |
| Borda padrão                            | `--border-default`                                |
| Borda forte                             | `--border-strong`                                 |
| Ação primária (1 por tela/etapa)        | `--action-primary-*`                              |
| Ação secundária (até 2)                 | `--action-secondary-*`                            |
| Ação destrutiva (fundo)                 | `--action-danger-*`                               |
| Texto destrutivo no dropdown            | `--action-danger-text-only`                       |
| Chip de status                          | `--status-{estado}-bg` + `--status-{estado}-text` |
| Stepper etapa concluída                 | `--stepper-done`                                  |
| Stepper etapa atual                     | `--stepper-current`                               |
| Stepper etapa futura                    | `--stepper-future`                                |

**Mapeamento de status de processo:**

- Pendente → `--status-warning-*`
- Validado / Em Carteira → `--status-success-*`
- Rejeitado → `--status-danger-*`
- Análise Documental → `--status-neutral-*`
- Ativo / Selecionado → `--status-active-*`

---

## 5. Padrão Estrutural de telas de workflow crítico

Ordem das camadas (não alterar):

1. **Identificação do Registro** — título + chip de status (informação, não botão)
2. **Stepper** — indicador de progresso informativo, etapas não clicáveis
3. **Barra de Ações** — 1 primária + até 2 secundárias + "Mais ações" para destrutivas
4. **Tabs** — navegação interna da etapa atual
5. **Conteúdo em Blocos** — agrupado por responsabilidade, títulos claros

**Ações destrutivas** (ex: Rejeitar): ficam dentro do dropdown "Mais ações", separadas por divisor, com texto em `--action-danger-text-only`, e exigem modal de confirmação com justificativa obrigatória.

---

## 6. Componentes — comportamento padrão

**Botão primário:** fundo `--action-primary-bg`, texto `--action-primary-text`, hover `--action-primary-bg-hover`. Um por tela ou etapa.

**Botão secundário:** fundo `--action-secondary-bg`, borda `--action-secondary-border`, hover `--action-secondary-bg-hover`.

**Chip de status:** `border-radius: --radius-full`, fundo e texto do par `--status-*`. Read-only, nunca interativo como botão.

**Modal:** backdrop escuro com blur, `border-radius: --radius-xl`, `box-shadow: --shadow-lg`, altura 85vh com scroll interno. Header fixo (título + stepper), footer fixo (ações).

**Dropdown "Mais ações":** `box-shadow: --shadow-md`, `border-radius: --radius-lg`. Itens destrutivos após divisor, em `--action-danger-text-only`.

**Tabela:** thead com `--surface-sunken`, linhas com `--border-default`. Números com `font-variant-numeric: tabular-nums`. Coluna "Classe" sempre primeira quando presente.

**Focus ring:** `--focus-ring` em todos os elementos interativos. Não remover.

---

## 7. Módulos do sistema

- **FIDC** — gestão de fundos de investimento em direitos creditórios
- **CRA** — certificados de recebíveis do agronegócio (MonoCRA / MultiCRA)
- **Passivo** — estrutura de captação, cotas SR/MEZ/SUB
- **Ativos** — recebíveis e duplicatas
- **Garantias** — administração de garantias vinculadas
- **Cobrança > Notificações de Cobrança** — réguas de notificação parametrizáveis
- **Admin, Gerencial, Confina, Risco** — módulos de suporte

---

## 8. Design Tokens (CSS custom properties — v1)

Cole o conteúdo do arquivo `minerva-design-tokens.css` aqui, ou anexe o arquivo diretamente. Todos os valores abaixo são a fonte de verdade.

```css
:root {
  /* PRIMITIVAS — não usar direto nos componentes */

  --gci-base: #083c4a;
  --gci-hover: #062d38;
  --gci-active: #04222b;
  --gci-light: #f0f4f5;
  --gci-subtle: #dce6e9;

  --agro-base: #f27d26;
  --agro-hover: #d96e1a;
  --agro-active: #bd5e14;
  --agro-light: #fdf1e7;

  --neutral-0: #ffffff;
  --neutral-50: #f8fafb;
  --neutral-100: #f1f5f7;
  --neutral-200: #e3e9ed;
  --neutral-300: #cbd5db;
  --neutral-400: #94a3ac;
  --neutral-500: #64748b;
  --neutral-600: #475569;
  --neutral-700: #334155;
  --neutral-800: #1e293b;
  --neutral-900: #0f172a;

  --success-base: #059669;
  --success-light: #ecfdf5;
  --success-dark: #047857;

  --warning-base: #d97706;
  --warning-light: #fffbeb;
  --warning-dark: #b45309;

  --danger-base: #dc2626;
  --danger-light: #fef2f2;
  --danger-dark: #b91c1c;

  --info-base: var(--gci-base);
  --info-light: var(--gci-light);

  /* SEMÂNTICAS — usar estas nos componentes */

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

  /* TIPOGRAFIA */

  --font-sans:
    "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  --font-numeric: var(--font-sans); /* + font-variant-numeric: tabular-nums */

  --text-micro: 0.6875rem; /* 11px */
  --text-xs: 0.75rem; /* 12px */
  --text-sm: 0.8125rem; /* 13px */
  --text-base: 0.875rem; /* 14px — corpo padrão */
  --text-md: 1rem; /* 16px */
  --text-lg: 1.125rem; /* 18px */
  --text-xl: 1.25rem; /* 20px */
  --text-2xl: 1.5rem; /* 24px */
  --text-3xl: 1.875rem; /* 30px */
  --text-4xl: 2.25rem; /* 36px */

  --leading-tight: 1.2;
  --leading-snug: 1.35;
  --leading-normal: 1.5;
  --leading-relaxed: 1.6;

  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;

  /* ESPAÇAMENTO — múltiplos de 4px */

  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-9: 36px;
  --space-10: 40px;
  --space-12: 48px;
  --space-15: 60px;
  --space-18: 72px;
  --space-20: 80px;
  --space-30: 120px;
  --space-40: 160px;
  --space-50: 200px;

  /* RAIO DE BORDA */

  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* ELEVAÇÃO */

  --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-sm:
    0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.1);
  --shadow-lg: 0 12px 32px rgba(15, 23, 42, 0.16);
  --focus-ring: 0 0 0 3px rgba(8, 60, 74, 0.25);

  /* MOVIMENTO */

  --duration-fast: 120ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);

  /* Z-INDEX */

  --z-base: 0;
  --z-sticky: 100;
  --z-dropdown: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-toast: 500;
}
```

---

## 10. Padrão de tela de detalhes de entidade

O padrão abaixo foi estabelecido na `CraTitleDetailScreen` e deve ser replicado em qualquer tela de detalhe de título, operação ou entidade financeira.

### Estrutura geral

```
[Botão Voltar]  [Breadcrumb da entidade pai]  [Badge de status]
[Hero card — valor principal]
[Barra de tabs]
[Conteúdo da tab ativa]
```

### Hero card
- Fundo sólido `var(--gci-base)` (azul-marinho), texto branco.
- Valor principal em `font-size: 36px`, `font-weight: 700`, `letter-spacing: -0.02em`.
- Linha de metadados compacta abaixo do valor em `color: rgba(255,255,255,0.65)`, `font-size: var(--text-xs)`.
- Detalhe decorativo: círculo `rgba(255,255,255,0.04)` posicionado fora dos limites no canto direito.

### Tabs de navegação interna
- Container `background: var(--surface-card)`, `border: 1px solid var(--border-default)`, `border-radius: var(--radius-xl)`, `padding: 4px`, alinhado à esquerda (`align-self: flex-start`).
- Tab ativa: `background: var(--gci-base)`, texto branco, ícone + label.
- Tab inativa: background transparente, `color: var(--text-muted)`.

### Seções dentro de tab

```tsx
function Section({ title, children }) {
  return (
    <div>
      {/* Título da seção */}
      <div style={{
        fontSize: 10, fontWeight: 800, letterSpacing: "0.18em",
        color: "var(--accent)",           // laranja/accent
        textTransform: "uppercase",
        marginBottom: 16,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}
```

### Campo de detalhe

```tsx
function Field({ label, value }) {
  return (
    <div>
      <div style={{
        fontSize: 10, fontWeight: 800, letterSpacing: "0.14em",
        color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)",
        color: "var(--text-strong)",
      }}>
        {value}
      </div>
    </div>
  );
}
```

### Layout de campos em grid
- Grid de **4 colunas** (`repeat(4, 1fr)`) com `gap: 24px` para seções informacionais.
- Grid de **2 colunas** (`1fr 1fr`) com `gap: 16px` para blocos de participantes.

### Bloco de participante (Cedente / Sacado)

```tsx
function Participant({ role, name, cnpj, icon: Icon }) {
  return (
    <div style={{ display: "flex", gap: 14, padding: 16,
      background: "var(--surface-sunken)", borderRadius: "var(--radius-lg)" }}>
      <div style={{ width: 44, height: 44, borderRadius: "var(--radius-lg)",
        background: "var(--surface-card)", color: "var(--gci-base)" }}>
        <Icon size={20} />
      </div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em",
          color: "var(--text-muted)", textTransform: "uppercase" }}>{role}</div>
        <div style={{ fontWeight: 700, color: "var(--text-strong)" }}>{name}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{cnpj}</div>
      </div>
    </div>
  );
}
```

### Regras gerais
- Botão "Voltar": `width: 48px`, `height: 48px`, borda `1px solid var(--border-default)`, ícone `ArrowLeft size={20}`.
- Status badge: pill (`border-radius: 9999px`), `padding: 8px 14px`, ícone + texto uppercase.
- Conteúdo das tabs dentro de `background: var(--surface-card)`, `border: 1px solid var(--border-default)`, `border-radius: var(--radius-xl)`, `padding: 24px`.
- Botão de copiar: `<CopyButton>` inline junto ao valor copiável (número, CNPJ, e-mail).

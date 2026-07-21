# Handoff — Novo Pedido de Operação (pixel-perfect)

> Fonte de verdade: `src/features/solicitacao-operacao/components/NovoPedidoModal.vue` + `components/novo-pedido/*` + tokens em `src/styles/theme.css`.  
> Contexto da listagem: [listagem.md](./listagem.md). Índice do módulo: [README.md](./README.md).

**Objetivo:** reimplementação pixel-perfect do wizard de criação de solicitação sem abrir o Figma.

---

## 1. Entrada

| Item | Valor |
|---|---|
| Trigger | Botão **NOVO PEDIDO** na `SolicitacaoScreen` (listagem) |
| Componente | `NovoPedidoModal.vue` |
| Emits | `close` · `create: [NewPedidoData]` |
| Pós-create | `buildFromForm()` na listagem → `unshift` no topo (etapa `RASCUNHO`) |

### Árvore

```
components/
├── NovoPedidoModal.vue
└── novo-pedido/
    ├── index.ts
    ├── types.ts                 → NewPedidoData, GarantiaItem
    ├── DadosGeraisStep.vue
    ├── GarantiaStep.vue
    ├── AnexosStep.vue
    ├── BentoBox.vue / BentoGrid.vue
    ├── FormField.vue / SelectField.vue / FieldLabel.vue
    ├── ToggleRow.vue / Switch.vue
    ├── SectionGroup.vue / AddButton.vue
    ├── DataTable.vue
    ├── DocGroup.vue / IconAction.vue
```

---

## 2. Shell do modal

### Overlay

```
position: fixed; inset: 0;
background: rgba(8, 60, 74, 0.55);
backdrop-filter: blur(8px);
z-index: 400;
padding: 32px;
animation: fadeIn 0.2s ease-out;
```

Flex centralizado. **Não** fecha no `@click.self` do overlay (só no X / Cancelar).

### Painel

| Spec | Valor |
|---|---|
| max-width | **980px** |
| height | **85vh** |
| background | `var(--surface-card)` |
| border-radius | `var(--radius-xl)` |
| box-shadow | `var(--shadow-lg)` |
| layout | coluna flex, `overflow: hidden` |

---

## 3. Header

`padding: 24px 32px`, `border-bottom: 1px solid var(--border-default)`, `flex` space-between

| Peça | Spec |
|---|---|
| Título | `--text-2xl` bold `--text-strong`, `letter-spacing: -0.01em` — **"Novo Pedido de Operação"** |
| Subtitle | `--text-sm` `--text-muted`, `margin-top: 4px` — `"{hint} · Etapa {n} de 3"` |
| Fechar | **36×36**, `radius-lg`, border + card (não sunken), `X` 18 muted |

---

## 4. Stepper (informativo, não clicável)

Barra: `background: var(--surface-sunken)`, border-bottom.

Cada step: `flex: 1`, `gap: 8px`, `padding: 16px 8px 13px`, centralizado.

| Estado | Spec |
|---|---|
| Ativa | `border-bottom: 3px solid var(--agro-base)`, cor `--agro-base`, stroke ícone 2.25 |
| Concluída | ícone `Check` 16 stroke 2.5, cor `--stepper-done` |
| Futura | ícone da etapa, muted, **opacity 0.6**, stroke 1.75 |
| Label | `--text-xs` bold uppercase `letter-spacing: 0.08em` |

| # | key | label | ícone Lucide | hint |
|---|---|---|---|---|
| 1 | `dados` | Dados Gerais | FileText | Parâmetros comerciais e financeiros da operação |
| 2 | `garantia` | Garantia | ShieldCheck | Garantias vinculadas à operação |
| 3 | `anexos` | Anexos | Paperclip | Documentação comprobatória |

---

## 5. Body

```
flex: 1;
overflow-y: auto;
padding: 32px;
```

---

## 6. Footer

`padding: 16px 32px`, border-top, bg card, `justify-between`

### Esquerda

Ghost: muted, semibold `--text-sm`, `padding: 10px 4px`, gap 6

| Contexto | Texto |
|---|---|
| 1ª etapa | **Cancelar** → `emit('close')` |
| Demais | `ChevronLeft` 15 + **Voltar** → `stepIdx--` |

### Direita (`gap: 16px`)

| Peça | Spec |
|---|---|
| Warning (só última + `!canConfirm`) | `AlertTriangle` 14 + `"{n} documento(s) obrigatório(s) pendente(s)"` — xs semibold `--warning-base` |
| CTA etapas 1–2 | **Próxima etapa** + `ChevronRight` 15 — h **44**, pad `0 22px`, `--action-primary-bg`, `#fff`, xs bold `letter-spacing: 0.08em`, `radius-lg` |
| CTA última OK | **Confirmar solicitação** + `Check` 15 — **`--success-base`** |
| CTA última bloqueada | `neutral-200` / `--text-disabled`, `cursor: not-allowed`, `disabled` |

`canConfirm` = todos docs obrigatórios com `docFiles[id] === true`.  
Última etapa + confirm → `emit('create', { ...form })` (garantias ficam só no estado local do modal; o create atual passa só o form).

---

## 7. Etapa 1 — Dados Gerais

Root: `flex flex-col; gap: 16px`

### Primitivos locais

| Comp | Spec |
|---|---|
| **BentoBox** | sunken, `radius-lg`, pad **20**; título 10px accent uppercase `letter-spacing: 0.18em`, `margin-bottom: 14px` |
| **BentoGrid** | `repeat(cols, 1fr)`, **gap: 14px** |
| **FieldLabel** | 10px bold muted uppercase `0.14em`, `margin-bottom: 6px` |
| **FormField / SelectField** | input/select h **40**, pad `0 14px` (select `pr: 36`), border, `radius-lg`, `--text-sm` |
| Select chevron | `ChevronDown` 16 absolute right 12, `neutral-400`, `appearance: none` |

### Blocos

**Identificação** — grid 3

| Campo | Opções |
|---|---|
| Tipo de operação | Desconto Duplicata, Contrato NC/NP/CCB/CPR/CPRF/CDCA |
| Esteira | labels de `ESTEIRAS` (`operacaoData.ts`) |
| Tipo de contrato | CCB, CPR-F, CDCA, CDA-WA, NCE |

**Responsáveis** — grid 2

| Campo | Opções |
|---|---|
| Unidade de negócio | Ceres Trading, Ceres Confina, Ceres Investimentos |
| Gerente comercial | Ana Martins, Carlos Eduardo, Fernanda Lima, Roberto Alves |

**Veículo** — grid 3

| Campo | Notas |
|---|---|
| Fundo | CRA Semeagro, CRA Ceres Agro, CRA BTG Agro, FIDC Boa Safra |
| Grupo empresarial | Grupo Ceres, Semeagro, BTG Agro, Raízen, Cargill Brasil, Coamo, Castrolanda |
| Conta bancária | select + botão **Plus 40×40** (border, card, `--gci-base`) à direita — **sem handler** |

**Taxas**

- Default `tipoTaxa = 'Pré-fixado'`
- Opções: Pré-fixado | Pós-fixado | Híbrido
- Se **Pós-fixado**: grid **4** → Tipo + Índice (CDI/IPCA/Selic) + Operador (Percentual/Spread) + Valor da taxa
- Senão: grid **3** → Tipo + Taxa operação (%) + FEE (%)
- FEE sempre visível

**ToggleRow** — “Operação para quitação de vencidos”

| Spec | Valor |
|---|---|
| Pad | `14px 18px`, `radius-lg` |
| Off | border default + card |
| On | border/bg `--success-base` / `--success-light` |
| Track | 44×24; knob 18; on = **success** (não gci) |

**Agrupamento** — tabela mock (somente leitura)

- Container: border, `radius-lg`, overflow hidden, card
- Header: sunken, `10px 14px`, 10px bold uppercase `0.12em` muted
- Grid: `1.4fr 1fr 1fr 1.2fr`
- Rows: `12px 14px`, border-top, `--text-sm`, `tabular-nums`
- Colunas: Agrupamento | Limite | Risco | Risco c/ Solicitação
- Seed: Confina / Multicedentes (valores fixos em BRL)

> `valorOperacao` existe em `NewPedidoData` / `form`, mas **não há campo na UI** desta etapa.

---

## 8. Etapa 2 — Garantia

Root: `gap: 20px`

### Toggle “Requer garantia”

| Spec | Valor |
|---|---|
| Pad | `16px 20px`, `radius-lg`, clicável |
| Off | border + card |
| On | border `--gci-base`, bg `--gci-light` |
| Ícone | Shield 20 — gci se on, muted se off |
| Título | `--text-base` bold |
| Hint | xs muted: *Ative para vincular garantias reais ou fidejussórias à operação.* |
| Switch | track 44×24; on = **`--gci-base`** (diferente do ToggleRow verde) |

### Empty (`requer === false`)

- Pad `48px 24px`, centralizado, gap 12
- Círculo 64 sunken, Shield 28 stroke 1.5, `neutral-400`
- Texto sm muted max-width 360 — aponta para **“Próxima etapa”**

### Form (`requer === true`)

**SectionGroup** “Adicionar garantia” (`ShieldCheck`)

- Card: pad 20, border, `radius-lg`
- Eyebrow: 10px accent uppercase `0.18em` + ícone 14, `margin-bottom: 16px`
- Grid: `1fr 1.4fr 1fr auto`, gap 12, `items-end`
- Campos: Tipo (select) · Nome · Valor · **AddButton**

**AddButton:** h 40, pad `0 16px`, gap 6, **`--success-base`**, `#fff`, Plus 14, texto **ADICIONAR**, xs bold `letter-spacing: 0.08em`

Tipos de garantia: Penhor Agrícola, Alienação Fiduciária, Aval, Hipoteca, CPR Física  
Add só se `tipo` e `nome` preenchidos; limpa o form após push.

**DataTable**

| Col | width |
|---|---|
| Tipo | `1fr` |
| Nome | `1.6fr` |
| Valor | `1fr` |
| trash | `36px` |

- Header sunken `10px 14px`, 10px uppercase `0.12em`
- Rows `12px 14px`; 1ª col bold; trash `--danger-base` só no **hover** da row (`opacity 0→1`)
- Empty: “Nenhuma garantia adicionada.”
- Paginação default 10 (`TablePagination`)

Cada item gera doc obrigatório na etapa 3: `Laudo de Avaliação — {nome}` (`id: garantia-{i}`).

---

## 9. Etapa 3 — Anexos

Root: `gap: 20px`

### Docs gerais (fixos)

| id | nome | obrigatório |
|---|---|---|
| `contrato-social` | Contrato Social | sim |
| `cartao-cnpj` | Cartão CNPJ | sim |
| `balanco` | Balanço Patrimonial | sim |
| `end` | Comprovante de Endereço | não |
| `procuracao` | Procuração | não |

+ bloco **Documentos das garantias** se `docsGarantia.length > 0`.

### DocGroup / linha

| Peça | Spec |
|---|---|
| Título grupo | 10px accent uppercase `0.18em`, `margin-bottom: 12px` |
| Row | gap 14, pad `12px 16px`, card, border, `radius-lg` |
| Pendente obrigatório | **`border-left: 3px solid var(--warning-base)`** |
| Ícone box | 38×38, `radius-md` — FileText muted / CheckCircle2 em success-light |
| Nome | sm bold strong |
| Badge | 9px bold pill uppercase — Obrigatório (`status-warning-*`) / Opcional (`status-neutral-*`) |
| Sub | 11px — “Nenhum arquivo anexado” / “Arquivo anexado · documento.pdf” (success-dark) |
| Sem arquivo | botão **Enviar** + Upload 14, pad `8px 14px`, `radius-md`, border |
| Com arquivo | `IconAction` Download + Trash danger (34×34) |

Toggle = mock de upload (`docFiles[id]` boolean). Sem upload real de arquivo.

---

## 10. Tipo de dados

```ts
interface NewPedidoData {
  tipoOperacao: string;
  esteira: string;
  tipoContrato: string;
  unidadeNegocio: string;
  gerenteComercial: string;
  fundo: string;
  grupoEmpresarial: string;
  contaBancaria: string;
  tipoTaxa: string;          // default 'Pré-fixado'
  taxaOperacao: string;
  indicePos: string;
  operadorPos: string;
  valorTaxaPos: string;
  fee: string;
  valorOperacao: string;     // no form, sem UI
  quitacaoVencidos: boolean;
  requerGarantia: boolean;
}

type GarantiaItem = { tipo: string; nome: string; valor: string };
```

---

## 11. Pós-create (`SolicitacaoScreen`)

`buildFromForm(data)`:

| Campo | Valor |
|---|---|
| `id` | `#${1397 + random até 1996}` |
| `etapa` | `'RASCUNHO'` |
| `validacao` | `'VALIDO'` |
| `abertura` | data de hoje ISO |
| `tempoTotalHoras` / `tempoEtapaHoras` | `0` |
| `slaEtapaHoras` | `24` |

Insere no topo da lista (`unshift`). Fecha o modal.

---

## 12. Checklist visual

- [ ] Overlay teal 0.55 + blur 8 / z 400; painel 980px × 85vh
- [ ] Header `--text-2xl`; fechar 36×36 com border (não sunken)
- [ ] Stepper underline agro 3px; steps não clicáveis
- [ ] Body pad 32; BentoBox sunken + título accent
- [ ] Campos h 40; ToggleRow quitação = verde; Switch garantia = gci
- [ ] AddButton verde; trash da tabela só no hover
- [ ] Docs obrigatórios pendentes: border-left warning 3px
- [ ] CTA intermediário primary gci; confirmar final success
- [ ] Confirmar bloqueado enquanto houver docs obrigatórios pendentes

---

## 13. Referências

| Arquivo | Papel |
|---|---|
| `components/NovoPedidoModal.vue` | Shell + stepper + footer |
| `components/novo-pedido/DadosGeraisStep.vue` | Etapa 1 |
| `components/novo-pedido/GarantiaStep.vue` | Etapa 2 |
| `components/novo-pedido/AnexosStep.vue` | Etapa 3 |
| `components/novo-pedido/DocGroup.vue` | Linhas de anexo |
| `screens/SolicitacaoScreen.vue` | Abre modal + `buildFromForm` |
| [listagem.md](./listagem.md) | Botão NOVO PEDIDO + contexto kanban/cards/tabela |

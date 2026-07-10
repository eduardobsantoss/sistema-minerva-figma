# Handoff — Ativos (Solicitação de Operação)

> Fonte de verdade complementar: `guidelines/Guidelines.md` (design tokens e padrão estrutural de telas de detalhe) e `docs/handoff/solicitacao-detalhes.md` (contexto geral da tela de detalhe). Este documento cobre **somente a aba Ativos** e o **drill-down de detalhe do ativo** em `src/features/solicitacao-operacao/`.

---

## 1. Onde fica e como a feature é montada

### Entrada

Dentro de `SolicitacaoDetailScreen.vue`, após o usuário abrir uma solicitação na listagem:

```
SolicitacaoScreen.vue
└─ SolicitacaoDetailScreen.vue
    ├─ tab === 'ativos'  →  AtivosTab.vue          (listagem na aba)
    └─ subView === 'ativo-detalhe'  →  AtivoDetailView.vue  (tela cheia)
```

A aba **Ativos** é a segunda `TabPill` externa (`Boxes`). O detalhe do ativo **substitui** toda a tela de detalhe da solicitação (mesmo padrão de `parte-detalhe` e `validacoes-detalhe`).

### Árvore de pastas

```
src/features/solicitacao-operacao/
├── data/
│   ├── operacaoData.ts           → ContratoAtivo, ParcelaAtivo, detalheSolicitacao()
│   ├── ativoData.ts              → tipos ricos, seeds, enriquecerContratoAtivo()
│   └── pagamentoFields.ts        → campos dinâmicos da aba Pagamentos
├── screens/
│   ├── SolicitacaoDetailScreen.vue   → orquestra aba + subView + modais
│   └── detail-tabs/
│       ├── AtivosTab.vue
│       ├── ativos/
│       │   └── AtivosTable.vue
│       └── ativo/
│           ├── index.ts
│           ├── AtivoDetailView.vue
│           ├── TituloTab.vue
│           ├── PessoaDetailTabs.vue
│           ├── titulo/               → 6 sub-abas do título
│           └── pessoa/               → Dados, Contatos, Endereços, Histórico
└── components/modals/
    ├── AdicionarContratoModal.vue
    ├── VincularAtivosModal.vue
    ├── ConfirmarTituloModal.vue
    └── ProrrogarVencimentoModal.vue
```

---

## 2. De onde vêm os dados

Hoje **tudo é mock**. A lista de ativos vive em `det.ativos`, derivado de `detalheSolicitacao(s)`:

```ts
// operacaoData.ts
export function detalheSolicitacao(s: Solicitacao): DetalheSolicitacao {
  return {
    // ...
    ativos: seedAtivos(s.id),
    // ...
  };
}
```

`det` é `reactive` em `SolicitacaoDetailScreen.vue` — mutações (vincular, remover, confirmar, prorrogar) alteram o array local.

### a) `ContratoAtivo` — objeto principal

Definido em `operacaoData.ts`, estendido com tipos de `ativoData.ts`:

```ts
interface ContratoAtivo {
  id: string;
  numero: string;
  tipo: string;
  emissao: string;
  vencimento: string;
  valorTotal: number;
  sacadoNome: string;
  sacadoDocumento: string;
  parcelas: ParcelaAtivo[];
  // Colunas da tabela
  registro: string;
  statusAnexos: StatusAnexos;       // PENDENTE | ENVIADO | REJEITADO
  anexosEnviados: number;
  anexosTotal: number;              // padrão: 11 (ANEXO_TITULO_DOCS.length)
  lastro: string;
  entrega: EntregaTipo;             // PER | FUT
  confirmacao: ConfirmacaoAtivo;    // PENDENTE | CONFIRMADO | REJEITADO
  situacao: SituacaoTitulo;         // VALIDADO | REJEITADO | PENDENTE
  situacaoPagamento: SituacaoPagamento; // VENCIDO | EM_DIA | LIQUIDADO | PENDENTE
  entrada: string;
  cedenteNome: string;
  cedenteDocumento: string;
  // Detalhe
  cedente: AtivoPessoa;
  sacado: AtivoPessoa;
  pagamentosDetalhe: AtivoDetalhePagamentos;
  confirmacoes: AtivoConfirmacao[];
  observacoesCobranca: AtivoObservacaoCobranca[];
  historicoTitulo: EventoHistorico[];
  anexosDocs: AtivoAnexoDoc[];
}
```

### b) Seeds por solicitação

`seedAtivos(solicitacaoId)` em `ativoData.ts` retorna ativos só para:

| Solicitação | Ativo(s) seed | Destaque |
|---|---|---|
| `#1384` | `50342-1` | REJEITADO, VENCIDO, histórico rico, anexos parciais |
| `#1388` | `48201-2` | REJEITADO, anexos pendentes |
| `#1386` | `47100-3` | VALIDADO, EM_DIA, FUT, confirmado |

Outras solicitações começam com `ativos: []`.

### c) `enriquecerContratoAtivo()` — preenchimento de defaults

Contratos criados via modal trazem poucos campos. A função completa o objeto antes de entrar em `det.ativos`:

```ts
// ativoData.ts
export function enriquecerContratoAtivo(
  ativo: Omit<ContratoAtivo, 'id'> & Partial<Pick<ContratoAtivo, 'id'>>,
): ContratoAtivo
```

Preenche: `id` gerado, `lastro` aleatório se ausente, `cedente`/`sacado` via `pessoaBase()`, `pagamentosDetalhe` via `defaultPagamentos()`, `anexosDocs` via `ANEXO_TITULO_DOCS` (11 documentos), defaults de situação/confirmação/anexos.

### d) Títulos disponíveis para vincular

`TITULOS_DISPONIVEIS` (3 itens mock) alimentam `VincularAtivosModal`. Conversão:

```ts
tituloDisponivelParaContrato(t) → enriquecerContratoAtivo({ ... })
```

### e) Pagamentos no detalhe

`pagamentosDetalhe` fica em `ContratoAtivo`, mas a aba **Pagamentos** mantém cópia local reativa:

```ts
// PagamentosTituloTab.vue
const det = ref<AtivoDetalhePagamentos>({ ...props.ativo.pagamentosDetalhe });
```

Alterações na aba **não** propagam de volta para `ativo.pagamentosDetalhe` no pai — estado isolado na sessão da aba.

### f) Mapas de cor (`ativoData.ts`)

| Mapa | Uso |
|---|---|
| `TONE_SITUACAO` | Badge situação do título |
| `TONE_SIT_PAGAMENTO` | Coluna sit. pagamento na tabela |
| `TONE_STATUS_ANEXOS` | Coluna status anexos |
| `TONE_ENTREGA` | Badge PER/FUT |

---

## 3. Navegação e fluxos

### Estado em `SolicitacaoDetailScreen.vue`

| Ref | Papel |
|---|---|
| `tab` | `'ativos'` para exibir a aba |
| `subView` | `'ativo-detalhe'` para tela de detalhe |
| `selectedAtivo` | `ContratoAtivo` clicado na tabela |
| `ativosAcao` | seleção em lote para modais Confirmar/Prorrogar |
| `show*Modal` | flags dos 4 modais de ativos |

### Fluxos da aba (`AtivosTab` → pai)

| Ação UI | Evento | Handler no pai |
|---|---|---|
| Vincular Ativos | `vincular` | `showVincularModal = true` |
| Adicionar Contrato | `addContrato` | `showContratoModal = true` |
| Exportar | `exportar` | noop `() => {}` |
| Menu → Remover | `remover` | `handleRemover(ids)` — filtra `det.ativos` |
| Menu → Prorrogar | `prorrogar` | abre `ProrrogarVencimentoModal` |
| Menu → Confirmar | `confirmar` | abre `ConfirmarTituloModal` |
| Clique na linha | `openAtivo` | `subView = 'ativo-detalhe'` |

Menu de 3 pontos exige **seleção** (`hasSelection`) para Prorrogar e Confirmar; Remover também.

### Detalhe do ativo (`AtivoDetailView`)

**3 abas externas** (`TabPill`):

| Aba | Conteúdo |
|---|---|
| Título | `TituloTab` → 6 sub-abas underline |
| Cedente | `PessoaDetailTabs` (Dados, Contatos, Endereços) |
| Sacado | `PessoaDetailTabs` + sub-aba **Histórico** (`historicoTitulo`) |

Voltar emite `back` → `closeAtivoDetail()` limpa `subView` e `selectedAtivo`.

---

## 4. Aba Ativos — listagem

### `AtivosTab.vue`

- Envolve tudo em `Section title="Ativos Vinculados"` (`detail-tabs/shared`)
- **Barra de ações:** `GhostButton` (Vincular, Adicionar, Exportar) + menu `MoreVertical`
- **Filtros locais:** Lastro, Número, Sacado (client-side em `ativosFiltrados`)
- **EmptyState** quando `det.ativos.length === 0`
- **Footer:** valor total da carteira + valor dos selecionados (laranja `--accent`)

### `AtivosTable.vue`

Tabela com scroll horizontal (`min-width: 1400px`), **15 colunas**:

| # | Coluna |
|---|---|
| ☐ | Checkbox (seleção) |
| 1 | Registro |
| 2 | Status anexos |
| 3 | Anexos (enviados/total) |
| 4 | Lastro |
| 5 | Entrega |
| 6 | Número |
| 7 | Valor nominal |
| 8 | Cedente |
| 9 | Sacado |
| 10 | Confirmação |
| 11 | Situação |
| 12 | Sit. pagamento |
| 13 | Entrada |
| 14 | Vencimento |

- Checkbox: `src/components/ui/Checkbox.vue` (com `indeterminate` no header)
- Clique na linha → `openAtivo`; checkbox usa `@click.stop`
- Badges usam mapas `TONE_*` de `ativoData.ts`

---

## 5. Detalhe do ativo

### Header (`AtivoDetailView.vue`)

- Eyebrow: `{solicitacaoId} · Detalhes do Ativo`
- Título: `Título {numero}` + `CopyButton` + badge `situacao`
- Subtítulo: lastro · cedente → sacado
- Valor nominal à direita (`--text-2xl`)

**Sem card externo** envolvendo abas + conteúdo — padrão alinhado ao módulo Risco (sub-abas fora do card).

### `TituloTab.vue` — 6 sub-abas underline

Sub-abas **fora** do card branco; conteúdo **dentro** do card (`padding: 24px`):

| Sub-aba | Componente |
|---|---|
| Detalhes do Título | `DetalhesTituloTab` — grids `Section` + `Field` |
| Anexos | `AnexosTituloTab` — `DocGroup`, confirmar/rejeitar (visual) |
| Pagamentos | `PagamentosTituloTab` — formulário dinâmico + histórico |
| Confirmações | `ConfirmacoesTituloTab` — lista ou `EmptyState` |
| Observações de Cobrança | `ObservacoesCobrancaTab` |
| Movimentações | `MovimentacoesTituloTab` — timeline `historicoTitulo` |

Estilo underline: `border-bottom: 2px solid var(--accent)` na ativa; `flex-wrap` (sem scroll horizontal).

### `PessoaDetailTabs.vue`

Reutilizável para Cedente e Sacado:

- Sub-abas: Dados, Contatos, Endereços (+ Histórico se prop `historico` presente)
- Sacado recebe `:historico="ativo.historicoTitulo"`
- Mesmo padrão underline + card de conteúdo

---

## 6. Aba Pagamentos (implementação de referência)

### Arquivos

| Arquivo | Papel |
|---|---|
| `pagamentoFields.ts` | `REGISTRAR_PAGAMENTO_FIELDS`, `CONFIGURACAO_TITULO_FIELDS` |
| `DynamicPagamentoFormGrid.vue` | Renderiza campos por `type`: text, select, toggle |
| `DynamicConfigGrid.vue` | Configuração somente leitura |
| `PagamentosTituloTab.vue` | Orquestra seções |

### Campos dinâmicos (`pagamentoFields.ts`)

```ts
REGISTRAR_PAGAMENTO_FIELDS: PagamentoFormFieldDef[]
// text: valorAmortizacao, dataPagamento, jurosMoratorio, multa, jurosRemuneratorio, observacao
// select: tipoPagamento (Amortização, Juros, Liquidação, Parcial)
// toggle: transferenciaParcial (span: 3, prop spacious no ToggleRow)
```

### Seções da aba

1. Stats: valor em aberto, juros remuneratórios em aberto
2. Registrar pagamento — grid 3 colunas + `GhostButton` salvar
3. Histórico de pagamentos — tabela ou `EmptyState`
4. Configuração do título — collapsible + `DynamicConfigGrid`
5. Cronograma — tabela de `ParcelaAtivo` ou `EmptyState`

`ToggleRow` do modal `adicionar-contrato` com prop `spacious` para padding maior no toggle.

> Para evoluir: portar modais de estorno/edição de parcelas do FIDC (`docs/handoff/fidc.md`) se necessário.

---

## 7. Modais

| Modal | Abertura | Emissão | Efeito em `det.ativos` |
|---|---|---|---|
| `AdicionarContratoModal` | Adicionar Contrato | `create` | `push(enriquecerContratoAtivo(...))` — wizard com parcelas/cronograma automático |
| `VincularAtivosModal` | Vincular Ativos | `vincular` | `push(...titulos selecionados)` via `tituloDisponivelParaContrato` |
| `ConfirmarTituloModal` | Menu Confirmar | `confirm` | atualiza `confirmacao` + append em `confirmacoes[]` |
| `ProrrogarVencimentoModal` | Menu Prorrogar | `confirm` | atualiza `vencimento` |

Todos usam primitives de `components/modals/adicionar-contrato/` (`FormField`, `SelectField`, `ToggleRow`, `AddButton`).

`AdicionarContratoModal` recebe `:valor-operacao` e `:tipo-calculo` da solicitação para contexto do cronograma.

Upload de evidência/carta de correção nos modais Confirmar e Prorrogar é **somente visual**.

---

## 8. Componentes reutilizáveis

### Do módulo (`detail-tabs/shared/`)

| Componente | Uso em Ativos |
|---|---|
| `Section` | AtivosTab, sub-abas do título |
| `Field` | DetalhesTituloTab |
| `EmptyState` | lista vazia, pagamentos, confirmações |
| `GhostButton` | ações da barra, registrar pagamento |
| `TabPill` | abas externas em AtivoDetailView |
| `CopyButton` | número do título |

### Globais

| Componente | Uso |
|---|---|
| `Checkbox.vue` | AtivosTable, VincularAtivosModal |
| `DocGroup` | AnexosTituloTab (compartilhado com Novo Pedido) |

### Não duplicar

Formulários de pagamento devem usar `pagamentoFields.ts` + `DynamicPagamentoFormGrid` — não hardcodar labels/campos na aba.

---

## 9. Tipografia e espaçamento

| Contexto | Valor típico |
|---|---|
| Título detalhe ativo | `--text-xl`, bold |
| Valor nominal (header) | `--text-2xl`, `tabular-nums` |
| Eyebrow | `10px`, `letter-spacing: 0.18em`, `--accent` |
| Cabeçalho tabela ativos | `10px`, uppercase, `letter-spacing: 0.08em` |
| Células tabela | `--text-sm` |
| Sub-abas underline | `--text-sm`, bold; ativa com `2px` laranja |
| Gap entre blocos | `24px` (detalhe), `20px` (sub-abas → card) |
| Card conteúdo sub-aba | `padding: 24px`, `--radius-xl` |
| Footer totais | `--text-xs` label, `--text-md` valor |

Badges: fundo semântico light + texto dark (mapas `TONE_*`).

---

## 10. O que ainda é mock / fora de escopo

- Exportar ativos — handler vazio;
- Nenhuma API — CRUD só em `det` reativo;
- `pagamentosDetalhe` na aba Pagamentos não persiste no `ContratoAtivo` pai;
- Cronograma vazio por padrão em contratos novos (`defaultPagamentos`);
- Confirmar/Rejeitar anexos — botões sem backend;
- Observações de cobrança — lista estática ou vazia nos seeds;
- Filtros de data no `VincularAtivosModal` (`filtroDataIni`/`Fim`) declarados mas não aplicados no `computed`;
- Motivo da prorrogação capturado mas não gravado no ativo (só `vencimento` atualiza).

---

## 11. Checklist para evoluir Ativos

1. **Tipos** — estender `ContratoAtivo` em `operacaoData.ts` e helpers em `ativoData.ts` juntos.
2. **Novos seeds** — adicionar entrada em `SEED_MAP` de `seedAtivos()`.
3. **Contrato parcial** — sempre passar por `enriquecerContratoAtivo()` antes do `push`.
4. **Sub-abas underline** — manter barra **fora** do card; conteúdo **dentro** (não repetir erro de scroll).
5. **Pagamentos** — novos campos → `pagamentoFields.ts` + tipos em `PagamentoFormState`; toggle com `spacious` se full-width.
6. **Seleção em lote** — ações do menu devem receber `ids` de `selectedIds` em `AtivosTab`.
7. **API futura** — `det.ativos` vira fetch; manter props `ativo` em `AtivoDetailView` e filhos; sincronizar `pagamentosDetalhe` com PATCH ou store.

---

## 12. Referências rápidas de arquivos

| Arquivo | Conteúdo |
|---|---|
| `screens/SolicitacaoDetailScreen.vue` | subView, modais, mutações em `det.ativos` |
| `screens/detail-tabs/AtivosTab.vue` | listagem, filtros, seleção, menu |
| `screens/detail-tabs/ativos/AtivosTable.vue` | 15 colunas + Checkbox |
| `screens/detail-tabs/ativo/AtivoDetailView.vue` | shell do detalhe (3 abas) |
| `screens/detail-tabs/ativo/TituloTab.vue` | 6 sub-abas do título |
| `screens/detail-tabs/ativo/titulo/PagamentosTituloTab.vue` | pagamentos dinâmicos |
| `data/ativoData.ts` | seeds, tons, `enriquecerContratoAtivo` |
| `data/pagamentoFields.ts` | definição de campos do formulário |
| `data/operacaoData.ts` | `ContratoAtivo`, `detalheSolicitacao` |
| `components/modals/VincularAtivosModal.vue` | vincular títulos existentes |
| `components/modals/AdicionarContratoModal.vue` | criar contrato manual |
| `docs/handoff/solicitacao-detalhes.md` | handoff geral da solicitação |
| `docs/handoff/fidc.md` | referência para pagamentos avançados (estorno, parcelas) |

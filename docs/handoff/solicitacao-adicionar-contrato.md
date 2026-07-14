# Handoff — Adicionar Contrato (Solicitação de Operação)

> Fonte de verdade complementar: `guidelines/Guidelines.md` (design tokens), `docs/handoff/solicitacao-ativos.md` (contexto da aba Ativos) e `docs/handoff/solicitacao-detalhes.md` (tela de detalhe). Este documento cobre **somente o modal Adicionar Contrato** e o **wizard Gerar minuta CPR / CPR-F** em `src/features/solicitacao-operacao/`.

---

## 1. Onde fica e como é montado

### Entrada

```
SolicitacaoDetailScreen.vue
└─ tab === 'ativos'  →  AtivosTab.vue
    └─ GhostButton "Adicionar Contrato"
         → emit('addContrato')
         → showContratoModal = true
         → <AdicionarContratoModal />
```

### Árvore de pastas

```
src/features/solicitacao-operacao/
├── data/
│   ├── operacaoData.ts          → ContratoAtivo, ParcelaAtivo, UF_OPTIONS, PAISES_DDI
│   └── minutaData.ts            → tipos/opções do wizard, mocks, helpers
├── components/modals/
│   ├── AdicionarContratoModal.vue   → orquestra modo padrão ↔ wizard
│   ├── ParteRelacionadaModal.vue    → nested no step Avalista
│   ├── adicionar-contrato/          → primitivas compartilhadas
│   │   ├── BentoBox, BentoGrid, StepGrid
│   │   ├── FormField, SelectField, FieldLabel
│   │   ├── ToggleRow, AddButton, EmptyState
│   │   └── index.ts
│   └── minuta/
│       ├── MinutaWizard.vue
│       ├── MinutaStepper.vue
│       ├── EmitenteStep.vue
│       ├── CredoraStep.vue
│       ├── AvalistaStep.vue
│       ├── EmissaoStep.vue
│       ├── ProdutoStep.vue
│       ├── GarantiaMinutaStep.vue
│       ├── TituloMinutaStep.vue
│       └── index.ts
```

### Props / emits

| Prop | Tipo | Origem |
|---|---|---|
| `valorOperacao` | `number` | `solicitacao.valor` |
| `tipoCalculo` | `string` | `solicitacao.tipoTaxa ?? 'Pré-fixado'` |
| `partes?` | `ParteRelacionada[]` | `det.partes` (seed Avalista) |

| Evento | Payload |
|---|---|
| `close` | — |
| `create` | `Omit<ContratoAtivo, 'id'> & Partial<Pick<ContratoAtivo, 'id'>>` |

Persistência na tela:

```ts
function handleAddContrato(ativo) {
  det.ativos.push(enriquecerContratoAtivo(ativo));
  showContratoModal.value = false;
}
```

---

## 2. Dois modos — quando cada um aparece

```ts
minutaHabilitada = isTipoMinutaDisponivel(form.tipo)
showWizard       = form.gerarMinuta && minutaHabilitada
```

Tipos com minuta nesta versão: **`Contrato CPR`** e **`Contrato CPRF`** (também aceita aliases `CPR` / `CPR-F` / `CPRF`).

| Condição | UI |
|---|---|
| Default (`gerarMinuta === false`) | **Modo padrão** — body + footer Cancelar / GERAR TÍTULO |
| Tipo CPR/CPRF **e** “Gerar minuta” ON | **MinutaWizard** substitui body + footer |
| Toggle ON mas tipo ≠ CPR/CPRF | Toggle **disabled** (`opacity: 0.55`) + helper |
| Tipo sai de CPR/CPRF com toggle ON | `watch` força `gerarMinuta = false` → volta ao padrão |

**Ordem de uso:** o usuário escolhe **Tipo** em Dados do Título (modo padrão) → o toggle habilita → ao ligar, o wizard abre com esse tipo. No step Título o tipo fica disabled como `CPR` / `CPRF`.

| Elemento | Modo padrão | Wizard |
|---|---|---|
| Subtítulo do header | `Dados do título, parcelas/cronograma e dados do sacado` | `Geração de minuta CPR / CPR-F · 7 etapas` |
| Posição do toggle “Gerar minuta” | **Acima** de Dados do Título | Barra superior do wizard (esquerda) |

---

## 3. Chrome do modal (pixel)

| Token | Valor |
|---|---|
| Overlay | `position: fixed; inset: 0; z-index: 400` |
| Overlay fill | `rgba(8, 60, 74, 0.55)` + `backdrop-filter: blur(8px)` |
| Overlay pad | `32px`; flex center |
| Animação | `fadeIn 0.2s ease-out` |
| Panel | `max-width: 1040px`; `width: 100%`; `height: 88vh` |
| Panel radius | `var(--radius-xl)` → **12px** |
| Panel bg / shadow | `var(--surface-card)` / `var(--shadow-lg)` |
| Header pad | `24px 32px`; border-bottom `1px solid var(--border-default)` |
| Título | `var(--text-2xl)` = **24px**, weight 700, `letter-spacing: -0.01em` |
| Subtítulo | `var(--text-sm)` = **13px**, muted, `margin-top: 4px` |
| Close | `36×36`, radius 8px, border 1px, ícone `X` 18px |
| Body (padrão) | pad `32px`; gap entre seções `24px` |
| Footer (padrão) | pad `16px 32px`; gap `12px`; border-top |
| Cancelar | height `44px`, pad `0 20px`, weight 600, `text-sm` |
| GERAR TÍTULO | height `44px`, pad `0 24px`, radius 8px, weight 700, `text-xs`, tracking `0.08em`, bg `#083C4A`, texto branco; disabled → `neutral-200` / `text-disabled`; ícone `FileText` 15px |

### Modal nested “Nova Garantia”

Mesmo recipe de overlay; `z-index: 500`; `max-width: 860px`; `height: 85vh`.

---

## 4. Primitivas compartilhadas (`adicionar-contrato/`)

| Componente | Métricas |
|---|---|
| **BentoBox** | bg `surface-sunken`; radius 8px; pad `20px`; título 10px / weight 700 / tracking `0.18em` / color `var(--accent)` `#F27D26`; ícone 13px; título `margin-bottom: 14px` |
| **BentoGrid** | `repeat(cols, 1fr)`, gap `14px` |
| **StepGrid** | 12 colunas, gap `14px` (spans variáveis via prop `span`) |
| **FieldLabel** | 10px, weight 700, tracking `0.14em`, uppercase, `margin-bottom: 6px`; erro → `danger-base` + `*` |
| **FormField / SelectField** | input height **40px**; pad `0 14px` (select `0 36px 0 14px`); radius 8px; disabled bg `surface-sunken` |
| **ToggleRow** | pad default `14px 18px` / compact `12px 16px` / spacious `20px 24px`; radius 8px; ON border/bg `success-base` / `success-light`; track `44×24` pill; knob `18×18`; disabled opacity `0.55`; compact `min-height: 64px` (alinhado ao bloco label+input) |
| **AddButton** | height 40px; pad `0 18px`; bg `var(--gci-base)`; weight 700; `text-xs`; tracking `0.04em` |
| **EmptyState** | pad `40px 24px`; gap 10; dashed border; ícone 28px @ 0.5 opacity; hint max-width 360px |
| **MinutaStepper** | bg `surface-sunken`; item `min-width: 88px`; pad `14px 8px 11px`; gap 6; ícone 18; label 9px / weight 800 / tracking `0.20em`; ativo: underline `3px solid var(--agro-base)`; futuros opacity 0.6; **sem checkmarks** (padrão CRA/FIDC) |

### Tokens resolvidos (`theme.css`)

```
--gci-base #083C4A | --agro-base / --accent #F27D26 | --success-base #059669
--surface-card #FFF | --surface-sunken #F1F5F7 | --border-default #E3E9ED
--text-strong #0F172A | --text-muted #64748B | --danger-base #DC2626
--radius-sm 4px | --radius-lg 8px | --radius-xl 12px
--text-xs 0.75rem | --text-sm 0.8125rem | --text-2xl 1.5rem
--shadow-lg 0 12px 32px rgba(15,23,42,0.16)
```

Tabelas de lista: header/body pad `10px 14px`; trash `28×28`, radius `radius-sm`.  
Upload decorativo (padrão): height `42px`, pad `0 14px`, gap 8, dashed border, radius 8px.

---

## 5. Modo padrão — inventário de campos

### 5.1 Toggle superior

| Controle | Notas |
|---|---|
| Gerar minuta | `ToggleRow` (tamanho default); disabled até `minutaHabilitada` |
| Helper (sem tipo) | `Selecione o tipo do título (CPR ou CPRF) em Dados do Título...` · `text-xs` muted · `margin-top: -12px` |
| Helper (tipo inválido) | `Disponível apenas para Contrato CPR e Contrato CPRF nesta versão.` |

### 5.2 Dados do Título (`BentoBox`, ícone `Tag`)

Grid interno: coluna vertical gap `14px`; campos em `BentoGrid :cols="4"`.

| Campo | Componente | Opções / placeholder | Regras |
|---|---|---|---|
| Upload documento | row dashed + `Paperclip` 15 | `Insira o documento...` | **Somente visual** |
| Valor total | `FormField` | `brl(valorOperacao)` | **Sempre disabled** |
| Tipo de cálculo | `SelectField` | `[tipoCalculo]` | **Sempre disabled** |
| Número | `FormField` | `—` | Obrigatório para submit |
| Tipo | `SelectField` | `TIPO_OPERACAO_OPTS` | Obrigatório; libera minuta |
| Tipo de valor: NOMINAL | `ToggleRow` compact | — | Local; **não vai no payload** |
| Emissão | `FormField` | `dd/mm/aaaa` | `required` (UI) |
| Vencimento | `FormField` | `dd/mm/aaaa` | `required` (UI) |
| Chave da nota | `FormField` | `—` | Opcional; não no payload |
| Doc. da cedente | `SelectField` | `DOC_CEDENTE_OPTS` | Opcional; não no payload |
| Gerar operação no módulo de garantias | `ToggleRow` compact | — | Local; não no payload |

```ts
TIPO_OPERACAO_OPTS = [
  'Desconto Duplicata', 'Contrato NC', 'Contrato NP',
  'Contrato CCB', 'Contrato CPR', 'Contrato CPRF', 'Contrato CDCA',
];
DOC_CEDENTE_OPTS = [
  'Contrato_Social_Cedente.pdf', 'Procuracao_2026.pdf', 'Cartao_CNPJ.pdf',
];
```

### 5.3 Parcelas (condicional)

| Controle | Notas |
|---|---|
| Possui múltiplas parcelas | `ToggleRow` → revela `BentoBox` “Parcelas” |
| Linha de cadastro | grid `1fr 1fr 1fr auto`, gap `12px`, `items-end` |
| Parcela | disabled `${n}ª Parcela` |
| Valor | placeholder `R$ 0,00` |
| Vencimento | `dd/mm/aaaa` required |
| Adicionar parcela | `AddButton` — exige valor + vencimento |
| Empty | `EmptyState` Layers · “Nenhuma parcela adicionada” |
| Tabela | colunas `1.4fr 1fr 1fr auto` · Parcela / Valor / Vencimento / trash |
| Rodapé | `Somatória das parcelas: …` |
| Warning | Se soma ≠ `valorOperacao`: mensagem laranja + `AlertTriangle` |

### 5.4 Cronograma (condicional)

| Controle | Notas |
|---|---|
| Possui cronograma de pagamentos | `ToggleRow` |
| Gerar pagamentos automaticamente | `ToggleRow` compact |
| **Auto ON** | Fluxo Amortização + Fluxo juros (`FLUXO_OPTS`) + botão “Gerar pagamentos” |
| **Auto OFF** | Amortização, Vencimento, toggle Pagar juros, Valor do juros (disabled se !pagarJuros), “Adicionar pagamento” |
| Obs | Texto em vermelho sobre pré-fixado / juros R$ 0,00 |
| Tabela | Parcela / Vencimento / Amortização / Juros / Pagar juros |
| Rodapé | `Amortização: …` |

```ts
FLUXO_OPTS = ['Única', 'Mensal', 'Bimestral', 'Trimestral', 'Quadrimestral', 'Semestral', 'Anual'];
```

Mock “Gerar pagamentos”: 2 parcelas, cada uma `valorOperacao/2` (fallback `50000`), juros 2%, datas `30/07/2026` e `30/08/2026`.

**Precedência no submit:** se `possuiCronograma`, payload usa cronograma; senão, array de parcelas.

### 5.5 Dados do Sacado (`BentoBox`)

`StepGrid` 12 colunas, gap `14px`:

| Campo | Span | Opções |
|---|---|---|
| CPF/CNPJ | 4 | — |
| Nome | 5 | — |
| E-mail | 3 | — |
| DDI | 2 | `PAISES_DDI[].ddi` (default `+55`) |
| Telefone | 4 | — |
| CEP | 3 | — |
| Número | 3 | — |
| Endereço | 6 | — |
| Complemento | 6 | — |
| Bairro | 4 | — |
| Cidade | 4 | texto livre (não amarrada à UF) |
| Estado | 2 | `UF_OPTIONS` (27 UFs) |
| País | 2 | `PAISES_DDI[].pais` (default `Brasil`) |

**No payload `create`:** só `sacadoNome` + `sacadoDocumento`. Endereço/contato extras são UI-only hoje.

### 5.6 Gate de submit (padrão)

```ts
canSubmit = form.numero.trim() !== '' && form.tipo.trim() !== ''
```

Footer: **Cancelar** + **GERAR TÍTULO**.

---

## 6. Wizard Gerar minuta — shell

### Barra superior

Grid `1fr 1.5fr 1fr`, gap `16px`, pad `16px 32px`, border-bottom, `align-items: stretch`:

| Coluna | Controle |
|---|---|
| Esquerda | `ToggleRow` compact “Gerar minuta” — desligar fecha o wizard |
| Centro | `SelectField` “Selecione o template” **disabled** · opções=`[template]` |
| Direita | `ToggleRow` compact “Gerar via não negociável” · default **ON** |

Templates:

| Tipo | Template |
|---|---|
| CPR / Contrato CPR | `CPR Física (Trading)` |
| CPRF / Contrato CPRF | `CPR-F (Ceres Investimentos)` |

Toggles compact usam `min-height: 64px` para alinhar à altura do SelectField (label + input).

### Stepper (`MinutaStepper`)

7 abas clicáveis (navegação livre):

`Emitente → Credora → Avalista → Emissão → Produto → Garantia → Título`

Ícones Lucide: `User`, `Building2`, `Users`, `MapPin`, `Package`, `Shield`, `Tag`.  
Estado ativo: cor + underline 3px agro. Passados: cor gci. Futuros: muted + opacity 0.6. **Sem ícone de check.**

### Footer do wizard

Pad `16px 32px`, border-top:

| Esquerda | Centro | Direita |
|---|---|---|
| Voltar (`ChevronLeft` 15) — disabled no step 0, opacity 0.4 | `{n} / 7` · `text-xs` muted semibold | **Próximo** (+ `ChevronRight`) ou no último **GERAR TÍTULO** (`FileText` 15) |

CTA: height 44px, pad `0 22px`, radius 8px, tracking `0.08em`, bg `action-primary-bg`.  
“Próximo” **não valida** o step atual — só avança. Submit só no último step.

---

## 7. Etapas do wizard — campos e spans

Layout padrão dos steps: vertical gap `14px` / `18px`; campos em `StepGrid` 12-col + `span`.

### 7.1 Emitente

| Campo | Span | Notas |
|---|---|---|
| Insira o doc. do cliente | 7 | Mock docs; autofill via `buscarClientePorDoc` |
| Natureza | 5 | `Pessoa Física` / `Pessoa Jurídica` (`SelectField`) |

**PF:** CPF 3 · Nome 5 · RG 4 · Inscrição produtor 4 · Nacionalidade 4 · Data nasc. 4 · Profissão 4 · Estado Civil 4 · E-mail representante 4.

**PJ:** CNPJ 4 · Razão 5 · Fantasia 3 · Abertura 3 · Tipo 3 · Porte 3 · Atividade 3 · Natureza jurídica 6 · Inscrição municipal 3 · estadual 3 · **Representante Legal** (`BentoBox`): CPF 3 · Nome 5 · RG 4 · Inscrição 4 · Nacionalidade 4 · Data nasc. 4 · Profissão 4.

**Contato** (`BentoBox`): E-mail 5 · DDI 3 · Telefone 4.  
**Endereço** (`BentoBox`): CEP 3 · Localidade 6 · Número 3 · Bairro 4 · Info 8 · Estado 3 · Cidade 5 (`cidadesDaUf`, disabled sem UF) · País 4.

`AddButton` “Adicionar emitente” → tabela; remover com trash. Pode haver vários emitentes.

### 7.2 Credora

Três modos:

| Modo | Quando | UI |
|---|---|---|
| Vazio | Sem padrão e sem doc | Só selects do topo |
| Credora padrão | `CREDORA_PADRAO_OPTS` escolhida | Form PF/PJ preenchido de `CREDORAS_PADRAO`; doc **disabled**; link “Limpar credora padrão” |
| Via documento | Doc selecionado, sem padrão | Contato / Endereço / Representante como **selects** mock (sem form livre) |

Topo:

| Campo | Span |
|---|---|
| Selecione a Credora Padrão | 4 |
| Insira o doc. do cliente | 5 (disabled se padrão) |

Modo cliente: Contato 3 · Endereço 6 · Representante 6.

Form credora padrão (PJ típico) reusa spans do Emitente PJ + Contato/Endereço. Cidade disabled sem Estado. **Sem lista** — uma credora.

```ts
CREDORA_PADRAO_OPTS = ['Ceres Trading', 'Ceres Confina', 'Ceres Investimentos'];
```

### 7.3 Avalista

| Controle | Regras |
|---|---|
| Possui avalistas | `ToggleRow` · default **true** no wizard |
| Adicionar novo avalista | Abre `ParteRelacionadaModal`; força tipo `AVA` |
| Seed | `partes` onde `tipos.includes('AVA')` |
| Coluna checkbox | `selecionadoAssinatura` · `Checkbox` 16×16, radius 4px, fill `gci-base` |
| Possui cônjuge | Display Check / X (ícone) |
| Cônjuge interveniente | `Checkbox` **disabled** se `!possuiConjuge` |

`possuiConjuge` vem de `ParteRelacionada.possuiConjuge`.

### 7.4 Emissão

`BentoBox` com:

| Campo | Span | Opções |
|---|---|---|
| UF da emissão | 4 | `['MG','SP','MT','GO','PR','MS','BA','TO']` ∩ `UF_OPTIONS` · required |
| Cidade da emissão | 8 | `cidadesDaUf(uf)` · disabled sem UF · required |

### 7.5 Produto

| Campo | Span |
|---|---|
| Tipo | 3 · `PRODUTO_TIPO_OPTS` |
| Unidade de medida | 3 |
| Valor unitário | 3 |
| Quantidade | 3 |
| Safra | 3 |
| Local de produção | 3 |
| Estado de produção | 3 · UF subset |
| Cidade de produção | 3 · dependente |
| Nº da matrícula | 4 |
| UF de registro | 4 · subset |
| Cidade de registro | 4 · dependente |

Add exige `tipo`. Lista: Tipo / Valor unitário / Quantidade / Safra.

```ts
PRODUTO_TIPO_OPTS = ['Soja', 'Milho', 'Algodão', 'Café', 'Trigo', 'Boi Gordo'];
UNIDADE_MEDIDA_OPTS = ['Saca (60kg)', 'Tonelada', 'Quilograma', 'Arroba', 'Hectare'];
```

### 7.6 Garantia

Lista + `AddButton` → nested modal **Nova Garantia**.

**Tipos nesta fase:** apenas `AF. Estoque` e `Penhor de Estoque`.

| Seção | Campos (spans) |
|---|---|
| Tipo | Selecione o tipo · 5 |
| Estoque de formação | Nome imóvel 6 · Matrícula 6 · Zona 3 · Tipo imóvel 3 · Área 3 · Unidade 3 · Cartório 4 · UF registro 4 · Cidade registro 4 |
| Imóvel locado | Toggle → Tipo locação 4 · Data início 4 · Prazo indeterminado toggle · Data término 4 (hidden se indeterminado) · Natureza 4 · Contratante 6 · Contratado 6 |
| Endereço | Número 3 · Bairro 4 · Info 5 · Estado 3 (`UF_OPTIONS` full) · Cidade 5 · País 4 |
| Proprietário garantia | Natureza 4 |
| Estoques | “Adicionar dados do estoque” → rows propriedade/proprietário |
| Relatório | Data relatório 4 · Periodicidade 4 · Data 1ª atualização 4 |

Cadastro exige `form.tipo`. Valor exibido = `areaTotal || valor || '—'`.

```ts
ZONA_OPTS = ['Rural', 'Urbana'];
TIPO_IMOVEL_OPTS = ['Fazenda', 'Armazém', 'Galpão', 'Silo'];
TIPO_LOCACAO_OPTS = ['Arrendamento', 'Comodato', 'Parceria Agrícola'];
PERIODICIDADE_RELATORIO_OPTS = ['Mensal', 'Bimestral', 'Trimestral', 'Semestral', 'Anual'];
```

### 7.7 Título (`TituloMinutaStep`)

Espelha o modo padrão com diferenças:

| Diff vs padrão | Detalhe |
|---|---|
| Sem row de upload | — |
| Tipo de valor | Label alterna **LÍQUIDO** ↔ **NOMINAL** (`tipoValorLiquido`, default **true**) |
| Tipo | Disabled · `CPR` / `CPRF` do prop do wizard · span 3 |
| Doc cedente | Label “Insira o doc. da cedente”; opções = `MOCK_CLIENTES_MINUTA` como `doc - nome`; required; span 6 |
| Parcelas | **Ausente** — só cronograma (default `possuiCronograma: true`) |
| Sacado Cidade | `SelectField` ligado a UF via `cidadesDaUf` |
| Spans sacado | CPF 4 · Nome 5 · E-mail 3 · DDI 2 · Tel 4 · CEP 3 · Nº 3 · Endereço 6 · Compl. 6 · Bairro 4 · Estado 2 · Cidade 4 · País 2 |

Demais campos título: Valor total 3 · Tipo cálculo 3 · Número 3 · Emissão 3 · Vencimento 3 · Chave 3 · toggle garantias.

---

## 8. Payloads

### Modo padrão

```ts
{
  numero: string;
  tipo: string;
  emissao: string;
  vencimento: string;
  valorTotal: number;          // props.valorOperacao
  sacadoNome: string;
  sacadoDocumento: string;
  parcelas: ParcelaAtivo[];    // cronograma se possuiCronograma, senão parcelas
}
```

`ParcelaAtivo`: `{ parcela, vencimento, valor?, amortizacao?, juros?, pagarJuros? }`.

**Não emitidos:** flags de minuta, endereço/contato extras do sacado, chaveNota, docCedente, tipoValorNominal, gerarOperacaoGarantias, selects de fluxo (exceto linhas geradas).

### Modo minuta

```ts
{
  numero, tipo, emissao, vencimento,
  valorTotal: props.valorOperacao,
  sacadoNome, sacadoDocumento,
  parcelas: possuiCronograma ? cronograma : [],
  cedenteNome: minuta.emitentes[0]?.nome ?? '—',
  cedenteDocumento: minuta.emitentes[0]?.documento ?? '—',
  minuta: MinutaResumo
}
```

```ts
interface MinutaResumo {
  template: string;
  gerarViaNaoNegociavel: boolean;
  emitentes: PessoaMinuta[];
  credora: PessoaMinuta | null;
  credoraPadrao: string;
  avalistas: AvalistaMinutaRow[];
  possuiAvalistas: boolean;
  emissao: { uf: string; cidade: string };
  produtos: ProdutoMinuta[];
  garantias: GarantiaMinuta[];
}
```

`enriquecerContratoAtivo` preenche id, registro, lastro, situação, anexos, pessoas etc. e **preserva** `minuta`.

---

## 9. Dados mock / opções (`minutaData.ts` + `operacaoData.ts`)

### Cidades por UF (selects dependentes)

```ts
CIDADES_POR_UF = {
  MG: ['Uberaba', 'Uberlândia', 'Araguari', 'Ituiutaba'],
  SP: ['São Paulo', 'Ribeirão Preto', 'Campinas'],
  MT: ['Sorriso', 'Rondonópolis', 'Cuiabá'],
  GO: ['Rio Verde', 'Jataí', 'Goiânia'],
  PR: ['Londrina', 'Maringá', 'Curitiba'],
  MS: ['Dourados', 'Campo Grande'],
  BA: ['Barreiras', 'Luís Eduardo Magalhães'],
  TO: ['Palmas', 'Gurupi'],
};
```

UF subset (Emissão / Produto / registro garantia): `MG SP MT GO PR MS BA TO`.  
UF full (Endereço emitente/credora/sacado/garantia): `UF_OPTIONS` (27).

### Pessoas / nacionalidade / civil

```ts
NACIONALIDADE_OPTS = ['Brasileira', 'Estrangeira', 'BRASIL'];
ESTADO_CIVIL_OPTS = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável'];
```

### `CREDORAS_PADRAO`

Fixtures PJ + representante para as três credoras padrão (CNPJ, endereço Itaim Bibi etc.).

### `MOCK_CLIENTES_MINUTA`

Avantiagro (PJ), Marcelo Tartaro (PF), Ceres Trading (PJ) — lookup de emitente/credora e select de cedente no Título.

### DDI / países

```ts
PAISES_DDI = [
  { pais: 'Brasil', ddi: '+55' },
  { pais: 'Argentina', ddi: '+54' },
  { pais: 'Paraguai', ddi: '+595' },
  { pais: 'Uruguai', ddi: '+598' },
  { pais: 'Chile', ddi: '+56' },
  { pais: 'Bolívia', ddi: '+591' },
  { pais: 'Estados Unidos', ddi: '+1' },
];
```

---

## 10. Sketch de layout

```
┌─ Overlay z:400 · blur 8 · rgba(8,60,74,.55) · pad 32 ─────────┐
│  ┌─ Panel 1040 × 88vh · radius 12 · shadow-lg ──────────────┐ │
│  │ Header 24×32  "Adicionar Contrato"              [X 36]  │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ PADRÃO: body 32 · gap 24                                 │ │
│  │   [Gerar minuta]                                         │ │
│  │   ┌ Bento Dados do Título ─────────────────────────────┐ │ │
│  │   │ upload · 4-col · toggles · datas · doc             │ │ │
│  │   └────────────────────────────────────────────────────┘ │ │
│  │   [Parcelas?] → Bento | [Cronograma?] → Bento            │ │
│  │   ┌ Bento Sacado (12-col spans) ───────────────────────┐ │ │
│  │   └────────────────────────────────────────────────────┘ │ │
│  │ Footer 16×32          Cancelar        GERAR TÍTULO       │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ WIZARD: top 16×32 [minuta | template | via não-neg.]     │ │
│  │         stepper (7 · underline agro)                     │ │
│  │         step body pad 32                                 │ │
│  │ Footer Voltar | n/7 | Próximo / GERAR TÍTULO             │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

---

## 11. Regras de produto (QA)

1. Toggle **Gerar minuta** fica **acima** de Dados do Título no modo padrão.
2. Wizard só após toggle ON **e** tipo CPR/CPRF.
3. Reutilizar tokens/componentes do sistema (CRA/FIDC/Novo Pedido). **Não** copiar chrome de impressão (barra azul “INSERIR TÍTULO” etc.).
4. Stepper = ícones + underline · **sem checkmarks**.
5. Campos em grid 12-col com spans variáveis (não 3 colunas iguais rígidas).
6. Cidade = select dependente de UF (`cidadesDaUf`) no wizard (no sacado do modo padrão ainda é texto livre).
7. Natureza = `SelectField` (não toggle Pessoa Física/Jurídica custom).
8. Credora padrão preenche e desabilita doc; modo doc habilita selects de contato/endereço/rep.
9. Avalistas a partir de partes tipo AVA; “cônjuge interveniente” só se `possuiConjuge`.
10. Garantias nesta fase: só **AF. Estoque** e **Penhor de Estoque**.
11. Opções de dropdown vêm dos mocks aprovados — não inventar labels.

---

## 12. Gaps conhecidos (prototipo)

1. Vários campos UI (endereço sacado, chaveNota, toggles locais) não entram no `create`.
2. Upload de documento no modo padrão é decorativo.
3. “Próximo” no wizard não valida o step — só o GERAR TÍTULO final emite.
4. No modo padrão o toggle de minuta exige Tipo selecionado **antes** (fica acima do campo Tipo).
5. Cidade do sacado no modo padrão ainda é texto livre (wizard já usa select).

---

## 13. Arquivos-fonte

| Arquivo | Papel |
|---|---|
| `AdicionarContratoModal.vue` | Chrome + modo padrão + switch wizard |
| `minuta/MinutaWizard.vue` | Shell + estado + submit minuta |
| `minuta/MinutaStepper.vue` | Tabs 7 etapas |
| `minuta/*Step.vue` | Conteúdo por etapa |
| `adicionar-contrato/*` | Primitivas de formulário |
| `data/minutaData.ts` | Tipos, opções, fixtures |
| `data/operacaoData.ts` | `ContratoAtivo`, UF, DDI |
| `data/ativoData.ts` | `enriquecerContratoAtivo` |
| `SolicitacaoDetailScreen.vue` | Montagem + `handleAddContrato` |
| `AtivosTab.vue` | Botão de abertura |

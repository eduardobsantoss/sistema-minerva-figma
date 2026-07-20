# Minerva — Addendum de Guidelines
**Reaproveitamento de componentes · Layout dinâmico de formulários · Padrão de Detalhe · Sub-abas**

> Este documento complementa `minerva-figma-guidelines.md`. Cole o conteúdo abaixo ao final desse arquivo (novas seções 9, 10, 11 e 12) ou anexe como arquivo separado em todo prompt de Cursor que envolva formulários, telas de detalhe ou abas.

---

## 9. Reaproveitamento obrigatório de componentes

**Regra dura:** o Cursor NUNCA cria um componente novo sem antes verificar se já existe um componente com propósito equivalente no projeto.

### 9.1 Checklist obrigatório antes de gerar qualquer código

Antes de escrever qualquer componente, o Cursor deve:

1. Varrer a pasta de componentes existentes (ex: `/components/ui`, `/components/shared`, ou a pasta indicada no prompt).
2. Listar em voz alta (no chat, antes de codar) quais componentes existentes são candidatos a reaproveitamento para a tela em questão.
3. Só criar um componente novo se **nenhum existente** cobrir a necessidade — e, nesse caso, **parar e perguntar** antes de gerar o código, explicando por que os componentes existentes não servem.

### 9.2 Inventário de componentes-base (reaproveitar sempre que aplicável)

| Componente | Uso |
|---|---|
| `Button` (primary/secondary/danger) | Toda ação — nunca recriar variações soltas |
| `StatusChip` | Todo status de processo (read-only) |
| `Modal` | Todo fluxo modal (header fixo + footer fixo + scroll interno) |
| `Dropdown` / `MoreActionsMenu` | "Mais ações", menus contextuais |
| `Tabs` (nível 1) e `SubTabs` (nível 2) | Ver seção 12 |
| `Stepper` | Indicador de progresso (nunca navegação) |
| `DataTable` | Toda listagem tabular |
| `TextField`, `SelectField`, `DateField`, `MaskedField` (CPF/CNPJ/telefone/CEP) | Ver seção 10 |
| `SearchInput` | Toda busca |
| `FilterChip` | Filtros aplicados/removíveis |
| `SummaryCard` | Cartões de resumo/totais computados |
| `TransferList` | Padrão de vinculação dual-panel (ex: Agrupamentos de Limite) |
| `EmptyState` | Toda listagem/tab vazia |
| `ConfirmationDialog` | Toda ação destrutiva com justificativa obrigatória |

### 9.3 Regras de nomenclatura

- PascalCase, sem sufixos redundantes ou versionados (`ButtonNew`, `ModalV2`, `TabsFixed` são proibidos).
- Extensão de componente existente é feita **via props**, nunca duplicando o arquivo/componente.
- Se uma variante for genuinamente nova (ex: um novo tipo de card), ela deve ser nomeada pelo papel que exerce, não pela tela onde é usada (`RiskSummaryCard` reaproveita `SummaryCard`, não cria `GrupoEmpresarialCardBox`).

### 9.4 Trecho para colar no início de todo prompt de Cursor

```
Antes de implementar, verifique os componentes já existentes no projeto e
liste quais serão reaproveitados nesta tela. Só crie um componente novo se
nenhum existente servir — e, nesse caso, pare e pergunte antes de gerar código.
Nunca duplique um componente existente com um novo nome.
```

---

## 10. Organização dinâmica de campos de formulário

**Regra dura:** formulários nunca são gerados em coluna única "por padrão", e o Cursor não decide larguras por conta própria. A referência é **sempre o padrão já usado nas outras telas do Minerva** — não um grid numérico novo.

### 10.1 Regra de agrupamento
- Campos semanticamente relacionados (ex: CEP + Cidade + UF, Telefone + E-mail, Data início + Data fim) ficam na mesma linha, seguindo a mesma proporção de largura já usada em telas equivalentes existentes.
- Campos sem relação direta não dividem linha.
- A ordem de leitura (visual) deve ser igual à ordem de tab.
- Cada grupo de campos relacionados fica dentro do mesmo "Bloco de Conteúdo" (Padrão Estrutural, seção 5).

### 10.2 Trecho para colar em todo prompt que envolva formulário

```
Organize os campos de forma dinâmica (não em coluna única): agrupe campos
relacionados na mesma linha (ex: CEP + Cidade + UF) e siga exatamente as
proporções de largura já usadas em telas equivalentes do Minerva — não invente
um grid ou larguras novas. Se não houver uma tela de referência clara para
algum campo, pare e pergunte antes de decidir a largura.
```

---

## 11. Padrão de Tela de Detalhe (genérico, para qualquer entidade)

Toda tela de "Detalhe de X" (Grupo Empresarial, Sacado, Operação, etc.) segue uma de duas variantes do Padrão Estrutural (seção 5), dependendo se a entidade tem um workflow com etapas ou é puramente cadastral.

### 11.1 Variante A — Detalhe com Workflow
Usar quando a entidade tem estados de processo sequenciais (ex: Solicitação de Operação).

1. Identificação do Registro (título + `StatusChip`)
2. `Stepper` (indicador, não navegação)
3. Barra de Ações (1 primária + até 2 secundárias + "Mais ações")
4. `Tabs`
5. Blocos de Conteúdo

### 11.2 Variante B — Detalhe Cadastral (sem workflow)
Usar quando a entidade não tem etapas sequenciais de processo (ex: Detalhe do Grupo Empresarial, Detalhe do Sacado).

1. Identificação do Registro (título + `StatusChip`, se aplicável — ex: Ativo/Inativo)
2. Barra de Ações (sem stepper)
3. `Tabs`
4. Blocos de Conteúdo por aba

**Regra dura:** nunca inserir um `Stepper` em uma tela cadastral sem processo sequencial — isso comunica progresso onde não existe.

---

## 12. Sub-abas (abas dentro de abas)

Quando uma aba de nível 1 contém, internamente, uma segunda navegação por abas (ex: dentro de "Cedentes" existir sub-navegação), os dois níveis precisam ser visualmente distintos para não confundir a hierarquia.

Referência real: tela Detalhe do Grupo Empresarial (Risco), onde a aba "Parametrizações" contém as sub-abas Limite / Autoatendimento / Geral / Garantia.

### 12.1 Aba de nível 1 (ex: Detalhes / Parametrizações / Cedentes / Histórico)
- Estilo pílula segmentada: ícone + label, dentro de um trilho contínuo.
- Ativa: fundo preenchido `--action-primary-bg` (GCI Blue), texto `--action-primary-text` (branco).
- Inativa: sem fundo, ícone + texto em cor neutra/muted (`--text-muted`).

### 12.2 Sub-aba de nível 2 (ex: Limite / Autoatendimento / Geral / Garantia)
- Estilo underline simples, texto puro (sem pílula/fundo).
- Ativa: texto forte (`--text-strong`, peso maior) + underline `--accent` (Agro Orange).
- Inativa: `--text-muted`, sem underline.

### 12.3 Regra dura
Nível 1 = pílula com fundo preenchido. Nível 2 = texto com underline laranja. **Nunca inverter ou misturar os dois estilos entre níveis.** Qualquer outra tela com abas aninhadas deve replicar exatamente esse mesmo par de estilos — não criar uma terceira variação.

### 12.4 Trecho para colar em todo prompt que envolva abas aninhadas

```
Aba de nível 1: pílula segmentada com ícone + label; ativa com fundo
--action-primary-bg e texto --action-primary-text; inativa sem fundo, ícone+texto
em --text-muted. Sub-aba de nível 2 (dentro do conteúdo da aba de nível 1):
texto simples com underline; ativa em --text-strong com underline --accent
(Agro Orange); inativa em --text-muted sem underline. Siga exatamente este
padrão (referência: sub-abas de Parametrizações em Detalhe do Grupo
Empresarial) — não invente uma variação nova.
```

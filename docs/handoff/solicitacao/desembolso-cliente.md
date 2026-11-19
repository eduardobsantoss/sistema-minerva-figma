# Handoff — Desembolso do Cliente

> Submódulo da Solicitação de Operação. Protótipo: e-mails e downloads são simulados (toast + log de atividade). O estado fica na tela e não altera o kanban de Solicitações.

## Entrada

```
Sidebar → Solicitação de Operação → Desembolso do Cliente
ModulesScreen.vue  (view === 'solicitacoes-desembolso-cliente')
└─ DesembolsoClienteScreen.vue
```

## KPIs

Faixa no topo, no mesmo padrão visual dos KPIs de Ativos. Os totais acompanham as pílulas e as buscas da tela.

- **Pedidos em aberto**: quantidade de cards visíveis.
- **Valor de aquisição**: soma dos valores de aquisição. O chevron no canto do card abre a tabela **por veículo** (pedidos, aquisição, a desembolsar, participação).
- **Valor a desembolsar**: soma de aquisição menos vencidos.

Não existe KpiCard em `src/components/ui/`; há variantes em várias features. A faixa usa a markup de Ativos dentro da tela e é candidata a subir para o DS na próxima revisão.

## Valores do card

Faixa de 4 colunas, sempre visível (mesmo recolhido):

| Valor | Origem |
|---|---|
| Valor nominal | `solicitacao.valor` |
| Valor de aquisição | `solicitacao.valorAquisicao` (se ausente, igual ao nominal) |
| Valor a desembolsar | aquisição menos vencidos a abater. Vencidos = valor informado na Cobrança ou, antes disso, `solicitacao.valorVencido`. A nota "Vencidos a abater" aparece abaixo quando há vencidos |
| Valor desembolsado | informado no modal de Encarteirar. "—" até lá |

Os valores de aquisição e de vencidos dos seeds são fictícios (a confirmar com o negócio).

## Fluxo

1. Entram na lista os pedidos com etapa `DESEMBOLSO_CLIENTE`. O log já registra o e-mail de entrada (tesouraria, operações e backoffice).
2. As etapas da sequência são estritas: só a próxima fica clicável.
3. Concluir uma etapa dispara o e-mail daquela etapa e registra a atividade.
4. Pedidos com `possuiBmp: false` não exibem Subir BMP, 1ª aprovação BMP e 2ª aprovação BMP.
5. **Encarteirar** abre um modal com comprovante, data e valor desembolsado (pré-preenchido com o valor da operação). Os três campos são obrigatórios.
6. Pedidos com `possuiFinanceiro: true` (no protótipo, só o `#1403`) ganham o grupo final: **Financeiro** e **Cobrança** correm **em paralelo**, em qualquer ordem, depois de Encarteirar. No stepper dividem a última posição (pontos 8 e 9).
   - **Financeiro**: conclusão direta, com e-mail (`financeiro@`, `controladoria@`).
   - **Cobrança**: abre o modal "Cobrança" com os vencidos a abater (pré-preenchidos com `valorVencido`; não pode passar do valor de aquisição) e o resumo aquisição − vencidos = a desembolsar. Ao confirmar, envia e-mail (`cobranca@`, `financeiro@`) e atualiza o valor a desembolsar.
7. O desembolso termina quando **todas as etapas do pedido** estão concluídas: a etapa local vira `SOLUCIONADA` e o card sai da lista. Sem Financeiro isso acontece ao encarteirar; com Financeiro, só depois de Financeiro e Cobrança.

## Filtros

Pílulas com contador: Todos, Com BMP, Sem BMP, **Não aprovados**, SLA estourado.

**Não aprovados** = validação `INVALIDO` **ou** alguma aprovação (1ª/2ª Itaú, 1ª/2ª BMP) ainda não concluída. Na prática só sai do filtro quem é válido e já passou por todas as aprovações.

Buscas por ID, Cedente e Veículo combinam (E) com a pílula.

## Voltar etapa

1. O botão **Voltar etapa**, no cabeçalho da esteira, fica ativo quando há etapas concluídas. Clicar nos pontos já não desfaz nada.
2. Abre o modal com um comentário opcional (até 500 caracteres) e avisa que **todas as etapas voltam para a 1ª**. Nenhum e-mail é reenviado.
3. Ao confirmar: zera as etapas, apaga o valor desembolsado e a Cobrança, registra "Esteira reiniciada · voltou da Nª etapa" na Atividade e, se houve texto, salva o comentário.
4. O botão **Comentários (n)** abre a lista (mais recente primeiro), com a posição de onde voltou, o autor e a data. Fica visível com o card recolhido.

## Etapas

Subir no Itaú → 1ª aprovação Itaú → 2ª aprovação Itaú → Subir BMP → 1ª aprovação BMP → 2ª aprovação BMP → Encarteirar → (Financeiro ‖ Cobrança)

## Árvore

```
src/features/solicitacao-operacao/
├── screens/DesembolsoClienteScreen.vue
├── components/desembolso-cliente/
│   ├── DesembolsoClienteCard.vue
│   ├── DesembolsoStepper.vue
│   ├── EncarteirarModal.vue
│   ├── CobrancaModal.vue
│   ├── VoltarEtapaModal.vue
│   └── ComentariosModal.vue
└── data/desembolsoClienteData.ts
```

Seeds em `operacaoData.ts`: `#1400`, `#1403` (`possuiFinanceiro: true`, vencidos de R$ 120.000; chega com 7 etapas concluídas, valor desembolsado e um comentário), `#1404` (`possuiBmp: false`) e `#1405` (inválido).

## Pendências para a próxima revisão do DS

- Process Stepper com etapas em paralelo (dois pontos na mesma posição): composição proposta sem referência de Figma.
- KPI card compartilhado em `src/components/ui/`.

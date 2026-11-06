# Handoff — Desembolso do Cliente

> Submódulo da Solicitação de Operação. Protótipo: e-mails e downloads são simulados (toast + log de atividade). O estado fica na tela e não altera o kanban de Solicitações.

## Entrada

```
Sidebar → Solicitação de Operação → Desembolso do Cliente
ModulesScreen.vue  (view === 'solicitacoes-desembolso-cliente')
└─ DesembolsoClienteScreen.vue
```

## Fluxo

1. Entram na lista os pedidos com etapa `DESEMBOLSO_CLIENTE`. Ao aparecer, o log já registra o e-mail de entrada (tesouraria, operações e backoffice).
2. Cada card mostra os dados básicos, os documentos (termo de cessão assinado e extrato para desembolso) e o stepper das etapas.
3. As etapas são sequenciais: só a próxima fica clicável. Só a última concluída pode ser desfeita (inclusive Encarteirar, enquanto o card ainda estiver na lista).
4. Concluir uma etapa dispara o e-mail daquela etapa e registra a atividade.
5. Pedidos com `possuiBmp: false` não exibem Subir BMP, 1ª aprovação BMP e 2ª aprovação BMP.
6. Pedidos com `possuiFinanceiro: true` ganham a 8ª etapa, **Financeiro**, depois de Encarteirar. É opcional e, no protótipo, só o `#1403` a possui.
7. Encarteirar abre um modal com comprovante de pagamento, data de desembolso e valor desembolsado (pré-preenchido com o valor da operação). Os três campos são obrigatórios.
8. A **última etapa da esteira do pedido** encerra o desembolso: a etapa local vira `SOLUCIONADA` e o card sai da lista. Sem Financeiro, isso acontece ao encarteirar. Com Financeiro, o card continua na lista até concluir o Financeiro.

## Valor desembolsado

O cabeçalho do card mostra **Valor** (da operação) e **Valor desembolsado** lado a lado. Este último é "—" até Encarteirar ser concluída. Depois, aparece o valor informado no modal; a data de desembolso e o comprovante entram na grade de informações do card expandido. Desfazer Encarteirar limpa esses dados.

## Voltar etapa e comentários

1. Clicar numa etapa concluída (a última) abre o modal **Voltar etapa**, com um comentário opcional (até 500 caracteres).
2. Ao confirmar, a etapa volta para pendente, o log registra "Etapa desfeita" com o motivo e nenhum e-mail é reenviado.
3. Se houve comentário, ele é salvo no card (autor, data, etapa que voltou).
4. O botão **Comentários (n)**, no cabeçalho da esteira, abre o modal com a lista, do mais recente ao mais antigo. Fica visível com o card recolhido.

## Etapas

Subir no Itaú → 1ª aprovação Itaú → 2ª aprovação Itaú → Subir BMP → 1ª aprovação BMP → 2ª aprovação BMP → Encarteirar → Financeiro

Financeiro notifica `financeiro@ceres.com` e `controladoria@ceres.com`.

## Árvore

```
src/features/solicitacao-operacao/
├── screens/DesembolsoClienteScreen.vue
├── components/desembolso-cliente/
│   ├── DesembolsoClienteCard.vue
│   ├── DesembolsoStepper.vue
│   ├── EncarteirarModal.vue
│   ├── VoltarEtapaModal.vue
│   └── ComentariosModal.vue
└── data/desembolsoClienteData.ts
```

Seeds em `operacaoData.ts`: `#1400`, `#1403` (`possuiFinanceiro: true`; chega com 7 etapas concluídas, valor desembolsado e um comentário), `#1404` (`possuiBmp: false`) e `#1405`.

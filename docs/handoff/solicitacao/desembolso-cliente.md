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
3. As etapas são sequenciais: só a próxima fica clicável. Só a última concluída pode ser desfeita. Encarteirar não desfaz.
4. Concluir uma etapa (exceto Encarteirar) dispara o e-mail daquela etapa e registra a atividade.
5. Pedidos com `possuiBmp: false` não exibem Subir BMP, 1ª aprovação BMP e 2ª aprovação BMP.
6. Encarteirar abre um modal com comprovante de pagamento, data de desembolso e valor desembolsado (pré-preenchido com o valor da operação). Os três campos são obrigatórios.
7. Ao confirmar, a etapa local vira `SOLUCIONADA`, o card sai da lista e um toast informa o e-mail enviado.

## Etapas

Subir no Itaú → 1ª aprovação Itaú → 2ª aprovação Itaú → Subir BMP → 1ª aprovação BMP → 2ª aprovação BMP → Encarteirar

## Árvore

```
src/features/solicitacao-operacao/
├── screens/DesembolsoClienteScreen.vue
├── components/desembolso-cliente/
│   ├── DesembolsoClienteCard.vue
│   ├── DesembolsoStepper.vue
│   └── EncarteirarModal.vue
└── data/desembolsoClienteData.ts
```

Seeds em `operacaoData.ts`: `#1400`, `#1403` (já com duas etapas Itaú), `#1404` (`possuiBmp: false`) e `#1405`.

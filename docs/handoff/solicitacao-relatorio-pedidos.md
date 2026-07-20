# Handoff — Relatório de Pedidos (Solicitações)

> Fonte: mapeamento legado `relatorio-pedidos.md`. Prototype em `src/features/solicitacao-operacao/`.

## Entrada

```
Sidebar → Solicitação de Operação → Relatórios
ModulesScreen.vue  (view === 'solicitacoes-relatorios')
└─ RelatorioPedidosScreen.vue
```

## Árvore

```
src/features/solicitacao-operacao/
├── screens/RelatorioPedidosScreen.vue
└── data/
    ├── relatoriosPedidosData.ts  → REQUEST_REPORTS, filtros, mocks
    └── tipoPedidoOptions.ts      → 9 tipos de pedido (compartilhado)
```

## Fluxo (padrão visual de Relatórios de Risco)

1. Grid de cards — um por tipo de relatório (hover eleva o card)
2. Clique → tela de detalhe com voltar + filtros + **GERAR RELATÓRIO**
3. Resultado em tabela paginada + **EXPORTAR CSV** (ou PDF no checklist)

## Tipos de relatório

- 20 Relatório Solicitação → CSV
- 22 Checklist da Solicitação → PDF (mock .txt no prototype)
- 34 Títulos da Solicitação → CSV (+ switch quitação de vencidos)
- 29 Pedidos Aprovados Abaixo da Taxa → CSV (filtros próprios)
- 33 Primeira Validação → CSV

## Blocos de filtro (no detalhe)

- Demais tipos → número, gerente, grupo, tipo (+ quitação só no 34)
- Tipo 29 → datas, veículos multi, grupo, tipo, superintendente, gerente

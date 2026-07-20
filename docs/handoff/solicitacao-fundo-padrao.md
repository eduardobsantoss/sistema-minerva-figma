# Handoff — Fundo Padrão (Solicitações)

> Fonte: mapeamento legado `fundo-padrao.md`. Prototype em `src/features/solicitacao-operacao/`.

## Entrada

```
Sidebar → Solicitação de Operação → Fundo Padrão
ModulesScreen.vue  (view === 'solicitacoes-fundo-padrao')
└─ FundoPadraoScreen.vue
```

## Árvore

```
src/features/solicitacao-operacao/
├── screens/FundoPadraoScreen.vue
├── components/fundo-padrao/
│   ├── OperationFundRankList.vue   → cards do rank ativo
│   └── OperationFundRankEditor.vue → editor reordenável ↑/↓
└── data/fundoPadraoData.ts         → fundos CRA/FIDC + RANK_ATIVO_SEED
```

## Comportamento

- **Rank ativo**: cards com prioridade `#N`, tipo, chips Atual/Esgotado, Operado/Limite, barra de progresso (% client-side).
- **Edição do rank**: adicionar itens (fundo + limite), reordenar com setas (sem drag-and-drop), "Carregar rank atual", salvar **substitui** o rank inteiro.
- Validações do botão Salvar: ao menos 1 item; fundo + limite > 0; sem duplicatas.

## Mocks

`FUNDOS_DISPONIVEIS`, `RANK_ATIVO_SEED` em `fundoPadraoData.ts`.

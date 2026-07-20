# Handoff — Taxas dos Veículos (Solicitações)

> **Atenção:** não existe tela 1:1 no legado (`taxas-veiculos.md`). Este prototype é uma **composição** dos candidatos:
> 1) Parametrização de Veículos (abas + ativo/inativo) + 2) Gerenciamento de Taxa de Operação (pré/pós-fixada + histórico).

## Entrada

```
Sidebar → Solicitação de Operação → Taxas dos Veículos
ModulesScreen.vue  (view === 'solicitacoes-taxas-veiculos')
└─ TaxasVeiculosScreen.vue
```

## Árvore

```
src/features/solicitacao-operacao/
├── screens/TaxasVeiculosScreen.vue
├── components/taxas-veiculos/VehicleRateDetailModal.vue
└── data/taxasVeiculosData.ts
```

## Comportamento

- Abas principais: `SegmentedToggle` variant brand (FIDC / CRA / Garantias) — padrão de detalhe
- Clique na linha → **tela de detalhe** (`VehicleRateDetailView`) com voltar + SegmentedToggle (Parametrização | Histórico)
- Sub-abas laranja (`accent` underline) ficam reservadas a abas aninhadas (como Parametrizações em Risco), não ao nível principal

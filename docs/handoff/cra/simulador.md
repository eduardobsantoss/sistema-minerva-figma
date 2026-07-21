# Handoff — CRA / Simulador

> Parte do módulo CRA. Gestão: [gestao.md](./gestao.md). Relatórios: [relatorios.md](./relatorios.md).

## Entrada

| Item | Valor |
|---|---|
| View | `?view=cras-simulador` |
| Sidebar | CRA's → Simulador |
| Topbar | Simulador |
| Componente | `CraSimuladorScreen.vue` |
| Dados | `data/simuladorData.ts` + `cras` de `craData.ts` |

## Fluxo

1. **Seleção de veículo** — mesma busca 56px da listagem (placeholder *"Pesquisar CRA para simular..."*) + grid 3 cols `CraCard`
2. **Após selecionar** — header com back 48×48 + eyebrow accent + nome do CRA
3. Sub-área **Termo Confina** (underline) com lista de simulações mock
4. CTA nova simulação → `ConfinaPromissoryModal` (**importado de FIDC**: `@/features/fidc/components/modals/ConfinaPromissoryModal.vue`)
5. Ao criar: prepend em `simulations` com id `sim-confina-*`

## Dados

- `MOCK_CONFINA_SIMULATIONS`, `SavedSimulation`
- Helpers: `simulatePromissoryNote`, opts de categoria/raça/fazendas/base days

## Visual

- Page gap **24px**; busca idêntica à Gestão (focus ring gci)
- Cards reutilizam `CraCard` (hover translateY / donuts)
- Não altera `craList` da Gestão — usa seed estático `cras`

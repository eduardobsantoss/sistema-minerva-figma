# Handoff — CRA / Relatórios

> Parte do módulo CRA. Gestão: [gestao.md](./gestao.md). Simulador: [simulador.md](./simulador.md).  
> Padrão visual alinhado a Relatórios de Risco / Solicitações (catálogo → filtros → gerar → tabela + CSV).

## Entrada

| Item | Valor |
|---|---|
| View | `?view=cras-relatorios` |
| Sidebar | CRA's → Relatórios |
| Topbar | Relatórios |
| Componente | `CraRelatoriosScreen.vue` |
| Dados | `data/relatoriosData.ts` |

## Fluxo

1. Catálogo de cards `PORTFOLIO_REPORTS` (GER001–GER005)
2. Clique → tela de filtros (situação do fundo, cessionária) + checklist de CRAs
3. Gerar → `mockCraPortfolioRows` + `TablePagination` (default 10)
4. Export CSV via `toPortfolioCsv` (blob no browser)

## Relatórios

| Key | Ícone típico |
|---|---|
| `ger001` | Wallet |
| `ger002` | Receipt |
| `ger003` | BellRing |
| `ger004` | FileText |
| `ger005` | Users |

Opts: `SITUACAO_FUNDO_OPTS` (status dos CRAs). Cessionárias derivadas de `cras`.

## Visual

- Cards de catálogo com hover; ChevronRight
- Checkbox `@/components/ui/Checkbox.vue` para seleção de fundos
- Botão voltar no detalhe do relatório
- Download CSV com ícone Download

Tudo mock — sem HTTP.

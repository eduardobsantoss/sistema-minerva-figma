# Handoffs Minerva

Documentação de handoff por **módulo**, para reimplementação pixel-perfect em outro Cursor.

## Estrutura

```
docs/handoff/
├── README.md                 ← este índice
├── layout-shell.md           ← shell compartilhado (sidebar, topbar, dashboard)
├── cra/
│   ├── README.md
│   ├── gestao.md             ← Gestão (pixel-perfect)
│   ├── simulador.md
│   └── relatorios.md
├── fidc/
│   └── fidc.md
├── risco/
│   ├── risco.md              ← módulo completo
│   ├── grupos.md             ← Grupos Empresariais (pixel-perfect)
│   └── relatorios.md         ← Relatórios + Parecer de Crédito (pixel-perfect)
├── solicitacao/
│   ├── listagem.md
│   ├── novo-pedido.md            ← wizard Novo Pedido (pixel-perfect)
│   ├── detalhes.md
│   ├── ativos.md
│   ├── adicionar-contrato.md
│   ├── fundo-padrao.md
│   ├── relatorio-pedidos.md
│   ├── taxas-veiculos.md
│   └── validacoes-config.md
└── cobranca/
    └── cobranca.md
```

## Por módulo

| Módulo | Pasta | Entrada principal |
|---|---|---|
| Shell | [layout-shell.md](./layout-shell.md) | App chrome |
| CRA | [cra/](./cra/) | `?view=cras` |
| FIDC | [fidc/fidc.md](./fidc/fidc.md) | `?view=fidcs` |
| Risco | [risco/](./risco/) | `?view=risco-grupos` etc. |
| Solicitação de Operação | [solicitacao/](./solicitacao/) | `?view=solicitacoes` |
| Cobrança | [cobranca/cobranca.md](./cobranca/cobranca.md) | `?view=cobranca` |

## Design system

- `guidelines/Guidelines.md`
- `guidelines/minerva-guidelines-addendum-componentes-formularios.md`
- `src/styles/theme.css`

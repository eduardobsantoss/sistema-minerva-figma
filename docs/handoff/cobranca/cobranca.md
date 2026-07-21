# Handoff — Módulo de Cobrança

> Complementa `guidelines/Guidelines.md`. Cobre o módulo em `src/features/cobranca/` — navegação, dados mock e telas.

## Navegação

Menu **Cobrança** (`Sidebar.vue`). Clique no pai ou no card do dashboard geral abre **Títulos** (`cobranca-titulos`).

| View (`?view=`) | Tela | Componente |
|---|---|---|
| `cobranca-titulos` | Listagem + detalhe de títulos | `TitulosScreen.vue` |
| `cobranca-dashboard` | Dashboard de atuação | `CobrancaDashboardScreen.vue` |
| `cobranca-notif` | Réguas de notificação | `CobrancaScreen.vue` |
| `cobranca-notif-cessao` | Notificações de cessão | `NotificacoesCessaoScreen.vue` |
| `cobranca-resultado-notif` | Resultado / disparos | `ResultadoNotificacoesScreen.vue` |
| `cobranca-rel` | Relatórios | `CobrancaRelatoriosScreen.vue` |

Montagem em `ModulesScreen.vue`.

## Árvore

```
src/features/cobranca/
├── index.ts
├── data/
│   ├── cobrancaData.ts              → réguas (+ enviaFimSemanaFeriado)
│   ├── titulosData.ts
│   ├── notificacoesCessaoData.ts
│   └── resultadoNotificacoesData.ts
├── screens/
│   ├── CobrancaScreen / CobrancaListScreen
│   ├── TitulosScreen / TitulosListScreen / TituloDetailScreen
│   ├── CobrancaDashboardScreen
│   ├── NotificacoesCessaoScreen / …List / NotificacaoCessaoDetailScreen
│   ├── ResultadoNotificacoesScreen / …List / DisparoDetailScreen
│   └── CobrancaRelatoriosScreen
└── components/
    ├── CobrancaCard.vue             → menu: Editar / Pausar / Deletar
    ├── NovaNotificacaoModal.vue     → toggle fins de semana/feriados
    └── nova-notificacao/*
```

## Convenções

- **List ↔ detail**: igual Risco/CRA — clique na linha abre tela full-page com botão voltar; **não** usar drawer.
- Menu ⋮ da listagem **não** inclui “Ver detalhe” (só ações operacionais).
- Dados 100% mock em `data/*.ts`; ações alteram estado local / toast / CSV blob.
- Tokens: `theme.css`; padrão visual de listagens espelha `GruposListScreen`.

## Réguas (tela existente)

- Ação **Deletar notificação** remove do array; **Pausar envios** continua toggle Ativa/Inativa.
- Wizard: toggle “Enviar em finais de semana e feriados” à direita dos métodos (ocupa o resto da row).

## Checklist para evoluir

1. Tipar / seed em `data/*` antes de novas colunas.
2. Novas views: `View` + `VALID_VIEWS` + `titleMap` + `Sidebar` children + export em `index.ts`.
3. Detalhe de título/cessão/disparo = tela dedicada, não overlay lateral.

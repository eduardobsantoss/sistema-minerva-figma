# Handoff — Módulo de Cobrança

> Complementa `guidelines/Guidelines.md`. Cobre o módulo em `src/features/cobranca/` — navegação, dados mock e telas.

## Navegação

Menu **Cobrança** (`Sidebar.vue`). Ordem alinhada ao `front-minerva` (`app/layouts/home-admin.vue`), com uma entrada extra no protótipo.

| Ordem | Protótipo (`Sidebar` key) | front-minerva (rota) | Observação |
|---:|---|---|---|
| 1 | `cobranca-dashboard` | `/home-admin/cobranca/dashboard` | Paridade |
| 2 | `cobranca-titulos` | `/home-admin/billing/titles` | Hub só **Títulos** + **Aptos para boletar** (cessão fora do hub) |
| 3 | `cobranca-notif-cessao` | `/home-admin/cobranca/notificacoes-de-cessao` | Item próprio; `NotificacoesCessaoHubScreen` |
| 4 | `cobranca-notif` | `/home-admin/cobranca/notificacoes-de-cobranca` | Régua |
| 5 | `cobranca-resultado-notif` | — | **Só protótipo** (Minerva: fluxo a partir da régua) |
| 6 | `cobranca-historico-notif` | `/home-admin/cobranca/historico-de-notificacoes` | Paridade |
| 7 | `cobranca-preventiva` | `/home-admin/cobranca/preventiva` | Minerva: 2 abas; protótipo: 4 abas (2 esboço) |
| 8 | `cobranca-rel` | `/home-admin/cobranca/relatorios` | Paridade |

| View (`?view=`) | Tela | Componente |
|---|---|---|
| `cobranca-titulos` | Hub títulos + aptos | `TitulosHubScreen.vue` |
| `cobranca-dashboard` | Dashboard de atuação | `CobrancaDashboardScreen.vue` |
| `cobranca-notif` | Réguas de notificação | `CobrancaScreen.vue` |
| `cobranca-notif-cessao` | Notificações de cessão | `NotificacoesCessaoHubScreen.vue` → `NotificacoesCessaoScreen.vue` |
| `cobranca-resultado-notif` | Resultado / disparos | `ResultadoNotificacoesScreen.vue` |
| `cobranca-historico-notif` | Histórico unificado | `HistoricoNotificacoesScreen.vue` |
| `cobranca-preventiva` | Cobrança preventiva | `CobrancaPreventivaScreen.vue` |
| `cobranca-rel` | Relatórios | `CobrancaRelatoriosScreen.vue` |

Montagem em `ModulesScreen.vue`.

### Notificações de cessão (paridade UX Minerva)

- Listagem: cards/tabela; atalhos Pendentes / Enviadas / Falhas.
- Detalhe único com abas **Detalhes · Títulos · Histórico** (`NotificacaoCessaoDetailScreen.vue`).
- Card (espelho `BillingRoundCards.vue`): topo `Cessão · data`, `roundName`, `veículo · valor`, status; bloco **Cedente/Sacado** com nome + documento e botões Notificações/Contatos; **Condições da cessão**; rodapé **Histórico · Ver títulos · Enviar** (primário à direita, desabilitado se condições bloqueiam).
- Mock: `bonds[]`, `historico[]` em `notificacoesCessaoData.ts`.

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
│   ├── NotificacoesCessaoHubScreen / NotificacoesCessaoScreen / …List / NotificacaoCessaoDetailScreen
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

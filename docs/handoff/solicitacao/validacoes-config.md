# Handoff — Validações (parametrização admin)

> Fonte: mapeamento legado `validacoes.md`.
> **Não confundir** com a aba Validações do detalhe da solicitação (`ValidacoesTab/`) — esta é a tela global de parametrização.

## Entrada

```
Sidebar → Solicitação de Operação → Validações
ModulesScreen.vue  (view === 'solicitacoes-validacoes')
└─ ValidacoesConfigScreen.vue
```

## Fluxo

1. Listagem com botão **Filtros** (popover, igual Solicitações) — Nome, ID, Setor + Limpar / FILTRAR
2. Clique na linha / lápis → **tela de detalhe** (mesmo padrão de Ativo/Solicitação: voltar + header + `SegmentedToggle`)
3. Abas: Detalhes | Configurações | Veículos
4. Botão **Atualizar** no header salva em memória e mostra banner de sucesso

## Árvore

```
src/features/solicitacao-operacao/
├── screens/ValidacoesConfigScreen.vue          → lista ↔ detalhe
├── components/validacoes-config/
│   └── ValidationDetailView.vue                → detalhe full-page (não modal)
└── data/
    ├── validacoesConfigData.ts
    └── tipoPedidoOptions.ts
```

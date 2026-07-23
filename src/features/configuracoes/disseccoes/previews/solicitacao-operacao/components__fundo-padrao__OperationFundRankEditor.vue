<script setup lang="ts">
import { ArrowUp, ArrowDown, Trash2, Plus, Info } from 'lucide-vue-next';
withDefaults(defineProps<{ activeRank: RankItemAtivo[] }>(), {
  activeRank: []
});
</script>

<template>
  <div
    style="
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      background: var(--surface-card);
      padding: 20px 22px;
    "
  >
    <div class="flex flex-wrap items-center justify-between" style="gap: 12px; margin-bottom: 16px">
      <h2 style="font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong); margin: 0">
        Edição do rank
      </h2>
      <button
        v-if="activeRank.length > 0"
        type="button"
        class="btn-animated"
        style="
          height: 36px;
          padding: 0 14px;
          font-size: var(--text-xs);
          font-weight: var(--weight-semibold);
          color: var(--gci-base);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          cursor: pointer;
        "
       
      >
        Carregar rank atual
      </button>
    </div>

    <div
      class="flex items-start"
      style="
        gap: 10px;
        padding: 12px 14px;
        margin-bottom: 16px;
        border-radius: var(--radius-lg);
        background: var(--surface-sunken);
        border: 1px solid var(--border-default);
      "
    >
      <Info :size="16" style="color: var(--gci-base); flex-shrink: 0; margin-top: 2px" />
      <p style="margin: 0; font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5">
        A ordem dos itens define a prioridade do rank (o item no topo é prioridade 1). Ao salvar, o rank ativo
        inteiro será substituído pela configuração abaixo.
      </p>
    </div>

    <div
      v-if="editorItems.length === 0"
      style="
        padding: 32px 16px;
        text-align: center;
        font-size: var(--text-sm);
        color: var(--text-muted);
        border: 1px dashed var(--border-default);
        border-radius: var(--radius-lg);
        margin-bottom: 16px;
      "
    >
      Nenhum item adicionado. Clique em 'Adicionar item' para começar.
    </div>

    <div v-else class="flex flex-col" style="gap: 10px; margin-bottom: 16px">
      <div
        v-for="(row, index) in editorItems"
        :key="index"
        class="flex flex-wrap items-center"
        style="
          gap: 10px;
          padding: 12px 14px;
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          background: var(--surface-sunken);
        "
      >
        <span
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.08em;
            padding: 4px 10px;
            border-radius: var(--radius-sm);
            background: var(--surface-card);
            color: var(--text-muted);
            flex-shrink: 0;
          "
        >
          #{{ index + 1 }}
        </span>

        <div class="flex" style="gap: 4px; flex-shrink: 0">
          <button
            type="button"
            aria-label="Mover para cima"
            class="flex items-center justify-center"
            :disabled="index === 0"
            :style="{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--surface-card)',
              cursor: index === 0 ? 'not-allowed' : 'pointer',
              opacity: index === 0 ? 0.45 : 1,
              color: 'var(--text-muted)',
            }"
           
          >
            <ArrowUp :size="14" />
          </button>
          <button
            type="button"
            aria-label="Mover para baixo"
            class="flex items-center justify-center"
            :disabled="index === editorItems.length - 1"
            :style="{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--surface-card)',
              cursor: index === editorItems.length - 1 ? 'not-allowed' : 'pointer',
              opacity: index === editorItems.length - 1 ? 0.45 : 1,
              color: 'var(--text-muted)',
            }"
           
          >
            <ArrowDown :size="14" />
          </button>
        </div>

        <select
          v-model="row.fundId"
          style="
            flex: 1 1 200px;
            min-width: 180px;
            height: 40px;
            padding: 0 12px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            font-size: var(--text-sm);
            color: var(--text-strong);
            cursor: pointer;
          "
        >
          <option value="" disabled>Selecione o fundo</option>
          <option v-for="f in fundOptionsForRow(index)" :key="f.id" :value="f.id">
            {{ fundoLabel(f) }}
          </option>
          <option v-if="row.fundId && !fundOptionsForRow(index).some((f) => f.id === row.fundId)" :value="row.fundId">
            {{ fundoLabel(FUNDOS_DISPONIVEIS.find((f) => f.id === row.fundId)!) }}
          </option>
        </select>

        <input
          v-model="row.limite"
          type="text"
          inputmode="decimal"
          placeholder="Limite (R$)"
          style="
            flex: 0 1 160px;
            min-width: 140px;
            height: 40px;
            padding: 0 12px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            font-size: var(--text-sm);
            color: var(--text-strong);
          "
        />

        <button
          type="button"
          aria-label="Remover item"
          class="flex items-center justify-center"
          style="
            width: 32px;
            height: 32px;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-default);
            background: var(--surface-card);
            cursor: pointer;
            color: var(--action-danger-text-only);
            flex-shrink: 0;
          "
         
        >
          <Trash2 :size="14" />
        </button>
      </div>
    </div>

    <div class="flex flex-wrap items-center" style="gap: 10px">
      <button
        type="button"
        class="flex items-center btn-animated"
        style="
          gap: 8px;
          height: 40px;
          padding: 0 16px;
          font-size: var(--text-xs);
          font-weight: var(--weight-bold);
          letter-spacing: 0.06em;
          color: var(--gci-base);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          cursor: pointer;
        "
       
      >
        <Plus :size="14" />
        Adicionar item
      </button>
      <button
        type="button"
        class="btn-animated"
        :disabled="!canSave"
        :title="saveDisabledReason ?? undefined"
        style="
          height: 40px;
          padding: 0 20px;
          font-size: var(--text-xs);
          font-weight: var(--weight-bold);
          letter-spacing: 0.08em;
          color: #fff;
          background: var(--action-primary-bg);
          border: none;
          border-radius: var(--radius-lg);
          cursor: pointer;
          opacity: 1;
        "
        :style="!canSave ? { opacity: 0.5, cursor: 'not-allowed' } : {}"
       
      >
        Salvar rank
      </button>
    </div>
  </div>
</template>

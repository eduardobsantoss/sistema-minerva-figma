<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowUp, ArrowDown, Trash2, Plus, Info } from 'lucide-vue-next';
import {
  FUNDOS_DISPONIVEIS,
  fundoLabel,
  parseMoneyInput,
  type RankItemAtivo,
  type RankEditorItem,
} from '../../data/fundoPadraoData';

const props = defineProps<{ activeRank: RankItemAtivo[] }>();
const emit = defineEmits<{ save: [items: RankItemAtivo[]] }>();

const editorItems = ref<RankEditorItem[]>([]);

function emptyItem(): RankEditorItem {
  return { fundId: '', limite: '' };
}

function loadCurrentRank() {
  editorItems.value = props.activeRank.map((r) => ({
    fundId: r.fundId,
    limite: r.limite > 0 ? String(r.limite) : '',
  }));
}

function addItem() {
  editorItems.value = [...editorItems.value, emptyItem()];
}

function removeItem(index: number) {
  editorItems.value = editorItems.value.filter((_, i) => i !== index);
}

function moveUp(index: number) {
  if (index <= 0) return;
  const next = [...editorItems.value];
  [next[index - 1], next[index]] = [next[index], next[index - 1]];
  editorItems.value = next;
}

function moveDown(index: number) {
  if (index >= editorItems.value.length - 1) return;
  const next = [...editorItems.value];
  [next[index], next[index + 1]] = [next[index + 1], next[index]];
  editorItems.value = next;
}

function fundOptionsForRow(rowIndex: number) {
  const taken = new Set(
    editorItems.value
      .map((row, i) => (i === rowIndex ? '' : row.fundId))
      .filter(Boolean),
  );
  return FUNDOS_DISPONIVEIS.filter((f) => !taken.has(f.id));
}

const hasDuplicateFunds = computed(() => {
  const ids = editorItems.value.map((r) => r.fundId).filter(Boolean);
  return new Set(ids).size !== ids.length;
});

const hasIncompleteItems = computed(() =>
  editorItems.value.some((r) => !r.fundId || parseMoneyInput(r.limite) <= 0),
);

const saveDisabledReason = computed((): string | null => {
  if (editorItems.value.length === 0) return 'Adicione ao menos um item para salvar';
  if (hasIncompleteItems.value) return 'Preencha o fundo e o limite de todos os itens';
  if (hasDuplicateFunds.value) return 'Há fundos duplicados no rank';
  return null;
});

const canSave = computed(() => saveDisabledReason.value === null);

function handleSave() {
  if (!canSave.value) return;
  const today = new Date().toLocaleDateString('pt-BR');
  const payload: RankItemAtivo[] = editorItems.value.map((row, i) => {
    const fund = FUNDOS_DISPONIVEIS.find((f) => f.id === row.fundId)!;
    return {
      priority: i + 1,
      fundId: fund.id,
      fundName: fund.name,
      fundType: fund.type,
      limite: parseMoneyInput(row.limite),
      operado: 0,
      configuradoPor: 'Eduardo Santos',
      dataConfiguracao: today,
      isCurrent: i === 0,
      isExhausted: false,
    };
  });
  emit('save', payload);
}
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
        @click="loadCurrentRank"
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
            @click="moveUp(index)"
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
            @click="moveDown(index)"
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
          @click="removeItem(index)"
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
        @click="addItem"
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
        @click="handleSave"
      >
        Salvar rank
      </button>
    </div>
  </div>
</template>

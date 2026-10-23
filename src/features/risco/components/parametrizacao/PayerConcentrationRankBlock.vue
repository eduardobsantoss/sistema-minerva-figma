<script setup lang="ts">
import { computed, ref } from 'vue';
import { Trash2, ListOrdered, MoreVertical, Eraser, ListPlus } from 'lucide-vue-next';
import type { FaixaConcentracaoSacado } from '../../data/riscoData';
import {
  addFaixaBeforeLast,
  normalizeFaixasPositions,
  rankLabel,
  removeFaixaAt,
  validateFaixasConcentracao,
} from '../../utils/concentracaoSacado';
import { EmptyState } from '../../screens/detail-tabs/shared';
import { useActionMenuTeleport } from '../../composables/useActionMenuTeleport';

const faixas = defineModel<FaixaConcentracaoSacado[]>('faixas', { required: true });

const validationError = ref<string | null>(null);
const { openId, menuStyle, toggle, close } = useActionMenuTeleport();

const TOOLBAR_MENU_ID = 'rank-toolbar';
const rowMenuId = (index: number) => `rank-row-${index}`;

const sortedFaixas = computed(() =>
  [...faixas.value].sort((a, b) => a.position - b.position),
);

const barScaleMax = computed(() => {
  const top = sortedFaixas.value[0]?.percentual ?? 0;
  return top > 0 ? top : 100;
});

function barWidth(pct: number): string {
  const ratio = Math.min(100, Math.max(0, (pct / barScaleMax.value) * 100));
  return `${ratio}%`;
}

function isLastRank(index: number): boolean {
  return index === sortedFaixas.value.length - 1 && sortedFaixas.value.length > 1;
}

function displayPct(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

function onPctInput(index: number, raw: string) {
  const numeric = Number(raw.replace(/[^\d,.-]/g, '').replace(',', '.'));
  const next = sortedFaixas.value.map((f, i) =>
    i === index ? { ...f, percentual: Number.isFinite(numeric) ? numeric : 0 } : { ...f },
  );
  faixas.value = normalizeFaixasPositions(next);
  validationError.value = validateFaixasConcentracao(faixas.value);
}

function addRank() {
  faixas.value = addFaixaBeforeLast(sortedFaixas.value);
  validationError.value = validateFaixasConcentracao(faixas.value);
}

function clearRanks() {
  faixas.value = [];
  validationError.value = null;
  close();
}

function removeRank(index: number) {
  faixas.value = removeFaixaAt(sortedFaixas.value, index);
  validationError.value = faixas.value.length ? validateFaixasConcentracao(faixas.value) : null;
  close();
}

function removeRankFromOpenMenu() {
  if (!openId.value?.startsWith('rank-row-')) return;
  removeRank(Number(openId.value.replace('rank-row-', '')));
}

defineExpose({
  validate: () => {
    validationError.value = validateFaixasConcentracao(faixas.value);
    return validationError.value;
  },
});
</script>

<template>
  <div class="rank-block">
    <div class="rank-block__header">
      <div>
        <div class="rank-block__title">Ranking de concentração por sacado</div>
        <p class="rank-block__hint">
          Cada linha é um teto percentual. A posição 1 é o top 1 e a última faixa vale para os demais sacados.
          O percentual de cada posição deve ser menor ou igual ao da anterior.
        </p>
      </div>
      <div class="rank-block__toolbar">
        <button type="button" class="rank-block__btn rank-block__btn--add" @click="addRank">
          <ListPlus :size="16" />
          Adicionar faixa
        </button>
        <div v-if="sortedFaixas.length" class="rank-block__actions">
          <button
            type="button"
            class="rank-block__btn rank-block__btn--icon"
            aria-label="Ações do ranking"
            data-action-menu-anchor
            @click.stop="toggle(TOOLBAR_MENU_ID, $event.currentTarget as HTMLElement)"
          >
            <MoreVertical :size="18" />
          </button>
        </div>
      </div>
    </div>

    <EmptyState
      v-if="!sortedFaixas.length"
      class="rank-block__empty"
      :icon="ListOrdered"
      title="Nenhuma faixa cadastrada"
      hint="Adicione faixas para definir o ranking de concentração."
    />

    <div v-else class="rank-table">
      <div class="rank-table__head">
        <div>#</div>
        <div>Faixa</div>
        <div>Teto (%)</div>
        <div>Visual</div>
        <div style="text-align: center">Ação</div>
      </div>
      <div
        v-for="(rank, index) in sortedFaixas"
        :key="`${rank.position}-${index}`"
        class="rank-table__row"
        :class="{ 'rank-table__row--demais': isLastRank(index) }"
      >
        <div class="rank-table__pos">
          <span class="rank-table__pos-badge" :class="{ 'rank-table__pos-badge--demais': isLastRank(index) }">
            {{ isLastRank(index) ? '∗' : index + 1 }}
          </span>
        </div>
        <div>
          <div class="rank-table__label">{{ rankLabel(index, sortedFaixas.length) }}</div>
          <div class="rank-table__sublabel">Posição {{ index + 1 }}</div>
        </div>
        <div class="rank-table__pct">
          <input
            class="rank-table__input"
            :value="displayPct(rank.percentual)"
            placeholder="0,00"
            inputmode="decimal"
            @input="onPctInput(index, ($event.target as HTMLInputElement).value)"
          />
          <span class="rank-table__pct-suffix">%</span>
        </div>
        <div class="rank-table__bar-wrap" aria-hidden="true">
          <div class="rank-table__bar-track">
            <div class="rank-table__bar-fill" :style="{ width: barWidth(rank.percentual) }" />
          </div>
          <span class="rank-table__bar-label">{{ displayPct(rank.percentual) }}%</span>
        </div>
        <div class="rank-table__actions">
          <button
            type="button"
            class="rank-table__actions-trigger"
            aria-label="Ações da faixa"
            data-action-menu-anchor
            @click.stop="toggle(rowMenuId(index), $event.currentTarget as HTMLElement)"
          >
            <MoreVertical :size="16" />
          </button>
        </div>
      </div>
    </div>

    <p v-if="validationError" class="rank-block__error">{{ validationError }}</p>

    <Teleport to="body">
      <div
        v-if="openId === TOOLBAR_MENU_ID"
        data-action-menu-floating
        class="rank-block__menu rank-block__menu--floating"
        :style="menuStyle"
      >
        <button type="button" class="rank-block__menu-item rank-block__menu-item--danger" @click="clearRanks">
          <Eraser :size="15" />
          Limpar faixas
        </button>
      </div>
      <div
        v-else-if="openId?.startsWith('rank-row-')"
        data-action-menu-floating
        class="rank-block__menu rank-block__menu--floating"
        :style="menuStyle"
      >
        <button type="button" class="rank-block__menu-item rank-block__menu-item--danger" @click="removeRankFromOpenMenu">
          <Trash2 :size="15" />
          Remover faixa
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.rank-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  width: 100%;
}

.rank-block__empty {
  width: 100%;
  min-height: 160px;
  box-sizing: border-box;
}

.rank-block__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.rank-block__title {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
}

.rank-block__hint {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin: 4px 0 0;
  max-width: 720px;
  line-height: 1.45;
}

.rank-block__toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rank-block__btn {
  height: 34px;
  padding: 0 12px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  background: var(--surface-card);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  color: var(--text-default);
}

.rank-block__btn--add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--surface-card);
  color: var(--text-strong);
}

.rank-block__btn--icon {
  width: 34px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-block__menu--floating {
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 6px;
}

.rank-block__menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: var(--radius-md);
  background: none;
  cursor: pointer;
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  text-align: left;
  color: var(--text-default);
  transition: background var(--duration-fast);
}

.rank-block__menu-item:hover {
  background: var(--surface-sunken);
}

.rank-block__menu-item--danger {
  color: var(--action-danger-text-only);
}

.rank-block__error {
  font-size: var(--text-xs);
  color: var(--danger-base);
  margin: 0;
}

.rank-table {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow: visible;
}

.rank-table__head,
.rank-table__row {
  display: grid;
  grid-template-columns: 44px 1.1fr 120px minmax(140px, 1.4fr) 40px;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
}

.rank-table__head {
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.rank-table__row {
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
  background: var(--surface-card);
}

.rank-table__row--demais {
  background: color-mix(in srgb, var(--accent) 4%, var(--surface-card));
}

.rank-table__pos-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  font-variant-numeric: tabular-nums;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
}

.rank-table__pos-badge--demais {
  background: var(--surface-sunken);
  color: var(--text-muted);
  font-size: 14px;
}

.rank-table__label {
  font-weight: var(--weight-semibold);
  color: var(--text-strong);
}

.rank-table__sublabel {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-top: 2px;
}

.rank-table__pct {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rank-table__input {
  width: 100%;
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  outline: none;
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.rank-table__pct-suffix {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--text-muted);
  flex-shrink: 0;
}

.rank-table__bar-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.rank-table__bar-track {
  flex: 1;
  height: 8px;
  border-radius: 9999px;
  background: var(--surface-sunken);
  overflow: hidden;
}

.rank-table__bar-fill {
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--accent) 85%, #fff),
    var(--accent)
  );
  transition: width 0.2s ease;
}

.rank-table__row--demais .rank-table__bar-fill {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--text-muted) 50%, transparent),
    color-mix(in srgb, var(--text-muted) 75%, transparent)
  );
}

.rank-table__bar-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
  width: 44px;
  text-align: right;
  flex-shrink: 0;
}

.rank-table__actions {
  position: relative;
  display: flex;
  justify-content: center;
}

.rank-table__actions-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  background: var(--surface-card);
  cursor: pointer;
  color: var(--text-muted);
}

.rank-table__actions-trigger:hover {
  background: var(--surface-sunken);
  color: var(--text-strong);
}

@media (max-width: 900px) {
  .rank-table__head {
    display: none;
  }

  .rank-table__row {
    grid-template-columns: 44px 1fr 40px;
    grid-template-rows: auto auto;
  }

  .rank-table__pct {
    grid-column: 2;
  }

  .rank-table__bar-wrap {
    grid-column: 2;
    grid-row: 2;
  }

  .rank-table__actions {
    grid-column: 3;
    grid-row: 1 / span 2;
    align-self: center;
  }
}
</style>

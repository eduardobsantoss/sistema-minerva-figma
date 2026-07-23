<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Component } from 'vue';
import { ArrowLeft, Percent, History } from 'lucide-vue-next';
withDefaults(defineProps<{ vehicle: VehicleSetting; tabLabel: string }>(), {
  vehicle: '',
  tabLabel: 'Label'
});
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
          flex-shrink: 0;
        "
       
      >
        <ArrowLeft :size="20" />
      </button>

      <div style="flex: 1; min-width: 0">
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          Taxas dos Veículos · {{ tabLabel }}
        </div>
        <h2
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
          "
        >
          {{ vehicle.vehicleName }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          ID {{ vehicle.vehicleId }} ·
          {{ vehicle.isActive ? 'Ativo' : 'Inativo' }}
        </p>
      </div>
    </div>

    <div
      v-if="savedBanner"
      style="
        padding: 12px 16px;
        border-radius: var(--radius-lg);
        background: color-mix(in srgb, #16a34a 12%, transparent);
        border: 1px solid color-mix(in srgb, #16a34a 35%, transparent);
        font-size: var(--text-sm);
        color: var(--text-default);
      "
    >
      Taxa salva com sucesso.
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="DETAIL_TABS"
      variant="brand"
     
    />

    <!-- Parametrização -->
    <div
      v-if="tab === 'parametrizacao'"
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        padding: 22px;
      "
    >
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px 20px">
        <div>
          <div :style="labelStyle">Taxa Pré Fixada (%)</div>
          <input
            v-model="preFixedInput"
            type="text"
            inputmode="decimal"
            placeholder="Ex.: 1,85"
            :style="inputStyle"
          />
        </div>
        <div>
          <div :style="labelStyle">Taxa Pós Fixada (%)</div>
          <input
            v-model="postFixedInput"
            type="text"
            inputmode="decimal"
            placeholder="Ex.: 1,5"
            :style="inputStyle"
          />
        </div>
        <div>
          <div :style="labelStyle">Indexador Pós Fixado</div>
          <select v-model="postFixedIndex" :style="inputStyle">
            <option v-for="opt in POST_FIXED_INDEX_OPTS" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Data de vencimento da taxa</div>
          <input v-model="dueAtInput" type="date" :min="minDueDate" :style="inputStyle" />
        </div>
      </div>

      <p
        v-if="formError"
        style="font-size: var(--text-sm); color: var(--danger-base, #c53030); margin-top: 14px; line-height: 1.4"
      >
        {{ formError }}
      </p>

      <div class="flex items-center justify-end" style="margin-top: 20px">
        <button
          type="button"
          style="
            height: 44px;
            padding: 0 22px;
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            border-radius: var(--radius-lg);
            border: none;
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-sm);
          "
         
        >
          {{ primaryActionLabel }}
        </button>
      </div>
    </div>

    <!-- Histórico -->
    <div v-else>
      <div
        v-if="vehicle.history.length === 0"
        style="
          padding: 40px;
          text-align: center;
          font-size: var(--text-sm);
          color: var(--text-muted);
          background: var(--surface-sunken);
          border-radius: var(--radius-xl);
          border: 1px dashed var(--border-default);
        "
      >
        Nenhuma taxa cadastrada para este veículo.
      </div>
      <div
        v-else
        style="
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: var(--surface-card);
        "
      >
        <div
          class="grid"
          :style="{
            gridTemplateColumns: HIST_COLS,
            padding: '12px 20px',
            background: 'var(--surface-sunken)',
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.12em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }"
        >
          <div>Data</div>
          <div>Vencimento</div>
          <div>Status</div>
          <div>Taxa Pré</div>
          <div>Taxa Pós</div>
        </div>
        <div
          v-for="h in vehicle.history"
          :key="h.id"
          class="grid items-center"
          :style="{
            gridTemplateColumns: HIST_COLS,
            padding: '14px 20px',
            borderTop: '1px solid var(--border-default)',
            fontSize: 'var(--text-sm)',
          }"
        >
          <div style="color: var(--text-default); font-variant-numeric: tabular-nums">{{ h.createdAt }}</div>
          <div style="color: var(--text-default); font-variant-numeric: tabular-nums">{{ h.dueAt }}</div>
          <div>
            <span
              :style="{
                display: 'inline-block',
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '3px 8px',
                borderRadius: '9999px',
                background: `${rateStatusColor(h.status)}18`,
                color: rateStatusColor(h.status),
              }"
            >
              {{ rateStatusLabel(h.status) }}
            </span>
          </div>
          <div style="font-variant-numeric: tabular-nums; color: var(--text-strong)">{{ formatPre(h) }}</div>
          <div style="font-variant-numeric: tabular-nums; color: var(--text-strong)">{{ formatPost(h) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

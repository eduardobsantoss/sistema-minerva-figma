<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Component } from 'vue';
import { ArrowLeft, Percent, History } from 'lucide-vue-next';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import {
  POST_FIXED_INDEX_OPTS,
  rateStatusColor,
  rateStatusLabel,
  type VehicleSetting,
  type VehicleRateHistory,
} from '../../data/taxasVeiculosData';

const props = defineProps<{ vehicle: VehicleSetting; tabLabel: string }>();
const emit = defineEmits<{ back: []; save: [vehicle: VehicleSetting] }>();

type DetailTab = 'parametrizacao' | 'historico';

const DETAIL_TABS: { key: DetailTab; label: string; icon: Component }[] = [
  { key: 'parametrizacao', label: 'Parametrização', icon: Percent },
  { key: 'historico', label: 'Histórico', icon: History },
];

const tab = ref<DetailTab>('parametrizacao');
const preFixedInput = ref('');
const postFixedInput = ref('');
const postFixedIndex = ref<string>('DI');
const dueAtInput = ref('');
const formError = ref('');
const savedBanner = ref(false);
let bannerTimer: ReturnType<typeof setTimeout> | null = null;

const labelStyle = {
  fontSize: '10px',
  fontWeight: 'var(--weight-bold)',
  letterSpacing: '0.14em',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  marginBottom: '6px',
} as const;

const inputStyle = {
  width: '100%',
  height: '40px',
  padding: '0 14px',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-lg)',
  outline: 'none',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-strong)',
} as const;

const HIST_COLS = '1.1fr 1fr 0.9fr 0.8fr 1fr';

function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const minDueDate = computed(() => tomorrowISO());

function syncFromVehicle(v: VehicleSetting) {
  preFixedInput.value = v.preFixedRate != null ? String(v.preFixedRate) : '';
  postFixedInput.value = v.postFixedRate != null ? String(v.postFixedRate) : '';
  postFixedIndex.value = v.postFixedIndex || 'DI';
  dueAtInput.value = v.dueAt || '';
  formError.value = '';
}

watch(() => props.vehicle, syncFromVehicle, { immediate: true, deep: true });

function parseOptionalRate(raw: string): number | null {
  const trimmed = raw.trim().replace(',', '.');
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function formatCreatedAt(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function isoToDisplayBR(iso: string): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function formatPre(h: VehicleRateHistory): string {
  return h.preFixedRate != null ? `${h.preFixedRate}%` : '—';
}

function formatPost(h: VehicleRateHistory): string {
  if (h.postFixedRate == null) return '—';
  return `${h.postFixedIndex} ${h.postFixedRate}%`;
}

const isNewRateSetup = computed(
  () =>
    props.vehicle.history.length === 0 ||
    (props.vehicle.preFixedRate == null &&
      props.vehicle.postFixedRate == null &&
      !props.vehicle.dueAt),
);

const primaryActionLabel = computed(() =>
  isNewRateSetup.value ? 'Cadastrar taxa' : 'Salvar parametrização',
);

function handleSaveRate() {
  formError.value = '';
  const pre = parseOptionalRate(preFixedInput.value);
  const post = parseOptionalRate(postFixedInput.value);

  if (pre == null && post == null) {
    formError.value = 'Informe ao menos a taxa pré-fixada ou a taxa pós-fixada.';
    return;
  }
  if (!dueAtInput.value) {
    formError.value = 'Informe a data de vencimento da taxa.';
    return;
  }
  if (dueAtInput.value < minDueDate.value) {
    formError.value = 'A data de vencimento deve ser a partir de amanhã.';
    return;
  }

  const now = new Date();
  const newEntry: VehicleRateHistory = {
    id: `h-${props.vehicle.vehicleId}-${Date.now()}`,
    createdAt: formatCreatedAt(now),
    dueAt: isoToDisplayBR(dueAtInput.value),
    status: 1,
    preFixedRate: pre,
    postFixedRate: post,
    postFixedIndex: postFixedIndex.value,
  };

  const history = props.vehicle.history.map((h) =>
    h.status === 1 ? { ...h, status: 2 as const } : h,
  );

  emit('save', {
    ...props.vehicle,
    preFixedRate: pre,
    postFixedRate: post,
    postFixedIndex: postFixedIndex.value,
    dueAt: dueAtInput.value,
    history: [newEntry, ...history],
  });

  savedBanner.value = true;
  if (bannerTimer) clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => {
    savedBanner.value = false;
  }, 2200);
}
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
        @click="emit('back')"
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
      @update:model-value="tab = $event as DetailTab"
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
          @click="handleSaveRate"
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

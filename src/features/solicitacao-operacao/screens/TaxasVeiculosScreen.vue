<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Component } from 'vue';
import { Landmark, Briefcase, Shield, Search } from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import {
  seedByTab,
  type VehicleSetting,
  type VehicleTypeTab,
} from '../data/taxasVeiculosData';
import VehicleRateDetailView from '../components/taxas-veiculos/VehicleRateDetailView.vue';

const TABS: { key: VehicleTypeTab; label: string; icon: Component }[] = [
  { key: 'FIDC', label: 'FIDC', icon: Landmark },
  { key: 'CRA', label: 'CRA', icon: Briefcase },
  { key: 'GARANTIAS', label: 'Garantias', icon: Shield },
];

const TAB_LABELS: Record<VehicleTypeTab, string> = {
  FIDC: 'FIDC',
  CRA: 'CRA',
  GARANTIAS: 'Garantias',
};

const COLS = 'auto 0.5fr 2fr';

const activeTab = ref<VehicleTypeTab>('FIDC');
const lists = ref<Record<VehicleTypeTab, VehicleSetting[]>>({
  FIDC: seedByTab('FIDC'),
  CRA: seedByTab('CRA'),
  GARANTIAS: seedByTab('GARANTIAS'),
});

const filterId = ref('');
const filterNome = ref('');
const detailVehicle = ref<VehicleSetting | null>(null);
const saveConfirmOpen = ref(false);
const saveBannerVisible = ref(false);
let saveBannerTimer: ReturnType<typeof setTimeout> | null = null;

const inputStyle = {
  width: '100%',
  height: '40px',
  padding: '0 12px',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-lg)',
  outline: 'none',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-strong)',
} as const;

const currentList = computed(() => lists.value[activeTab.value]);

const filteredVehicles = computed(() => {
  const idQ = filterId.value.trim().toLowerCase();
  const nomeQ = filterNome.value.trim().toLowerCase();
  return currentList.value.filter((v) => {
    const matchId = !idQ || v.vehicleId.toLowerCase().includes(idQ);
    const matchNome = !nomeQ || v.vehicleName.toLowerCase().includes(nomeQ);
    return matchId && matchNome;
  });
});

const visibleActiveCount = computed(() => filteredVehicles.value.filter((v) => v.isActive).length);

const allActiveVisible = computed(
  () => filteredVehicles.value.length > 0 && visibleActiveCount.value === filteredVehicles.value.length,
);

const someActiveVisible = computed(() => visibleActiveCount.value > 0);

const selectAllIndeterminate = computed(() => someActiveVisible.value && !allActiveVisible.value);

function updateVehicleInTab(updated: VehicleSetting) {
  lists.value[activeTab.value] = lists.value[activeTab.value].map((v) =>
    v.vehicleId === updated.vehicleId ? updated : v,
  );
  if (detailVehicle.value?.vehicleId === updated.vehicleId) {
    detailVehicle.value = updated;
  }
}

function toggleVehicleActive(vehicleId: string) {
  lists.value[activeTab.value] = lists.value[activeTab.value].map((v) =>
    v.vehicleId === vehicleId ? { ...v, isActive: !v.isActive } : v,
  );
}

function toggleAllVisibleActive() {
  const target = !allActiveVisible.value;
  const visibleIds = new Set(filteredVehicles.value.map((v) => v.vehicleId));
  lists.value[activeTab.value] = lists.value[activeTab.value].map((v) =>
    visibleIds.has(v.vehicleId) ? { ...v, isActive: target } : v,
  );
}

function openDetail(vehicle: VehicleSetting) {
  detailVehicle.value = { ...vehicle, history: vehicle.history.map((h) => ({ ...h })) };
}

function closeDetail() {
  detailVehicle.value = null;
}

function handleDetailSave(updated: VehicleSetting) {
  updateVehicleInTab(updated);
}

function requestSaveTab() {
  saveConfirmOpen.value = true;
}

function confirmSaveTab() {
  saveConfirmOpen.value = false;
  if (saveBannerTimer) clearTimeout(saveBannerTimer);
  saveBannerVisible.value = true;
  saveBannerTimer = setTimeout(() => {
    saveBannerVisible.value = false;
    saveBannerTimer = null;
  }, 3200);
}

function cancelSaveTab() {
  saveConfirmOpen.value = false;
}
</script>

<template>
  <VehicleRateDetailView
    v-if="detailVehicle"
    :vehicle="detailVehicle"
    :tab-label="TAB_LABELS[activeTab]"
    @back="closeDetail"
    @save="handleDetailSave"
  />

  <div v-else class="flex flex-col" style="gap: 24px">
    <div v-if="saveBannerVisible" role="status">
      <div
        style="
          padding: 12px 16px;
          border-radius: var(--radius-lg);
          background: var(--status-success-bg, #ecfdf5);
          border: 1px solid var(--status-success-border, #a7f3d0);
          color: var(--status-success-text, #047857);
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
        "
      >
        Configurações salvas
      </div>
    </div>

    <div class="flex items-start justify-between" style="gap: 16px">
      <div>
        <div
          style="
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: var(--accent);
            font-weight: var(--weight-bold);
            margin-bottom: 6px;
          "
        >
          Workflow Operacional · Solicitações
        </div>
        <h1
          style="
            font-size: 26px;
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.02em;
            line-height: 1.15;
          "
        >
          Taxas dos Veículos
        </h1>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 8px; max-width: 720px; line-height: 1.5">
          Parametrize taxas por tipo de veículo. Clique em um veículo para abrir o detalhe.
        </p>
      </div>
      <button
        type="button"
        class="btn-animated btn-agro"
        style="
          height: 48px;
          padding: 0 28px;
          background: var(--agro-base);
          color: #fff;
          border-radius: var(--radius-lg);
          border: none;
          cursor: pointer;
          font-weight: var(--weight-bold);
          font-size: var(--text-xs);
          letter-spacing: 0.1em;
          box-shadow: 0 10px 24px -8px rgba(242, 125, 38, 0.4);
          flex-shrink: 0;
        "
        @click="requestSaveTab"
      >
        SALVAR
      </button>
    </div>

    <SegmentedToggle
      :model-value="activeTab"
      :options="TABS"
      variant="brand"
      @update:model-value="activeTab = $event as VehicleTypeTab"
    />

    <div class="grid" style="grid-template-columns: 160px 1fr; gap: 12px 16px; max-width: 640px">
      <div>
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.1em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-bottom: 6px;
          "
        >
          ID
        </div>
        <input v-model="filterId" placeholder="Filtrar ID..." :style="inputStyle" />
      </div>
      <div>
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.1em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-bottom: 6px;
          "
        >
          Nome
        </div>
        <div class="relative">
          <Search
            :size="15"
            style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)"
          />
          <input
            v-model="filterNome"
            placeholder="Filtrar por nome..."
            :style="{ ...inputStyle, paddingLeft: '36px' }"
          />
        </div>
      </div>
    </div>

    <div
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        overflow: hidden;
        background: var(--surface-card);
      "
    >
      <div
        class="grid items-center"
        :style="{
          gridTemplateColumns: COLS,
          padding: '12px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }"
      >
        <label class="flex flex-col" style="gap: 4px; cursor: pointer">
          <span class="flex items-center" style="gap: 10px">
            <Checkbox
              :checked="allActiveVisible"
              :indeterminate="selectAllIndeterminate"
              @change="toggleAllVisibleActive"
            />
            <span>Selecionar todos</span>
          </span>
          <span style="padding-left: 26px; font-size: 9px; letter-spacing: 0.08em; opacity: 0.85">Ativo</span>
        </label>
        <div>ID</div>
        <div>Nome</div>
      </div>

      <div
        v-if="filteredVehicles.length === 0"
        style="padding: 32px 20px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
      >
        Nenhum veículo encontrado com os filtros aplicados.
      </div>

      <div
        v-for="v in filteredVehicles"
        :key="v.vehicleId"
        class="grid items-center taxas-row"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          transition: 'background var(--duration-fast)',
        }"
        @click="openDetail(v)"
      >
        <div @click.stop>
          <Checkbox :checked="v.isActive" @change="toggleVehicleActive(v.vehicleId)" />
        </div>
        <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ v.vehicleId }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ v.vehicleName }}</div>
      </div>
    </div>

    <div
      v-if="saveConfirmOpen"
      class="flex items-center justify-center"
      style="position: fixed; inset: 0; z-index: 500; background: rgba(15, 23, 42, 0.45); padding: 24px"
    >
      <div
        style="
          width: 100%;
          max-width: 440px;
          background: var(--surface-card);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          padding: 28px;
        "
        @click.stop
      >
        <h3
          style="
            font-size: var(--text-lg);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            margin-bottom: 10px;
          "
        >
          Deseja salvar as configurações de veículos?
        </h3>
        <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 22px">
          As alterações de ativação e taxas permanecem apenas neste protótipo local (aba
          {{ TAB_LABELS[activeTab] }}).
        </p>
        <div class="flex items-center justify-end" style="gap: 10px">
          <button
            type="button"
            style="
              height: 42px;
              padding: 0 18px;
              background: var(--surface-card);
              color: var(--text-strong);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              cursor: pointer;
              font-weight: var(--weight-bold);
              font-size: var(--text-sm);
            "
            @click="cancelSaveTab"
          >
            Cancelar
          </button>
          <button
            type="button"
            style="
              height: 42px;
              padding: 0 18px;
              background: var(--agro-base);
              color: #fff;
              border: none;
              border-radius: var(--radius-lg);
              cursor: pointer;
              font-weight: var(--weight-bold);
              font-size: var(--text-sm);
            "
            @click="confirmSaveTab"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.taxas-row:hover {
  background: var(--surface-sunken);
}
</style>

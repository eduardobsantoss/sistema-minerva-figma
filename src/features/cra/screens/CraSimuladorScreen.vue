<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowLeft, Search, Plus } from 'lucide-vue-next';
import { brl, cras, type Cra } from '../data/craData';
import { MOCK_CONFINA_SIMULATIONS, type SavedSimulation } from '../data/simuladorData';
import CraCard from '../components/CraCard.vue';
import ConfinaPromissoryModal from '@/features/fidc/components/modals/ConfinaPromissoryModal.vue';

const selected = ref<Cra | null>(null);
const q = ref('');
const focus = ref(false);
const modalOpen = ref(false);
const simulations = ref<SavedSimulation[]>([...MOCK_CONFINA_SIMULATIONS]);

const filtered = computed(() =>
  cras.filter(
    (c) =>
      !q.value ||
      c.nome.toLowerCase().includes(q.value.toLowerCase()) ||
      c.cnpj.includes(q.value) ||
      c.cessionaria.toLowerCase().includes(q.value.toLowerCase()),
  ),
);

const vehicleName = computed(() => selected.value?.nome ?? '');

function openVehicle(id: string) {
  selected.value = cras.find((c) => c.id === id) ?? null;
}

function handleCreated() {
  simulations.value = [
    {
      id: `sim-confina-${Date.now()}`,
      type: 6,
      typeLabel: 'Termo Confina',
      grupo: 'Nova simulação',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      valorNominal: 980_000,
    },
    ...simulations.value,
  ];
}
</script>

<template>
  <div v-if="!selected" class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <div
        class="relative"
        :style="{
          flex: 1,
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-xl)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: focus ? 'var(--gci-base)' : 'var(--border-default)',
          boxShadow: focus ? '0 0 0 4px rgba(8,60,74,0.06)' : 'var(--shadow-xs)',
          transition: 'border-color var(--duration-base), box-shadow var(--duration-base)',
        }"
      >
        <Search :size="18" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
        <input
          v-model="q"
          placeholder="Pesquisar CRA para simular..."
          style="width: 100%; height: 56px; border: none; outline: none; background: transparent; padding-left: 52px; padding-right: 160px; font-size: var(--text-base); color: var(--text-strong); border-radius: var(--radius-xl)"
          @focus="focus = true"
          @blur="focus = false"
        />
        <button
          type="button"
          style="position: absolute; right: 8px; top: 8px; bottom: 8px; padding: 0 24px; background: var(--action-primary-bg); color: var(--action-primary-text); border-radius: var(--radius-lg); border: none; cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.10em"
        >
          PESQUISAR
        </button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px">
      <CraCard v-for="c in filtered" :key="c.id" :cra="c" @open="openVehicle" />
    </div>
  </div>

  <div v-else class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="selected = null"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 4px">
          Simulador · CRA's
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
          {{ selected.nome }}
        </h2>
      </div>
    </div>

    <div style="border-bottom: 1px solid var(--border-default)">
      <button
        type="button"
        style="padding: 10px 4px; margin-right: 22px; background: none; border: none; cursor: default; font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); border-bottom: 2px solid var(--accent); margin-bottom: -1px"
      >
        Termo Confina
      </button>
    </div>

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 22px">
      <div class="flex items-start justify-between" style="gap: 16px; margin-bottom: 18px">
        <div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Nota promissória de gado</div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px; max-width: 560px; line-height: 1.5">
            Simule valor de compra vs. valor nominal a partir da cotação da arroba, peso do lote, juros e prazo.
          </div>
        </div>
        <button
          type="button"
          class="flex items-center btn-animated btn-agro"
          style="gap: 8px; height: 42px; padding: 0 18px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em; flex-shrink: 0; box-shadow: 0 10px 24px -10px rgba(242,125,38,0.40)"
          @click="modalOpen = true"
        >
          <Plus :size="15" /> GERAR TÍTULO
        </button>
      </div>

      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div
          class="grid"
          style="grid-template-columns: 1.2fr 1.4fr 1fr 1fr; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase"
        >
          <div>Tipo</div><div>Grupo</div><div>Criado em</div><div>Valor nominal</div>
        </div>
        <div
          v-for="s in simulations"
          :key="s.id"
          class="grid items-center"
          style="grid-template-columns: 1.2fr 1.4fr 1fr 1fr; padding: 12px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ s.typeLabel }}</div>
          <div style="color: var(--text-default)">{{ s.grupo }}</div>
          <div style="color: var(--text-muted)">{{ s.createdAt }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ brl(s.valorNominal) }}</div>
        </div>
        <div v-if="simulations.length === 0" style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)">
          Nenhuma simulação nesta operação.
        </div>
      </div>
    </div>

    <ConfinaPromissoryModal
      v-if="modalOpen"
      :vehicle-name="vehicleName"
      @close="modalOpen = false"
      @created="handleCreated"
    />
  </div>
</template>

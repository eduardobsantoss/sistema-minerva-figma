<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { TrendingUp, Upload, Wallet } from 'lucide-vue-next';
import UnderlineSubTabs from '../../components/UnderlineSubTabs.vue';
import { useToast } from '@/composables/useToast';
import {
  applyBankBalance,
  applyLaminaUpload,
  brl,
  type BankBalanceInput,
  type LaminaUploadKind,
  type Veiculo,
} from '../../data/passivoNovoData';
import { getLamina } from '../../data/laminaData';
import ResumoSubTab from './sub-tabs/ResumoSubTab.vue';
import RentabilidadeSubTab from './sub-tabs/RentabilidadeSubTab.vue';
import CarteiraSubTab from './sub-tabs/CarteiraSubTab.vue';
import UploadLaminaModal from './UploadLaminaModal.vue';
import CaixasModal from './CaixasModal.vue';

const props = defineProps<{ veiculo: Veiculo }>();
const { success, error } = useToast();
const showUpload = ref(false);
const showCaixas = ref(false);

function confirmUpload(payload: { kind: LaminaUploadKind; fileName: string }) {
  const msg = applyLaminaUpload(props.veiculo, payload.kind, payload.fileName);
  showUpload.value = false;
  if (msg.startsWith('Não há')) error(msg);
  else success(msg);
}

function confirmCaixas(input: BankBalanceInput) {
  applyBankBalance(props.veiculo, input);
  showCaixas.value = false;
  success('Caixas atualizadas (protótipo).');
}

const LAMINA_TABS = ['Resumo', 'Rentabilidade', 'Carteira'] as const;
type LaminaTabId = (typeof LAMINA_TABS)[number];

const activeTab = ref<LaminaTabId>('Resumo');
const dateIso = ref(props.veiculo.dataBaseIso);
const dateChips = computed(() => props.veiculo.dateChips.slice(0, 3));
const lamina = computed(() => getLamina(props.veiculo, dateIso.value));

watch(
  () => props.veiculo.id,
  () => {
    dateIso.value = props.veiculo.dataBaseIso;
  },
);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div
      class="relative overflow-hidden flex items-center"
      style="
        background: var(--gci-base);
        border-radius: var(--radius-xl);
        padding: 28px 32px;
        color: #fff;
        box-shadow: 0 20px 40px -20px rgba(8, 60, 74, 0.4);
      "
    >
      <div style="position: absolute; top: -80px; right: -80px; width: 280px; height: 280px; border-radius: 9999px; background: rgba(255,255,255,0.04)" />
      <div style="position: absolute; bottom: -120px; right: 80px; width: 240px; height: 240px; border-radius: 9999px; background: rgba(242,125,38,0.04)" />
      <div style="flex: 1; position: relative; z-index: 1">
        <div style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 10px">
          Ativo total
        </div>
        <div style="font-size: 36px; font-weight: var(--weight-bold); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1">
          {{ brl(veiculo.ativoTotal) }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255,255,255,0.65); margin-top: 8px">
          {{ veiculo.series.length }} séries · Funding {{ brl(veiculo.funding, true) }} · Caixa {{ brl(veiculo.caixa, true) }}
        </div>
        <div class="flex items-center" style="gap: 8px; margin-top: 16px; flex-wrap: wrap">
          <span style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.55)">
            Data-base
          </span>
          <button
            v-for="chip in dateChips"
            :key="chip.iso"
            type="button"
            :style="{
              height: '28px',
              padding: '0 12px',
              borderRadius: '9999px',
              border: dateIso === chip.iso ? '1px solid #fff' : '1px solid rgba(255,255,255,0.22)',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 'var(--weight-bold)',
              background: dateIso === chip.iso ? '#fff' : 'transparent',
              color: dateIso === chip.iso ? 'var(--gci-base)' : '#fff',
            }"
            @click="dateIso = chip.iso"
          >
            {{ chip.label }}
          </button>
        </div>
      </div>
      <div
        class="flex items-center justify-center"
        style="width: 56px; height: 56px; border-radius: var(--radius-lg); background: rgba(255,255,255,0.10); color: #fff; position: relative; z-index: 1"
      >
        <TrendingUp :size="26" />
      </div>
    </div>

    <div class="flex items-center justify-end" style="gap: 8px; flex-wrap: wrap">
      <button type="button" class="ghost-btn flex items-center" style="gap: 8px" @click="showUpload = true">
        <Upload :size="14" />
        Subir arquivo
      </button>
      <button type="button" class="ghost-btn flex items-center" style="gap: 8px" @click="showCaixas = true">
        <Wallet :size="14" />
        Editar caixas
      </button>
    </div>

    <UnderlineSubTabs v-model="activeTab" :tabs="[...LAMINA_TABS]" />

    <ResumoSubTab v-if="activeTab === 'Resumo'" :veiculo="veiculo" :lamina="lamina" />
    <RentabilidadeSubTab v-else-if="activeTab === 'Rentabilidade'" :veiculo="veiculo" :lamina="lamina" />
    <CarteiraSubTab v-else :veiculo="veiculo" :lamina="lamina" />

    <UploadLaminaModal v-if="showUpload" @close="showUpload = false" @confirm="confirmUpload" />
    <CaixasModal
      v-if="showCaixas"
      :default-date-iso="veiculo.dataBaseIso"
      :accounts="veiculo.caixaAccounts"
      @close="showCaixas = false"
      @confirm="confirmCaixas"
    />
  </div>
</template>

<style scoped>
.ghost-btn {
  height: 40px;
  padding: 0 16px;
  background: var(--surface-card);
  color: var(--text-strong);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
</style>

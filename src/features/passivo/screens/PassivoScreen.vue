<script setup lang="ts">
import { ref, computed } from 'vue';
import { AlertCircle } from 'lucide-vue-next';
import {
  COTAS,
  CRAS,
  EXTRAORDINARY_VALUE_LABEL,
  BASE_D1_LABEL,
  type Cota,
  type CraComposicao,
  type EventoPagamento,
} from '../data/passivoData';
import PassivoOverviewScreen from './overview/PassivoOverviewScreen.vue';
import CotaDetailScreen from './cota-detail/CotaDetailScreen.vue';
import CraDetailScreen from './cra-detail/CraDetailScreen.vue';

type Route =
  | { level: 1 }
  | { level: 2; cotaId: string }
  | { level: 3; cotaId?: string; craId?: string };

const route = ref<Route>({ level: 1 });
const showD1Prompt = ref(true);

const currentCota = computed<Cota | undefined>(() => {
  const r = route.value;
  if (r.level === 1 || !r.cotaId) return undefined;
  return COTAS.find((c) => c.id === r.cotaId);
});

const currentCra = computed<CraComposicao | undefined>(() => {
  const r = route.value;
  if (r.level !== 3) return undefined;
  if (r.craId) return CRAS.find((c) => c.id === r.craId);
  return CRAS[0];
});

function handleBack() {
  const r = route.value;
  if (r.level === 3) {
    if (r.cotaId) {
      route.value = { level: 2, cotaId: r.cotaId };
    } else {
      route.value = { level: 1 };
    }
  } else if (r.level === 2) {
    route.value = { level: 1 };
  }
}

function openCota(cotaId: string) {
  route.value = { level: 2, cotaId };
}

function openEvent(_evento: EventoPagamento) {
  route.value = { level: 3 };
  showD1Prompt.value = true;
}

function openCra(cra: CraComposicao) {
  const cotaId = route.value.level === 2 ? route.value.cotaId : undefined;
  route.value = { level: 3, cotaId, craId: cra.id };
  showD1Prompt.value = true;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px; position: relative">
    <!-- Meta D-1 no nível overview -->
    <div
      v-if="route.level === 1"
      class="flex items-center justify-end"
      style="gap: 10px; margin-bottom: -8px"
    >
      <span
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.12em;
        "
      >
        Base D-1:
      </span>
      <span
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          background: var(--surface-card);
          padding: 6px 12px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-default);
          letter-spacing: 0.06em;
        "
      >
        {{ BASE_D1_LABEL }}
      </span>
    </div>

    <!-- Banner D-1 (nível 3) -->
    <Transition name="banner">
      <div
        v-if="route.level === 3 && showD1Prompt"
        class="flex items-center justify-between"
        style="
          background: var(--gci-base);
          color: #fff;
          padding: 14px 20px;
          border-radius: var(--radius-xl);
          gap: 16px;
          box-shadow: var(--shadow-md);
        "
      >
        <div class="flex items-center" style="gap: 12px">
          <div
            class="flex items-center justify-center"
            style="
              width: 36px;
              height: 36px;
              background: rgba(255, 255, 255, 0.15);
              border-radius: var(--radius-lg);
              flex-shrink: 0;
            "
          >
            <AlertCircle :size="18" />
          </div>
          <p style="font-size: var(--text-sm); font-weight: var(--weight-semibold)">
            O pagamento extraordinário de
            <span style="color: var(--accent); font-weight: var(--weight-bold)">R$ {{ EXTRAORDINARY_VALUE_LABEL }}</span>
            em 26/05 foi realizado?
          </p>
        </div>
        <div class="flex" style="gap: 8px; flex-shrink: 0">
          <button
            type="button"
            style="
              height: 36px;
              padding: 0 16px;
              background: rgba(255, 255, 255, 0.12);
              border: none;
              border-radius: var(--radius-lg);
              color: #fff;
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.08em;
              text-transform: uppercase;
              cursor: pointer;
            "
            @click="showD1Prompt = false"
          >
            Não
          </button>
          <button
            type="button"
            style="
              height: 36px;
              padding: 0 16px;
              background: #fff;
              border: none;
              border-radius: var(--radius-lg);
              color: var(--gci-base);
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.08em;
              text-transform: uppercase;
              cursor: pointer;
            "
            @click="showD1Prompt = false"
          >
            Sim, Confirmar
          </button>
        </div>
      </div>
    </Transition>

    <Transition name="level" mode="out-in">
      <PassivoOverviewScreen
        v-if="route.level === 1"
        key="level1"
        @open-cota="openCota"
        @open-event="openEvent"
      />
      <CotaDetailScreen
        v-else-if="route.level === 2 && currentCota"
        key="level2"
        :cota="currentCota"
        @back="handleBack"
        @open-cra="openCra"
      />
      <CraDetailScreen
        v-else-if="route.level === 3 && currentCra"
        key="level3"
        :cra="currentCra"
        :cota-nome="currentCota?.nome"
        @back="handleBack"
      />
    </Transition>
  </div>
</template>

<style scoped>
.banner-enter-active,
.banner-leave-active {
  transition:
    opacity var(--duration-slow) var(--ease-standard),
    transform var(--duration-slow) var(--ease-standard);
}
.banner-enter-from,
.banner-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.level-enter-active,
.level-leave-active {
  transition:
    opacity var(--duration-base) var(--ease-standard),
    transform var(--duration-base) var(--ease-standard);
}
.level-enter-from {
  opacity: 0;
  transform: translateX(8px);
}
.level-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>

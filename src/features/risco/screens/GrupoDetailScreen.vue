<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, type Component } from 'vue';
import { ArrowLeft, MoreVertical, Settings2, Users, History, UserCog, BellRing, ShieldCheck, Info } from 'lucide-vue-next';
import { statusOperacaoColor, detalheGrupo, type GrupoEmpresarial } from '../data/riscoData';
import { TabPill } from './detail-tabs/shared';
import DetalhesTab from './detail-tabs/DetalhesTab.vue';
import ParametrizacoesTab from './detail-tabs/ParametrizacoesTab.vue';
import CedentesTab from './detail-tabs/CedentesTab.vue';
import HistoricoTab from './detail-tabs/HistoricoTab.vue';
import TransferirGerenteModal from '../components/modals/TransferirGerenteModal.vue';
import ConfigurarNotificacoesModal from '../components/modals/ConfigurarNotificacoesModal.vue';
import HabilitarOperarModal from '../components/modals/HabilitarOperarModal.vue';

interface Props {
  grupo: GrupoEmpresarial;
}

type Tab = 'detalhes' | 'parametrizacoes' | 'cedentes' | 'historico';

const TABS: { key: Tab; label: string; icon: Component }[] = [
  { key: 'detalhes', label: 'Detalhes', icon: Info },
  { key: 'parametrizacoes', label: 'Parametrizações', icon: Settings2 },
  { key: 'cedentes', label: 'Cedentes', icon: Users },
  { key: 'historico', label: 'Histórico', icon: History },
];

const props = defineProps<Props>();
const emit = defineEmits<{ back: [] }>();

const tab = ref<Tab>('detalhes');
const det = reactive(detalheGrupo(props.grupo));
const cor = statusOperacaoColor(props.grupo.statusOperacao);

const transferindo = ref(false);
const configurandoNotif = ref(false);
const habilitando = ref(false);

const actionMenuOpen = ref(false);
const actionMenuRef = ref<HTMLDivElement | null>(null);

const actions = [
  { label: 'Transferir gerente', icon: UserCog, onClick: () => { transferindo.value = true; } },
  { label: 'Configurar notificações', icon: BellRing, onClick: () => { configurandoNotif.value = true; } },
  { label: 'Habilitar para operar', icon: ShieldCheck, onClick: () => { habilitando.value = true; } },
];

function handleActionClick(action: (typeof actions)[number]) {
  actionMenuOpen.value = false;
  action.onClick();
}

function handleClickOutside(e: MouseEvent) {
  if (actionMenuRef.value && !actionMenuRef.value.contains(e.target as Node)) actionMenuOpen.value = false;
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Header -->
    <div class="flex items-center" style="gap: 16px">
      <button aria-label="Voltar" class="flex items-center justify-center" style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0" @click="emit('back')">
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          Risco · Grupo Empresarial
        </div>
        <h2 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2; gap: 10px">
          {{ grupo.nome }}
          <span class="flex items-center" :style="{ gap: '6px', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '5px 11px', borderRadius: '9999px', background: `color-mix(in srgb, ${cor} 14%, transparent)`, color: cor }">
            <span :style="{ width: '7px', height: '7px', borderRadius: '9999px', background: cor }" />
            {{ grupo.statusOperacao.toUpperCase() }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ grupo.documento }} · Gerente: {{ grupo.gerente }}
        </p>
      </div>

      <div ref="actionMenuRef" style="position: relative; flex-shrink: 0">
        <button
          aria-label="Mais ações"
          class="flex items-center justify-center"
          style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong)"
          @click="actionMenuOpen = !actionMenuOpen"
        >
          <MoreVertical :size="20" />
        </button>
        <div
          v-if="actionMenuOpen"
          class="flex flex-col"
          style="position: absolute; top: 52px; right: 0; z-index: 50; min-width: 240px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 6px"
        >
          <button
            v-for="a in actions"
            :key="a.label"
            class="flex items-center grupo-detail-action-item"
            style="gap: 10px; padding: 10px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%; transition: background var(--duration-fast)"
            @click="handleActionClick(a)"
          >
            <component :is="a.icon" :size="16" style="color: var(--text-muted)" />
            {{ a.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center" style="gap: 4px; padding: 4px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); flex-wrap: wrap">
      <TabPill v-for="t in TABS" :key="t.key" :active="tab === t.key" :icon="t.icon" @click="tab = t.key">
        {{ t.label }}
      </TabPill>
    </div>

    <!-- Conteúdo -->
    <DetalhesTab
      v-if="tab === 'detalhes'"
      :grupo="grupo"
      :partes-relacionadas="det.partesRelacionadas"
      :limite="det.parametrizacoes.limite"
      @update:limite="(limite) => { det.parametrizacoes = { ...det.parametrizacoes, limite }; }"
      @update:rating="(rating) => { det.parametrizacoes.limite.indicativoRating = rating; }"
    />
    <ParametrizacoesTab v-if="tab === 'parametrizacoes'" :data="det.parametrizacoes" @change="(parametrizacoes) => { det.parametrizacoes = parametrizacoes; }" />
    <CedentesTab
      v-if="tab === 'cedentes'"
      :cedentes="det.cedentes"
      @update-cedente="(cedente) => { det.cedentes = det.cedentes.map((c) => (c.id === cedente.id ? cedente : c)); }"
    />
    <HistoricoTab v-if="tab === 'historico'" :eventos="det.historico" />

    <TransferirGerenteModal v-if="transferindo" :grupo-nome="grupo.nome" :gerente-atual="grupo.gerente" @close="transferindo = false" @confirm="transferindo = false" />
    <ConfigurarNotificacoesModal v-if="configurandoNotif" :grupo-nome="grupo.nome" @close="configurandoNotif = false" @confirm="configurandoNotif = false" />
    <HabilitarOperarModal v-if="habilitando" :grupo-nome="grupo.nome" @close="habilitando = false" @confirm="habilitando = false" />
  </div>
</template>

<style scoped>
.grupo-detail-action-item:hover {
  background: var(--surface-sunken);
}
</style>

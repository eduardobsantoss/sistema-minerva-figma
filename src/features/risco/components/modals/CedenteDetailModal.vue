<script setup lang="ts">
import { ref } from 'vue';
import { X, Pencil, FileUp, TrendingUp, MapPin, CalendarDays, Phone, Home, FileText } from 'lucide-vue-next';
import { brl, statusCedenteColor, type Cedente } from '../../data/riscoData';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import { KpiCard, ContatosPanel, EnderecosPanel, DocumentosPanel } from './cedente-detail';
import EditarCadastroCedenteModal from './EditarCadastroCedenteModal.vue';

type Tab = 'contatos' | 'enderecos' | 'documentos';

const TABS: { key: Tab; label: string; icon: typeof Phone }[] = [
  { key: 'contatos', label: 'Contatos', icon: Phone },
  { key: 'enderecos', label: 'Endereços', icon: Home },
  { key: 'documentos', label: 'Documentos', icon: FileText },
];

const props = defineProps<{ cedente: Cedente }>();
const emit = defineEmits<{ close: []; update: [cedente: Cedente] }>();

const tab = ref<Tab>('contatos');
const editando = ref(false);
const cor = statusCedenteColor(props.cedente.status);

function handleUpdate(updated: Cedente) {
  emit('update', updated);
  editando.value = false;
}
</script>

<template>
  <div
    style="
      position: fixed; inset: 0;
      background: rgba(8,60,74,0.55); backdrop-filter: blur(8px);
      z-index: 400; display: flex; align-items: center; justify-content: center;
      padding: 32px; animation: fadeIn 0.2s ease-out;
    "
  >
    <div
      class="flex flex-col"
      style="
        background: var(--surface-card); border-radius: var(--radius-xl);
        width: 100%; max-width: 1000px; max-height: 92vh;
        overflow: hidden; box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 20px 28px; border-bottom: 1px solid var(--border-default); flex-shrink: 0; gap: 16px">
        <div style="min-width: 0">
          <div class="flex items-center" style="gap: 10px; flex-wrap: wrap">
            <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">
              {{ cedente.nome }}
            </h2>
            <span class="flex items-center" :style="{ gap: '6px', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '4px 10px', borderRadius: '9999px', background: `color-mix(in srgb, ${cor} 14%, transparent)`, color: cor, flexShrink: 0 }">
              <span :style="{ width: '6px', height: '6px', borderRadius: '9999px', background: cor }" />
              {{ cedente.status.toUpperCase() }}
            </span>
          </div>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px; font-variant-numeric: tabular-nums">
            {{ cedente.documento }}
          </p>
        </div>
        <div class="flex items-center" style="gap: 10px; flex-shrink: 0">
          <button
            class="flex items-center"
            style="gap: 8px; height: 38px; padding: 0 16px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); background: var(--surface-card); cursor: pointer; color: var(--text-strong); font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em; white-space: nowrap"
            @click="editando = true"
          >
            <Pencil :size="13" /> EDITAR CADASTRO
          </button>
          <button
            aria-label="Fechar"
            class="flex items-center justify-center"
            style="width: 36px; height: 36px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-card); cursor: pointer; color: var(--text-muted); flex-shrink: 0"
            @click="emit('close')"
          >
            <X :size="16" />
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="flex flex-col" style="padding: 24px; gap: 20px; overflow: auto">
        <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 14px">
          <KpiCard :icon="FileUp" label="Qtd. de títulos em aberto" :value="String(cedente.qtdTitulosAberto)" />
          <KpiCard :icon="TrendingUp" label="Risco tomado" :value="brl(cedente.riscoTomado)" />
          <KpiCard :icon="MapPin" label="Cidade - UF" :value="`${cedente.cidade} - ${cedente.uf}`" />
          <KpiCard :icon="CalendarDays" label="Data de abertura" :value="cedente.dataAbertura" />
        </div>

        <SegmentedToggle
          :model-value="tab"
          :options="TABS"
          variant="brand"
          style="width: fit-content"
          @update:model-value="tab = $event as Tab"
        />

        <ContatosPanel v-if="tab === 'contatos'" :cedente="cedente" @update="emit('update', $event)" />
        <EnderecosPanel v-if="tab === 'enderecos'" :cedente="cedente" @update="emit('update', $event)" />
        <DocumentosPanel v-if="tab === 'documentos'" :cedente="cedente" @update="emit('update', $event)" />
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end" style="gap: 12px; padding: 14px 28px; border-top: 1px solid var(--border-default); background: var(--surface-card); flex-shrink: 0">
        <button
          style="height: 40px; padding: 0 20px; background: var(--surface-card); color: var(--text-strong); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>

  <EditarCadastroCedenteModal
    v-if="editando"
    :cedente="cedente"
    @close="editando = false"
    @update="handleUpdate"
  />
</template>

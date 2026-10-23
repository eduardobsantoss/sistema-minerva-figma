<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowLeft, Pencil, FileUp, TrendingUp, MapPin, CalendarDays, Phone, Home, FileText } from 'lucide-vue-next';
import { brl, statusCedenteColor, type Cedente } from '../../data/riscoData';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import { CopyButton } from '../../screens/detail-tabs/shared';
import { KpiCard, ContatosPanel, EnderecosPanel, DocumentosPanel } from './cedente-detail';
import EditarCadastroCedenteModal from './EditarCadastroCedenteModal.vue';

type Tab = 'contatos' | 'enderecos' | 'documentos';

const TABS: { key: Tab; label: string; icon: typeof Phone }[] = [
  { key: 'contatos', label: 'Contatos', icon: Phone },
  { key: 'enderecos', label: 'Endereços', icon: Home },
  { key: 'documentos', label: 'Documentos', icon: FileText },
];

const props = withDefaults(
  defineProps<{
    cedente: Cedente;
    /** Renderiza como página de detalhe (padrão dos módulos) em vez de overlay. */
    asPage?: boolean;
    pageLabel?: string;
  }>(),
  { asPage: false, pageLabel: '' },
);
const emit = defineEmits<{ close: []; update: [cedente: Cedente] }>();

const tab = ref<Tab>('contatos');
const editando = ref(false);
const cor = computed(() => statusCedenteColor(props.cedente.status));
const eyebrow = computed(() =>
  props.pageLabel ? `${props.pageLabel} · Cedente` : 'Cedente',
);

function handleUpdate(updated: Cedente) {
  emit('update', updated);
  editando.value = false;
}
</script>

<template>
  <!-- Página de detalhe -->
  <div v-if="asPage" class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="emit('close')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          {{ eyebrow }}
        </div>
        <h2 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2; gap: 10px; flex-wrap: wrap">
          {{ cedente.nome }}
          <span class="flex items-center" :style="{ gap: '6px', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '5px 11px', borderRadius: '9999px', background: `color-mix(in srgb, ${cor} 14%, transparent)`, color: cor }">
            <span :style="{ width: '7px', height: '7px', borderRadius: '9999px', background: cor }" />
            {{ cedente.status.toUpperCase() }}
          </span>
        </h2>
        <p class="flex items-center" style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px; gap: 6px">
          <span style="font-variant-numeric: tabular-nums">{{ cedente.documento }}</span>
          <CopyButton :value="cedente.documento" />
        </p>
      </div>
      <AdminButton variant="secondary" :icon="Pencil" @click="editando = true">Editar cadastro</AdminButton>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px">
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
    <EnderecosPanel v-else-if="tab === 'enderecos'" :cedente="cedente" @update="emit('update', $event)" />
    <DocumentosPanel v-else :cedente="cedente" @update="emit('update', $event)" />
  </div>

  <!-- Overlay (Risco e demais usos) -->
  <AdminModal v-else size="lg" :title="cedente.nome" footer-align="end" @close="emit('close')">
    <template #header>
      <div class="flex items-start justify-between" style="flex: 1; min-width: 0; gap: 16px">
        <div style="min-width: 0">
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 6px">
            {{ eyebrow }}
          </div>
          <div class="flex items-center" style="gap: 10px; flex-wrap: wrap">
            <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
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
        <AdminButton variant="secondary" :icon="Pencil" @click="editando = true">Editar cadastro</AdminButton>
      </div>
    </template>

    <div class="flex flex-col" style="gap: 20px">
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

    <template #footer>
      <AdminButton variant="secondary" @click="emit('close')">Fechar</AdminButton>
    </template>
  </AdminModal>

  <EditarCadastroCedenteModal
    v-if="editando"
    :cedente="cedente"
    @close="editando = false"
    @update="handleUpdate"
  />
</template>

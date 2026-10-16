<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { Filter, X } from 'lucide-vue-next';
import AdminDateField from '@/components/ui/AdminDateField.vue';
import AdminSelect from '@/components/ui/AdminSelect.vue';

export interface SolicitacaoFilters {
  idPedido: string;
  veiculo: string;
  tipoPedido: string;
  dataAbertura: string;
  grupoEmpresarial: string;
  gerenteComercial: string;
  requerente: string;
  usuarioAtendimento: string;
}

const props = defineProps<{
  modelValue: SolicitacaoFilters;
  veiculos: string[];
  tiposPedido: string[];
  grupos: string[];
  gerentes: string[];
  requerentes: string[];
  atendentes: string[];
}>();

const emit = defineEmits<{
  apply: [filters: SolicitacaoFilters];
  clear: [];
}>();

const draft = reactive<SolicitacaoFilters>({ ...props.modelValue });

watch(
  () => props.modelValue,
  (value) => {
    Object.assign(draft, value);
  },
  { deep: true },
);

const hasDraft = computed(() => Object.values(draft).some((value) => value.trim() !== ''));

const labelStyle = {
  fontSize: '10px',
  fontWeight: 'var(--weight-bold)',
  letterSpacing: '0.10em',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  marginBottom: '6px',
} as const;

const inputStyle = {
  width: '100%',
  height: '38px',
  padding: '0 12px',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-lg)',
  outline: 'none',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-strong)',
} as const;

function handleApply() {
  emit('apply', { ...draft });
}

function handleClear() {
  emit('clear');
}
</script>

<template>
  <div class="flex items-center justify-between" style="margin-bottom: 16px">
    <span style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">
      Filtros adicionais
    </span>
    <button
      v-if="hasDraft"
      class="flex items-center"
      style="gap: 4px; background: none; border: none; cursor: pointer; font-size: var(--text-xs); color: var(--text-muted); font-weight: var(--weight-semibold)"
      @click="handleClear"
    >
      <X :size="12" /> Limpar filtros
    </button>
  </div>

  <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px">
    <div style="grid-column: 1 / -1">
      <div :style="labelStyle">ID da Solicitação</div>
      <input v-model="draft.idPedido" placeholder="Buscar por ID" :style="inputStyle" />
    </div>

    <div style="grid-column: 1 / -1">
      <div :style="labelStyle">Veículo</div>
      <AdminSelect v-model="draft.veiculo" :options="[{ value: '', label: 'Todos' }, ...veiculos.map((opt) => ({ value: opt, label: opt }))]" />
    </div>

    <div>
      <div :style="labelStyle">Tipo de solicitação</div>
      <AdminSelect v-model="draft.tipoPedido" :options="[{ value: '', label: 'Todos' }, ...tiposPedido.map((opt) => ({ value: opt, label: opt }))]" />
    </div>

    <div>
      <div :style="labelStyle">Data de abertura</div>
      <AdminDateField v-model="draft.dataAbertura" />
    </div>

    <div style="grid-column: 1 / -1">
      <div :style="labelStyle">Grupo Empresarial</div>
      <AdminSelect v-model="draft.grupoEmpresarial" :options="[{ value: '', label: 'Todos' }, ...grupos.map((opt) => ({ value: opt, label: opt }))]" />
    </div>

    <div style="grid-column: 1 / -1">
      <div :style="labelStyle">Gerente Comercial</div>
      <AdminSelect v-model="draft.gerenteComercial" :options="[{ value: '', label: 'Todos' }, ...gerentes.map((opt) => ({ value: opt, label: opt }))]" />
    </div>

    <div>
      <div :style="labelStyle">Requerente da solicitação</div>
      <AdminSelect v-model="draft.requerente" :options="[{ value: '', label: 'Todos' }, ...requerentes.map((opt) => ({ value: opt, label: opt }))]" />
    </div>

    <div>
      <div :style="labelStyle">Usuário de atendimento</div>
      <AdminSelect v-model="draft.usuarioAtendimento" :options="[{ value: '', label: 'Todos' }, ...atendentes.map((opt) => ({ value: opt, label: opt }))]" />
    </div>
  </div>

  <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
    <button
      style="height: 38px; padding: 0 16px; background: none; border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
      @click="handleClear"
    >
      Limpar
    </button>
    <button
      class="flex items-center"
      style="gap: 6px; height: 38px; padding: 0 18px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
      @click="handleApply"
    >
      <Filter :size="13" /> FILTRAR
    </button>
  </div>
</template>

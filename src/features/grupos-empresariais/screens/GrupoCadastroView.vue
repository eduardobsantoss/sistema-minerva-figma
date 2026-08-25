<script setup lang="ts">
import { computed, reactive, ref, watch, type Component } from 'vue';
import { ArrowLeft, Info, Users } from 'lucide-vue-next';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import FormField from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/FormField.vue';
import SelectField from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/SelectField.vue';
import StepGrid from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/StepGrid.vue';
import {
  parseCurrencyInput,
} from '@/features/solicitacao-operacao/utils/currencyMask';
import { brl } from '@/features/risco/data/riscoData';
import type { ParteRelacionada } from '@/features/solicitacao-operacao/data/operacaoData';
import {
  GERENTES_SEED,
  TIPO_CLIENTE_OPTS,
  cloneGrupo,
  type GrupoCadastro,
  type TipoCliente,
} from '../data/gruposCadastroData';
import PartesRelacionadasTab from './PartesRelacionadasTab.vue';

const props = defineProps<{
  grupo: GrupoCadastro;
  mode: 'create' | 'detail';
}>();
const emit = defineEmits<{
  back: [];
  save: [grupo: GrupoCadastro];
  addParte: [];
  openParte: [parte: ParteRelacionada];
  removeParte: [parte: ParteRelacionada];
}>();

type TabKey = 'dados' | 'partes';

const TABS: { key: TabKey; label: string; icon: Component }[] = [
  { key: 'dados', label: 'Dados gerais', icon: Info },
  { key: 'partes', label: 'Partes relacionadas', icon: Users },
];

const tab = ref<TabKey>('dados');
const savedBanner = ref(false);
let bannerTimer: ReturnType<typeof setTimeout> | null = null;

const draft = reactive({
  nome: '',
  documento: '',
  tipoCliente: 'Multicedente' as TipoCliente,
  gerente: '',
  limiteMasked: 'R$ 0,00',
});

const errors = reactive({ nome: '', documento: '' });

function hydrate(g: GrupoCadastro) {
  draft.nome = g.nome;
  draft.documento = g.documento;
  draft.tipoCliente = g.tipoCliente;
  draft.gerente = g.gerente;
  draft.limiteMasked = brl(g.limite);
  errors.nome = '';
  errors.documento = '';
}

hydrate(props.grupo);

watch(
  () => props.grupo.id,
  () => hydrate(props.grupo),
);

const gerenteOpts = GERENTES_SEED.map((g) => g.nome);
const isCreate = computed(() => props.mode === 'create');

function validate(): boolean {
  errors.nome = draft.nome.trim() ? '' : 'Campo obrigatório';
  errors.documento = draft.documento.trim() ? '' : 'Campo obrigatório';
  return !errors.nome && !errors.documento;
}

function buildGrupo(): GrupoCadastro {
  return {
    ...cloneGrupo(props.grupo),
    nome: draft.nome.trim().toUpperCase(),
    documento: draft.documento.trim(),
    tipoCliente: draft.tipoCliente,
    gerente: draft.gerente,
    limite: parseCurrencyInput(draft.limiteMasked),
  };
}

function handleSalvar() {
  if (!validate()) {
    tab.value = 'dados';
    return;
  }
  emit('save', buildGrupo());
  savedBanner.value = true;
  if (bannerTimer) clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => {
    savedBanner.value = false;
  }, 2200);
}

function onAddParte() {
  tab.value = 'partes';
  emit('addParte');
}

function onOpenParte(parte: ParteRelacionada) {
  tab.value = 'partes';
  emit('openParte', parte);
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
          {{ isCreate ? 'Cadastro de Grupos · Novo' : 'Cadastro de Grupos · Detalhes' }}
        </div>
        <h2
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
          "
        >
          {{ isCreate ? 'Novo grupo empresarial' : draft.nome || 'Grupo empresarial' }}
        </h2>
        <p v-if="!isCreate" style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ draft.documento }} · {{ draft.tipoCliente }}
        </p>
      </div>
    </div>

    <SegmentedToggle
      v-if="!isCreate"
      :model-value="tab"
      :options="TABS"
      variant="brand"
      @update:model-value="tab = $event as TabKey"
    />

    <div
      v-if="isCreate || tab === 'dados'"
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        padding: 22px;
      "
    >
      <StepGrid>
        <FormField v-model="draft.nome" label="Nome do grupo" required :span="8" />
        <FormField v-model="draft.documento" label="Documento" required :span="4" />
        <SelectField
          v-model="draft.tipoCliente"
          label="Tipo de cliente"
          :options="[...TIPO_CLIENTE_OPTS]"
          :span="4"
        />
        <SelectField v-model="draft.gerente" label="Gerente" :options="gerenteOpts" :span="4" />
        <FormField v-model="draft.limiteMasked" label="Limite" currency :span="4" />
      </StepGrid>
      <div v-if="errors.nome || errors.documento" style="margin-top: 12px">
        <div
          v-if="errors.nome"
          style="font-size: var(--text-xs); color: var(--danger-base, #c53030)"
        >
          Nome: {{ errors.nome }}
        </div>
        <div
          v-if="errors.documento"
          style="font-size: var(--text-xs); color: var(--danger-base, #c53030); margin-top: 4px"
        >
          Documento: {{ errors.documento }}
        </div>
      </div>
    </div>

    <PartesRelacionadasTab
      v-else
      :partes="grupo.partes"
      @add="onAddParte"
      @open="onOpenParte"
      @remove="emit('removeParte', $event)"
    />

    <div v-if="isCreate || tab === 'dados'" class="flex items-center justify-end" style="gap: 12px">
      <span
        v-if="savedBanner"
        style="font-size: var(--text-sm); color: var(--success-base); font-weight: var(--weight-semibold)"
      >
        {{ isCreate ? 'Grupo cadastrado com sucesso.' : 'Grupo atualizado com sucesso.' }}
      </span>
      <button
        type="button"
        class="flex items-center"
        style="
          height: 44px;
          padding: 0 22px;
          background: var(--action-primary-bg);
          color: var(--action-primary-text);
          border: none;
          border-radius: var(--radius-lg);
          cursor: pointer;
          font-weight: var(--weight-bold);
          font-size: var(--text-sm);
          flex-shrink: 0;
        "
        @click="handleSalvar"
      >
        {{ isCreate ? 'Salvar' : 'Atualizar' }}
      </button>
    </div>
  </div>
</template>

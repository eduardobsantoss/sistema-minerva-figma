<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';

import {
  TIPO_GARANTIA_OPERACAO_OPTS,
  emptyGarantiaAnexos,
  garantiaAnexosParaTipo,
  sortGarantiaAnexos,
  formatValorGarantia,
  type GarantiaOperacao,
  type GarantiaAnexo,
} from '../../data/operacaoData';
import { parseCurrencyInput } from '../../utils/currencyMask';
import { FormField, SelectField, StepGrid } from './adicionar-contrato';
import DocGroup from '../novo-pedido/DocGroup.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const props = defineProps<{
  garantia?: GarantiaOperacao | null;
}>();
const emit = defineEmits<{
  close: [];
  save: [g: GarantiaOperacao];
}>();

const isEdit = computed(() => !!props.garantia?.id);
const showAnexos = ref(!!props.garantia);

const form = reactive({
  tipo: '',
  nome: '',
  valor: 'R$ 0,00',
});

const anexos = ref<GarantiaAnexo[]>(emptyGarantiaAnexos());

function hydrate(g: GarantiaOperacao | null | undefined) {
  if (!g) {
    form.tipo = '';
    form.nome = '';
    form.valor = 'R$ 0,00';
    anexos.value = emptyGarantiaAnexos();
    showAnexos.value = false;
    return;
  }
  form.tipo = g.tipo;
  form.nome = g.nome;
  form.valor = formatValorGarantia(g.valor);
  anexos.value = garantiaAnexosParaTipo(
    g.tipo,
    g.anexos.map((a) => ({ ...a })),
  );
  showAnexos.value = true;
}

watch(() => props.garantia, (g) => hydrate(g), { immediate: true });

watch(
  () => form.tipo,
  (tipo) => {
    anexos.value = garantiaAnexosParaTipo(tipo, anexos.value);
  },
);

const docsForGroup = computed(() =>
  anexos.value.map((a) => ({ id: a.id, nome: a.nome, obrigatorio: a.obrigatorio })),
);

const docFiles = computed(() =>
  Object.fromEntries(anexos.value.map((a) => [a.id, a.enviado])),
);

const dadosOk = computed(
  () => form.tipo.trim() !== '' && form.nome.trim() !== '' && parseCurrencyInput(form.valor) > 0,
);

const anexosObrigatoriosOk = computed(() =>
  anexos.value.filter((a) => a.obrigatorio).every((a) => a.enviado),
);

const canSave = computed(() => dadosOk.value && showAnexos.value && anexosObrigatoriosOk.value);

function toggleDoc(id: string) {
  const item = anexos.value.find((a) => a.id === id);
  if (item) item.enviado = !item.enviado;
}

function continuar() {
  if (!dadosOk.value) return;
  showAnexos.value = true;
}

function salvar() {
  if (!canSave.value) return;
  emit('save', {
    id: props.garantia?.id ?? `gar-${Date.now()}`,
    tipo: form.tipo.trim(),
    nome: form.nome.trim(),
    valor: formatValorGarantia(form.valor),
    anexos: sortGarantiaAnexos(anexos.value.map((a) => ({ ...a }))),
  });
}
</script>

<template>
  <AdminModal size="md" eyebrow="Solicitação" :title="`${isEdit ? 'Editar garantia' : 'Cadastrar garantia'}`" subtitle="Dados da garantia e documentos comprobatórios" @close="emit('close')">
    <div>
      <div class="flex flex-col" style="gap: 20px">
        <StepGrid>
          <SelectField
            label="Tipo de garantia"
            :options="TIPO_GARANTIA_OPERACAO_OPTS"
            placeholder="Selecione"
            required
            :span="4"
            v-model="form.tipo"
          />
          <FormField
            label="Nome da garantia"
            placeholder="Ex: AF Estoque Safra 2026"
            required
            :span="5"
            v-model="form.nome"
          />
          <FormField
            label="Valor da garantia"
            placeholder="R$ 0,00"
            required
            currency
            :span="3"
            v-model="form.valor"
          />
        </StepGrid>

        <div v-if="!showAnexos" class="flex justify-end">
          <AdminButton type="button" :disabled="!dadosOk" @click="continuar">Continuar</AdminButton>
        </div>

        <DocGroup
          v-if="showAnexos"
          title="Documentos da garantia"
          :docs="docsForGroup"
          :doc-files="docFiles"
          @toggle-doc="toggleDoc"
        />
      </div>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" :disabled="!canSave" @click="salvar" type="button">{{ isEdit ? 'Salvar' : 'Adicionar' }}</AdminButton>
    </template>
  </AdminModal>
</template>

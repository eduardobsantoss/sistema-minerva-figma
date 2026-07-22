<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { X } from 'lucide-vue-next';
import {
  TIPO_GARANTIA_OPERACAO_OPTS,
  emptyGarantiaAnexos,
  sortGarantiaAnexos,
  formatValorGarantia,
  type GarantiaOperacao,
  type GarantiaAnexo,
} from '../../data/operacaoData';
import { parseCurrencyInput } from '../../utils/currencyMask';
import { FormField, SelectField, StepGrid } from './adicionar-contrato';
import DocGroup from '../novo-pedido/DocGroup.vue';

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
  anexos.value = g.anexos.length
    ? sortGarantiaAnexos(g.anexos.map((a) => ({ ...a })))
    : emptyGarantiaAnexos();
  showAnexos.value = true;
}

watch(() => props.garantia, (g) => hydrate(g), { immediate: true });

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
  <div
    style="
      position: fixed;
      inset: 0;
      z-index: 400;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    "
    @click.self="emit('close')"
  >
    <div
      style="
        width: 100%;
        max-width: 720px;
        max-height: calc(100vh - 64px);
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ isEdit ? 'Editar garantia' : 'Cadastrar garantia' }}
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Dados da garantia e documentos comprobatórios
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted)"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 24px 28px">
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
            <button
              type="button"
              :disabled="!dadosOk"
              :style="{
                height: '42px',
                padding: '0 20px',
                background: dadosOk ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
                color: dadosOk ? '#fff' : 'var(--text-disabled)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                cursor: dadosOk ? 'pointer' : 'not-allowed',
                fontWeight: 'var(--weight-bold)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.08em',
              }"
              @click="continuar"
            >
              CONTINUAR
            </button>
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

      <div class="flex items-center justify-between" style="padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          type="button"
          :disabled="!canSave"
          :style="{
            height: '44px',
            padding: '0 24px',
            background: canSave ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canSave ? '#fff' : 'var(--text-disabled)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canSave ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
          }"
          @click="salvar"
        >
          {{ isEdit ? 'SALVAR' : 'ADICIONAR' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus } from 'lucide-vue-next';
import type { Sacado, SacadoEndereco } from '../../data/fidcsData';
import FormField from '../../components/create-class/FormField.vue';
import StepGrid from '../../components/create-class/StepGrid.vue';

const props = defineProps<{ sacado: Sacado }>();
const emit = defineEmits<{ update: [Sacado] }>();

const showForm = ref(false);
const cep = ref('');
const localidade = ref('');
const numero = ref('');
const bairro = ref('');
const cidade = ref('');
const uf = ref('');
const pais = ref('Brasil');

function addEndereco() {
  if (!localidade.value.trim() || !cidade.value.trim()) return;
  const endereco: SacadoEndereco = {
    id: `e-${Date.now()}`,
    cep: cep.value,
    localidade: localidade.value,
    numero: numero.value,
    bairro: bairro.value,
    cidade: cidade.value,
    uf: uf.value,
    pais: pais.value,
  };
  emit('update', { ...props.sacado, enderecos: [...props.sacado.enderecos, endereco] });
  cep.value = '';
  localidade.value = '';
  numero.value = '';
  bairro.value = '';
  cidade.value = '';
  uf.value = '';
  showForm.value = false;
}

function removeEndereco(id: string) {
  emit('update', { ...props.sacado, enderecos: props.sacado.enderecos.filter((e) => e.id !== id) });
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div class="flex items-center justify-between">
      <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
        {{ sacado.enderecos.length }} endereço(s)
      </div>
      <button
        type="button"
        class="flex items-center"
        style="gap: 6px; padding: 8px 14px; background: var(--gci-base); color: #fff; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--text-xs); font-weight: var(--weight-bold)"
        @click="showForm = !showForm"
      >
        <Plus :size="14" /> Adicionar
      </button>
    </div>

    <div
      v-if="showForm"
      style="padding: 16px; background: var(--surface-sunken); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
    >
      <StepGrid>
        <FormField v-model="cep" label="CEP" :span="3" />
        <FormField v-model="localidade" label="Logradouro" :span="6" />
        <FormField v-model="numero" label="Número" :span="3" />
        <FormField v-model="bairro" label="Bairro" :span="4" />
        <FormField v-model="cidade" label="Cidade" :span="4" />
        <FormField v-model="uf" label="UF" :span="2" />
        <FormField v-model="pais" label="País" :span="2" />
      </StepGrid>
      <button
        type="button"
        style="margin-top: 12px; padding: 10px 18px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-md); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
        @click="addEndereco"
      >
        Salvar endereço
      </button>
    </div>

    <div v-if="!sacado.enderecos.length" style="padding: 32px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
      Nenhum endereço cadastrado.
    </div>
    <div
      v-for="e in sacado.enderecos"
      :key="e.id"
      class="flex items-center justify-between"
      style="padding: 14px 16px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg)"
    >
      <div style="font-size: var(--text-sm); color: var(--text-strong)">
        {{ e.localidade }}, {{ e.numero }} — {{ e.bairro }}, {{ e.cidade }}/{{ e.uf }}
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">CEP {{ e.cep }} · {{ e.pais }}</div>
      </div>
      <button
        type="button"
        style="background: none; border: none; cursor: pointer; color: var(--danger-base); font-size: var(--text-xs); font-weight: var(--weight-semibold)"
        @click="removeEndereco(e.id)"
      >
        Remover
      </button>
    </div>
  </div>
</template>

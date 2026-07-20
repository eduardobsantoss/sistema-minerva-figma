<script setup lang="ts">
import { ref } from 'vue';
import { Plus } from 'lucide-vue-next';
import type { Sacado, SacadoContato } from '../../data/fidcsData';
import FormField from '../../components/create-class/FormField.vue';
import StepGrid from '../../components/create-class/StepGrid.vue';

const props = defineProps<{ sacado: Sacado }>();
const emit = defineEmits<{ update: [Sacado] }>();

const showForm = ref(false);
const nome = ref('');
const email = ref('');
const ddi = ref('+55');
const telefone = ref('');

function addContato() {
  if (!nome.value.trim() || !email.value.trim()) return;
  const contato: SacadoContato = {
    id: `c-${Date.now()}`,
    nome: nome.value.trim(),
    email: email.value.trim(),
    ddi: ddi.value,
    telefone: telefone.value,
    principal: props.sacado.contatos.length === 0,
  };
  emit('update', { ...props.sacado, contatos: [...props.sacado.contatos, contato] });
  nome.value = '';
  email.value = '';
  telefone.value = '';
  showForm.value = false;
}

function removeContato(id: string) {
  emit('update', { ...props.sacado, contatos: props.sacado.contatos.filter((c) => c.id !== id) });
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div class="flex items-center justify-between">
      <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
        {{ sacado.contatos.length }} contato(s)
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
        <FormField v-model="nome" label="Nome" :span="5" />
        <FormField v-model="email" label="E-mail" type="email" :span="7" />
        <FormField v-model="ddi" label="DDI" :span="3" />
        <FormField v-model="telefone" label="Telefone" :span="9" />
      </StepGrid>
      <button
        type="button"
        style="margin-top: 12px; padding: 10px 18px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-md); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
        @click="addContato"
      >
        Salvar contato
      </button>
    </div>

    <div v-if="!sacado.contatos.length" style="padding: 32px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
      Nenhum contato cadastrado.
    </div>
    <div
      v-for="c in sacado.contatos"
      :key="c.id"
      class="flex items-center justify-between"
      style="padding: 14px 16px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg)"
    >
      <div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">
          {{ c.nome }}
          <span v-if="c.principal" style="font-size: 9px; margin-left: 8px; padding: 2px 6px; background: var(--gci-light); color: var(--gci-base); border-radius: var(--radius-sm)">Principal</span>
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">{{ c.email }} · {{ c.ddi }} {{ c.telefone }}</div>
      </div>
      <button
        type="button"
        style="background: none; border: none; cursor: pointer; color: var(--danger-base); font-size: var(--text-xs); font-weight: var(--weight-semibold)"
        @click="removeContato(c.id)"
      >
        Remover
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Phone, Trash2 } from 'lucide-vue-next';
import type { Cedente, ContatoCedente } from '../../../data/riscoData';
import { DDI_OPTS } from '../../../data/riscoData';
import { FormField, SelectField, EmptyState, AddButton } from '../../../screens/detail-tabs/shared';

const props = defineProps<{ cedente: Cedente }>();
const emit = defineEmits<{ update: [cedente: Cedente] }>();

const nome = ref('');
const email = ref('');
const ddi = ref('+55');
const telefone = ref('');

function add() {
  if (!nome.value.trim() || !email.value.trim()) return;
  const novo: ContatoCedente = { id: `cont-${Date.now()}`, nome: nome.value, email: email.value, ddi: ddi.value, telefone: telefone.value };
  emit('update', { ...props.cedente, contatos: [...props.cedente.contatos, novo] });
  nome.value = '';
  email.value = '';
  telefone.value = '';
}

function remove(id: string) {
  emit('update', { ...props.cedente, contatos: props.cedente.contatos.filter((c) => c.id !== id) });
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 14px">
      <FormField label="Nome" placeholder="—" v-model="nome" />
      <FormField label="E-mail" placeholder="contato@email.com" v-model="email" />
    </div>
    <div class="grid items-end" style="grid-template-columns: 140px 1fr auto; gap: 14px">
      <SelectField label="DDI" :options="DDI_OPTS" :value="ddi" @change="ddi = ($event.target as HTMLSelectElement).value" />
      <FormField label="Telefone" placeholder="(00) 00000-0000" v-model="telefone" />
      <AddButton @click="add" />
    </div>

    <EmptyState v-if="cedente.contatos.length === 0" :icon="Phone" title="Nenhum contato cadastrado" hint="Use o formulário acima para cadastrar um contato deste cedente." />
    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <div class="grid items-center" style="grid-template-columns: 1.2fr 1.6fr 1.2fr 40px; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
        <div>Nome</div><div>E-mail</div><div>Telefone</div><div />
      </div>
      <div v-for="c in cedente.contatos" :key="c.id" class="grid items-center" style="grid-template-columns: 1.2fr 1.6fr 1.2fr 40px; padding: 10px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ c.nome }}</div>
        <div style="color: var(--text-muted)">{{ c.email }}</div>
        <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ c.ddi }} {{ c.telefone }}</div>
        <div class="flex justify-end">
          <button aria-label="Remover" class="flex items-center justify-center" style="width: 26px; height: 26px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--action-danger-text-only)" @click="remove(c.id)">
            <Trash2 :size="13" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

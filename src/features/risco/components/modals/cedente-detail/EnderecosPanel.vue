<script setup lang="ts">
import { ref } from 'vue';
import { Home, Trash2 } from 'lucide-vue-next';
import type { Cedente, EnderecoCedente } from '../../../data/riscoData';
import { UF_OPTIONS, PAIS_OPTS } from '../../../data/riscoData';
import { FormField, SelectField, EmptyState, AddButton } from '../../../screens/detail-tabs/shared';

const props = defineProps<{ cedente: Cedente }>();
const emit = defineEmits<{ update: [cedente: Cedente] }>();

const cep = ref('');
const localidade = ref('');
const numero = ref('');
const bairro = ref('');
const infoAdicionais = ref('');
const cidade = ref('');
const uf = ref('');
const pais = ref('Brasil');

function add() {
  if (!cep.value.trim() || !cidade.value.trim()) return;
  const novo: EnderecoCedente = {
    id: `end-${Date.now()}`, cep: cep.value, localidade: localidade.value, numero: numero.value,
    bairro: bairro.value, infoAdicionais: infoAdicionais.value, cidade: cidade.value, uf: uf.value, pais: pais.value,
  };
  emit('update', { ...props.cedente, enderecos: [...props.cedente.enderecos, novo] });
  cep.value = ''; localidade.value = ''; numero.value = ''; bairro.value = ''; infoAdicionais.value = ''; cidade.value = ''; uf.value = '';
}

function remove(id: string) {
  emit('update', { ...props.cedente, enderecos: props.cedente.enderecos.filter((e) => e.id !== id) });
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 14px">
      <FormField label="CEP" placeholder="00000-000" v-model="cep" />
      <FormField label="Localidade" placeholder="—" v-model="localidade" />
    </div>
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 14px">
      <FormField label="Número" placeholder="—" v-model="numero" />
      <FormField label="Bairro" placeholder="—" v-model="bairro" />
    </div>
    <FormField label="Informações adicionais" placeholder="—" v-model="infoAdicionais" />
    <div class="grid items-end" style="grid-template-columns: 1fr 140px 160px auto; gap: 14px">
      <FormField label="Cidade" placeholder="—" v-model="cidade" />
      <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :value="uf" @change="uf = ($event.target as HTMLSelectElement).value" />
      <SelectField label="País" :options="PAIS_OPTS" :value="pais" @change="pais = ($event.target as HTMLSelectElement).value" />
      <AddButton @click="add" />
    </div>

    <EmptyState v-if="cedente.enderecos.length === 0" :icon="Home" title="Nenhum endereço cadastrado" hint="Use o formulário acima para cadastrar um endereço deste cedente." />
    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: auto">
      <div class="grid items-center" style="grid-template-columns: 1fr 1.4fr 0.7fr 1fr 1fr 0.6fr 1fr 40px; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase; white-space: nowrap">
        <div>CEP</div><div>Localidade</div><div>Número</div><div>Bairro</div><div>Cidade</div><div>UF</div><div>País</div><div />
      </div>
      <div v-for="e in cedente.enderecos" :key="e.id" class="grid items-center" style="grid-template-columns: 1fr 1.4fr 0.7fr 1fr 1fr 0.6fr 1fr 40px; padding: 10px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); white-space: nowrap">
        <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ e.cep }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ e.localidade || '—' }}</div>
        <div style="color: var(--text-muted)">{{ e.numero || '—' }}</div>
        <div style="color: var(--text-muted)">{{ e.bairro || '—' }}</div>
        <div style="color: var(--text-default)">{{ e.cidade }}</div>
        <div style="color: var(--text-default)">{{ e.uf }}</div>
        <div style="color: var(--text-default)">{{ e.pais }}</div>
        <div class="flex justify-end">
          <button aria-label="Remover" class="flex items-center justify-center" style="width: 26px; height: 26px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--action-danger-text-only)" @click="remove(e.id)">
            <Trash2 :size="13" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

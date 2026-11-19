<script setup lang="ts">
import { computed, ref } from 'vue';
import AdminModal from '@/components/ui/AdminModal.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminDateField from '@/components/ui/AdminDateField.vue';
import AdminFormField from '@/components/ui/AdminFormField.vue';
import AdminTextField from '@/components/ui/AdminTextField.vue';
import { brl, moneyToInput, parseMoney, todayIso, valorAtual, type EstoqueImovel } from '../data/estoqueData';

const props = defineProps<{ imovel: EstoqueImovel }>();
const emit = defineEmits<{ close: []; save: [payload: { data: string; valorAvaliado: number; observacao: string }] }>();

const data = ref(todayIso());
const valor = ref(moneyToInput(valorAtual(props.imovel)));
const observacao = ref('');
const tentou = ref(false);

const erroValor = computed(() => (parseMoney(valor.value) > 0 ? '' : 'Informe o valor avaliado.'));
const erroData = computed(() => (data.value ? '' : 'Informe a data do monitoramento.'));

function salvar() {
  tentou.value = true;
  if (erroValor.value || erroData.value) return;
  emit('save', { data: data.value, valorAvaliado: parseMoney(valor.value), observacao: observacao.value.trim() });
}
</script>

<template>
  <AdminModal size="md" eyebrow="Estoque · Monitoramento" title="Registrar monitoramento" :subtitle="imovel.nome" @close="emit('close')">
    <div class="grid" style="grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px">
      <AdminFormField label="Data do monitoramento" :error="tentou ? erroData : ''">
        <AdminDateField v-model="data" :max="todayIso()" />
      </AdminFormField>
      <AdminFormField label="Valor avaliado (R$)" :error="tentou ? erroValor : ''" :hint="`Valor atual: ${brl(valorAtual(imovel))}`">
        <AdminTextField v-model="valor" inputmode="decimal" placeholder="0,00" :invalid="tentou && !!erroValor" />
      </AdminFormField>
      <AdminFormField label="Observação" style="grid-column: span 2">
        <AdminTextField v-model="observacao" multiline :rows="4" placeholder="Estado do imóvel, valorização, ocupação..." />
      </AdminFormField>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" type="button" @click="emit('close')">Cancelar</AdminButton>
      <AdminButton variant="agro" size="large" type="button" @click="salvar">Registrar</AdminButton>
    </template>
  </AdminModal>
</template>

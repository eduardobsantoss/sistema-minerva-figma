<script setup lang="ts">
import { reactive } from 'vue';

import { SelectField, ToggleRow, StepGrid } from './adicionar-contrato';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const emit = defineEmits<{ close: []; confirm: [] }>();

const CESSAO_OPTS = [
  'AGROCOLMEIA_OP.2047_16072026',
  'CERES_OP.1388_09072026',
  'SEMEAGRO_OP.1401_01062026',
];
const CNAB_OPTS = ['CNAB 240', 'CNAB 400', 'CNAB 444'];
const ADMIN_OPTS = ['Singulare', 'Oliveira Trust', 'Vórtx'];
const OCORRENCIA_OPTS = [
  'Remessa de títulos',
  'Baixa de títulos',
  'Alteração de vencimento',
  'Protesto',
];

const form = reactive({
  cessao: '',
  cnab: '',
  administradora: '',
  semCoobrigacao: false,
  identificacaoOcorrencia: '',
});

function salvar() {
  emit('confirm');
  emit('close');
}
</script>

<template>
  <AdminModal size="sm" eyebrow="Solicitação" title="Gerar CNAB" subtitle="Configuração do arquivo de remessa" @close="emit('close')">
    <div>
      <StepGrid>
        <SelectField label="Cessão" :options="CESSAO_OPTS" placeholder="Selecione" :span="12" v-model="form.cessao" />
        <SelectField label="CNAB" :options="CNAB_OPTS" placeholder="Selecione" :span="6" v-model="form.cnab" />
        <SelectField label="Administradora" :options="ADMIN_OPTS" placeholder="Selecione" :span="6" v-model="form.administradora" />
        <div style="grid-column: span 12">
          <ToggleRow
            label="Sem coobrigação"
            :on="form.semCoobrigacao"
            compact
            @toggle="form.semCoobrigacao = !form.semCoobrigacao"
          />
        </div>
        <SelectField
          label="Identificação de ocorrência"
          :options="OCORRENCIA_OPTS"
          placeholder="Selecione"
          :span="12"
          v-model="form.identificacaoOcorrencia"
        />
      </StepGrid>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" @click="salvar" type="button">Gerar</AdminButton>
    </template>
  </AdminModal>
</template>

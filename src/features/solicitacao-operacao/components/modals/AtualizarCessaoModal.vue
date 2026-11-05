<script setup lang="ts">
import { reactive } from 'vue';

import {
  emptyCessaoForm,
  CESSAO_PARAM_OPTS,
  CESSAO_TIPO_CALCULO_OPTS,
  CESSAO_FREQUENCIA_OPTS,
  CESSAO_OPERADOR_OPTS,
  CESSAO_INDICADOR_OPTS,
  CESSAO_CAPITALIZACAO_OPTS,
  CESSAO_BASE_DIAS_OPTS,
  CESSAO_INICIO_JUROS_OPTS,
  CESSAO_DATA_ACCRUAL_OPTS,
} from '../../data/minutaData';
import { FormField, SelectField, ToggleRow, StepGrid } from './adicionar-contrato';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const emit = defineEmits<{ close: []; confirm: [] }>();

const form = reactive(emptyCessaoForm());
if (!form.dataDesembolso) {
  const d = new Date();
  form.dataDesembolso = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function salvar() {
  emit('confirm');
  emit('close');
}
</script>

<template>
  <AdminModal size="lg" eyebrow="Solicitação" title="Atualizar Cessão" subtitle="Parâmetros financeiros e de cálculo da cessão" @close="emit('close')">
    <div>
      <div class="flex flex-col" style="gap: 16px">
        <StepGrid>
          <FormField label="Taxa (%)" placeholder="0" :span="4" v-model="form.taxaCessao" />
          <FormField label="Data de cessão" placeholder="dd/mm/aaaa" :span="4" v-model="form.dataDesembolso" />
          <FormField label="Desconto adicional (%)" placeholder="0" :span="4" v-model="form.descontoAdicional" />
          <FormField label="% garantia de recebíveis" placeholder="0" :span="6" v-model="form.pctGarantiaRecebiveis" />
          <FormField label="% de outras garantias" placeholder="0" :span="6" v-model="form.pctGarantiaOutras" />
          <div style="grid-column: span 12">
            <ToggleRow
              label="Usar certificador de e-mail"
              :on="form.usarCertificadorEmail"
              compact
              @toggle="form.usarCertificadorEmail = !form.usarCertificadorEmail"
            />
          </div>
        </StepGrid>

        <StepGrid>
          <SelectField
            label="Parametrização de cálculo"
            :options="CESSAO_PARAM_OPTS"
            placeholder="Selecione"
            :span="12"
            v-model="form.parametrizacaoCalculo"
          />
          <SelectField
            label="Tipo de cálculo"
            :options="CESSAO_TIPO_CALCULO_OPTS"
            placeholder="Selecione"
            :span="4"
            v-model="form.tipoCalculoCessao"
          />
          <SelectField
            label="Indicador da taxa"
            :options="CESSAO_INDICADOR_OPTS"
            placeholder="Selecione"
            :span="4"
            v-model="form.indicadorTaxa"
          />
          <SelectField
            label="Operador"
            :options="CESSAO_OPERADOR_OPTS"
            placeholder="Selecione"
            :span="4"
            v-model="form.operador"
          />
          <SelectField
            label="Frequência da taxa"
            :options="CESSAO_FREQUENCIA_OPTS"
            placeholder="Selecione"
            :span="4"
            v-model="form.frequenciaTaxa"
          />
          <SelectField
            label="Base de dias para cálculo"
            :options="CESSAO_BASE_DIAS_OPTS"
            placeholder="Selecione"
            :span="4"
            v-model="form.baseDias"
          />
          <SelectField
            label="Início da contagem de juros"
            :options="CESSAO_INICIO_JUROS_OPTS"
            placeholder="Selecione"
            :span="4"
            v-model="form.inicioContagemJuros"
          />
          <SelectField
            label="Data usada para cálculo do Accrual"
            :options="CESSAO_DATA_ACCRUAL_OPTS"
            placeholder="Selecione"
            :span="6"
            v-model="form.dataAccrual"
          />
          <SelectField
            label="Tipo de capitalização"
            :options="CESSAO_CAPITALIZACAO_OPTS"
            placeholder="Selecione"
            :span="6"
            v-model="form.tipoCapitalizacao"
          />
          <div style="grid-column: span 12">
            <ToggleRow
              label="Usar cálculo de mercado"
              :on="form.usarCalculoMercado"
              compact
              @toggle="form.usarCalculoMercado = !form.usarCalculoMercado"
            />
          </div>
          <div style="grid-column: span 12">
            <ToggleRow
              label="Utilizar última taxa disponível (final de semana utiliza taxa de sexta-feira)"
              :on="form.usarUltimaTaxaDisponivel"
              compact
              @toggle="form.usarUltimaTaxaDisponivel = !form.usarUltimaTaxaDisponivel"
            />
          </div>
          <div style="grid-column: span 6">
            <ToggleRow
              label="Com coobrigação"
              :on="form.comCoobrigacao"
              compact
              @toggle="form.comCoobrigacao = !form.comCoobrigacao"
            />
          </div>
          <div style="grid-column: span 6">
            <ToggleRow
              label="Possui obrigação de recompra"
              :on="form.obrigacaoRecompra"
              compact
              @toggle="form.obrigacaoRecompra = !form.obrigacaoRecompra"
            />
          </div>
        </StepGrid>
      </div>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" @click="salvar" type="button">Atualizar</AdminButton>
    </template>
  </AdminModal>
</template>

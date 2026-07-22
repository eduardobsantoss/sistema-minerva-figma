<script setup lang="ts">
import { reactive } from 'vue';
import { X } from 'lucide-vue-next';
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
        max-width: 900px;
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
            Atualizar Cessão
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Parâmetros financeiros e de cálculo da cessão
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
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
          @click="salvar"
        >
          ATUALIZAR
        </button>
      </div>
    </div>
  </div>
</template>

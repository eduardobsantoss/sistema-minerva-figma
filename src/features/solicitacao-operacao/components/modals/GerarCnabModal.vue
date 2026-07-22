<script setup lang="ts">
import { reactive } from 'vue';
import { X } from 'lucide-vue-next';
import { SelectField, ToggleRow, StepGrid } from './adicionar-contrato';

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
        max-width: 560px;
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
            Gerar CNAB
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Configuração do arquivo de remessa
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

      <div style="padding: 24px 28px">
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
          GERAR
        </button>
      </div>
    </div>
  </div>
</template>

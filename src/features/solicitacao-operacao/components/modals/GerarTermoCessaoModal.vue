<script setup lang="ts">
import { reactive } from 'vue';
import { X, MapPin, Building2, PenLine } from 'lucide-vue-next';
import { UF_OPTIONS } from '../../data/operacaoData';
import { FormField, SelectField, ToggleRow, StepGrid, BentoBox } from './adicionar-contrato';

const emit = defineEmits<{ close: []; confirm: [] }>();

const TERMOS_OPTS = [
  'Termo padrão Ceres',
  'Termo sem coobrigação',
  'Termo com anuente',
];
const GESTORAS_OPTS = ['Ceres Investimentos', 'Ceres Trading', 'Ceres Securitizadora'];
const SIGNATARIOS_OPTS = ['Representantes legais do fundo', 'Cedente + Fundo', 'Avalistas'];

const form = reactive({
  termo: '',
  semCoobrigacao: false,
  dataFirma: '',
  possuiDevedorSolidario: false,
  conjugeAssinaAnuente: false,
  cidade: '',
  estado: '',
  gestoras: '',
  signatarios: '',
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
        max-width: 640px;
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
            Gerar Termo de Cessão
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Dados do termo, endereço, gestoras e signatários
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
            <SelectField label="Termos" :options="TERMOS_OPTS" placeholder="Selecione" :span="6" v-model="form.termo" />
            <FormField label="Data de firma do contrato" placeholder="dd/mm/aaaa" :span="6" v-model="form.dataFirma" />
            <div style="grid-column: span 12">
              <ToggleRow
                label="Sem coobrigação"
                :on="form.semCoobrigacao"
                compact
                @toggle="form.semCoobrigacao = !form.semCoobrigacao"
              />
            </div>
            <div style="grid-column: span 6">
              <ToggleRow
                label="Possui devedor solidário"
                :on="form.possuiDevedorSolidario"
                compact
                @toggle="form.possuiDevedorSolidario = !form.possuiDevedorSolidario"
              />
            </div>
            <div style="grid-column: span 6">
              <ToggleRow
                label="Cônjuge assina como anuente"
                :on="form.conjugeAssinaAnuente"
                compact
                @toggle="form.conjugeAssinaAnuente = !form.conjugeAssinaAnuente"
              />
            </div>
          </StepGrid>

          <BentoBox title="Endereço" :icon="MapPin">
            <StepGrid>
              <FormField label="Cidade" placeholder="—" :span="8" v-model="form.cidade" />
              <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="4" v-model="form.estado" />
            </StepGrid>
          </BentoBox>

          <BentoBox title="Gestoras" :icon="Building2">
            <StepGrid>
              <SelectField label="Gestoras" :options="GESTORAS_OPTS" placeholder="Selecione" :span="12" v-model="form.gestoras" />
            </StepGrid>
          </BentoBox>

          <BentoBox title="Signatários" :icon="PenLine">
            <StepGrid>
              <SelectField label="Signatários" :options="SIGNATARIOS_OPTS" placeholder="Selecione" :span="12" v-model="form.signatarios" />
            </StepGrid>
          </BentoBox>
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
          GERAR
        </button>
      </div>
    </div>
  </div>
</template>

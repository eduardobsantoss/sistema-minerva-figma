<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { MapPin, Building2, PenLine } from 'lucide-vue-next';
import { UF_OPTIONS } from '../../data/operacaoData';
import { FormField, SelectField, ToggleRow, StepGrid, BentoBox } from './adicionar-contrato';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const props = withDefaults(
  defineProps<{ conjugeAssinaAnuenteInicial?: boolean }>(),
  { conjugeAssinaAnuenteInicial: false },
);

const emit = defineEmits<{ close: []; confirm: [] }>();

const prefilledFromRisco = computed(() => props.conjugeAssinaAnuenteInicial);

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
  conjugeAssinaAnuente: props.conjugeAssinaAnuenteInicial,
  cidade: '',
  estado: '',
  gestoras: '',
  signatarios: '',
});

watch(
  () => props.conjugeAssinaAnuenteInicial,
  (next) => {
    form.conjugeAssinaAnuente = next;
  },
);

function salvar() {
  emit('confirm');
  emit('close');
}
</script>

<template>
  <AdminModal size="md" eyebrow="Solicitação" title="Gerar Termo de Cessão" subtitle="Dados do termo, endereço, gestoras e signatários" @close="emit('close')">
    <div>
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
            <p
              v-if="prefilledFromRisco"
              style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 6px; line-height: 1.4"
            >
              Pré-preenchido conforme Risco → Partes relacionadas.
            </p>
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

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="primary" size="large" @click="salvar" type="button">Gerar</AdminButton>
    </template>
  </AdminModal>
</template>

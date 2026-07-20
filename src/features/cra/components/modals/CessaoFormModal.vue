<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { X, FileText, Percent, SlidersHorizontal } from 'lucide-vue-next';
import {
  CESSAO_TIPOS,
  type Cessao,
  type CessaoTipo,
  type RoundStatus,
} from '../../data/craData';
import SectionGroup from '../create-cra-operacao-modal/SectionGroup.vue';
import StepGrid from '../create-cra-operacao-modal/StepGrid.vue';
import FormField from '../create-cra-operacao-modal/FormField.vue';
import SelectField from '../create-cra-operacao-modal/SelectField.vue';
import ToggleRow from '../create-cra-operacao-modal/ToggleRow.vue';

const props = defineProps<{ cessao?: Cessao | null }>();
const emit = defineEmits<{ close: []; save: [Cessao] }>();

const isCreate = computed(() => !props.cessao?.id);

const nome = ref('');
const data = ref('');
const tipo = ref<CessaoTipo>('DESEMBOLSO');
const parametrizacao = ref('Padrão');
const taxaCessao = ref('');
const descontoAdicional = ref('');
const tipoCalculo = ref('Deságio por valor nominal');
const usoArtesanal = ref(false);
const indicadorTaxa = ref('CDI');
const operadorTaxa = ref('Percentual');
const frequenciaTaxa = ref('Mensal');
const baseCalculo = ref('252');
const capitalizacao = ref('Composto');
const inicioContagem = ref('D+0');
const inicioCalculo = ref('Cessão');
const coobrigacao = ref(false);
const obrigacaoRecompra = ref(false);
const certificadorEmail = ref(false);

function hydrateFromProp(c: Cessao | null | undefined) {
  if (!c) {
    nome.value = '';
    data.value = new Date().toISOString().slice(0, 10);
    tipo.value = 'DESEMBOLSO';
    parametrizacao.value = 'Padrão';
    taxaCessao.value = '';
    descontoAdicional.value = '';
    tipoCalculo.value = 'Deságio por valor nominal';
    usoArtesanal.value = false;
    indicadorTaxa.value = 'CDI';
    operadorTaxa.value = 'Percentual';
    frequenciaTaxa.value = 'Mensal';
    baseCalculo.value = '252';
    capitalizacao.value = 'Composto';
    inicioContagem.value = 'D+0';
    inicioCalculo.value = 'Cessão';
    coobrigacao.value = false;
    obrigacaoRecompra.value = false;
    certificadorEmail.value = false;
    return;
  }
  nome.value = c.nome;
  data.value = c.data;
  tipo.value = c.tipo;
  parametrizacao.value = c.parametrizacao ?? 'Padrão';
  taxaCessao.value = c.taxaCessao != null ? String(c.taxaCessao) : '';
  descontoAdicional.value = c.descontoAdicional ?? '';
  tipoCalculo.value = c.tipoCalculo ?? 'Deságio por valor nominal';
  usoArtesanal.value = c.usoArtesanal ?? false;
  indicadorTaxa.value = c.indicadorTaxa ?? 'CDI';
  operadorTaxa.value = c.operadorTaxa ?? 'Percentual';
  frequenciaTaxa.value = c.frequenciaTaxa ?? 'Mensal';
  baseCalculo.value = c.baseCalculo ?? '252';
  capitalizacao.value = c.capitalizacao ?? 'Composto';
  inicioContagem.value = c.inicioContagem ?? 'D+0';
  inicioCalculo.value = c.inicioCalculo ?? 'Cessão';
  coobrigacao.value = c.coobrigacao ?? false;
  obrigacaoRecompra.value = c.obrigacaoRecompra ?? false;
  certificadorEmail.value = c.certificadorEmail ?? false;
}

watch(() => props.cessao, (c) => hydrateFromProp(c), { immediate: true });

function handleSave() {
  const taxa = parseFloat(taxaCessao.value.replace(',', '.')) || undefined;
  const payload: Cessao = {
    id: props.cessao?.id ?? `ces-${Date.now()}`,
    nome: nome.value.trim() || 'Nova Cessão',
    data: data.value,
    tipo: tipo.value,
    valorAberto: props.cessao?.valorAberto ?? 0,
    status: (props.cessao?.status ?? 'ABERTA') as RoundStatus,
    taxaCessao: taxa,
    valorPresente: props.cessao?.valorPresente,
    valorTotal: props.cessao?.valorTotal,
    temTermo: props.cessao?.temTermo,
    cedente: props.cessao?.cedente,
    descontoAdicional: descontoAdicional.value || undefined,
    parametrizacao: parametrizacao.value,
    tipoCalculo: tipoCalculo.value,
    usoArtesanal: usoArtesanal.value,
    indicadorTaxa: indicadorTaxa.value,
    operadorTaxa: operadorTaxa.value,
    frequenciaTaxa: frequenciaTaxa.value,
    baseCalculo: baseCalculo.value,
    capitalizacao: capitalizacao.value,
    inicioContagem: inicioContagem.value,
    inicioCalculo: inicioCalculo.value,
    coobrigacao: coobrigacao.value,
    obrigacaoRecompra: obrigacaoRecompra.value,
    certificadorEmail: certificadorEmail.value,
  };
  emit('save', payload);
}
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      z-index: 400;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    "
    @click.self="emit('close')"
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 900px;
        max-height: calc(100vh - 64px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 6px">
            CRA · Cessão
          </div>
          <h3 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ isCreate ? 'Nova Cessão' : 'Editar Cessão' }}
          </h3>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 8px"
          @click="emit('close')"
        >
          <X :size="22" />
        </button>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 24px 28px; display: flex; flex-direction: column; gap: 20px; background: var(--surface-sunken)">
        <SectionGroup :icon="FileText" title="Dados">
          <StepGrid>
        <FormField v-model="nome" label="Nome" placeholder="Nome da cessão" :span="6" />
        <FormField v-model="data" label="Data" type="date" :span="3" />
        <SelectField v-model="tipo" label="Tipo de Cessão" :options="[...CESSAO_TIPOS]" :span="3" />
        <SelectField
          v-if="isCreate"
          v-model="parametrizacao"
          label="Indicativo de Parametrização"
          :options="['Padrão', 'Personalizado']"
          :span="6"
        />
      </StepGrid>
        </SectionGroup>

        <SectionGroup :icon="Percent" title="Cálculo e Taxas">
          <StepGrid>
            <FormField v-model="taxaCessao" label="Taxa de Cessão (%)" placeholder="0,00" :span="3" />
            <FormField v-model="descontoAdicional" label="Desconto Adicional" placeholder="—" :span="3" />
            <SelectField
              v-model="tipoCalculo"
              label="Tipo de Cálculo"
              :options="['Deságio por valor nominal', 'Ágio', 'Sem cálculo']"
              :span="6"
            />
          </StepGrid>
          <div style="margin-top: 16px">
            <ToggleRow label="Metodologia artesanal" :on="usoArtesanal" @toggle="usoArtesanal = !usoArtesanal" />
          </div>
          <div style="margin-top: 16px">
          <StepGrid>
            <SelectField v-model="indicadorTaxa" label="Indicador" :options="['CDI', 'Indefinido']" :span="4" />
            <SelectField v-model="operadorTaxa" label="Operador" :options="['Percentual', 'Spread', 'Indefinido']" :span="4" />
            <SelectField v-model="frequenciaTaxa" label="Frequência" :options="['Diário', 'Mensal', 'Anual']" :span="4" />
            <SelectField v-model="baseCalculo" label="Base" :options="['252', '360', '30']" :span="3" />
            <SelectField v-model="capitalizacao" label="Capitalização" :options="['Simples', 'Composto']" :span="3" />
            <SelectField v-model="inicioContagem" label="Início contagem" :options="['D+0', 'D+1']" :span="3" />
            <SelectField v-model="inicioCalculo" label="Início cálculo" :options="['Emissão', 'Cessão']" :span="3" />
          </StepGrid>
          </div>
        </SectionGroup>

        <SectionGroup :icon="SlidersHorizontal" title="Flags">
          <div class="flex flex-col" style="gap: 12px">
            <ToggleRow label="Coobrigação" :on="coobrigacao" @toggle="coobrigacao = !coobrigacao" />
            <ToggleRow label="Obrigação de Recompra" :on="obrigacaoRecompra" @toggle="obrigacaoRecompra = !obrigacaoRecompra" />
            <ToggleRow label="Certificador de e-mail" :on="certificadorEmail" @toggle="certificadorEmail = !certificadorEmail" />
          </div>
        </SectionGroup>
      </div>

      <div class="flex items-center justify-between" style="padding: 16px 28px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
        <button
          type="button"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: 600; font-size: var(--text-sm); padding: 10px 4px"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          type="button"
          style="padding: 12px 28px; background: var(--agro-base); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: 700; font-size: var(--text-sm); box-shadow: 0 10px 24px -10px rgba(242,125,38,0.40)"
          @click="handleSave"
        >
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { FileText, Percent, SlidersHorizontal } from 'lucide-vue-next';
import { gruposEmpresariais } from '@/features/cra/data/craData';
import {
  CESSAO_TIPOS,
  type Cessao,
  type CessaoTipo,
  type RoundStatus,
} from '../../data/fidcsData';
import SectionGroup from '../create-class/SectionGroup.vue';
import StepGrid from '../create-class/StepGrid.vue';
import FormField from '../create-class/FormField.vue';
import SelectField from '../create-class/SelectField.vue';
import ToggleRow from './ToggleRow.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const GRUPO_OPTS = gruposEmpresariais.map((g) => g.nome);

const props = defineProps<{ cessao?: Cessao | null }>();
const emit = defineEmits<{ close: []; save: [Cessao] }>();

const isCreate = computed(() => !props.cessao?.id);

const nome = ref('');
const data = ref('');
const tipo = ref<CessaoTipo>('DESEMBOLSO');
const grupoEmpresarial = ref('');
const parametrizacao = ref('Padrão');
const taxaCessao = ref('');
const taxaDesconto = ref('');
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
    grupoEmpresarial.value = '';
    parametrizacao.value = 'Padrão';
    taxaCessao.value = '';
    taxaDesconto.value = '';
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
  data.value = c.data.includes('/') ? c.data.split('/').reverse().join('-') : c.data;
  tipo.value = c.tipo;
  grupoEmpresarial.value = c.grupoEmpresarial ?? '';
  parametrizacao.value = c.parametrizacao ?? 'Padrão';
  taxaCessao.value = c.taxaCessao != null ? String(c.taxaCessao) : '';
  taxaDesconto.value = c.taxaDesconto != null ? String(c.taxaDesconto) : '';
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

function formatDataOut(iso: string) {
  if (!iso) return '';
  if (iso.includes('/')) return iso;
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function handleSave() {
  const taxa = parseFloat(taxaCessao.value.replace(',', '.')) || undefined;
  const desconto = parseFloat(taxaDesconto.value.replace(',', '.')) || undefined;
  const payload: Cessao = {
    id: props.cessao?.id ?? `ces-${Date.now()}`,
    nome: nome.value.trim() || 'Nova Cessão',
    data: formatDataOut(data.value),
    tipo: tipo.value,
    valorAberto: props.cessao?.valorAberto ?? 0,
    status: (props.cessao?.status ?? 'ABERTA') as RoundStatus,
    taxaCessao: taxa,
    valorPresente: props.cessao?.valorPresente,
    valorTotal: props.cessao?.valorTotal,
    temTermo: props.cessao?.temTermo,
    cedente: props.cessao?.cedente,
    grupoEmpresarial: grupoEmpresarial.value || undefined,
    aprovacaoTaxa: props.cessao?.aprovacaoTaxa,
    taxaDesconto: desconto,
    linkAssinatura: props.cessao?.linkAssinatura ?? '',
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
  <AdminModal size="lg" eyebrow="FIDC" :title="isCreate ? 'Nova Cessão' : 'Editar Cessão'" subtitle="Parametrização da cessão no fundo · FIDC" @close="emit('close')">
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <SectionGroup :icon="FileText" title="Dados">
        <StepGrid>
          <FormField v-model="nome" label="Nome" placeholder="Nome da cessão" :span="6" />
          <FormField v-model="data" label="Data de Cessão" type="date" :span="3" />
          <SelectField v-model="tipo" label="Tipo de Cessão" :options="[...CESSAO_TIPOS]" :span="3" />
          <SelectField
            v-model="grupoEmpresarial"
            label="Grupo Empresarial"
            :options="GRUPO_OPTS"
            placeholder="Selecione"
            :span="6"
          />
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
          <FormField v-model="taxaDesconto" label="Taxa de Desconto (%)" placeholder="0,00" :span="3" />
          <FormField v-model="descontoAdicional" label="Desconto Adicional" placeholder="—" :span="3" />
          <SelectField
            v-model="tipoCalculo"
            label="Tipo de Cálculo"
            :options="['Deságio por valor nominal', 'Ágio', 'Sem cálculo']"
            :span="3"
          />
        </StepGrid>
        <div style="margin-top: 16px">
          <ToggleRow label="Metodologia artesanal" :on="usoArtesanal" @toggle="usoArtesanal = !usoArtesanal" />
        </div>
        <StepGrid style="margin-top: 16px">
          <SelectField v-model="indicadorTaxa" label="Indicador" :options="['CDI', 'Indefinido']" :span="4" />
          <SelectField v-model="operadorTaxa" label="Operador" :options="['Percentual', 'Spread', 'Indefinido']" :span="4" />
          <SelectField v-model="frequenciaTaxa" label="Frequência" :options="['Diário', 'Mensal', 'Anual']" :span="4" />
          <SelectField v-model="baseCalculo" label="Base" :options="['252', '360', '30']" :span="3" />
          <SelectField v-model="capitalizacao" label="Capitalização" :options="['Simples', 'Composto']" :span="3" />
          <SelectField v-model="inicioContagem" label="Início contagem" :options="['D+0', 'D+1']" :span="3" />
          <SelectField v-model="inicioCalculo" label="Início cálculo" :options="['Emissão', 'Cessão']" :span="3" />
        </StepGrid>
      </SectionGroup>

      <SectionGroup :icon="SlidersHorizontal" title="Flags">
        <div class="flex flex-col" style="gap: 12px">
          <ToggleRow label="Coobrigação" :on="coobrigacao" @toggle="coobrigacao = !coobrigacao" />
          <ToggleRow label="Obrigação de Recompra" :on="obrigacaoRecompra" @toggle="obrigacaoRecompra = !obrigacaoRecompra" />
          <ToggleRow label="Certificador de e-mail" :on="certificadorEmail" @toggle="certificadorEmail = !certificadorEmail" />
        </div>
      </SectionGroup>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="agro" size="large" @click="handleSave" type="button">Salvar</AdminButton>
    </template>
  </AdminModal>
</template>

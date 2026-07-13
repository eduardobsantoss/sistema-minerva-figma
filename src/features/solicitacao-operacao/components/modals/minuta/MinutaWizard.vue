<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  User,
  Building2,
  Users,
  MapPin,
  Package,
  Shield,
  Tag,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import type { ParteRelacionada, ParcelaAtivo } from '../../../data/operacaoData';
import { SelectField, ToggleRow } from '../adicionar-contrato';
import MinutaStepper from './MinutaStepper.vue';
import EmitenteStep from './EmitenteStep.vue';
import CredoraStep from './CredoraStep.vue';
import AvalistaStep from './AvalistaStep.vue';
import EmissaoStep from './EmissaoStep.vue';
import ProdutoStep from './ProdutoStep.vue';
import GarantiaMinutaStep from './GarantiaMinutaStep.vue';
import TituloMinutaStep from './TituloMinutaStep.vue';
import ParteRelacionadaModal from '../ParteRelacionadaModal.vue';
import {
  templateMinuta,
  emptyPessoaMinuta,
  emptyProdutoMinuta,
  emptyMinutaResumo,
  type PessoaMinuta,
  type ProdutoMinuta,
  type AvalistaMinutaRow,
  type TituloMinutaForm,
  type MinutaResumo,
  type GarantiaMinuta,
} from '../../../data/minutaData';

const props = defineProps<{
  valorOperacao: number;
  tipoCalculo: string;
  tipo: string;
  partes: ParteRelacionada[];
  gerarMinuta: boolean;
}>();

const emit = defineEmits<{
  'update:gerarMinuta': [value: boolean];
  create: [
    data: {
      numero: string;
      tipo: string;
      emissao: string;
      vencimento: string;
      valorTotal: number;
      sacadoNome: string;
      sacadoDocumento: string;
      parcelas: ParcelaAtivo[];
      minuta: MinutaResumo;
    },
  ];
}>();

const steps: { key: string; label: string; icon: Component }[] = [
  { key: 'emitente', label: 'Emitente', icon: User },
  { key: 'credora', label: 'Credora', icon: Building2 },
  { key: 'avalista', label: 'Avalista', icon: Users },
  { key: 'emissao', label: 'Emissão', icon: MapPin },
  { key: 'produto', label: 'Produto', icon: Package },
  { key: 'garantia', label: 'Garantia', icon: Shield },
  { key: 'titulo', label: 'Título', icon: Tag },
];

const stepIdx = ref(0);
const gerarViaNaoNegociavel = ref(true);
const template = computed(() => templateMinuta(props.tipo));

const emitenteForm = ref<PessoaMinuta>(emptyPessoaMinuta('FISICA'));
const emitenteDocBusca = ref('');
const emitentes = ref<PessoaMinuta[]>([]);

const credoraForm = ref<PessoaMinuta>(emptyPessoaMinuta('JURIDICA'));
const credoraPadrao = ref('');
const credoraDocBusca = ref('');
const credoraContato = ref('');
const credoraEndereco = ref('');
const credoraRepresentante = ref('');

const possuiAvalistas = ref(true);
const avalistaRows = ref<AvalistaMinutaRow[]>(
  props.partes
    .filter((p) => p.tipos.includes('AVA'))
    .map((p) => ({
      documento: p.documento,
      nome: p.nome,
      possuiConjuge: !!p.possuiConjuge,
      selecionadoAssinatura: false,
      conjugeInterveniente: false,
    })),
);
const showParteModal = ref(false);

const emissao = reactive({ uf: '', cidade: '' });

const produtoForm = ref(emptyProdutoMinuta());
const produtos = ref<ProdutoMinuta[]>([]);
const garantias = ref<GarantiaMinuta[]>([]);

const tipoTituloLabel = computed(() => {
  const t = props.tipo.toUpperCase();
  if (t.includes('CPRF') || t.includes('CPR-F')) return 'CPRF';
  if (t.includes('CPR')) return 'CPR';
  return props.tipo;
});

const tituloForm = ref<TituloMinutaForm>({
  tipoValorLiquido: true,
  numero: '',
  tipo: tipoTituloLabel.value,
  emissao: '',
  vencimento: '',
  chaveNota: '',
  docCedente: '',
  gerarOperacaoGarantias: false,
  possuiCronograma: true,
  cronogramaAutomatico: false,
  fluxoAmortizacao: '',
  fluxoJuros: '',
  sacadoDocumento: '',
  sacadoNome: '',
  sacadoEmail: '',
  ddi: '+55',
  telefone: '',
  cep: '',
  endereco: '',
  numeroEndereco: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  pais: 'Brasil',
});
const cronograma = ref<ParcelaAtivo[]>([]);

watch(
  () => props.tipo,
  () => {
    tituloForm.value.tipo = tipoTituloLabel.value;
  },
);

const isFirst = computed(() => stepIdx.value === 0);
const isLast = computed(() => stepIdx.value === steps.length - 1);

function goNext() {
  if (isLast.value) {
    handleSubmit();
    return;
  }
  stepIdx.value++;
}

function goBack() {
  if (isFirst.value) return;
  stepIdx.value--;
}

function selectStep(i: number) {
  stepIdx.value = i;
}

function toggleAssinatura(i: number) {
  avalistaRows.value[i].selecionadoAssinatura = !avalistaRows.value[i].selecionadoAssinatura;
}
function toggleConjuge(i: number) {
  avalistaRows.value[i].conjugeInterveniente = !avalistaRows.value[i].conjugeInterveniente;
}

function onAddParte(parte: ParteRelacionada) {
  if (!parte.tipos.includes('AVA')) {
    parte.tipos = [...parte.tipos, 'AVA'];
  }
  avalistaRows.value = [
    ...avalistaRows.value,
    {
      documento: parte.documento,
      nome: parte.nome,
      possuiConjuge: !!parte.possuiConjuge,
      selecionadoAssinatura: true,
      conjugeInterveniente: false,
    },
  ];
  showParteModal.value = false;
}

function buildMinuta(): MinutaResumo {
  const base = emptyMinutaResumo(props.tipo);
  return {
    ...base,
    template: template.value,
    gerarViaNaoNegociavel: gerarViaNaoNegociavel.value,
    emitentes: [...emitentes.value],
    credora: credoraPadrao.value || credoraDocBusca.value ? { ...credoraForm.value } : null,
    credoraPadrao: credoraPadrao.value,
    avalistas: [...avalistaRows.value],
    possuiAvalistas: possuiAvalistas.value,
    emissao: { ...emissao },
    produtos: [...produtos.value],
    garantias: [...garantias.value],
  };
}

function handleSubmit() {
  emit('create', {
    numero: tituloForm.value.numero,
    tipo: tituloForm.value.tipo,
    emissao: tituloForm.value.emissao,
    vencimento: tituloForm.value.vencimento,
    valorTotal: props.valorOperacao,
    sacadoNome: tituloForm.value.sacadoNome,
    sacadoDocumento: tituloForm.value.sacadoDocumento,
    parcelas: tituloForm.value.possuiCronograma ? [...cronograma.value] : [],
    minuta: buildMinuta(),
  });
}
</script>

<template>
  <div class="flex flex-col" style="flex: 1; min-height: 0">
    <!-- Barra superior alinhada ao padrão do sistema -->
    <div
      class="grid"
      style="
        grid-template-columns: 1fr 1.5fr 1fr;
        gap: 16px;
        padding: 16px 32px;
        border-bottom: 1px solid var(--border-default);
        align-items: stretch;
      "
    >
      <ToggleRow
        label="Gerar minuta"
        :on="gerarMinuta"
        compact
        @toggle="emit('update:gerarMinuta', !gerarMinuta)"
      />
      <SelectField label="Selecione o template" :options="[template]" :model-value="template" required disabled />
      <ToggleRow
        label="Gerar via não negociável"
        :on="gerarViaNaoNegociavel"
        compact
        @toggle="gerarViaNaoNegociavel = !gerarViaNaoNegociavel"
      />
    </div>

    <MinutaStepper :steps="steps" :current="stepIdx" @select="selectStep" />

    <div style="flex: 1; overflow-y: auto; padding: 32px">
      <EmitenteStep
        v-if="stepIdx === 0"
        v-model:emitentes="emitentes"
        v-model:form="emitenteForm"
        v-model:doc-busca="emitenteDocBusca"
      />
      <CredoraStep
        v-else-if="stepIdx === 1"
        v-model:form="credoraForm"
        v-model:credora-padrao="credoraPadrao"
        v-model:doc-busca="credoraDocBusca"
        v-model:contato="credoraContato"
        v-model:endereco="credoraEndereco"
        v-model:representante="credoraRepresentante"
      />
      <AvalistaStep
        v-else-if="stepIdx === 2"
        :possui-avalistas="possuiAvalistas"
        :rows="avalistaRows"
        @toggle-possui="possuiAvalistas = !possuiAvalistas"
        @toggle-assinatura="toggleAssinatura"
        @toggle-conjuge="toggleConjuge"
        @add-avalista="showParteModal = true"
      />
      <EmissaoStep v-else-if="stepIdx === 3" v-model="emissao" />
      <ProdutoStep
        v-else-if="stepIdx === 4"
        v-model:produtos="produtos"
        v-model:form="produtoForm"
      />
      <GarantiaMinutaStep v-else-if="stepIdx === 5" v-model:garantias="garantias" />
      <TituloMinutaStep
        v-else
        :valor-operacao="valorOperacao"
        :tipo-calculo="tipoCalculo"
        v-model="tituloForm"
        v-model:cronograma="cronograma"
      />
    </div>

    <div
      class="flex items-center justify-between"
      style="padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)"
    >
      <button
        class="flex items-center"
        :style="{
          gap: '6px',
          background: 'none',
          border: 'none',
          cursor: isFirst ? 'not-allowed' : 'pointer',
          color: 'var(--text-muted)',
          fontWeight: 'var(--weight-semibold)',
          fontSize: 'var(--text-sm)',
          padding: '10px 4px',
          opacity: isFirst ? 0.4 : 1,
        }"
        :disabled="isFirst"
        @click="goBack"
      >
        <ChevronLeft :size="15" /> Voltar
      </button>

      <span style="font-size: var(--text-xs); color: var(--text-muted); font-weight: var(--weight-semibold)">
        {{ stepIdx + 1 }} / {{ steps.length }}
      </span>

      <button
        class="flex items-center"
        :style="{
          gap: '8px',
          height: '44px',
          padding: '0 22px',
          border: 'none',
          borderRadius: 'var(--radius-lg)',
          cursor: 'pointer',
          fontWeight: 'var(--weight-bold)',
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.08em',
          background: 'var(--action-primary-bg)',
          color: '#fff',
        }"
        @click="goNext"
      >
        <template v-if="isLast">
          <FileText :size="15" /> GERAR TÍTULO
        </template>
        <template v-else>
          Próximo <ChevronRight :size="15" />
        </template>
      </button>
    </div>

    <ParteRelacionadaModal v-if="showParteModal" @close="showParteModal = false" @create="onAddParte" />
  </div>
</template>

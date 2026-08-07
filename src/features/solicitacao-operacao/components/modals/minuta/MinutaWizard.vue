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
  Landmark,
  ScrollText,
  BookOpen,
  Forward,
  Percent,
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
import EscrituradorStep from './EscrituradorStep.vue';
import InformacaoPagamentoStep from './InformacaoPagamentoStep.vue';
import BoletimSubscricaoStep from './BoletimSubscricaoStep.vue';
import EndossatarioStep from './EndossatarioStep.vue';
import CetStep from './CetStep.vue';
import ParteRelacionadaModal from '../ParteRelacionadaModal.vue';
import {
  categoriaMinuta,
  templatesDisponiveis,
  templateMinuta,
  credoraPadraoOptions,
  emptyPessoaMinuta,
  emptyProdutoMinuta,
  emptyMinutaResumo,
  emptyBoletimSubscricao,
  emptyCetForm,
  emptyCessaoForm,
  type PessoaMinuta,
  type ProdutoMinuta,
  type AvalistaMinutaRow,
  type TituloMinutaForm,
  type MinutaResumo,
  type GarantiaMinuta,
  type ContaBancaria,
  type BoletimSubscricao,
  type CetForm,
  type EmissaoMinuta,
} from '../../../data/minutaData';

const props = withDefaults(
  defineProps<{
    valorOperacao: number;
    tipoCalculo: string;
    tipo: string;
    partes: ParteRelacionada[];
    gerarMinuta: boolean;
    unidadeNegocio?: string;
  }>(),
  { unidadeNegocio: '' },
);

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

const categoria = computed(() => categoriaMinuta(props.tipo));
const showBoletim = computed(
  () => categoria.value === 'NC' && props.unidadeNegocio === 'Ceres Trading',
);

type StepDef = { key: string; label: string; icon: Component };

const steps = computed<StepDef[]>(() => {
  if (categoria.value === 'NC') {
    const list: StepDef[] = [
      { key: 'emitente', label: 'Emissora', icon: User },
      { key: 'credora', label: 'Credora', icon: Building2 },
      { key: 'escriturador', label: 'Escriturador', icon: Landmark },
      { key: 'avalista', label: 'Avalista', icon: Users },
      { key: 'emissao', label: 'Emissão', icon: MapPin },
      { key: 'pagamento', label: 'Pagamento', icon: ScrollText },
      { key: 'garantia', label: 'Garantia', icon: Shield },
    ];
    if (showBoletim.value) {
      list.push({ key: 'boletim', label: 'Boletim', icon: BookOpen });
    }
    list.push({ key: 'titulo', label: 'Título', icon: Tag });
    return list;
  }
  if (categoria.value === 'CCB') {
    return [
      { key: 'emitente', label: 'Emissora', icon: User },
      { key: 'credora', label: 'Credora', icon: Building2 },
      { key: 'avalista', label: 'Avalista', icon: Users },
      { key: 'endossatario', label: 'Endossatário', icon: Forward },
      { key: 'garantia', label: 'Garantia', icon: Shield },
      { key: 'titulo', label: 'Título', icon: Tag },
      { key: 'cet', label: 'CET', icon: Percent },
    ];
  }
  return [
    { key: 'emitente', label: 'Emitente', icon: User },
    { key: 'credora', label: 'Credora', icon: Building2 },
    { key: 'avalista', label: 'Avalista', icon: Users },
    { key: 'emissao', label: 'Emissão', icon: MapPin },
    { key: 'produto', label: 'Produto', icon: Package },
    { key: 'garantia', label: 'Garantia', icon: Shield },
    { key: 'titulo', label: 'Título', icon: Tag },
  ];
});

const stepIdx = ref(0);
const currentKey = computed(() => steps.value[stepIdx.value]?.key ?? 'emitente');

watch(steps, () => {
  if (stepIdx.value >= steps.value.length) stepIdx.value = Math.max(0, steps.value.length - 1);
});

const templatesOpts = computed(() => templatesDisponiveis(props.tipo));
const templateSel = ref(templateMinuta(props.tipo));
const templateDisabled = computed(() => categoria.value !== 'NC');

watch(
  () => props.tipo,
  () => {
    templateSel.value = templateMinuta(props.tipo);
    stepIdx.value = 0;
  },
);

const gerarViaNaoNegociavel = ref(categoria.value !== 'NC');
watch(categoria, (c) => {
  if (c === 'NC') gerarViaNaoNegociavel.value = false;
  else if (!gerarViaNaoNegociavel.value) gerarViaNaoNegociavel.value = true;
});

const topBarCols = computed(() =>
  categoria.value === 'NC' ? '1fr 1.5fr' : '1fr 1.5fr 1fr',
);

const emitenteForm = ref<PessoaMinuta>(
  emptyPessoaMinuta(categoria.value === 'NC' ? 'JURIDICA' : 'FISICA'),
);
const emitenteDocBusca = ref('');
const emitentes = ref<PessoaMinuta[]>([]);

const credoraForm = ref<PessoaMinuta>(emptyPessoaMinuta('JURIDICA'));
const credoraPadrao = ref('');
const credoraDocBusca = ref('');
const credoraContato = ref('');
const credoraEndereco = ref('');
const credoraRepresentante = ref('');
const credoraOpts = computed(() => credoraPadraoOptions(categoria.value));

const escrituradorForm = ref<PessoaMinuta>(emptyPessoaMinuta('JURIDICA'));
const escrituradorPadrao = ref('');
const escrituradorDocBusca = ref('');

const contaBancariaId = ref('');
const contasExtras = ref<ContaBancaria[]>([]);

const boletim = ref<BoletimSubscricao>(emptyBoletimSubscricao());

const endossatarioForm = ref<PessoaMinuta>(emptyPessoaMinuta('JURIDICA'));
const endossatarioPadrao = ref('');
const endossatarioDocBusca = ref('');
const endossatarioContato = ref('');
const endossatarioEndereco = ref('');
const endossatarioRepresentante = ref('');

const cetForm = ref<CetForm>(emptyCetForm());

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

const emissao = reactive<EmissaoMinuta>({
  uf: '',
  cidade: '',
  numero: '',
  serie: '',
  valorNominalUnitario: '',
  quantidade: '',
  valorTotal: '',
});

const produtoForm = ref(emptyProdutoMinuta());
const produtos = ref<ProdutoMinuta[]>([]);
const garantias = ref<GarantiaMinuta[]>([]);

const tipoTituloLabel = computed(() => {
  const cat = categoria.value;
  if (cat === 'NC') return 'NC';
  if (cat === 'CCB') return 'CCB';
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
  cessao: emptyCessaoForm(),
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
const isLast = computed(() => stepIdx.value === steps.value.length - 1);

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
  const cat = categoria.value;

  const emissaoPayload: EmissaoMinuta =
    cat === 'CCB'
      ? { uf: 'SP', cidade: 'São Paulo' }
      : { ...emissao };

  const result: MinutaResumo = {
    ...base,
    template: templateSel.value,
    gerarViaNaoNegociavel: cat === 'NC' ? false : gerarViaNaoNegociavel.value,
    emitentes: [...emitentes.value],
    credora: credoraPadrao.value || credoraDocBusca.value ? { ...credoraForm.value } : null,
    credoraPadrao: credoraPadrao.value,
    avalistas: [...avalistaRows.value],
    possuiAvalistas: possuiAvalistas.value,
    emissao: emissaoPayload,
    produtos: cat === 'CPR' ? [...produtos.value] : [],
    garantias: [...garantias.value],
    cessao: { ...tituloForm.value.cessao },
  };

  if (cat === 'NC') {
    result.escriturador =
      escrituradorPadrao.value || escrituradorDocBusca.value ? { ...escrituradorForm.value } : null;
    result.escrituradorPadrao = escrituradorPadrao.value;
    result.contaBancariaId = contaBancariaId.value;
    result.boletimSubscricao = showBoletim.value ? { ...boletim.value, subscritor: { ...boletim.value.subscritor } } : null;
  }

  if (cat === 'CCB') {
    result.endossatario =
      endossatarioPadrao.value || endossatarioDocBusca.value ? { ...endossatarioForm.value } : null;
    result.endossatarioPadrao = endossatarioPadrao.value;
    result.cet = { ...cetForm.value };
  }

  return result;
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

const subtitleByCat = computed(() => {
  if (categoria.value === 'NC') return 'Geração de minuta Nota Comercial';
  if (categoria.value === 'CCB') return 'Geração de minuta CCB';
  return 'Geração de minuta CPR / CPR-F';
});
</script>

<template>
  <div class="flex flex-col" style="flex: 1; min-height: 0">
    <div
      class="grid"
      :style="{
        gridTemplateColumns: topBarCols,
        gap: '16px',
        padding: '16px 32px',
        borderBottom: '1px solid var(--border-default)',
        alignItems: 'stretch',
      }"
    >
      <ToggleRow
        label="Gerar minuta"
        :on="gerarMinuta"
        compact
        @toggle="emit('update:gerarMinuta', !gerarMinuta)"
      />
      <SelectField
        label="Selecione o template"
        :options="templatesOpts"
        v-model="templateSel"
        required
        :disabled="templateDisabled"
      />
      <ToggleRow
        v-if="categoria !== 'NC'"
        label="Gerar via não negociável"
        :on="gerarViaNaoNegociavel"
        compact
        @toggle="gerarViaNaoNegociavel = !gerarViaNaoNegociavel"
      />
    </div>

    <MinutaStepper :steps="steps" :current="stepIdx" @select="selectStep" />

    <div style="flex: 1; overflow-y: auto; padding: 32px">
      <EmitenteStep
        v-if="currentKey === 'emitente'"
        v-model:emitentes="emitentes"
        v-model:form="emitenteForm"
        v-model:doc-busca="emitenteDocBusca"
        :apenas-pessoa-juridica="categoria === 'NC'"
        :max-emitentes="categoria === 'NC' ? 1 : undefined"
      />
      <CredoraStep
        v-else-if="currentKey === 'credora'"
        v-model:form="credoraForm"
        v-model:credora-padrao="credoraPadrao"
        v-model:doc-busca="credoraDocBusca"
        v-model:contato="credoraContato"
        v-model:endereco="credoraEndereco"
        v-model:representante="credoraRepresentante"
        :padrao-options="credoraOpts"
        :legal-rep-fields-optional="categoria === 'CCB'"
      />
      <EscrituradorStep
        v-else-if="currentKey === 'escriturador'"
        v-model:form="escrituradorForm"
        v-model:escriturador-padrao="escrituradorPadrao"
        v-model:doc-busca="escrituradorDocBusca"
      />
      <AvalistaStep
        v-else-if="currentKey === 'avalista'"
        :possui-avalistas="possuiAvalistas"
        :rows="avalistaRows"
        @toggle-possui="possuiAvalistas = !possuiAvalistas"
        @toggle-assinatura="toggleAssinatura"
        @toggle-conjuge="toggleConjuge"
        @add-avalista="showParteModal = true"
      />
      <EmissaoStep
        v-else-if="currentKey === 'emissao'"
        v-model="emissao"
        :modo-nc="categoria === 'NC'"
      />
      <InformacaoPagamentoStep
        v-else-if="currentKey === 'pagamento'"
        v-model:conta-bancaria-id="contaBancariaId"
        v-model:contas-extras="contasExtras"
      />
      <ProdutoStep
        v-else-if="currentKey === 'produto'"
        v-model:produtos="produtos"
        v-model:form="produtoForm"
      />
      <GarantiaMinutaStep v-else-if="currentKey === 'garantia'" v-model:garantias="garantias" />
      <BoletimSubscricaoStep
        v-else-if="currentKey === 'boletim'"
        v-model="boletim"
        v-model:contas-extras="contasExtras"
      />
      <EndossatarioStep
        v-else-if="currentKey === 'endossatario'"
        v-model:form="endossatarioForm"
        v-model:endossatario-padrao="endossatarioPadrao"
        v-model:doc-busca="endossatarioDocBusca"
        v-model:contato="endossatarioContato"
        v-model:endereco="endossatarioEndereco"
        v-model:representante="endossatarioRepresentante"
      />
      <TituloMinutaStep
        v-else-if="currentKey === 'titulo'"
        :valor-operacao="valorOperacao"
        :tipo-calculo="tipoCalculo"
        v-model="tituloForm"
        v-model:cronograma="cronograma"
      />
      <CetStep
        v-else-if="currentKey === 'cet'"
        v-model="cetForm"
        :valor-titulo="valorOperacao"
        :data-emissao="tituloForm.emissao"
        :data-vencimento="tituloForm.vencimento"
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
        <span style="margin-left: 8px; font-weight: var(--weight-normal)">· {{ subtitleByCat }}</span>
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

<script setup lang="ts">
import { computed, ref } from 'vue';
import AdminModal from '@/components/ui/AdminModal.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminSelect from '@/components/ui/AdminSelect.vue';
import AdminFormField from '@/components/ui/AdminFormField.vue';
import AdminTextField from '@/components/ui/AdminTextField.vue';
import { Alert } from '@/components/feedback';
import EstoqueArquivoField from './EstoqueArquivoField.vue';
import {
  IMOVEL_STATUSES,
  IMOVEL_STATUS_LABEL,
  ORIGENS,
  ORIGEM_LABEL,
  listVeiculos,
  moneyToInput,
  parseMoney,
  veiculoKey,
  brl,
  type EstoqueImovel,
  type GarantiaOrigem,
  type ImovelOrigem,
  type ImovelStatus,
  type NovoImovelInput,
  type VeiculoRef,
} from '../data/estoqueData';

const props = defineProps<{
  /** Edição. */
  imovel?: EstoqueImovel | null;
  /** Veículo travado (aba Estoque dentro do veículo). */
  veiculoFixo?: VeiculoRef;
  /** Veículo pré-selecionado, mas editável (ex.: cota da operação). */
  veiculoSugerido?: VeiculoRef;
  /** Pré-preenchimento (ex.: garantia executada). */
  prefill?: Partial<NovoImovelInput>;
  garantiaOrigem?: GarantiaOrigem;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
}>();
const emit = defineEmits<{ close: []; save: [NovoImovelInput] }>();

const isEdit = computed(() => !!props.imovel);
const veiculos = listVeiculos();
const origemTravada = computed(() => !!props.garantiaOrigem || !!props.imovel?.garantiaOrigem);

const base = props.imovel ?? props.prefill ?? {};

const veiculoSel = ref(
  props.imovel
    ? veiculoKey({ tipo: props.imovel.veiculoTipo, id: props.imovel.veiculoId })
    : props.veiculoFixo
      ? veiculoKey(props.veiculoFixo)
      : props.veiculoSugerido
        ? veiculoKey(props.veiculoSugerido)
        : '',
);
const origem = ref<ImovelOrigem>(base.origem ?? (props.garantiaOrigem ? 'GARANTIA_EXECUTADA' : 'DACAO_DIRETA'));
const cedente = ref(base.cedenteOriginal ?? '');
const nome = ref(base.nome ?? '');
const matricula = ref(base.matricula ?? '');
const localizacao = ref(base.localizacao ?? '');
const valorMercado = ref(moneyToInput(base.valorMercado ?? 0));
const valorForcada = ref(moneyToInput(base.valorVendaForcada ?? 0));
const instrumento = ref(base.instrumentoDacao ?? '');
const status = ref<ImovelStatus>(base.status ?? 'DISPONIVEL');

const tentou = ref(false);

const erros = computed(() => ({
  veiculo: veiculoSel.value ? '' : 'Selecione o veículo que passa a ser dono do imóvel.',
  nome: nome.value.trim() ? '' : 'Informe o nome do imóvel.',
  cedente: cedente.value.trim() ? '' : 'Informe o cedente original.',
  valorMercado: parseMoney(valorMercado.value) > 0 ? '' : 'Informe o valor de mercado.',
  forcada:
    parseMoney(valorForcada.value) > 0 && parseMoney(valorForcada.value) > parseMoney(valorMercado.value)
      ? 'A venda forçada não pode ser maior que o valor de mercado.'
      : '',
}));
const valido = computed(() => Object.values(erros.value).every((e) => !e));

function erro(key: keyof typeof erros.value): string {
  return tentou.value ? erros.value[key] : '';
}

function salvar() {
  tentou.value = true;
  if (!valido.value) return;
  const veiculo = veiculos.find((v) => veiculoKey(v) === veiculoSel.value);
  if (!veiculo) return;
  emit('save', {
    veiculoTipo: veiculo.tipo,
    veiculoId: veiculo.id,
    veiculoNome: veiculo.nome,
    origem: origem.value,
    garantiaOrigem: props.garantiaOrigem ?? props.imovel?.garantiaOrigem,
    cedenteOriginal: cedente.value.trim(),
    nome: nome.value.trim(),
    matricula: matricula.value.trim(),
    localizacao: localizacao.value.trim(),
    valorMercado: parseMoney(valorMercado.value),
    valorVendaForcada: parseMoney(valorForcada.value),
    instrumentoDacao: instrumento.value,
    status: status.value,
  });
}
</script>

<template>
  <AdminModal
    size="lg"
    :eyebrow="eyebrow ?? (isEdit ? 'Estoque · Editar imóvel' : 'Estoque · Novo imóvel')"
    :title="title ?? (isEdit ? 'Editar imóvel' : 'Cadastrar imóvel')"
    :subtitle="subtitle ?? 'Imóvel que passou a pertencer ao veículo por execução de garantia ou dação em pagamento.'"
    @close="emit('close')"
  >
    <div class="flex flex-col" style="gap: 20px">
      <Alert
        v-if="garantiaOrigem"
        type="info"
        title="Garantia vinculada"
        :message="`${garantiaOrigem.tipoGarantia} ${garantiaOrigem.garantiaNumero} da operação ${garantiaOrigem.operacaoNome}. Ao salvar, a garantia sai de Demais Garantias e o imóvel entra no estoque do veículo.`"
        :dismissible="false"
      />

      <div class="grid" style="grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 16px">
        <AdminFormField label="Veículo" :error="erro('veiculo')" style="grid-column: span 8">
          <AdminSelect
            v-model="veiculoSel"
            :options="veiculos.map((v) => ({ value: veiculoKey(v), label: `${v.tipo} · ${v.nome}` }))"
            :disabled="!!veiculoFixo || isEdit"
            placeholder="Selecione o veículo"
          />
        </AdminFormField>
        <AdminFormField label="Origem" style="grid-column: span 4">
          <AdminSelect
            v-model="origem"
            :options="ORIGENS.map((o) => ({ value: o, label: ORIGEM_LABEL[o] }))"
            :disabled="origemTravada"
          />
        </AdminFormField>

        <AdminFormField label="Cedente original" :error="erro('cedente')" style="grid-column: span 6">
          <AdminTextField v-model="cedente" placeholder="Quem cedeu ou deu o imóvel em pagamento" :invalid="!!erro('cedente')" />
        </AdminFormField>
        <AdminFormField label="Nome do imóvel" :error="erro('nome')" style="grid-column: span 6">
          <AdminTextField v-model="nome" placeholder="Ex.: Casa de praia Ubatuba" :invalid="!!erro('nome')" />
        </AdminFormField>

        <AdminFormField label="Matrícula" style="grid-column: span 6">
          <AdminTextField v-model="matricula" placeholder="Nº da matrícula e cartório" />
        </AdminFormField>
        <AdminFormField label="Localização" style="grid-column: span 6">
          <AdminTextField v-model="localizacao" placeholder="Cidade / UF" />
        </AdminFormField>

        <AdminFormField label="Valor de mercado (R$)" :error="erro('valorMercado')" style="grid-column: span 4">
          <AdminTextField v-model="valorMercado" inputmode="decimal" placeholder="0,00" :invalid="!!erro('valorMercado')" />
        </AdminFormField>
        <AdminFormField
          label="Valor de venda forçada (R$)"
          :error="erro('forcada')"
          hint="Menor valor aceito numa venda forçada."
          style="grid-column: span 4"
        >
          <AdminTextField v-model="valorForcada" inputmode="decimal" placeholder="0,00" :invalid="!!erro('forcada')" />
        </AdminFormField>
        <AdminFormField label="Status" style="grid-column: span 4">
          <AdminSelect v-model="status" :options="IMOVEL_STATUSES.map((s) => ({ value: s, label: IMOVEL_STATUS_LABEL[s] }))" />
        </AdminFormField>

        <AdminFormField
          label="Instrumento de dação"
          hint="Escritura ou traslado que comprova a passagem do imóvel para o veículo."
          style="grid-column: span 12"
        >
          <EstoqueArquivoField v-model="instrumento" />
        </AdminFormField>
      </div>

      <p v-if="prefill?.valorMercado" style="font-size: var(--text-xs); color: var(--text-muted)">
        Valor de mercado sugerido a partir do valor nominal da garantia ({{ brl(prefill.valorMercado) }}). Ajuste se houver avaliação.
      </p>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" type="button" @click="emit('close')">Cancelar</AdminButton>
      <AdminButton variant="agro" size="large" type="button" @click="salvar">
        {{ submitLabel ?? (isEdit ? 'Salvar' : 'Cadastrar imóvel') }}
      </AdminButton>
    </template>
  </AdminModal>
</template>

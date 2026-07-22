<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { Tag, CalendarClock, Trash2, Handshake } from 'lucide-vue-next';
import { brl, UF_OPTIONS, PAISES_DDI, type ParcelaAtivo } from '../../../data/operacaoData';
import {
  BentoBox,
  StepGrid,
  FormField,
  SelectField,
  ToggleRow,
  AddButton,
  EmptyState,
} from '../adicionar-contrato';
import {
  MOCK_CLIENTES_MINUTA,
  cidadesDaUf,
  CESSAO_TIPO_OPTS,
  CESSAO_PARAM_OPTS,
  CESSAO_TIPO_CALCULO_OPTS,
  CESSAO_FREQUENCIA_OPTS,
  CESSAO_OPERADOR_OPTS,
  CESSAO_INDICADOR_OPTS,
  CESSAO_CAPITALIZACAO_OPTS,
  CESSAO_BASE_DIAS_OPTS,
  CESSAO_INICIO_JUROS_OPTS,
  CESSAO_DATA_ACCRUAL_OPTS,
  type TituloMinutaForm,
} from '../../../data/minutaData';

const props = defineProps<{
  valorOperacao: number;
  tipoCalculo: string;
}>();

const form = defineModel<TituloMinutaForm>({ required: true });
const cronograma = defineModel<ParcelaAtivo[]>('cronograma', { default: () => [] });

const FLUXO_OPTS = ['Única', 'Mensal', 'Bimestral', 'Trimestral', 'Quadrimestral', 'Semestral', 'Anual'];
const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const DDI_OPTS = PAISES_DDI.map((p) => p.ddi);
const DOC_CEDENTE_OPTS = MOCK_CLIENTES_MINUTA.map((c) => `${c.documento} - ${c.nome}`);

const cidadeOpts = computed(() => cidadesDaUf(form.value.estado));
const pagamentoForm = reactive({ amortizacao: '', vencimento: '', pagarJuros: false, valorJuros: '' });
const somatoriaAmortizacao = computed(() => cronograma.value.reduce((acc, c) => acc + (Number(c.amortizacao) || 0), 0));

const isPosFixado = computed(() => {
  const t = (props.tipoCalculo || '').toLowerCase();
  return t.includes('pós') || t.includes('pos');
});

const isPersonalizado = computed(() => form.value.cessao.parametrizacaoCalculo === 'Personalizado');

const conversaoLabel = computed(() =>
  form.value.cessao.conversaoIndice
    ? 'Conversão de índice: forçar base 360'
    : 'Conversão de índice: usar última taxa disponível',
);

watch(
  () => form.value.estado,
  () => {
    if (form.value.cidade && !cidadeOpts.value.includes(form.value.cidade)) {
      form.value.cidade = '';
    }
  },
);

/** Watchers do legado: pré/pós-fixado afetam cronograma */
watch(
  isPosFixado,
  (pos) => {
    if (pos) {
      form.value.possuiCronograma = true;
      form.value.cessao.indicadorTaxa = '';
      form.value.cessao.operador = '';
    } else {
      form.value.possuiCronograma = false;
      form.value.cessao.indicadorTaxa = 'Indefinido';
    }
  },
  { immediate: true },
);

/** Preset de parametrização sobrescreve campos; Personalizado libera edição */
watch(
  () => form.value.cessao.parametrizacaoCalculo,
  (param) => {
    if (!param || param === 'Personalizado') return;
    const pos = param.toLowerCase().includes('pós') || param.toLowerCase().includes('pos');
    form.value.cessao.frequenciaTaxa = pos ? 'Diário' : 'Mensal';
    form.value.cessao.tipoCapitalizacao = pos ? 'Composto' : 'Simples';
    form.value.cessao.baseDias = pos ? '252' : '360';
    form.value.cessao.inicioContagemJuros = 'D0';
    form.value.cessao.dataAccrual = 'Data da cessão/desembolso';
    form.value.cessao.usarCalculoUra = param.startsWith('URA');
    form.value.cessao.indicadorTaxa = pos ? 'CDI' : 'Indefinido';
    form.value.cessao.operador = pos ? 'Multiplicativo' : '';
  },
);

function addPagamento() {
  if (!pagamentoForm.vencimento) return;
  cronograma.value = [
    ...cronograma.value,
    {
      parcela: `${cronograma.value.length + 1}ª Parcela`,
      vencimento: pagamentoForm.vencimento,
      amortizacao: Number(pagamentoForm.amortizacao) || 0,
      juros: pagamentoForm.pagarJuros ? Number(pagamentoForm.valorJuros) || 0 : 0,
      pagarJuros: pagamentoForm.pagarJuros,
    },
  ];
  pagamentoForm.amortizacao = '';
  pagamentoForm.vencimento = '';
  pagamentoForm.pagarJuros = false;
  pagamentoForm.valorJuros = '';
}

function removePagamento(i: number) {
  cronograma.value = cronograma.value.filter((_, idx) => idx !== i);
}

function gerarPagamentosAutomaticos() {
  if (!form.value.fluxoAmortizacao || !form.value.fluxoJuros) return;
  const base = props.valorOperacao > 0 ? props.valorOperacao / 2 : 50_000;
  cronograma.value = [
    { parcela: '1ª Parcela', vencimento: '30/07/2026', amortizacao: Math.round(base), juros: Math.round(base * 0.02), pagarJuros: true },
    { parcela: '2ª Parcela', vencimento: '30/08/2026', amortizacao: Math.round(base), juros: Math.round(base * 0.02), pagarJuros: true },
  ];
}
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <BentoBox title="Dados do Título" :icon="Tag">
      <div class="flex flex-col" style="gap: 14px">
        <StepGrid>
          <FormField label="Valor total" :model-value="brl(valorOperacao)" disabled :span="3" />
          <SelectField label="Tipo de cálculo" :options="[tipoCalculo]" :model-value="tipoCalculo" disabled :span="3" />
          <div style="grid-column: span 3; align-self: end">
            <ToggleRow
              :label="form.tipoValorLiquido ? 'Tipo de valor: LÍQUIDO' : 'Tipo de valor: NOMINAL'"
              :on="form.tipoValorLiquido"
              compact
              @toggle="form.tipoValorLiquido = !form.tipoValorLiquido"
            />
          </div>
          <FormField label="Número" placeholder="—" :span="3" v-model="form.numero" />
          <SelectField label="Tipo" :options="[form.tipo]" :model-value="form.tipo" disabled :span="3" />
          <FormField label="Emissão" placeholder="dd/mm/aaaa" required :span="3" v-model="form.emissao" />
          <FormField label="Vencimento" placeholder="dd/mm/aaaa" required :span="3" v-model="form.vencimento" />
          <FormField label="Chave da nota" placeholder="—" :span="3" v-model="form.chaveNota" />
          <SelectField
            label="Insira o doc. da cedente"
            :options="DOC_CEDENTE_OPTS"
            placeholder="Selecione"
            required
            :span="6"
            v-model="form.docCedente"
          />
          <div style="grid-column: span 6; align-self: end">
            <ToggleRow
              label="Gerar operação no módulo de garantias"
              :on="form.gerarOperacaoGarantias"
              compact
              @toggle="form.gerarOperacaoGarantias = !form.gerarOperacaoGarantias"
            />
          </div>
        </StepGrid>
      </div>
    </BentoBox>

    <BentoBox title="Dados da cessão" :icon="Handshake">
      <div class="flex flex-col" style="gap: 14px">
        <StepGrid>
          <FormField label="Nome" placeholder="—" required :span="5" v-model="form.cessao.nome" />
          <FormField label="Data do desembolso" placeholder="dd/mm/aaaa" required :span="4" v-model="form.cessao.dataDesembolso" />
          <FormField label="Taxa da cessão (%)" placeholder="0,00" required :span="3" v-model="form.cessao.taxaCessao" />
          <SelectField label="Tipo" :options="CESSAO_TIPO_OPTS" placeholder="Selecione" required :span="4" v-model="form.cessao.tipo" />
          <SelectField
            label="Parametrização de cálculo"
            :options="CESSAO_PARAM_OPTS"
            placeholder="Selecione"
            required
            :span="5"
            v-model="form.cessao.parametrizacaoCalculo"
          />
          <SelectField
            label="Tipo de cálculo"
            :options="CESSAO_TIPO_CALCULO_OPTS"
            placeholder="Selecione"
            required
            :span="3"
            v-model="form.cessao.tipoCalculoCessao"
          />
          <FormField label="% em garantia de recebíveis" placeholder="0,00" :span="4" v-model="form.cessao.pctGarantiaRecebiveis" />
          <FormField label="% em garantia de outras garantias" placeholder="0,00" :span="4" v-model="form.cessao.pctGarantiaOutras" />
          <FormField label="Desconto adicional (%)" placeholder="0" :span="4" v-model="form.cessao.descontoAdicional" />
          <FormField label="Taxa de multa (%)" placeholder="0,00" required :span="6" v-model="form.cessao.taxaMulta" />
          <FormField label="Taxa de mora (%)" placeholder="0,00" required :span="6" v-model="form.cessao.taxaMora" />
        </StepGrid>

        <ToggleRow
          label="Usar cálculo URA / de mercado"
          :on="form.cessao.usarCalculoUra"
          :disabled="!isPersonalizado && !!form.cessao.parametrizacaoCalculo"
          @toggle="form.cessao.usarCalculoUra = !form.cessao.usarCalculoUra"
        />

        <StepGrid v-if="isPersonalizado || form.cessao.parametrizacaoCalculo">
          <SelectField
            label="Frequência da taxa"
            :options="CESSAO_FREQUENCIA_OPTS"
            placeholder="Selecione"
            :span="4"
            :disabled="!isPersonalizado"
            v-model="form.cessao.frequenciaTaxa"
          />
          <SelectField
            label="Operador"
            :options="CESSAO_OPERADOR_OPTS"
            placeholder="Selecione"
            :span="4"
            :disabled="!isPersonalizado || !isPosFixado"
            v-model="form.cessao.operador"
          />
          <SelectField
            label="Indicador da taxa"
            :options="CESSAO_INDICADOR_OPTS"
            placeholder="Selecione"
            :span="4"
            :disabled="!isPersonalizado"
            v-model="form.cessao.indicadorTaxa"
          />
          <SelectField
            label="Tipo de capitalização"
            :options="CESSAO_CAPITALIZACAO_OPTS"
            placeholder="Selecione"
            :span="4"
            :disabled="!isPersonalizado"
            v-model="form.cessao.tipoCapitalizacao"
          />
          <SelectField
            label="Base de dias"
            :options="CESSAO_BASE_DIAS_OPTS"
            placeholder="Selecione"
            :span="4"
            :disabled="!isPersonalizado"
            v-model="form.cessao.baseDias"
          />
          <SelectField
            label="Início da contagem de juros"
            :options="CESSAO_INICIO_JUROS_OPTS"
            placeholder="Selecione"
            :span="4"
            :disabled="!isPersonalizado"
            v-model="form.cessao.inicioContagemJuros"
          />
          <SelectField
            label="Data usada para Accrual"
            :options="CESSAO_DATA_ACCRUAL_OPTS"
            placeholder="Selecione"
            :span="6"
            :disabled="!isPersonalizado"
            v-model="form.cessao.dataAccrual"
          />
        </StepGrid>

        <template v-if="isPersonalizado || form.cessao.parametrizacaoCalculo">
          <ToggleRow
            label="Usar certificador de e-mail"
            :on="form.cessao.usarCertificadorEmail"
            @toggle="form.cessao.usarCertificadorEmail = !form.cessao.usarCertificadorEmail"
          />
          <ToggleRow
            :label="conversaoLabel"
            :on="form.cessao.conversaoIndice"
            @toggle="form.cessao.conversaoIndice = !form.cessao.conversaoIndice"
          />
        </template>
      </div>
    </BentoBox>

    <ToggleRow
      label="Possui cronograma de pagamentos"
      :on="form.possuiCronograma"
      :disabled="isPosFixado"
      @toggle="!isPosFixado && (form.possuiCronograma = !form.possuiCronograma)"
    />

    <BentoBox v-if="form.possuiCronograma" title="Cronograma de Pagamentos" :icon="Tag">
      <div class="flex flex-col" style="gap: 14px">
        <ToggleRow
          label="Gerar pagamentos automaticamente"
          :on="form.cronogramaAutomatico"
          compact
          @toggle="form.cronogramaAutomatico = !form.cronogramaAutomatico"
        />

        <div v-if="form.cronogramaAutomatico" class="grid items-end" style="grid-template-columns: 1fr 1fr auto; gap: 12px">
          <SelectField label="Fluxo de Amortização" :options="FLUXO_OPTS" placeholder="Selecione" v-model="form.fluxoAmortizacao" />
          <SelectField label="Fluxo de pagamento de juros" :options="FLUXO_OPTS" placeholder="Selecione" v-model="form.fluxoJuros" />
          <AddButton @click="gerarPagamentosAutomaticos">Gerar pagamentos</AddButton>
        </div>
        <div v-else class="grid items-end" style="grid-template-columns: 1fr 1fr auto auto auto; gap: 12px">
          <FormField label="Amortização" placeholder="R$ 0,00" currency v-model="pagamentoForm.amortizacao" />
          <FormField label="Vencimento" placeholder="dd/mm/aaaa" required v-model="pagamentoForm.vencimento" />
          <ToggleRow label="Pagar juros" :on="pagamentoForm.pagarJuros" compact @toggle="pagamentoForm.pagarJuros = !pagamentoForm.pagarJuros" />
          <FormField
            label="Valor do juros"
            placeholder="R$ 0,00"
            currency
            v-model="pagamentoForm.valorJuros"
            :disabled="!pagamentoForm.pagarJuros || isPosFixado"
          />
          <AddButton @click="addPagamento">Adicionar pagamento</AddButton>
        </div>

        <div style="font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--danger-base)">
          Obs: Em títulos pré-fixados, caso o cronograma mostre pagamento de juros com valor de R$ 0,00, será considerado o valor de juros projetado na simulação.
        </div>

        <EmptyState
          v-if="cronograma.length === 0"
          :icon="CalendarClock"
          title="Nenhum pagamento adicionado ao cronograma"
          hint="Use o formulário acima para adicionar pagamentos manualmente ou gere automaticamente pelo fluxo selecionado."
        />
        <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
          <div
            class="grid"
            style="
              grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
              padding: 10px 14px;
              background: var(--surface-card);
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.12em;
              color: var(--text-muted);
              text-transform: uppercase;
            "
          >
            <div>Parcela</div>
            <div>Vencimento</div>
            <div>Amortização</div>
            <div>Juros</div>
            <div>Pagar juros</div>
            <div />
          </div>
          <div
            v-for="(c, i) in cronograma"
            :key="i"
            class="grid items-center"
            style="
              grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
              padding: 10px 14px;
              border-top: 1px solid var(--border-default);
              font-size: var(--text-sm);
            "
          >
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ c.parcela }}</div>
            <div style="font-variant-numeric: tabular-nums">{{ c.vencimento }}</div>
            <div style="font-variant-numeric: tabular-nums">{{ brl(c.amortizacao ?? 0) }}</div>
            <div style="font-variant-numeric: tabular-nums">{{ brl(c.juros ?? 0) }}</div>
            <div>{{ c.pagarJuros ? 'Sim' : 'Não' }}</div>
            <button
              aria-label="Remover"
              class="flex items-center justify-center"
              style="width: 28px; height: 28px; border: none; background: none; cursor: pointer; color: var(--text-muted)"
              @click="removePagamento(i)"
            >
              <Trash2 :size="14" />
            </button>
          </div>
          <div
            class="flex items-center justify-center"
            style="padding: 10px 14px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)"
          >
            Amortização: {{ brl(somatoriaAmortizacao) }}
          </div>
        </div>
      </div>
    </BentoBox>

    <BentoBox title="Dados do Sacado" :icon="Tag">
      <StepGrid>
        <FormField label="CPF/CNPJ" placeholder="—" :span="4" v-model="form.sacadoDocumento" />
        <FormField label="Nome" placeholder="—" :span="5" v-model="form.sacadoNome" />
        <FormField label="E-mail" placeholder="—" :span="3" v-model="form.sacadoEmail" />
        <SelectField label="DDI" :options="DDI_OPTS" :span="2" v-model="form.ddi" />
        <FormField label="Telefone" placeholder="—" :span="4" v-model="form.telefone" />
        <FormField label="CEP" placeholder="—" :span="3" v-model="form.cep" />
        <FormField label="Número" placeholder="—" :span="3" v-model="form.numeroEndereco" />
        <FormField label="Endereço" placeholder="—" :span="6" v-model="form.endereco" />
        <FormField label="Complemento" placeholder="—" :span="6" v-model="form.complemento" />
        <FormField label="Bairro" placeholder="—" :span="4" v-model="form.bairro" />
        <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" :span="2" v-model="form.estado" />
        <SelectField
          label="Cidade"
          :options="cidadeOpts"
          placeholder="Selecione"
          :span="4"
          :disabled="!form.estado"
          v-model="form.cidade"
        />
        <SelectField label="País" :options="PAIS_OPTS" placeholder="Selecione" :span="2" v-model="form.pais" />
      </StepGrid>
    </BentoBox>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { X, Tag, Paperclip, Trash2, FileText, AlertTriangle, Layers, CalendarClock } from 'lucide-vue-next';
import { brl, UF_OPTIONS, PAISES_DDI, type ContratoAtivo, type ParcelaAtivo, type ParteRelacionada } from '../../data/operacaoData';
import { isTipoMinutaDisponivel } from '../../data/minutaData';
import { BentoBox, BentoGrid, FormField, SelectField, EmptyState, ToggleRow, AddButton } from './adicionar-contrato';
import { MinutaWizard } from './minuta';

const props = defineProps<{
  valorOperacao: number;
  tipoCalculo: string;
  partes?: ParteRelacionada[];
}>();
const emit = defineEmits<{ close: []; create: [data: Omit<ContratoAtivo, 'id'> & Partial<Pick<ContratoAtivo, 'id'>>] }>();

const TIPO_OPERACAO_OPTS = [
  'Desconto Duplicata',
  'Contrato NC',
  'Contrato NP',
  'Contrato CCB',
  'Contrato CPR',
  'Contrato CPRF',
  'Contrato CDCA',
];
const DOC_CEDENTE_OPTS = ['Contrato_Social_Cedente.pdf', 'Procuracao_2026.pdf', 'Cartao_CNPJ.pdf'];
const FLUXO_OPTS = ['Única', 'Mensal', 'Bimestral', 'Trimestral', 'Quadrimestral', 'Semestral', 'Anual'];
const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const DDI_OPTS = PAISES_DDI.map((p) => p.ddi);

interface FormState {
  gerarMinuta: boolean;
  documento: string;
  tipoValorNominal: boolean;
  numero: string;
  tipo: string;
  emissao: string;
  vencimento: string;
  chaveNota: string;
  docCedente: string;
  gerarOperacaoGarantias: boolean;
  possuiParcelas: boolean;
  possuiCronograma: boolean;
  cronogramaAutomatico: boolean;
  fluxoAmortizacao: string;
  fluxoJuros: string;
  sacadoDocumento: string;
  sacadoNome: string;
  sacadoEmail: string;
  ddi: string;
  telefone: string;
  cep: string;
  endereco: string;
  numeroEndereco: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
}

const form = reactive<FormState>({
  gerarMinuta: false,
  documento: '',
  tipoValorNominal: false,
  numero: '',
  tipo: '',
  emissao: '',
  vencimento: '',
  chaveNota: '',
  docCedente: '',
  gerarOperacaoGarantias: false,
  possuiParcelas: false,
  possuiCronograma: false,
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

const parcelas = reactive<ParcelaAtivo[]>([]);
const parcelaForm = reactive({ valor: '', vencimento: '' });
const cronograma = reactive<ParcelaAtivo[]>([]);
const pagamentoForm = reactive({ amortizacao: '', vencimento: '', pagarJuros: false, valorJuros: '' });

const minutaHabilitada = computed(() => isTipoMinutaDisponivel(form.tipo));
const showWizard = computed(() => form.gerarMinuta && minutaHabilitada.value);

watch(
  () => form.tipo,
  (t) => {
    if (!isTipoMinutaDisponivel(t) && form.gerarMinuta) {
      form.gerarMinuta = false;
    }
  },
);

const somatoriaParcelas = computed(() => parcelas.reduce((acc, p) => acc + (Number(p.valor) || 0), 0));
const somatoriaAmortizacao = computed(() => cronograma.reduce((acc, c) => acc + (Number(c.amortizacao) || 0), 0));

function addParcela() {
  if (!parcelaForm.valor || !parcelaForm.vencimento) return;
  parcelas.push({
    parcela: `${parcelas.length + 1}ª Parcela`,
    valor: Number(parcelaForm.valor),
    vencimento: parcelaForm.vencimento,
  });
  parcelaForm.valor = '';
  parcelaForm.vencimento = '';
}
function removeParcela(i: number) {
  parcelas.splice(i, 1);
}

function addPagamento() {
  if (!pagamentoForm.vencimento) return;
  cronograma.push({
    parcela: `${cronograma.length + 1}ª Parcela`,
    vencimento: pagamentoForm.vencimento,
    amortizacao: Number(pagamentoForm.amortizacao) || 0,
    juros: pagamentoForm.pagarJuros ? Number(pagamentoForm.valorJuros) || 0 : 0,
    pagarJuros: pagamentoForm.pagarJuros,
  });
  pagamentoForm.amortizacao = '';
  pagamentoForm.vencimento = '';
  pagamentoForm.pagarJuros = false;
  pagamentoForm.valorJuros = '';
}
function removePagamento(i: number) {
  cronograma.splice(i, 1);
}

function gerarPagamentosAutomaticos() {
  if (!form.fluxoAmortizacao || !form.fluxoJuros) return;
  const base = props.valorOperacao > 0 ? props.valorOperacao / 2 : 50_000;
  cronograma.splice(
    0,
    cronograma.length,
    { parcela: '1ª Parcela', vencimento: '30/07/2026', amortizacao: Math.round(base), juros: Math.round(base * 0.02), pagarJuros: true },
    { parcela: '2ª Parcela', vencimento: '30/08/2026', amortizacao: Math.round(base), juros: Math.round(base * 0.02), pagarJuros: true },
  );
}

const canSubmit = computed(() => form.numero.trim() !== '' && form.tipo.trim() !== '');

function handleSubmit() {
  if (!canSubmit.value) return;
  emit('create', {
    numero: form.numero,
    tipo: form.tipo,
    emissao: form.emissao,
    vencimento: form.vencimento,
    valorTotal: props.valorOperacao,
    sacadoNome: form.sacadoNome,
    sacadoDocumento: form.sacadoDocumento,
    parcelas: form.possuiCronograma ? [...cronograma] : [...parcelas],
  } as Omit<ContratoAtivo, 'id'>);
}

function handleMinutaCreate(data: {
  numero: string;
  tipo: string;
  emissao: string;
  vencimento: string;
  valorTotal: number;
  sacadoNome: string;
  sacadoDocumento: string;
  parcelas: ParcelaAtivo[];
  minuta: ContratoAtivo['minuta'];
}) {
  const cedenteDoc = data.minuta?.emitentes?.[0]?.documento ?? '—';
  const cedenteNome = data.minuta?.emitentes?.[0]?.nome ?? '—';
  emit('create', {
    numero: data.numero,
    tipo: data.tipo,
    emissao: data.emissao,
    vencimento: data.vencimento,
    valorTotal: data.valorTotal,
    sacadoNome: data.sacadoNome,
    sacadoDocumento: data.sacadoDocumento,
    parcelas: data.parcelas,
    cedenteNome,
    cedenteDocumento: cedenteDoc,
    minuta: data.minuta,
  } as Omit<ContratoAtivo, 'id'>);
}

function toggleGerarMinuta() {
  if (!minutaHabilitada.value) return;
  form.gerarMinuta = !form.gerarMinuta;
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
      animation: fadeIn 0.2s ease-out;
    "
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 1040px;
        height: 88vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            Adicionar Contrato
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ showWizard ? 'Geração de minuta CPR / CPR-F · 7 etapas' : 'Dados do título, parcelas/cronograma e dados do sacado' }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="
            width: 36px;
            height: 36px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-default);
            background: var(--surface-card);
            cursor: pointer;
            color: var(--text-muted);
          "
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Wizard de minuta -->
      <MinutaWizard
        v-if="showWizard"
        :valor-operacao="valorOperacao"
        :tipo-calculo="tipoCalculo"
        :tipo="form.tipo"
        :partes="partes ?? []"
        :gerar-minuta="form.gerarMinuta"
        @update:gerar-minuta="form.gerarMinuta = $event"
        @create="handleMinutaCreate"
      />

      <!-- Body padrão (sem minuta) -->
      <template v-else>
        <div style="flex: 1; overflow-y: auto; padding: 32px">
          <div class="flex flex-col" style="gap: 24px">
            <BentoBox title="Dados do Título" :icon="Tag">
              <div class="flex flex-col" style="gap: 14px">
                <div
                  class="flex items-center"
                  style="
                    gap: 8px;
                    height: 42px;
                    padding: 0 14px;
                    background: var(--surface-card);
                    border: 1px dashed var(--border-default);
                    border-radius: var(--radius-lg);
                    color: var(--text-muted);
                    font-size: var(--text-sm);
                  "
                >
                  <Paperclip :size="15" /> Insira o documento...
                </div>

                <BentoGrid :cols="4">
                  <FormField label="Valor total" :model-value="brl(valorOperacao)" disabled />
                  <SelectField label="Tipo de cálculo" :options="[tipoCalculo]" :model-value="tipoCalculo" disabled />
                  <FormField label="Número" placeholder="—" v-model="form.numero" />
                  <SelectField label="Tipo" :options="TIPO_OPERACAO_OPTS" placeholder="Selecione" v-model="form.tipo" />
                </BentoGrid>

                <ToggleRow
                  label="Tipo de valor: NOMINAL"
                  :on="form.tipoValorNominal"
                  compact
                  @toggle="form.tipoValorNominal = !form.tipoValorNominal"
                />

                <BentoGrid :cols="4">
                  <FormField label="Emissão" placeholder="dd/mm/aaaa" v-model="form.emissao" required />
                  <FormField label="Vencimento" placeholder="dd/mm/aaaa" v-model="form.vencimento" required />
                  <FormField label="Chave da nota" placeholder="—" v-model="form.chaveNota" />
                  <SelectField label="Doc. da cedente" :options="DOC_CEDENTE_OPTS" placeholder="Selecione" v-model="form.docCedente" />
                </BentoGrid>

                <ToggleRow
                  label="Gerar operação no módulo de garantias"
                  :on="form.gerarOperacaoGarantias"
                  compact
                  @toggle="form.gerarOperacaoGarantias = !form.gerarOperacaoGarantias"
                />
              </div>
            </BentoBox>

            <ToggleRow
              label="Gerar minuta"
              :on="form.gerarMinuta"
              :disabled="!minutaHabilitada"
              @toggle="toggleGerarMinuta"
            />
            <div
              v-if="!minutaHabilitada && form.tipo"
              style="font-size: var(--text-xs); color: var(--text-muted); margin-top: -12px"
            >
              Disponível apenas para Contrato CPR e Contrato CPRF nesta versão.
            </div>
            <div
              v-else-if="!form.tipo"
              style="font-size: var(--text-xs); color: var(--text-muted); margin-top: -12px"
            >
              Selecione o tipo do título (CPR ou CPRF) para habilitar a geração de minuta.
            </div>

            <ToggleRow label="Possui múltiplas parcelas" :on="form.possuiParcelas" @toggle="form.possuiParcelas = !form.possuiParcelas" />
            <BentoBox v-if="form.possuiParcelas" title="Parcelas" :icon="Tag">
              <div class="flex flex-col" style="gap: 14px">
                <div class="grid items-end" style="grid-template-columns: 1fr 1fr 1fr auto; gap: 12px">
                  <FormField label="Parcela" :model-value="`${parcelas.length + 1}ª Parcela`" disabled />
                  <FormField label="Valor" placeholder="R$ 0,00" v-model="parcelaForm.valor" />
                  <FormField label="Vencimento" placeholder="dd/mm/aaaa" v-model="parcelaForm.vencimento" required />
                  <AddButton @click="addParcela">Adicionar parcela</AddButton>
                </div>

                <EmptyState
                  v-if="parcelas.length === 0"
                  :icon="Layers"
                  title="Nenhuma parcela adicionada"
                  hint="Use o formulário acima para adicionar as parcelas deste contrato."
                />
                <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
                  <div
                    class="grid"
                    style="
                      grid-template-columns: 1.4fr 1fr 1fr auto;
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
                    <div>Valor</div>
                    <div>Vencimento</div>
                    <div />
                  </div>
                  <div
                    v-for="(p, i) in parcelas"
                    :key="i"
                    class="grid items-center"
                    style="
                      grid-template-columns: 1.4fr 1fr 1fr auto;
                      padding: 10px 14px;
                      border-top: 1px solid var(--border-default);
                      font-size: var(--text-sm);
                    "
                  >
                    <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ p.parcela }}</div>
                    <div style="font-variant-numeric: tabular-nums">{{ brl(p.valor ?? 0) }}</div>
                    <div style="font-variant-numeric: tabular-nums">{{ p.vencimento }}</div>
                    <button
                      aria-label="Remover"
                      class="flex items-center justify-center"
                      style="width: 28px; height: 28px; border-radius: var(--radius-sm); background: none; border: none; cursor: pointer; color: var(--text-muted)"
                      @click="removeParcela(i)"
                    >
                      <Trash2 :size="14" />
                    </button>
                  </div>
                  <div
                    class="flex items-center justify-center"
                    style="padding: 10px 14px; border-top: 1px solid var(--border-default); font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)"
                  >
                    Somatória das parcelas: {{ brl(somatoriaParcelas) }}
                  </div>
                </div>
                <div
                  v-if="somatoriaParcelas !== valorOperacao"
                  class="flex items-center justify-center"
                  style="gap: 6px; font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--warning-base)"
                >
                  <AlertTriangle :size="13" /> Total das parcelas diferente do valor total solicitado
                </div>
              </div>
            </BentoBox>

            <ToggleRow
              label="Possui cronograma de pagamentos"
              :on="form.possuiCronograma"
              @toggle="form.possuiCronograma = !form.possuiCronograma"
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
                  <FormField label="Amortização" placeholder="R$ 0,00" v-model="pagamentoForm.amortizacao" />
                  <FormField label="Vencimento" placeholder="dd/mm/aaaa" v-model="pagamentoForm.vencimento" required />
                  <ToggleRow label="Pagar juros" :on="pagamentoForm.pagarJuros" compact @toggle="pagamentoForm.pagarJuros = !pagamentoForm.pagarJuros" />
                  <FormField label="Valor do juros" placeholder="R$ 0,00" v-model="pagamentoForm.valorJuros" :disabled="!pagamentoForm.pagarJuros" />
                  <AddButton @click="addPagamento">Adicionar pagamento</AddButton>
                </div>

                <div style="font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--danger-base)">
                  Obs: Em títulos pré-fixados, caso o cronograma mostre pagamento de juros com valor de R$ 0,00, será
                  considerado o valor de juros projetado na simulação.
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
                      style="width: 28px; height: 28px; border-radius: var(--radius-sm); background: none; border: none; cursor: pointer; color: var(--text-muted)"
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
              <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 14px">
                <div style="grid-column: span 4">
                  <FormField label="CPF/CNPJ" placeholder="—" v-model="form.sacadoDocumento" />
                </div>
                <div style="grid-column: span 5">
                  <FormField label="Nome" placeholder="—" v-model="form.sacadoNome" />
                </div>
                <div style="grid-column: span 3">
                  <FormField label="E-mail" placeholder="—" v-model="form.sacadoEmail" />
                </div>

                <div style="grid-column: span 2">
                  <SelectField label="DDI" :options="DDI_OPTS" v-model="form.ddi" />
                </div>
                <div style="grid-column: span 4">
                  <FormField label="Telefone" placeholder="—" v-model="form.telefone" />
                </div>
                <div style="grid-column: span 3">
                  <FormField label="CEP" placeholder="—" v-model="form.cep" />
                </div>
                <div style="grid-column: span 3">
                  <FormField label="Número" placeholder="—" v-model="form.numeroEndereco" />
                </div>

                <div style="grid-column: span 6">
                  <FormField label="Endereço" placeholder="—" v-model="form.endereco" />
                </div>
                <div style="grid-column: span 6">
                  <FormField label="Complemento" placeholder="—" v-model="form.complemento" />
                </div>

                <div style="grid-column: span 4">
                  <FormField label="Bairro" placeholder="—" v-model="form.bairro" />
                </div>
                <div style="grid-column: span 4">
                  <FormField label="Cidade" placeholder="—" v-model="form.cidade" />
                </div>
                <div style="grid-column: span 2">
                  <SelectField label="Estado" :options="UF_OPTIONS" placeholder="UF" v-model="form.estado" />
                </div>
                <div style="grid-column: span 2">
                  <SelectField label="País" :options="PAIS_OPTS" placeholder="Selecione" v-model="form.pais" />
                </div>
              </div>
            </BentoBox>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)">
          <button
            style="height: 44px; padding: 0 20px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
            @click="emit('close')"
          >
            Cancelar
          </button>
          <button
            :disabled="!canSubmit"
            class="flex items-center"
            :style="{
              gap: '8px',
              height: '44px',
              padding: '0 24px',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.08em',
              background: canSubmit ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
              color: canSubmit ? '#fff' : 'var(--text-disabled)',
              transition: 'background var(--duration-base)',
            }"
            @click="handleSubmit"
          >
            <FileText :size="15" /> GERAR TÍTULO
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

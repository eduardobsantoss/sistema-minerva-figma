<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { X, Tag, Paperclip, Trash2, FileText, AlertTriangle, Layers, MoreVertical, Copy, BadgeCheck } from 'lucide-vue-next';
import {
  brl, UF_OPTIONS, PAISES_DDI, buscarSacadoCadastrado,
  type ContratoAtivo, type ParcelaAtivo, type ParteRelacionada,
} from '../../data/operacaoData';
import { isTipoMinutaDisponivel, categoriaMinuta } from '../../data/minutaData';
import { BentoBox, BentoGrid, FormField, SelectField, EmptyState, ToggleRow, AddButton } from './adicionar-contrato';
import { MinutaWizard } from './minuta';

const props = defineProps<{
  valorOperacao: number;
  tipoCalculo: string;
  partes?: ParteRelacionada[];
  unidadeNegocio?: string;
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
const CFOP_OPTS = [
  '5117 - Transferência de título de crédito',
  '5949 - Outra saída de mercadoria/prestação não especificada',
  '6117 - Transferência de título de crédito (fora do Estado)',
  '6949 - Outra saída não especificada (fora do Estado)',
];
const METODO_DESCONTO_OPTS = ['Desconto Comercial (Por Fora)', 'Desconto Racional (Por Dentro)'];
const FLUXO_OPTS = ['Única', 'Mensal', 'Bimestral', 'Trimestral', 'Quadrimestral', 'Semestral', 'Anual'];
const PAIS_OPTS = PAISES_DDI.map((p) => p.pais);
const DDI_OPTS = PAISES_DDI.map((p) => p.ddi);

interface FormState {
  gerarMinuta: boolean;
  documento: string;
  valorInformado: 'DESAGIO' | 'AGIO';
  numero: string;
  tipo: string;
  emissao: string;
  vencimento: string;
  chaveNota: string;
  cfop: string;
  cedente: string;
  metodoDesconto: string;
  gerarOperacaoGarantias: boolean;
  possuiParcelas: boolean;
  gerarParcelas: boolean;
  fluxoParcelas: string;
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
  valorInformado: 'DESAGIO',
  numero: '',
  tipo: '',
  emissao: '',
  vencimento: '',
  chaveNota: '',
  cfop: '',
  cedente: '',
  metodoDesconto: '',
  gerarOperacaoGarantias: false,
  possuiParcelas: false,
  gerarParcelas: false,
  fluxoParcelas: '',
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
const openMenuIndex = ref<number | null>(null);

const sacadoEncontrado = computed(() => !!buscarSacadoCadastrado(form.sacadoDocumento));

watch(() => form.sacadoDocumento, (doc) => {
  const found = buscarSacadoCadastrado(doc);
  if (found) form.sacadoNome = found.nome;
});

const minutaHabilitada = computed(() => isTipoMinutaDisponivel(form.tipo));
const showWizard = computed(() => form.gerarMinuta && minutaHabilitada.value);
const wizardSubtitle = computed(() => {
  const cat = categoriaMinuta(form.tipo);
  if (cat === 'NC') return 'Geração de minuta Nota Comercial';
  if (cat === 'CCB') return 'Geração de minuta CCB';
  return 'Geração de minuta CPR / CPR-F';
});

watch(
  () => form.tipo,
  (t) => {
    if (!isTipoMinutaDisponivel(t) && form.gerarMinuta) {
      form.gerarMinuta = false;
    }
  },
);

const somatoriaParcelas = computed(() => parcelas.reduce((acc, p) => acc + (Number(p.valor) || 0), 0));

function renumerarParcelas() {
  parcelas.forEach((p, idx) => {
    p.parcela = `${idx + 1}ª Parcela`;
  });
}

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

function gerarParcelasAutomaticas() {
  if (!form.fluxoParcelas) return;
  const base = props.valorOperacao > 0 ? props.valorOperacao / 2 : 50_000;
  parcelas.splice(
    0,
    parcelas.length,
    { parcela: '1ª Parcela', valor: Math.round(base), vencimento: '30/07/2026' },
    { parcela: '2ª Parcela', valor: Math.round(base), vencimento: '30/08/2026' },
  );
  openMenuIndex.value = null;
}

function duplicarParcela(i: number) {
  const original = parcelas[i];
  parcelas.splice(i + 1, 0, { parcela: '', valor: original.valor, vencimento: '' });
  renumerarParcelas();
  openMenuIndex.value = null;
}

function removeParcela(i: number) {
  parcelas.splice(i, 1);
  renumerarParcelas();
  openMenuIndex.value = null;
}

function toggleMenu(i: number) {
  openMenuIndex.value = openMenuIndex.value === i ? null : i;
}

function handleClickOutsideParcela(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest('[data-parcela-action-menu]')) {
    openMenuIndex.value = null;
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutsideParcela));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutsideParcela));

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
    parcelas: [...parcelas],
    cedenteNome: form.cedente || undefined,
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
            {{ showWizard ? wizardSubtitle : 'Dados do título, parcelas e dados do sacado' }}
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
        :unidade-negocio="unidadeNegocio ?? ''"
        :gerar-minuta="form.gerarMinuta"
        @update:gerar-minuta="form.gerarMinuta = $event"
        @create="handleMinutaCreate"
      />

      <!-- Body padrão (sem minuta) -->
      <template v-else>
        <div style="flex: 1; overflow-y: auto; padding: 32px">
          <div class="flex flex-col" style="gap: 24px">
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
              Disponível apenas para Contrato CPR, CPRF, NC e CCB nesta versão.
            </div>
            <div
              v-else-if="!form.tipo"
              style="font-size: var(--text-xs); color: var(--text-muted); margin-top: -12px"
            >
              Selecione o tipo do título (CPR, CPRF, NC ou CCB) em Dados do Título para habilitar a geração de minuta.
            </div>

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
                  :label="`Valor Informado: ${form.valorInformado === 'AGIO' ? 'ÁGIO' : 'DESÁGIO'}`"
                  hint="Deságio: valor líquido. Ágio: valor de face."
                  :on="form.valorInformado === 'AGIO'"
                  compact
                  @toggle="form.valorInformado = form.valorInformado === 'AGIO' ? 'DESAGIO' : 'AGIO'"
                />

                <BentoGrid :cols="4">
                  <FormField label="Emissão" placeholder="dd/mm/aaaa" v-model="form.emissao" required />
                  <FormField label="Vencimento" placeholder="dd/mm/aaaa" v-model="form.vencimento" required />
                  <FormField label="Chave da nota" placeholder="—" v-model="form.chaveNota" />
                  <SelectField label="CFOP" :options="CFOP_OPTS" placeholder="Selecione" v-model="form.cfop" />
                </BentoGrid>

                <BentoGrid :cols="4">
                  <div style="grid-column: span 2">
                    <FormField label="Cedente" placeholder="—" v-model="form.cedente" />
                  </div>
                  <div style="grid-column: span 2">
                    <SelectField label="Método de Desconto" :options="METODO_DESCONTO_OPTS" placeholder="Selecione" v-model="form.metodoDesconto" />
                  </div>
                </BentoGrid>

                <ToggleRow
                  label="Gerar operação no módulo de garantias"
                  :on="form.gerarOperacaoGarantias"
                  compact
                  @toggle="form.gerarOperacaoGarantias = !form.gerarOperacaoGarantias"
                />
              </div>
            </BentoBox>

            <ToggleRow label="Possui múltiplas parcelas" :on="form.possuiParcelas" @toggle="form.possuiParcelas = !form.possuiParcelas" />
            <BentoBox v-if="form.possuiParcelas" title="Parcelas" :icon="Tag">
              <div class="flex flex-col" style="gap: 14px">
                <ToggleRow
                  label="Gerar parcelas"
                  :on="form.gerarParcelas"
                  compact
                  @toggle="form.gerarParcelas = !form.gerarParcelas"
                />

                <div v-if="form.gerarParcelas" class="grid items-end" style="grid-template-columns: 1fr auto; gap: 12px">
                  <SelectField label="Fluxo de parcelas" :options="FLUXO_OPTS" placeholder="Selecione" v-model="form.fluxoParcelas" />
                  <AddButton @click="gerarParcelasAutomaticas">Gerar pagamentos</AddButton>
                </div>
                <div v-else class="grid items-end" style="grid-template-columns: 1fr 1fr 1fr auto; gap: 12px">
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
                    <div>Ações</div>
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
                    <div style="font-variant-numeric: tabular-nums">{{ p.vencimento || '—' }}</div>
                    <div class="flex justify-end" style="position: relative" data-parcela-action-menu>
                      <button
                        aria-label="Ações"
                        class="flex items-center justify-center"
                        style="width: 28px; height: 28px; border: none; background: none; border-radius: var(--radius-sm); cursor: pointer; color: var(--text-muted)"
                        @click="toggleMenu(i)"
                      >
                        <MoreVertical :size="14" />
                      </button>
                      <div
                        v-if="openMenuIndex === i"
                        class="flex flex-col"
                        style="position: absolute; top: 30px; right: 0; z-index: 50; min-width: 150px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 6px"
                      >
                        <button
                          class="flex items-center parcela-action-item"
                          style="gap: 8px; padding: 8px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default); width: 100%"
                          @click="duplicarParcela(i)"
                        >
                          <Copy :size="14" style="color: var(--text-muted)" />
                          Copiar
                        </button>
                        <button
                          class="flex items-center parcela-action-item"
                          style="gap: 8px; padding: 8px 12px; background: none; border: none; cursor: pointer; border-radius: var(--radius-md); text-align: left; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--action-danger-text-only); width: 100%"
                          @click="removeParcela(i)"
                        >
                          <Trash2 :size="14" />
                          Deletar parcela
                        </button>
                      </div>
                    </div>
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

            <BentoBox title="Dados do Sacado" :icon="Tag">
              <div class="flex flex-col" style="gap: 14px">
                <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 14px">
                  <div style="grid-column: span 4">
                    <FormField label="CPF/CNPJ" placeholder="—" v-model="form.sacadoDocumento" />
                  </div>
                  <div style="grid-column: span 5">
                    <FormField label="Nome" placeholder="—" v-model="form.sacadoNome" :disabled="sacadoEncontrado" />
                  </div>
                  <div
                    v-if="sacadoEncontrado"
                    class="flex items-end"
                    style="grid-column: span 3; padding-bottom: 11px; gap: 6px; font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--success-base)"
                  >
                    <BadgeCheck :size="14" /> Sacado encontrado na base
                  </div>

                  <template v-if="!sacadoEncontrado">
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
                  </template>
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
            class="flex items-center btn-animated"
            :class="{ 'btn-primary': canSubmit }"
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

<style scoped>
.parcela-action-item:hover {
  background: var(--surface-sunken);
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Plus, Trash2 } from 'lucide-vue-next';
import AdminModal from '@/components/ui/AdminModal.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminSelect from '@/components/ui/AdminSelect.vue';
import AdminDateField from '@/components/ui/AdminDateField.vue';
import AdminFormField from '@/components/ui/AdminFormField.vue';
import AdminTextField from '@/components/ui/AdminTextField.vue';
import { Alert } from '@/components/feedback';
import EstoqueArquivoField from './EstoqueArquivoField.vue';
import {
  CONTRATO_LABEL,
  CONTRATO_STATUS,
  CONTRATO_TIPOS,
  CONTRAPARTE_LABEL,
  IMOVEL_STATUS_LABEL,
  addMonthsIso,
  brl,
  moneyToInput,
  parseMoney,
  todayIso,
  type ContratoTipo,
  type EstoqueContrato,
  type EstoqueImovel,
  type EstoqueParcela,
} from '../data/estoqueData';

const props = defineProps<{ imovel: EstoqueImovel }>();
const emit = defineEmits<{ close: []; save: [EstoqueContrato] }>();

interface Linha {
  id: string;
  vencimento: string;
  valor: string;
  original?: EstoqueParcela;
}

const atual = props.imovel.contrato;
const isEdit = !!atual;

const tipo = ref<ContratoTipo>(atual?.tipo ?? 'LOCACAO');
const contraparte = ref(atual?.contraparte ?? '');
const arquivo = ref(atual?.arquivo ?? '');
const linhas = ref<Linha[]>(
  (atual?.parcelas ?? []).map((p) => ({
    id: p.id,
    vencimento: p.vencimento,
    valor: moneyToInput(p.valor),
    original: p,
  })),
);
const qtdAdd = ref('1');
const tentou = ref(false);
let seq = 0;

const totalParcelas = computed(() => linhas.value.reduce((s, l) => s + parseMoney(l.valor), 0));

function adicionar() {
  const qtd = Math.min(60, Math.max(1, Math.floor(parseMoney(qtdAdd.value)) || 1));
  const ultima = linhas.value[linhas.value.length - 1];
  let vencimento = ultima?.vencimento || addMonthsIso(todayIso(), 1);
  const valor = ultima?.valor ?? '';
  for (let n = 0; n < qtd; n += 1) {
    if (ultima || n > 0) vencimento = addMonthsIso(vencimento, 1);
    seq += 1;
    linhas.value.push({ id: `nova-${Date.now()}-${seq}`, vencimento, valor });
  }
}

function remover(id: string) {
  linhas.value = linhas.value.filter((l) => l.id !== id);
}

function erroLinha(l: Linha): string {
  const v = parseMoney(l.valor);
  if (!l.vencimento) return 'Informe o vencimento.';
  if (v <= 0) return 'Informe o valor.';
  if (l.original && v < l.original.valorPago) return 'Valor menor que o já baixado.';
  return '';
}

const erros = computed(() => ({
  contraparte: contraparte.value.trim() ? '' : `Informe o ${CONTRAPARTE_LABEL[tipo.value].toLowerCase()}.`,
  parcelas: linhas.value.length ? '' : 'Lance ao menos uma parcela.',
  linhas: linhas.value.some((l) => erroLinha(l)),
}));
const valido = computed(() => !erros.value.contraparte && !erros.value.parcelas && !erros.value.linhas);

function salvar() {
  tentou.value = true;
  if (!valido.value) return;
  const ordenadas = [...linhas.value].sort((a, b) => a.vencimento.localeCompare(b.vencimento));
  emit('save', {
    tipo: tipo.value,
    contraparte: contraparte.value.trim(),
    arquivo: arquivo.value,
    parcelas: ordenadas.map((l, i) => ({
      id: l.original?.id ?? `parc-${Date.now()}-${i}`,
      numero: i + 1,
      vencimento: l.vencimento,
      valor: parseMoney(l.valor),
      valorPago: l.original?.valorPago ?? 0,
      baixas: l.original?.baixas ?? [],
    })),
  });
}
</script>

<template>
  <AdminModal
    size="lg"
    eyebrow="Estoque · Contrato"
    :title="isEdit ? 'Editar contrato e parcelas' : 'Lançar contrato e parcelas'"
    :subtitle="imovel.nome"
    @close="emit('close')"
  >
    <div class="flex flex-col" style="gap: 20px">
      <div class="grid" style="grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 16px">
        <AdminFormField label="Tipo de contrato" style="grid-column: span 4">
          <AdminSelect v-model="tipo" :options="CONTRATO_TIPOS.map((t) => ({ value: t, label: CONTRATO_LABEL[t] }))" />
        </AdminFormField>
        <AdminFormField :label="CONTRAPARTE_LABEL[tipo]" :error="tentou ? erros.contraparte : ''" style="grid-column: span 8">
          <AdminTextField v-model="contraparte" :placeholder="`Nome do ${CONTRAPARTE_LABEL[tipo].toLowerCase()}`" :invalid="tentou && !!erros.contraparte" />
        </AdminFormField>
        <AdminFormField label="Contrato assinado" style="grid-column: span 12">
          <EstoqueArquivoField v-model="arquivo" />
        </AdminFormField>
      </div>

      <Alert
        type="info"
        :dismissible="false"
        :message="`Lance as parcelas exatamente como estão no contrato, só data e valor. Ao salvar, o status do imóvel passa para ${IMOVEL_STATUS_LABEL[CONTRATO_STATUS[tipo]]}.`"
      />

      <div>
        <div class="flex items-center flex-wrap" style="gap: 12px; margin-bottom: 12px">
          <div style="flex: 1; min-width: 160px">
            <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">Parcelas</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
              {{ linhas.length }} lançada{{ linhas.length === 1 ? '' : 's' }} · {{ brl(totalParcelas) }}
            </div>
          </div>
          <div style="width: 88px">
            <AdminTextField v-model="qtdAdd" inputmode="numeric" placeholder="Qtd." />
          </div>
          <AdminButton variant="secondary" :icon="Plus" type="button" @click="adicionar">Adicionar parcelas</AdminButton>
        </div>

        <div v-if="tentou && erros.parcelas" style="font-size: var(--text-xs); color: var(--danger-base); margin-bottom: 8px">
          {{ erros.parcelas }}
        </div>

        <div v-if="linhas.length" class="flex flex-col" style="gap: 8px">
          <div
            class="grid"
            style="grid-template-columns: 48px minmax(0, 1fr) minmax(0, 1fr) 40px; gap: 12px; font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted)"
          >
            <div>Nº</div>
            <div>Vencimento</div>
            <div>Valor (R$)</div>
            <div />
          </div>
          <div v-for="(l, idx) in linhas" :key="l.id">
            <div class="grid items-center" style="grid-template-columns: 48px minmax(0, 1fr) minmax(0, 1fr) 40px; gap: 12px">
              <div style="font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">{{ idx + 1 }}</div>
              <AdminDateField v-model="l.vencimento" />
              <AdminTextField v-model="l.valor" inputmode="decimal" placeholder="0,00" :invalid="tentou && !!erroLinha(l)" />
              <button
                type="button"
                aria-label="Remover parcela"
                class="flex items-center justify-center"
                :disabled="!!l.original?.valorPago"
                :style="{
                  width: '40px',
                  height: '40px',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--surface-card)',
                  color: 'var(--text-muted)',
                  cursor: l.original?.valorPago ? 'not-allowed' : 'pointer',
                  opacity: l.original?.valorPago ? 'var(--opacity-disabled)' : 1,
                }"
                @click="remover(l.id)"
              >
                <Trash2 :size="16" />
              </button>
            </div>
            <div v-if="tentou && erroLinha(l)" style="font-size: var(--text-xs); color: var(--danger-base); margin: 4px 0 0 60px">
              {{ erroLinha(l) }}
            </div>
          </div>
        </div>
        <div
          v-else
          style="padding: 28px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); border: 1px dashed var(--border-default); border-radius: var(--radius-lg)"
        >
          Nenhuma parcela lançada. Informe a quantidade e clique em Adicionar parcelas.
        </div>
      </div>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" type="button" @click="emit('close')">Cancelar</AdminButton>
      <AdminButton variant="agro" size="large" type="button" @click="salvar">Salvar contrato</AdminButton>
    </template>
  </AdminModal>
</template>

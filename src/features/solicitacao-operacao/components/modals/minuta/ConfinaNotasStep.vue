<script setup lang="ts">
import { computed, ref } from 'vue';
import { Trash2, Receipt, FileSpreadsheet } from 'lucide-vue-next';
import { brl } from '../../../data/operacaoData';
import { BentoBox, StepGrid, FormField, AddButton, EmptyState } from '../adicionar-contrato';
import {
  emptyConfinaNotaDraft,
  type ConfinaNotaFiscal,
  type ConfinaOperacaoForm,
  type ConfinaGta,
} from '../../../data/minutaData';
import ConfinaPreviaSimulacao from './ConfinaPreviaSimulacao.vue';

const notas = defineModel<ConfinaNotaFiscal[]>('notas', { default: () => [] });
defineProps<{ operacao: ConfinaOperacaoForm }>();

const draft = ref(emptyConfinaNotaDraft());
const importMsg = ref('');

const nfOk = computed(() => {
  const n = draft.value.numero.trim();
  const v = draft.value.valorTotal.trim();
  const d = draft.value.dataEmissao.trim();
  const valorVazio = !v || v === 'R$ 0,00';
  return !!n && !valorVazio && !!d;
});

const pendingGta = computed<ConfinaGta | null>(() => {
  const numero = draft.value.gtaNumero.trim();
  const quantidade = draft.value.gtaQuantidade.trim();
  if (!numero || !quantidade) return null;
  return { numero, quantidade };
});

const gtasEfetivas = computed(() => {
  const list = [...draft.value.gtas];
  if (pendingGta.value) list.push(pendingGta.value);
  return list;
});

const canAddNota = computed(() => nfOk.value && gtasEfetivas.value.length >= 1);

const addNotaHint = computed(() => {
  if (canAddNota.value) return '';
  const missing: string[] = [];
  if (!draft.value.numero.trim()) missing.push('número da nota');
  if (!draft.value.valorTotal.trim() || draft.value.valorTotal === 'R$ 0,00') missing.push('valor total');
  if (!draft.value.dataEmissao.trim()) missing.push('data de emissão');
  if (gtasEfetivas.value.length < 1) missing.push('ao menos uma GTA');
  return `Preencha: ${missing.join(', ')}.`;
});

function addGta() {
  if (!pendingGta.value) return;
  draft.value.gtas = [...draft.value.gtas, pendingGta.value];
  draft.value.gtaNumero = '';
  draft.value.gtaQuantidade = '';
}

function removeGtaDraft(i: number) {
  draft.value.gtas = draft.value.gtas.filter((_, idx) => idx !== i);
}

function addNota() {
  if (!canAddNota.value) return;
  const gtas = gtasEfetivas.value.map((g) => ({ ...g }));
  notas.value = [
    ...notas.value,
    {
      numero: draft.value.numero.trim(),
      valorTotal: draft.value.valorTotal,
      dataEmissao: draft.value.dataEmissao.trim(),
      gtas,
    },
  ];
  draft.value = emptyConfinaNotaDraft();
  importMsg.value = '';
}

function removeNota(i: number) {
  notas.value = notas.value.filter((_, idx) => idx !== i);
}

function qtdTotal(n: ConfinaNotaFiscal) {
  return n.gtas.reduce((acc, g) => acc + (Number(g.quantidade) || 0), 0);
}

function fmtValor(v: string) {
  if (v.startsWith('R$')) return v;
  const n = Number(String(v).replace(/[^\d,.-]/g, '').replace(',', '.'));
  return Number.isFinite(n) ? brl(n) : v || '—';
}

function importarExcel() {
  const mock: ConfinaNotaFiscal = {
    numero: `NF-${1000 + notas.value.length + 1}`,
    valorTotal: 'R$ 34.234,24',
    dataEmissao: '11/08/2026',
    gtas: [
      { numero: 'GTA-1001', quantidade: '120' },
      { numero: 'GTA-1002', quantidade: '80' },
    ],
  };
  notas.value = [...notas.value, mock];
  importMsg.value = 'Importação simulada: 1 nota fiscal adicionada.';
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <BentoBox title="Informações das notas fiscais" :icon="Receipt">
      <div class="flex flex-col" style="gap: 16px">
        <div class="flex items-center justify-between" style="gap: 12px">
          <p style="margin: 0; font-size: var(--text-sm); color: var(--text-muted)">
            Preencha a nota e as GTAs do rascunho; a GTA ainda nos campos é incluída ao adicionar a nota.
          </p>
          <button
            type="button"
            class="flex items-center"
            style="
              gap: 8px;
              height: 40px;
              padding: 0 16px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              cursor: pointer;
              font-weight: var(--weight-bold);
              font-size: var(--text-xs);
              letter-spacing: 0.04em;
              color: var(--gci-base);
              white-space: nowrap;
            "
            @click="importarExcel"
          >
            <FileSpreadsheet :size="14" />
            Importar Excel
          </button>
        </div>
        <p
          v-if="importMsg"
          style="margin: 0; font-size: var(--text-xs); color: var(--success-base); font-weight: var(--weight-semibold)"
        >
          {{ importMsg }}
        </p>

        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
          Dados da nota fiscal
        </div>
        <StepGrid>
          <FormField label="Número da nota fiscal" placeholder="—" :span="4" v-model="draft.numero" />
          <FormField label="Valor total da nota" currency :span="4" v-model="draft.valorTotal" />
          <FormField label="Data de emissão" placeholder="dd/mm/aaaa" :span="4" v-model="draft.dataEmissao" />
        </StepGrid>

        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
          GTAs / TTAs
        </div>
        <StepGrid>
          <FormField label="Número da GTA" placeholder="—" :span="5" v-model="draft.gtaNumero" />
          <FormField label="Quantidade de animais" placeholder="0" :span="4" v-model="draft.gtaQuantidade" />
          <div style="grid-column: span 3; display: flex; align-items: flex-end">
            <AddButton
              full-width
              :disabled="!pendingGta"
              @click="addGta"
            >
              Adicionar GTA
            </AddButton>
          </div>
        </StepGrid>

        <div
          v-if="draft.gtas.length > 0"
          style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden; background: var(--surface-card)"
        >
          <div
            class="grid"
            style="
              grid-template-columns: 1.2fr 1fr auto;
              padding: 8px 14px;
              background: var(--surface-sunken);
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.12em;
              color: var(--text-muted);
              text-transform: uppercase;
            "
          >
            <div>GTA</div>
            <div>Quantidade</div>
            <div />
          </div>
          <div
            v-for="(g, i) in draft.gtas"
            :key="i"
            class="grid items-center"
            style="
              grid-template-columns: 1.2fr 1fr auto;
              padding: 8px 14px;
              border-top: 1px solid var(--border-default);
              font-size: var(--text-sm);
            "
          >
            <div style="font-weight: var(--weight-semibold)">{{ g.numero }}</div>
            <div style="font-variant-numeric: tabular-nums">{{ g.quantidade }}</div>
            <button
              type="button"
              aria-label="Remover GTA"
              class="flex items-center justify-center"
              style="width: 28px; height: 28px; border: none; background: none; cursor: pointer; color: var(--danger-base)"
              @click="removeGtaDraft(i)"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>

        <div class="flex flex-col items-end" style="gap: 6px">
          <AddButton :disabled="!canAddNota" @click="addNota">Adicionar nota fiscal</AddButton>
          <span v-if="addNotaHint" style="font-size: var(--text-xs); color: var(--text-muted)">
            {{ addNotaHint }}
          </span>
        </div>
      </div>
    </BentoBox>

    <EmptyState
      v-if="notas.length === 0"
      :icon="Receipt"
      title="Nenhuma nota fiscal adicionada"
      hint="Preencha os dados acima e clique em Adicionar nota fiscal."
    />
    <div
      v-else
      style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden"
    >
      <div
        class="grid"
        style="
          grid-template-columns: 1fr 0.8fr 1.1fr 1fr 0.8fr auto;
          padding: 10px 14px;
          background: var(--surface-sunken);
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.12em;
          color: var(--text-muted);
          text-transform: uppercase;
        "
      >
        <div>Nota Fiscal</div>
        <div>GTAs</div>
        <div>Valor total da nota</div>
        <div>Data da nota</div>
        <div>Quantidade</div>
        <div />
      </div>
      <div
        v-for="(n, i) in notas"
        :key="i"
        class="grid items-center"
        style="
          grid-template-columns: 1fr 0.8fr 1.1fr 1fr 0.8fr auto;
          padding: 10px 14px;
          border-top: 1px solid var(--border-default);
          font-size: var(--text-sm);
        "
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ n.numero }}</div>
        <div style="color: var(--gci-base); font-weight: var(--weight-semibold)">
          {{ n.gtas.length }} GTA{{ n.gtas.length === 1 ? '' : 's' }}
        </div>
        <div style="font-variant-numeric: tabular-nums">{{ fmtValor(n.valorTotal) }}</div>
        <div>{{ n.dataEmissao }}</div>
        <div style="font-variant-numeric: tabular-nums">{{ qtdTotal(n) }}</div>
        <button
          type="button"
          aria-label="Remover nota"
          class="flex items-center justify-center"
          style="width: 28px; height: 28px; border: none; background: none; cursor: pointer; color: var(--danger-base)"
          @click="removeNota(i)"
        >
          <Trash2 :size="14" />
        </button>
      </div>
    </div>

    <ConfinaPreviaSimulacao :operacao="operacao" />
  </div>
</template>

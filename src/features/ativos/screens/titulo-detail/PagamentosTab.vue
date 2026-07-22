<script setup lang="ts">
import { computed, ref } from 'vue';
import { brl, type TituloAtivoGlobal } from '../../data/ativosData';
import Section from './Section.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

const props = defineProps<{ titulo: TituloAtivoGlobal }>();

interface PagamentoLocal {
  data: string;
  valorAmortizacao: number;
  tipoPagamento: string;
  jurosMoratorio: number;
  multa: number;
}

const pagamentos = ref<PagamentoLocal[]>(
  props.titulo.ultimoPagamento
    ? [
        {
          data: props.titulo.ultimoPagamento,
          valorAmortizacao: props.titulo.valorNominal - props.titulo.valorAberto,
          tipoPagamento: 'TED',
          jurosMoratorio: 0,
          multa: 0,
        },
      ]
    : [],
);

const form = ref({
  dataPagamento: '',
  valorAmortizacao: '',
  tipoPagamento: 'TED',
  jurosMoratorio: '',
  multa: '',
});

const canSalvar = computed(
  () => form.value.dataPagamento.trim() !== '' && form.value.valorAmortizacao.trim() !== '',
);

function handleSalvar() {
  if (!canSalvar.value) return;
  pagamentos.value = [
    {
      data: form.value.dataPagamento,
      valorAmortizacao: Number(form.value.valorAmortizacao) || 0,
      tipoPagamento: form.value.tipoPagamento,
      jurosMoratorio: Number(form.value.jurosMoratorio) || 0,
      multa: Number(form.value.multa) || 0,
    },
    ...pagamentos.value,
  ];
  form.value = { dataPagamento: '', valorAmortizacao: '', tipoPagamento: 'TED', jurosMoratorio: '', multa: '' };
}

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => pagamentos.value,
  { defaultPageSize: 5 },
);
</script>

<template>
  <div class="flex flex-col" style="gap: 28px">
    <Section title="Registrar Pagamento">
      <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 14px">
        <div>
          <div class="field-label">Data do pagamento</div>
          <input v-model="form.dataPagamento" type="text" placeholder="dd/mm/aaaa" class="field-input" />
        </div>
        <div>
          <div class="field-label">Valor amortização</div>
          <input v-model="form.valorAmortizacao" type="number" placeholder="0,00" class="field-input" />
        </div>
        <div>
          <div class="field-label">Tipo</div>
          <select v-model="form.tipoPagamento" class="field-input">
            <option value="TED">TED</option>
            <option value="PIX">PIX</option>
            <option value="BOLETO">Boleto</option>
            <option value="OUTRO">Outro</option>
          </select>
        </div>
        <div>
          <div class="field-label">Juros moratório</div>
          <input v-model="form.jurosMoratorio" type="number" placeholder="0,00" class="field-input" />
        </div>
        <div>
          <div class="field-label">Multa</div>
          <input v-model="form.multa" type="number" placeholder="0,00" class="field-input" />
        </div>
        <div class="flex items-end">
          <button
            :disabled="!canSalvar"
            :style="{
              height: '38px',
              padding: '0 18px',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              cursor: canSalvar ? 'pointer' : 'not-allowed',
              background: canSalvar ? 'var(--action-primary-bg)' : 'var(--surface-sunken)',
              color: canSalvar ? '#fff' : 'var(--text-muted)',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.06em',
              opacity: canSalvar ? 1 : 0.7,
            }"
            @click="handleSalvar"
          >
            SALVAR PAGAMENTO
          </button>
        </div>
      </div>
    </Section>

    <Section title="Pagamentos Realizados">
      <div v-if="pagamentos.length === 0" style="padding: 32px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
        Nenhum pagamento registrado para este título.
      </div>
      <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 12px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase">
          <div>Data</div>
          <div>Tipo</div>
          <div style="text-align: right">Amortização</div>
          <div style="text-align: right">Juros</div>
          <div style="text-align: right">Multa</div>
        </div>
        <div
          v-for="(p, i) in pageItems"
          :key="i"
          class="grid items-center"
          style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; padding: 14px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
        >
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ p.data }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ p.tipoPagamento }}</div>
          <div style="text-align: right; font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(p.valorAmortizacao) }}</div>
          <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)">{{ brl(p.jurosMoratorio) }}</div>
          <div style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-default)">{{ brl(p.multa) }}</div>
        </div>
        <TablePagination sunken compact :total="total" :page="page" :page-size="pageSize" @update:page="setPage" @update:page-size="setPageSize" />
      </div>
    </Section>
  </div>
</template>

<style scoped>
.field-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 6px;
}
.field-input {
  width: 100%;
  height: 38px;
  padding: 0 12px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  outline: none;
  font-size: var(--text-sm);
  color: var(--text-strong);
}
</style>

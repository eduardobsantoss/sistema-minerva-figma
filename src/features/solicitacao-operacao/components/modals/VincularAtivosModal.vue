<script setup lang="ts">
import { computed, ref } from 'vue';
import { X, Search } from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';
import { brl, type ContratoAtivo } from '../../data/operacaoData';
import { TITULOS_DISPONIVEIS, tituloDisponivelParaContrato } from '../../data/ativoData';
import { FormField } from './adicionar-contrato';

const emit = defineEmits<{ close: []; vincular: [ativos: ContratoAtivo[]] }>();

const filtroLastro = ref('');
const filtroNumeros = ref('');
const filtroDataIni = ref('');
const filtroDataFim = ref('');
const filtroSacado = ref('');
const selectedIds = ref<Set<string>>(new Set());

const titulos = computed(() => {
  const l = filtroLastro.value.trim().toLowerCase();
  const n = filtroNumeros.value.trim().toLowerCase();
  const s = filtroSacado.value.trim().toLowerCase();
  return TITULOS_DISPONIVEIS.filter((t) => {
    if (l && !t.lastro.toLowerCase().includes(l)) return false;
    if (n && !t.numero.toLowerCase().includes(n)) return false;
    if (s && !t.sacado.toLowerCase().includes(s)) return false;
    return true;
  });
});

const totalSelecionado = computed(() =>
  titulos.value.filter((t) => selectedIds.value.has(t.id)).reduce((acc, t) => acc + t.valorNominal, 0),
);
const totalConfirmado = computed(() => totalSelecionado.value);
const percentual = computed(() => (totalSelecionado.value > 0 ? 100 : 0));

const allSelected = computed(
  () => titulos.value.length > 0 && titulos.value.every((t) => selectedIds.value.has(t.id)),
);
const someSelected = computed(
  () => titulos.value.some((t) => selectedIds.value.has(t.id)) && !allSelected.value,
);

function toggle(id: string) {
  const next = new Set(selectedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selectedIds.value = next;
}

function toggleAll() {
  const all = allSelected.value;
  const next = new Set(selectedIds.value);
  for (const t of titulos.value) {
    if (all) next.delete(t.id);
    else next.add(t.id);
  }
  selectedIds.value = next;
}

function confirmar() {
  const ativos = titulos.value
    .filter((t) => selectedIds.value.has(t.id))
    .map(tituloDisponivelParaContrato);
  emit('vincular', ativos);
}
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      z-index: 100;
      background: rgba(8, 60, 74, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    "
    @click.self="emit('close')"
  >
    <div
      class="flex flex-col"
      style="
        width: 100%;
        max-width: 1100px;
        max-height: 90vh;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        border: 1px solid var(--border-default);
        overflow: hidden;
      "
    >
      <div class="flex items-center justify-between" style="padding: 20px 24px; border-bottom: 1px solid var(--border-default)">
        <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Vincular Ativos</h3>
        <button aria-label="Fechar" style="background: none; border: none; cursor: pointer; color: var(--text-muted)" @click="emit('close')">
          <X :size="20" />
        </button>
      </div>

      <div style="padding: 20px 24px; overflow-y: auto; flex: 1">
        <div class="grid" style="grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px">
          <FormField label="Lastro" placeholder="Buscar lastro" v-model="filtroLastro" />
          <FormField label="Números" placeholder="Buscar número" v-model="filtroNumeros" />
          <FormField label="Data criação inicial" placeholder="dd/mm/aaaa" v-model="filtroDataIni" />
          <FormField label="Data criação final" placeholder="dd/mm/aaaa" v-model="filtroDataFim" />
          <FormField label="Nome do sacado" placeholder="Buscar sacado" v-model="filtroSacado" />
        </div>

        <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
          <div style="overflow-x: auto">
            <div style="min-width: 1000px">
              <div
                class="grid items-center"
                style="
                  grid-template-columns: 40px 80px 90px 70px 90px 100px 100px 120px 1.2fr 1.2fr 90px 70px;
                  padding: 10px 14px;
                  background: var(--surface-sunken);
                  font-size: 10px;
                  font-weight: var(--weight-bold);
                  letter-spacing: 0.08em;
                  color: var(--text-muted);
                  text-transform: uppercase;
                "
              >
                <div class="flex items-center justify-center">
                  <Checkbox :checked="allSelected" :indeterminate="someSelected" @change="toggleAll" />
                </div>
                <div>Lastro</div>
                <div>Número</div>
                <div>Tipo</div>
                <div>Situação</div>
                <div>Confirmação</div>
                <div>Criação</div>
                <div>Emissão</div>
                <div>Valor nominal</div>
                <div>Cedente</div>
                <div>Sacado</div>
                <div>Vencimento</div>
                <div>Entrega</div>
              </div>
              <div
                v-for="t in titulos"
                :key="t.id"
                class="grid items-center"
                style="
                  grid-template-columns: 40px 80px 90px 70px 90px 100px 100px 120px 1.2fr 1.2fr 90px 70px;
                  padding: 10px 14px;
                  border-top: 1px solid var(--border-default);
                  font-size: var(--text-sm);
                "
              >
                <div class="flex items-center justify-center">
                  <Checkbox :checked="selectedIds.has(t.id)" @change="toggle(t.id)" />
                </div>
                <div>{{ t.lastro }}</div>
                <div style="font-weight: var(--weight-semibold)">{{ t.numero }}</div>
                <div>{{ t.tipoOperacao }}</div>
                <div>{{ t.situacao }}</div>
                <div>{{ t.confirmacao }}</div>
                <div>{{ t.dataCriacao }}</div>
                <div>{{ t.dataEmissao }}</div>
                <div style="font-variant-numeric: tabular-nums">{{ brl(t.valorNominal) }}</div>
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{ t.cedente }}</div>
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{ t.sacado }}</div>
                <div>{{ t.vencimento }}</div>
                <div>{{ t.entrega }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex items-center justify-between"
        style="padding: 16px 24px; border-top: 1px solid var(--border-default); flex-wrap: wrap; gap: 12px"
      >
        <div class="flex items-center" style="gap: 20px; flex-wrap: wrap">
          <div>
            <span style="font-size: var(--text-xs); color: var(--text-muted)">Total selecionado</span>
            <div style="font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(totalSelecionado) }}</div>
          </div>
          <div>
            <span style="font-size: var(--text-xs); color: var(--text-muted)">Total confirmado</span>
            <div style="font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(totalConfirmado) }}</div>
          </div>
          <div>
            <span style="font-size: var(--text-xs); color: var(--text-muted)">Percentual</span>
            <div style="font-weight: var(--weight-bold)">{{ percentual }}%</div>
          </div>
        </div>
        <button
          :disabled="selectedIds.size === 0"
          style="
            height: 44px;
            padding: 0 24px;
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.08em;
          "
          @click="confirmar"
        >
          VINCULAR
        </button>
      </div>
    </div>
  </div>
</template>

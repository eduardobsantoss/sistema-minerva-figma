<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ArrowLeft, Search } from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { useToast } from '@/composables/useToast';
import RegistrarConfirmacaoModal from './RegistrarConfirmacaoModal.vue';
import {
  PAGE_SIZE_OPTIONS,
  PERMISSOES,
  brl,
  confirmarTitulos,
  corRegistroTitulo,
  formatDateBR,
  fmtPct,
  nomeRegistroTitulo,
  toneOf,
  type Cessao,
  type ConfirmacaoTitulo,
} from '../data/gerencialData';

const props = defineProps<{
  cessao: Cessao;
  veiculoNome: string;
  somenteLeitura?: boolean;
  embutido?: boolean;
}>();

const emit = defineEmits<{ close: [] }>();
const { success } = useToast();

const selecionados = ref<string[]>([]);
const modalAberto = ref(false);
const filtroLastro = ref('');
const filtroNumero = ref('');
const filtroSacado = ref('');
const podeConfirmar = computed(() => !props.somenteLeitura && PERMISSOES.confirmarTitulo);
const confirmacaoAtiva = computed(() => podeConfirmar.value && selecionados.value.length > 0);

const filtrados = computed(() => {
  const lastro = filtroLastro.value.trim().toLowerCase();
  const numero = filtroNumero.value.trim().toLowerCase();
  const sacado = filtroSacado.value.trim().toLowerCase();
  return props.cessao.titulos.filter((t) => {
    if (lastro && !t.lastro.toLowerCase().includes(lastro)) return false;
    if (numero && !t.numero.toLowerCase().includes(numero)) return false;
    if (sacado && !t.sacado.toLowerCase().includes(sacado)) return false;
    return true;
  });
});

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => filtrados.value,
  { defaultPageSize: 5 },
);
const linhas = computed(() => (props.somenteLeitura ? filtrados.value : pageItems.value));
watch(() => props.cessao.id, () => {
  selecionados.value = [];
  filtroLastro.value = '';
  filtroNumero.value = '';
  filtroSacado.value = '';
  setPage(1);
});

const grid = props.somenteLeitura
  ? '88px 110px minmax(160px, 1.4fr) 120px 120px 120px 120px 104px 72px 150px 120px'
  : '28px 88px 110px 120px 110px 168px 130px 96px 104px minmax(140px, 1fr) minmax(140px, 1fr) 120px 120px 120px 120px';

function badgeConfirmacao(status: ConfirmacaoTitulo) {
  if (status === 'Confirmado') return toneOf('ok');
  if (status === 'Não confirmado') return toneOf('bad');
  if (status === 'Dispensado') return toneOf('muted');
  return toneOf('warn');
}

function toggle(id: string) {
  selecionados.value = selecionados.value.includes(id)
    ? selecionados.value.filter((item) => item !== id)
    : [...selecionados.value, id];
}

function registrar(payload: { status: ConfirmacaoTitulo }) {
  confirmarTitulos(props.cessao.id, selecionados.value, payload.status);
  selecionados.value = [];
  modalAberto.value = false;
  success('Confirmação registrada.');
}

</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div v-if="!embutido" class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="emit('close')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          Gerencial · Títulos da cessão
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          {{ cessao.nome }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ veiculoNome }} · {{ formatDateBR(cessao.data) }} · {{ cessao.tipoTitulo }}
        </p>
      </div>
      <button
        v-if="podeConfirmar"
        type="button"
        class="ger-btn-primary"
        :disabled="!confirmacaoAtiva"
        @click="modalAberto = true"
      >
        Confirmar
      </button>
    </div>

    <div
      class="flex items-center justify-between"
      style="gap: 16px; flex-wrap: wrap; background: var(--gci-base); border-radius: var(--radius-xl); padding: 22px 26px; color: #fff"
    >
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 8px">
          Valor em aberto
        </div>
        <div style="font-size: 32px; font-weight: var(--weight-bold); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1">
          {{ brl(cessao.valorAberto) }}
        </div>
      </div>
      <div>
        <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: rgba(255, 255, 255, 0.6); text-transform: uppercase; margin-bottom: 6px">
          Valor da cessão
        </div>
        <div style="font-size: var(--text-md); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">
          {{ brl(cessao.valorCessao) }}
        </div>
      </div>
    </div>

    <div class="flex items-center" style="gap: 12px; flex-wrap: wrap">
      <div class="relative" style="flex: 1; min-width: 160px">
        <Search :size="15" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
        <input v-model="filtroLastro" placeholder="Lastro" class="filter-input" />
      </div>
      <div class="relative" style="flex: 1; min-width: 160px">
        <Search :size="15" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
        <input v-model="filtroNumero" placeholder="Número" class="filter-input" />
      </div>
      <div class="relative" style="flex: 1; min-width: 160px">
        <Search :size="15" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
        <input v-model="filtroSacado" placeholder="Sacado" class="filter-input" />
      </div>
    </div>

    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <div style="overflow-x: auto">
        <div :style="{ minWidth: somenteLeitura ? '1280px' : '1680px' }">
          <div class="grid items-center gt-head" :style="{ gridTemplateColumns: grid }">
            <div v-if="!somenteLeitura" class="flex items-center justify-center" />
            <div>Lastro</div>
            <div>Número</div>
            <template v-if="!somenteLeitura">
              <div>Situação</div>
              <div>Pagamento</div>
              <div>Confirmação</div>
              <div>Notificação</div>
              <div>Criação</div>
              <div>Vencimento</div>
              <div>Cedente</div>
              <div>Sacado</div>
              <div>Original</div>
              <div>Aquisição</div>
              <div>Presente</div>
              <div>Em aberto</div>
            </template>
            <template v-else>
              <div>Sacado</div>
              <div>Original</div>
              <div>Aquisição</div>
              <div>Presente</div>
              <div>Em aberto</div>
              <div>Vencimento</div>
              <div>Taxa</div>
              <div>Confirmação</div>
              <div>Registro</div>
            </template>
          </div>

          <div v-if="linhas.length === 0" style="padding: 32px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
            Nenhum título nesta cessão.
          </div>

          <div v-for="t in linhas" :key="t.id" class="grid items-center gt-row" :style="{ gridTemplateColumns: grid }">
            <template v-if="!somenteLeitura">
              <div class="flex items-center justify-center" @click.stop>
                <Checkbox :checked="selecionados.includes(t.id)" @change="toggle(t.id)" />
              </div>
              <div class="cell-strong">{{ t.lastro }}</div>
              <div class="cell-strong">{{ t.numero }}</div>
              <div>{{ t.situacao }}</div>
              <div>{{ t.statusPagamento }}</div>
              <div>
                <span class="badge" :style="{ background: badgeConfirmacao(t.confirmacao).bg, color: badgeConfirmacao(t.confirmacao).text }">
                  {{ t.confirmacao }}
                </span>
              </div>
              <div>{{ t.notificacao }}</div>
              <div class="cell-muted">{{ formatDateBR(t.criacao) }}</div>
              <div class="cell-muted">{{ formatDateBR(t.vencimento) }}</div>
              <div class="cell-clip" :title="t.cedente">{{ t.cedente }}</div>
              <div class="cell-clip" :title="t.sacado">{{ t.sacado }}</div>
              <div class="cell-strong">{{ brl(t.valorOriginal) }}</div>
              <div class="cell-num">{{ brl(t.valorAquisicao) }}</div>
              <div class="cell-num">{{ brl(t.valorPresente) }}</div>
              <div class="cell-strong">{{ brl(t.valorAberto) }}</div>
            </template>
            <template v-else>
              <div class="cell-strong">{{ t.lastro }}</div>
              <div class="cell-strong">{{ t.numero }}</div>
              <div class="cell-clip" :title="t.sacado">{{ t.sacado }}</div>
              <div class="cell-strong">{{ brl(t.valorOriginal) }}</div>
              <div class="cell-num">{{ brl(t.valorAquisicao) }}</div>
              <div class="cell-num">{{ brl(t.valorPresente) }}</div>
              <div class="cell-strong">{{ brl(t.valorAberto) }}</div>
              <div class="cell-muted">{{ formatDateBR(t.vencimento) }}</div>
              <div class="cell-num">{{ fmtPct(t.taxaOp) }}</div>
              <div>
                <span class="badge" :style="{ background: badgeConfirmacao(t.confirmacao).bg, color: badgeConfirmacao(t.confirmacao).text }">
                  {{ t.confirmacao }}
                </span>
              </div>
              <div>
                <span class="badge" :style="{ background: toneOf(corRegistroTitulo(t.registroCodigo)).bg, color: toneOf(corRegistroTitulo(t.registroCodigo)).text }">
                  {{ nomeRegistroTitulo(t.registroCodigo) }}
                </span>
              </div>
            </template>
          </div>
        </div>
      </div>
      <TablePagination
        v-if="!somenteLeitura"
        sunken
        compact
        :total="total"
        :page="page"
        :page-size="pageSize"
        :page-size-options="PAGE_SIZE_OPTIONS"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </div>

    <RegistrarConfirmacaoModal v-if="modalAberto" @close="modalAberto = false" @confirm="registrar" />
  </div>
</template>

<style scoped>
.filter-input {
  width: 100%;
  height: 40px;
  padding-left: 36px;
  padding-right: 12px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  outline: none;
  font-size: var(--text-sm);
  color: var(--text-strong);
}
.gt-head,
.gt-row {
  column-gap: 12px;
  padding: 12px 16px;
}
.gt-head {
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-transform: uppercase;
  white-space: nowrap;
}
.gt-row {
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
}
.cell-strong {
  font-weight: var(--weight-semibold);
  color: var(--text-strong);
  font-variant-numeric: tabular-nums;
}
.cell-num,
.cell-muted {
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
}
.cell-clip {
  color: var(--text-default);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.badge {
  display: inline-block;
  font-size: 9px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 9999px;
  text-transform: uppercase;
  white-space: nowrap;
}
</style>

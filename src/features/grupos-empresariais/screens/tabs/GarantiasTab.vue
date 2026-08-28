<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import {
  CheckCircle2,
  Clock,
  MoreVertical,
  Pencil,
  RefreshCw,
  Shield,
  ShieldCheck,
  Trash2,
  XCircle,
} from 'lucide-vue-next';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue';
import ConfirmTypedActionModal from '@/components/ui/ConfirmTypedActionModal.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import Tooltip from '@/components/ui/Tooltip.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import GarantiaMinutaStep from '@/features/solicitacao-operacao/components/modals/minuta/GarantiaMinutaStep.vue';
import {
  AddButton,
  EmptyState,
} from '@/features/solicitacao-operacao/components/modals/adicionar-contrato';
import {
  seedGarantiaGrupo,
  type GarantiaGrupo,
  type SituacaoRegistroGrupo,
} from '../../data/gruposCadastroData';

const props = defineProps<{ garantias: GarantiaGrupo[] }>();
const emit = defineEmits<{ 'update:garantias': [items: GarantiaGrupo[]] }>();

const minutaRef = ref<InstanceType<typeof GarantiaMinutaStep> | null>(null);
const menuOpen = ref<number | null>(null);
const toDelete = ref<GarantiaGrupo | null>(null);
const toUpdateStatus = ref<GarantiaGrupo | null>(null);

const STATUS_CONFIRM_PHRASE = 'GARANTIA-EM-EXECUCAO';

const COLS =
  'minmax(200px, min(400px, 36%)) 96px minmax(130px, 1fr) 96px 100px 84px 100px 112px 48px';

const model = computed({
  get: () => props.garantias,
  set: (next) => {
    emit(
      'update:garantias',
      next.map((g) => (isGarantiaGrupo(g) ? g : seedGarantiaGrupo(g))),
    );
  },
});

function isGarantiaGrupo(g: unknown): g is GarantiaGrupo {
  return !!g && typeof g === 'object' && 'id' in g && typeof (g as GarantiaGrupo).id === 'string';
}

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.garantias,
  { defaultPageSize: 10 },
);

function globalIndex(pageIdx: number) {
  return (page.value - 1) * pageSize.value + pageIdx;
}

function closeMenu() {
  menuOpen.value = null;
}

function toggleMenu(i: number) {
  menuOpen.value = menuOpen.value === i ? null : i;
}

function onClickOutsideMenu(e: MouseEvent) {
  const t = e.target as HTMLElement | null;
  if (t?.closest('[data-garantia-grupo-menu]')) return;
  closeMenu();
}

onMounted(() => document.addEventListener('mousedown', onClickOutsideMenu));
onUnmounted(() => document.removeEventListener('mousedown', onClickOutsideMenu));

function shieldColor(g: GarantiaGrupo) {
  return g.situacaoGarantia === 'em_uso' ? 'var(--gci-base)' : 'var(--success-base, #16a34a)';
}

function registroCartorioColor(sit: SituacaoRegistroGrupo) {
  if (sit === 'pendente') return 'var(--text-muted)';
  if (sit === 'ok') return 'var(--success-base, #16a34a)';
  return 'var(--action-danger-text-only, #dc2626)';
}

function registroRegistradoraColor(sit: SituacaoRegistroGrupo) {
  if (sit === 'ok') return 'var(--success-base, #16a34a)';
  return 'var(--action-danger-text-only, #dc2626)';
}

function usoBarColor(pct: number) {
  if (pct >= 100) return 'var(--success-base, #16a34a)';
  if (pct >= 50) return 'var(--warning-base, #f59e0b)';
  return 'var(--neutral-300, #cbd5e1)';
}

function podeExcluir(g: GarantiaGrupo) {
  return g.qtdOperacoes === 0;
}

function openNova() {
  minutaRef.value?.openNova();
}

function openEdit(i: number) {
  closeMenu();
  minutaRef.value?.openEdit(i);
}

function openUpdateStatus(g: GarantiaGrupo) {
  closeMenu();
  toUpdateStatus.value = g;
}

function confirmUpdateStatus() {
  if (!toUpdateStatus.value) return;
  const id = toUpdateStatus.value.id;
  model.value = props.garantias.map((g) =>
    g.id === id ? { ...g, situacaoGarantia: 'em_uso' } : g,
  );
  toUpdateStatus.value = null;
}

function askDelete(g: GarantiaGrupo) {
  if (!podeExcluir(g)) return;
  closeMenu();
  toDelete.value = g;
}

function confirmDelete() {
  if (!toDelete.value) return;
  model.value = props.garantias.filter((g) => g.id !== toDelete.value!.id);
  toDelete.value = null;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center justify-end">
      <AddButton @click="openNova">Adicionar garantia</AddButton>
    </div>

    <EmptyState
      v-if="garantias.length === 0"
      :icon="Shield"
      title="Nenhuma garantia adicionada"
      hint="Clique em Adicionar garantia para cadastrar AF. Estoque, Lavoura, Imóvel e demais tipos disponíveis."
    />

    <div
      v-else
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-lg);
        overflow: hidden;
        background: var(--surface-card);
      "
    >
      <div style="overflow-x: auto">
        <div class="garantia-grupo-table-inner">
          <div class="grid items-center garantia-grupo-table-row garantia-grupo-table-header" :style="{ gridTemplateColumns: COLS }">
            <div class="garantia-grupo-th">Tipo</div>
            <Tooltip content="Data de Aquisição" side="bottom" variant="light">
              <div class="garantia-grupo-th">Aquisição</div>
            </Tooltip>
            <div class="garantia-grupo-th garantia-grupo-th-num">Valor</div>
            <Tooltip content="Porcentagem usada" side="bottom" variant="light">
              <div class="garantia-grupo-th">Uso</div>
            </Tooltip>
            <Tooltip content="Quantidade de operações" side="bottom" variant="light">
              <div class="garantia-grupo-th">Operações</div>
            </Tooltip>
            <Tooltip content="Situação da Garantia" side="bottom" variant="light">
              <div class="garantia-grupo-th garantia-grupo-th-center">Garantia</div>
            </Tooltip>
            <Tooltip content="Situação do Registro no Cartório" side="bottom" variant="light">
              <div class="garantia-grupo-th garantia-grupo-th-center">Cartório</div>
            </Tooltip>
            <Tooltip content="Situação do Registro em Registradora" side="bottom" variant="light">
              <div class="garantia-grupo-th garantia-grupo-th-center">Registradora</div>
            </Tooltip>
            <div class="garantia-grupo-th garantia-grupo-th-actions">Ações</div>
          </div>

          <div
            v-for="(g, pageIdx) in pageItems"
            :key="g.id"
            class="grid items-center garantia-grupo-table-row"
            :style="{ gridTemplateColumns: COLS }"
          >
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong); min-width: 0; line-height: 1.35">
              {{ g.tipo }}
            </div>
            <div style="font-variant-numeric: tabular-nums; color: var(--text-default); white-space: nowrap">
              {{ g.dataAquisicao }}
            </div>
            <div class="garantia-grupo-td-num" style="color: var(--text-strong)">
              {{ g.valor || '—' }}
            </div>
            <div class="flex items-center" style="gap: 6px">
              <div
                style="
                  width: 40px;
                  height: 6px;
                  border-radius: 999px;
                  background: var(--neutral-200);
                  overflow: hidden;
                  flex-shrink: 0;
                "
                :title="`${g.percentualUsado ?? 0}% usado`"
              >
                <div
                  :style="{
                    width: `${g.percentualUsado ?? 0}%`,
                    height: '100%',
                    background: usoBarColor(g.percentualUsado ?? 0),
                  }"
                />
              </div>
              <span style="font-size: 11px; color: var(--text-muted); font-variant-numeric: tabular-nums; white-space: nowrap">
                {{ g.percentualUsado ?? 0 }}%
              </span>
            </div>
            <div style="font-variant-numeric: tabular-nums; color: var(--text-default); text-align: center">
              {{ g.qtdOperacoes }}
            </div>
            <div class="flex items-center justify-center">
              <ShieldCheck :size="16" :stroke-width="2.25" :style="{ color: shieldColor(g), flexShrink: 0 }" />
            </div>
            <div class="flex items-center justify-center">
              <Clock
                v-if="g.situacaoRegistroCartorio === 'pendente'"
                :size="16"
                :stroke-width="2.25"
                :style="{ color: registroCartorioColor(g.situacaoRegistroCartorio) }"
              />
              <XCircle
                v-else-if="g.situacaoRegistroCartorio === 'nao'"
                :size="16"
                :stroke-width="2.25"
                :style="{ color: registroCartorioColor(g.situacaoRegistroCartorio) }"
              />
              <CheckCircle2
                v-else
                :size="16"
                :stroke-width="2.25"
                :style="{ color: registroCartorioColor(g.situacaoRegistroCartorio) }"
              />
            </div>
            <div class="flex items-center justify-center">
              <XCircle
                v-if="g.situacaoRegistroRegistradora === 'nao'"
                :size="16"
                :stroke-width="2.25"
                :style="{ color: registroRegistradoraColor(g.situacaoRegistroRegistradora) }"
              />
              <CheckCircle2
                v-else
                :size="16"
                :stroke-width="2.25"
                :style="{ color: registroRegistradoraColor(g.situacaoRegistroRegistradora) }"
              />
            </div>
            <div class="flex justify-end" style="position: relative" data-garantia-grupo-menu>
              <button
                type="button"
                aria-label="Ações"
                class="flex items-center justify-center"
                style="
                  width: 32px;
                  height: 32px;
                  border: 1px solid var(--border-default);
                  border-radius: var(--radius-lg);
                  background: var(--surface-card);
                  cursor: pointer;
                  color: var(--text-muted);
                "
                @click.stop="toggleMenu(globalIndex(pageIdx))"
              >
                <MoreVertical :size="15" />
              </button>
              <div
                v-if="menuOpen === globalIndex(pageIdx)"
                class="flex flex-col"
                style="
                  position: absolute;
                  top: 36px;
                  right: 0;
                  z-index: 50;
                  min-width: 248px;
                  background: var(--surface-card);
                  border: 1px solid var(--border-default);
                  border-radius: var(--radius-lg);
                  box-shadow: var(--shadow-md);
                  padding: 6px;
                "
              >
                <button
                  type="button"
                  class="flex items-center garantia-grupo-action-item"
                  style="
                    gap: 8px;
                    padding: 8px 12px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    border-radius: var(--radius-md);
                    text-align: left;
                    font-size: var(--text-sm);
                    font-weight: var(--weight-semibold);
                    color: var(--text-default);
                    width: 100%;
                  "
                  @click="openEdit(globalIndex(pageIdx))"
                >
                  <Pencil :size="14" style="color: var(--text-muted); flex-shrink: 0" />
                  Editar
                </button>
                <button
                  type="button"
                  class="flex items-center garantia-grupo-action-item"
                  style="
                    gap: 8px;
                    padding: 8px 12px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    border-radius: var(--radius-md);
                    text-align: left;
                    font-size: var(--text-sm);
                    font-weight: var(--weight-semibold);
                    color: var(--text-default);
                    width: 100%;
                  "
                  @click="openUpdateStatus(g)"
                >
                  <RefreshCw :size="14" style="color: var(--text-muted); flex-shrink: 0" />
                  Atualizar Status da Garantia
                </button>
                <button
                  type="button"
                  class="flex items-center garantia-grupo-action-item"
                  :disabled="!podeExcluir(g)"
                  :style="{
                    gap: '8px',
                    padding: '8px 12px',
                    background: 'none',
                    border: 'none',
                    cursor: podeExcluir(g) ? 'pointer' : 'not-allowed',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'left',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--weight-semibold)',
                    color: podeExcluir(g) ? 'var(--action-danger-text-only)' : 'var(--text-disabled)',
                    width: '100%',
                    opacity: podeExcluir(g) ? 1 : 0.55,
                  }"
                  @click="askDelete(g)"
                >
                  <Trash2 :size="14" style="flex-shrink: 0" />
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TablePagination
        :total="total"
        :page="page"
        :page-size="pageSize"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </div>

    <GarantiaMinutaStep
      ref="minutaRef"
      v-model:garantias="model"
      hide-table
      hide-header
      :edit-on-row-click="false"
      :show-possui-toggle="false"
    />

    <ConfirmTypedActionModal
      v-if="toUpdateStatus"
      title="Atualizar status"
      instruction="Digite o código abaixo para colocar a garantia em execução"
      :confirm-phrase="STATUS_CONFIRM_PHRASE"
      confirm-label="Confirmar"
      @close="toUpdateStatus = null"
      @confirm="confirmUpdateStatus"
    />

    <ConfirmDeleteModal
      v-if="toDelete"
      :title="`Excluir a garantia «${toDelete.tipo}»?`"
      description="Esta ação remove a garantia deste grupo. Não será possível desfazer por aqui."
      @close="toDelete = null"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.garantia-grupo-table-inner {
  width: 100%;
  min-width: 960px;
}

.garantia-grupo-table-row {
  column-gap: 10px;
  padding: 12px 16px;
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
}

.garantia-grupo-table-header {
  border-top: none;
  padding: 10px 16px;
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.garantia-grupo-th {
  white-space: nowrap;
}

.garantia-grupo-th-center {
  text-align: center;
}

.garantia-grupo-th-num {
  text-align: right;
}

.garantia-grupo-th-actions {
  text-align: right;
}

.garantia-grupo-td-num {
  font-variant-numeric: tabular-nums;
  text-align: right;
  white-space: nowrap;
}

.garantia-grupo-action-item:hover:not(:disabled) {
  background: var(--surface-sunken);
}
</style>

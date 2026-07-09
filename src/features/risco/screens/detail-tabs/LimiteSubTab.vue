<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { FileText, Eye, RefreshCw, AlertTriangle, Layers, Plus, Trash2 } from 'lucide-vue-next';
import { RATINGS_SEED, brl, type ParametrizacaoLimite, type LimiteProdutoRow } from '../../data/riscoData';
import { TabCard, FieldLabel, SelectField } from './shared';
import IncluirLimiteModal from '../../components/modals/IncluirLimiteModal.vue';

interface Props {
  data: ParametrizacaoLimite;
}

const props = defineProps<Props>();
const emit = defineEmits<{ save: [data: ParametrizacaoLimite] }>();
const form = reactive<ParametrizacaoLimite>({ ...props.data, limites: [...props.data.limites] });
const modalOpen = ref(false);

const LIMITE_TABLE_GRID = 'minmax(140px, 2fr) minmax(88px, 1fr) minmax(100px, 1.1fr) 40px';

const RATING_OPTS = [...RATINGS_SEED.map((r) => r.nome), 'NÃO SE APLICA'];

const limitesAgrupados = computed(() => {
  const map = new Map<string, LimiteProdutoRow[]>();
  for (const l of form.limites) {
    const arr = map.get(l.agrupamento) ?? [];
    arr.push(l);
    map.set(l.agrupamento, arr);
  }
  return [...map.entries()];
});

function handleIncluirLimites(novos: LimiteProdutoRow[]) {
  form.limites = [...form.limites, ...novos];
  modalOpen.value = false;
  emit('save', { ...form, limites: [...form.limites] });
}

function removeLimite(id: string) {
  form.limites = form.limites.filter((l) => l.id !== id);
  emit('save', { ...form, limites: [...form.limites] });
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <TabCard title="Dados da Análise" :icon="FileText" has-save @save="emit('save', { ...form, limites: [...form.limites] })">
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
        <div>
          <FieldLabel>* Parecer de crédito</FieldLabel>
          <div v-if="form.parecerCreditoArquivo" class="flex items-center justify-between" style="height: 40px; padding: 0 8px 0 14px; border: 1px solid var(--border-default); border-radius: var(--radius-lg)">
            <span style="font-size: var(--text-sm); color: var(--text-default); overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{ form.parecerCreditoArquivo }}</span>
            <div class="flex items-center" style="gap: 4px">
              <button aria-label="Visualizar" class="flex items-center justify-center" style="width: 28px; height: 28px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--text-muted)">
                <Eye :size="14" />
              </button>
              <button aria-label="Atualizar" class="flex items-center justify-center" style="width: 28px; height: 28px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--text-muted)">
                <RefreshCw :size="14" />
              </button>
            </div>
          </div>
          <div v-else class="flex items-center justify-between" style="height: 40px; padding: 0 14px; border: 1px dashed var(--danger-base); border-radius: var(--radius-lg); background: var(--status-danger-bg)">
            <span style="font-size: var(--text-sm); color: var(--danger-base); font-weight: var(--weight-semibold)">Nenhum parecer anexado</span>
            <button class="flex items-center justify-center" style="width: 28px; height: 28px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--danger-base)">
              <RefreshCw :size="14" />
            </button>
          </div>
        </div>
        <SelectField
          label="Indicativo de rating"
          :options="RATING_OPTS"
          :value="form.indicativoRating"
          @change="form.indicativoRating = ($event.target as HTMLSelectElement).value"
        />
      </div>
    </TabCard>

    <div v-if="form.reparametrizacaoData" class="flex items-center" style="gap: 12px; padding: 14px 18px; border-radius: var(--radius-lg); background: var(--status-warning-bg); border: 1px solid var(--warning-base)">
      <AlertTriangle :size="18" style="color: var(--warning-dark); flex-shrink: 0" />
      <span style="font-size: var(--text-sm); color: var(--warning-dark); font-weight: var(--weight-semibold)">
        Este grupo possui reparametrização de limite agendada para {{ form.reparametrizacaoData }}.
      </span>
    </div>

    <TabCard title="Limites por Agrupamento" :icon="Layers">
      <div class="flex justify-end" style="margin-bottom: 14px">
        <button
          class="flex items-center"
          style="gap: 6px; height: 36px; padding: 0 16px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
          @click="modalOpen = true"
        >
          <Plus :size="14" /> INCLUIR LIMITE
        </button>
      </div>

      <div v-if="form.limites.length === 0" style="padding: 32px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); border: 1px dashed var(--border-default); border-radius: var(--radius-lg)">
        Nenhum limite cadastrado. Clique em "Incluir Limite" para adicionar.
      </div>

      <div v-for="[agrupamento, rows] in limitesAgrupados" :key="agrupamento" style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 12px">
        <div style="padding: 12px 16px; background: var(--surface-sunken); font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          {{ agrupamento }}
        </div>
        <div class="grid items-center limite-table-row limite-table-header" :style="{ gridTemplateColumns: LIMITE_TABLE_GRID }">
          <div>Produto</div><div class="limite-col-num">Limite</div><div class="limite-col-date">Vencimento</div><div />
        </div>
        <div v-for="row in rows" :key="row.id" class="grid items-center limite-table-row" :style="{ gridTemplateColumns: LIMITE_TABLE_GRID }">
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ row.produto }}</div>
          <div class="limite-col-num">{{ brl(row.valor, { compact: true }) }}</div>
          <div class="limite-col-date">{{ row.vencimento }}</div>
          <div class="flex justify-end">
            <button aria-label="Remover" class="flex items-center justify-center" style="width: 26px; height: 26px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--action-danger-text-only)" @click="removeLimite(row.id)">
              <Trash2 :size="13" />
            </button>
          </div>
        </div>
      </div>
    </TabCard>

    <IncluirLimiteModal v-if="modalOpen" @close="modalOpen = false" @confirm="handleIncluirLimites" />
  </div>
</template>

<style scoped>
.limite-table-row {
  column-gap: 16px;
  padding: 12px 16px;
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
}

.limite-table-header {
  padding: 10px 16px;
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.limite-col-num {
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.limite-col-date {
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
  white-space: nowrap;
  padding-left: 4px;
}
</style>

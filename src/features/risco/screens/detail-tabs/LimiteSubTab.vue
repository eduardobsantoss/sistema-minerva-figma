<script setup lang="ts">
import { reactive } from 'vue';
import { FileText, Eye, RefreshCw, AlertTriangle, Layers, Plus } from 'lucide-vue-next';
import { RATINGS_SEED, AGRUPAMENTOS_SEED, brl, type ParametrizacaoLimite } from '../../data/riscoData';
import { TabCard, FieldLabel, SelectField } from './shared';

interface Props {
  data: ParametrizacaoLimite;
}

const props = defineProps<Props>();
const emit = defineEmits<{ save: [data: ParametrizacaoLimite] }>();
const form = reactive<ParametrizacaoLimite>({ ...props.data });

const RATING_OPTS = [...RATINGS_SEED.map((r) => r.nome), 'NÃO SE APLICA'];

function nomeAgrupamento(id: string) {
  return AGRUPAMENTOS_SEED.find((a) => a.id === id)?.nome ?? id;
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <TabCard title="Dados da Análise" :icon="FileText" has-save @save="emit('save', form)">
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

    <TabCard title="Agrupamentos" :icon="Layers">
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid items-center" style="grid-template-columns: 2fr 1fr 1fr 1fr 44px; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
          <div>Agrupamento</div><div style="text-align: right">Produtos</div><div style="text-align: right">Limite</div><div style="text-align: right">Risco</div><div />
        </div>
        <div v-for="(row, i) in form.agrupamentos" :key="i" class="grid items-center" style="grid-template-columns: 2fr 1fr 1fr 1fr 44px; padding: 12px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ nomeAgrupamento(row.agrupamentoId) }}</div>
          <div style="text-align: right; font-variant-numeric: tabular-nums">{{ row.produtos }}</div>
          <div style="text-align: right; font-variant-numeric: tabular-nums">{{ brl(row.limite, { compact: true }) }}</div>
          <div style="text-align: right; font-variant-numeric: tabular-nums">{{ brl(row.risco, { compact: true }) }}</div>
          <div class="flex justify-end">
            <button
              aria-label="Adicionar agrupamento"
              title="Vincular novo agrupamento (em breve)"
              class="flex items-center justify-center"
              style="width: 28px; height: 28px; border-radius: var(--radius-md); border: 1px solid var(--border-default); background: none; cursor: pointer; color: var(--text-muted)"
            >
              <Plus :size="13" />
            </button>
          </div>
        </div>
      </div>
    </TabCard>
  </div>
</template>

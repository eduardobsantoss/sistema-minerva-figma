<script setup lang="ts">
import { reactive } from 'vue';
import { Users, FileText, Star, UserCog, Eye, RefreshCw } from 'lucide-vue-next';
import {
  RATINGS_SEED, gerentePorNome, type GrupoEmpresarial,
  type ParteRelacionada, type ParametrizacaoLimite,
} from '../../data/riscoData';
import { TabCard, FieldLabel, SelectField } from './shared';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

interface Props {
  grupo: GrupoEmpresarial;
  partesRelacionadas: ParteRelacionada[];
  limite: ParametrizacaoLimite;
}

const props = defineProps<Props>();
const emit = defineEmits<{ 'update:limite': [data: ParametrizacaoLimite]; 'update:rating': [rating: string] }>();

const form = reactive({ ...props.limite });
const gerente = gerentePorNome(props.grupo.gerente);
const RATING_OPTS = [...RATINGS_SEED.map((r) => r.nome), 'NÃO SE APLICA'];

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => props.partesRelacionadas,
  { defaultPageSize: 5 },
);

function saveRating() {
  emit('update:limite', { ...form });
  emit('update:rating', form.indicativoRating);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <TabCard title="Partes Relacionadas" :icon="Users">
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div class="grid items-center" style="grid-template-columns: 1.4fr 1fr 1.2fr 1fr 1fr; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase">
          <div>Nome</div><div>Documento</div><div>E-mail</div><div>Telefone</div><div>Estado Civil</div>
        </div>
        <div v-for="p in pageItems" :key="p.id" class="grid items-center" style="grid-template-columns: 1.4fr 1fr 1.2fr 1fr 1fr; padding: 12px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)">
          <div>
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ p.nome }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ p.papel }}</div>
          </div>
          <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ p.documento }}</div>
          <div style="color: var(--text-default)">{{ p.email }}</div>
          <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">{{ p.telefone }}</div>
          <div style="color: var(--text-default)">{{ p.estadoCivil }}</div>
        </div>
        <TablePagination
          v-if="partesRelacionadas.length > 0"
          sunken
          compact
          :total="total"
          :page="page"
          :page-size="pageSize"
          :page-size-options="[5, 10, 25]"
          @update:page="setPage"
          @update:page-size="setPageSize"
        />
      </div>
    </TabCard>

    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
      <TabCard title="Parecer de Crédito" :icon="FileText">
        <div v-if="form.parecerCreditoArquivo" class="flex flex-col" style="gap: 12px">
          <div class="flex items-center justify-between" style="padding: 14px 16px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); background: var(--surface-sunken)">
            <div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{ form.parecerCreditoArquivo }}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">Atualizado em {{ form.parecerAtualizadoEm ?? '—' }}</div>
            </div>
            <div class="flex items-center" style="gap: 4px">
              <button aria-label="Visualizar" class="flex items-center justify-center" style="width: 28px; height: 28px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--text-muted)">
                <Eye :size="14" />
              </button>
              <button aria-label="Atualizar" class="flex items-center justify-center" style="width: 28px; height: 28px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--text-muted)">
                <RefreshCw :size="14" />
              </button>
            </div>
          </div>
          <div>
            <FieldLabel>Próximo vencimento</FieldLabel>
            <div style="font-size: var(--text-sm); color: var(--text-default); font-variant-numeric: tabular-nums">{{ form.parecerProximoVencimento ?? 'Não Informado' }}</div>
          </div>
        </div>
        <div v-else style="padding: 20px; border: 1px dashed var(--danger-base); border-radius: var(--radius-lg); background: var(--status-danger-bg); text-align: center">
          <span style="font-size: var(--text-sm); color: var(--danger-base); font-weight: var(--weight-semibold)">Nenhum parecer anexado</span>
        </div>
      </TabCard>

      <TabCard title="Rating do Cliente" :icon="Star" has-save @save="saveRating">
        <SelectField
          label="Indicativo de rating"
          :options="RATING_OPTS"
          :value="form.indicativoRating"
          @change="form.indicativoRating = ($event.target as HTMLSelectElement).value"
        />
      </TabCard>
    </div>

    <TabCard v-if="gerente" title="Gerente do Grupo" :icon="UserCog">
      <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px">
        <div>
          <FieldLabel>Nome</FieldLabel>
          <div style="font-size: var(--text-sm); color: var(--text-strong); font-weight: var(--weight-semibold)">{{ gerente.nome }}</div>
        </div>
        <div>
          <FieldLabel>Documento</FieldLabel>
          <div style="font-size: var(--text-sm); color: var(--text-default); font-variant-numeric: tabular-nums">{{ gerente.documento }}</div>
        </div>
        <div>
          <FieldLabel>Telefone</FieldLabel>
          <div style="font-size: var(--text-sm); color: var(--text-default); font-variant-numeric: tabular-nums">{{ gerente.telefone }}</div>
        </div>
        <div>
          <FieldLabel>Cidade</FieldLabel>
          <div style="font-size: var(--text-sm); color: var(--text-default)">{{ gerente.cidade }}</div>
        </div>
        <div>
          <FieldLabel>Estado</FieldLabel>
          <div style="font-size: var(--text-sm); color: var(--text-default)">{{ gerente.uf }}</div>
        </div>
      </div>
    </TabCard>
  </div>
</template>

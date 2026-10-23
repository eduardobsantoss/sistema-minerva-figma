<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { ClipboardCheck, Users, Truck, ShieldCheck, UserCheck, Trash2, Pencil } from 'lucide-vue-next';
import {
  type ParametrizacaoGeral,
  type ExcecaoConcentracao,
  type ParteRelacionada,
  type Cedente,
} from '../../data/riscoData';
import { TabCard, FieldLabel, ToggleRow, PctInput, DiasInput, EmptyState, AddButton } from './shared';
import PayerConcentrationRankBlock from '../../components/parametrizacao/PayerConcentrationRankBlock.vue';
import TransferorSerasaExceptionsBlock from '../../components/parametrizacao/TransferorSerasaExceptionsBlock.vue';
import { validateFaixasConcentracao } from '../../utils/concentracaoSacado';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';

/** Colunas alinhadas: doc/nome/% + restritivo + valor + ação */
const EXCECOES_FORM_COLS =
  'minmax(128px, 1fr) minmax(140px, 1.25fr) minmax(108px, 120px) minmax(148px, 152px) minmax(168px, 1fr) auto';
const EXCECOES_TABLE_COLS =
  'minmax(140px, 1.2fr) minmax(120px, 1fr) minmax(100px, 112px) minmax(148px, 152px) minmax(168px, 1fr) 44px';
const PARTES_TABLE_COLS =
  'minmax(160px, 1.15fr) minmax(160px, 1.15fr) minmax(100px, 0.9fr) minmax(120px, 124px) minmax(120px, 124px) minmax(148px, 156px) minmax(168px, 180px) 44px';

interface Props {
  data: ParametrizacaoGeral;
  partesRelacionadas: ParteRelacionada[];
  cedentes: Cedente[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  save: [data: ParametrizacaoGeral];
  'update:partes-relacionadas': [data: ParteRelacionada[]];
  'edit-parte': [parte: ParteRelacionada];
}>();

function normalizeGeral(data: ParametrizacaoGeral): ParametrizacaoGeral {
  return {
    ...data,
    faixasConcentracaoSacado: data.faixasConcentracaoSacado ?? [],
    excecoesSerasaCedente: data.excecoesSerasaCedente ?? [],
    excecoesConcentracao: (data.excecoesConcentracao ?? []).map((e) => ({
      ...e,
      aceitaRestritivo: e.aceitaRestritivo ?? false,
      valorRestritivoAceito: e.valorRestritivoAceito ?? 0,
    })),
  };
}

const form = reactive<ParametrizacaoGeral>(normalizeGeral(props.data));
const partes = reactive<ParteRelacionada[]>(props.partesRelacionadas.map((p) => ({ ...p })));
const excSacadoDoc = ref('');
const excSacadoNome = ref('');
const excPct = ref('');
const excAceitaRestritivo = ref(false);
const excValorRestritivo = ref('');
const concentracaoSaveError = ref<string | null>(null);
const rankBlockRef = ref<InstanceType<typeof PayerConcentrationRankBlock> | null>(null);

watch(
  () => props.data,
  (next) => {
    Object.assign(form, normalizeGeral(next));
  },
  { deep: true },
);

watch(
  () => props.partesRelacionadas,
  (next) => {
    const localById = new Map(partes.map((p) => [p.id, p]));
    partes.splice(
      0,
      partes.length,
      ...next.map((p) => {
        const local = localById.get(p.id);
        if (!local) return { ...p };
        return {
          ...p,
          conjugeAnuente: local.conjugeAnuente,
          assinaturaObrigatoria: local.assinaturaObrigatoria,
          aceitaRestritivo: local.aceitaRestritivo,
          valorRestritivoAceito: local.valorRestritivoAceito,
        };
      }),
    );
  },
);

const {
  page: excecoesPage,
  pageSize: excecoesPageSize,
  total: excecoesTotal,
  pageItems: excecoesPageItems,
  setPage: setExcecoesPage,
  setPageSize: setExcecoesPageSize,
} = useTablePagination(() => form.excecoesConcentracao, { defaultPageSize: 5 });

const {
  page: partesPage,
  pageSize: partesPageSize,
  total: partesTotal,
  pageItems: partesPageItems,
  setPage: setPartesPage,
  setPageSize: setPartesPageSize,
} = useTablePagination(() => partes, { defaultPageSize: 5 });

function addExcecao() {
  if (!excSacadoNome.value.trim() || !excPct.value) return;
  if (excAceitaRestritivo.value && !excValorRestritivo.value.trim()) return;
  const nova: ExcecaoConcentracao = {
    id: `exc-${Date.now()}`,
    sacadoDocumento: excSacadoDoc.value,
    sacadoNome: excSacadoNome.value,
    percentual: Number(excPct.value.replace(',', '.')) || 0,
    aceitaRestritivo: excAceitaRestritivo.value,
    valorRestritivoAceito: excAceitaRestritivo.value
      ? Number(excValorRestritivo.value.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0
      : 0,
  };
  form.excecoesConcentracao = [...form.excecoesConcentracao, nova];
  excSacadoDoc.value = '';
  excSacadoNome.value = '';
  excPct.value = '';
  excAceitaRestritivo.value = false;
  excValorRestritivo.value = '';
}

function toggleExcAceitaRestritivo() {
  excAceitaRestritivo.value = !excAceitaRestritivo.value;
  if (!excAceitaRestritivo.value) excValorRestritivo.value = '';
}

function toggleExcRowRestritivo(item: ExcecaoConcentracao) {
  const next = !item.aceitaRestritivo;
  form.excecoesConcentracao = form.excecoesConcentracao.map((e) =>
    e.id === item.id
      ? { ...e, aceitaRestritivo: next, valorRestritivoAceito: next ? e.valorRestritivoAceito : 0 }
      : e,
  );
}

function onExcRowValor(item: ExcecaoConcentracao, raw: string) {
  const valor = Number(raw.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
  form.excecoesConcentracao = form.excecoesConcentracao.map((e) =>
    e.id === item.id ? { ...e, valorRestritivoAceito: valor } : e,
  );
}

function removeExcecao(id: string) {
  form.excecoesConcentracao = form.excecoesConcentracao.filter((e) => e.id !== id);
}

function toggleConjugeAnuente(id: string) {
  const idx = partes.findIndex((p) => p.id === id);
  if (idx >= 0) partes[idx] = { ...partes[idx], conjugeAnuente: !partes[idx].conjugeAnuente };
}

function toggleAssinaturaObrigatoria(id: string) {
  const idx = partes.findIndex((p) => p.id === id);
  if (idx >= 0) partes[idx] = { ...partes[idx], assinaturaObrigatoria: !partes[idx].assinaturaObrigatoria };
}

function toggleAceitaRestritivo(id: string) {
  const idx = partes.findIndex((p) => p.id === id);
  if (idx >= 0) {
    const next = !partes[idx].aceitaRestritivo;
    partes[idx] = { ...partes[idx], aceitaRestritivo: next, valorRestritivoAceito: next ? partes[idx].valorRestritivoAceito : 0 };
  }
}

function handleRestritivoInput(id: string, e: Event) {
  const target = e.target as HTMLInputElement;
  const idx = partes.findIndex((p) => p.id === id);
  if (idx >= 0) {
    partes[idx] = {
      ...partes[idx],
      valorRestritivoAceito: Number(target.value.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0,
    };
  }
}

function validateConcentracao(): boolean {
  const rankErr = rankBlockRef.value?.validate?.() ?? validateFaixasConcentracao(form.faixasConcentracaoSacado);
  concentracaoSaveError.value = rankErr;
  return !rankErr;
}

function handleSaveGeral() {
  if (!validateConcentracao()) return;
  emit('save', { ...form });
}

function handleSaveConcentracao() {
  if (!validateConcentracao()) return;
  emit('save', { ...form });
}

function handleSavePartes() {
  emit('update:partes-relacionadas', partes.map((p) => ({ ...p })));
}
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <TabCard title="Confirmações" :icon="ClipboardCheck">
      <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
        <div style="grid-column: span 3">
          <PctInput label="* % Confirmação Pré-Desembolso" :value="form.confirmacaoPreDesembolsoPct" @change="form.confirmacaoPreDesembolsoPct = $event" />
        </div>
        <div style="grid-column: span 3">
          <PctInput label="* % Confirmação Pós-Desembolso (Clientes Novos)" :value="form.confirmacaoClientesNovosPct" @change="form.confirmacaoClientesNovosPct = $event" />
        </div>
        <div style="grid-column: span 3">
          <PctInput label="* % Confirmação Pós-Desembolso (Clientes Antigos)" :value="form.confirmacaoClientesAntigosPct" @change="form.confirmacaoClientesAntigosPct = $event" />
        </div>
        <div style="grid-column: span 3">
          <DiasInput label="* Dias Confirmação dos Ativos (Dias)" :value="form.prazoConfirmacaoTitulosDias" @change="form.prazoConfirmacaoTitulosDias = $event" />
        </div>
      </div>
    </TabCard>

    <TabCard title="Notificações" :icon="Users">
      <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
        <div style="grid-column: span 4">
          <PctInput label="* Notificação de sacados" :value="form.notificacaoSacadosPct" @change="form.notificacaoSacadosPct = $event" />
        </div>
        <div style="grid-column: span 4">
          <DiasInput label="Prazo para confirmação dos sacados" :value="form.prazoConfirmacaoSacadosDias" @change="form.prazoConfirmacaoSacadosDias = $event" />
        </div>
      </div>
    </TabCard>

    <TabCard title="Concentração de Sacados" :icon="UserCheck" has-save @save="handleSaveConcentracao">
      <PayerConcentrationRankBlock ref="rankBlockRef" v-model:faixas="form.faixasConcentracaoSacado" />
      <p v-if="concentracaoSaveError" style="font-size: var(--text-xs); color: var(--danger-base); margin: 0 0 12px">
        {{ concentracaoSaveError }}
      </p>
      <div class="flex flex-col" style="gap: 16px">
        <div class="geral-exc-form grid items-end" :style="{ gridTemplateColumns: EXCECOES_FORM_COLS }">
          <div>
            <FieldLabel>* CPF/CNPJ do sacado</FieldLabel>
            <input v-model="excSacadoDoc" placeholder="—" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
          </div>
          <div>
            <FieldLabel>Nome do sacado</FieldLabel>
            <input v-model="excSacadoNome" placeholder="—" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
          </div>
          <div>
            <FieldLabel>* Percentual de concentração</FieldLabel>
            <input v-model="excPct" placeholder="0,00%" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)" />
          </div>
          <div class="geral-exc-restritivo-col flex flex-col items-center" style="gap: 6px; padding-bottom: 8px">
            <FieldLabel class="geral-field-nowrap">Aceita restritivo</FieldLabel>
            <Checkbox :checked="excAceitaRestritivo" @change="toggleExcAceitaRestritivo" />
          </div>
          <div>
            <FieldLabel class="geral-field-nowrap">Valor restritivo</FieldLabel>
            <input
              v-model="excValorRestritivo"
              :disabled="!excAceitaRestritivo"
              placeholder="R$ 0,00"
              style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)"
              :style="{ opacity: excAceitaRestritivo ? 1 : 0.55 }"
            />
          </div>
          <AddButton @click="addExcecao" />
        </div>
        <EmptyState v-if="form.excecoesConcentracao.length === 0" :icon="UserCheck" title="Nenhuma exceção cadastrada" hint="Cadastre sacados com exceção de concentração." />
        <div v-else class="geral-table-wrap">
          <div class="geral-table-head geral-exc-table-row" :style="{ gridTemplateColumns: EXCECOES_TABLE_COLS }">
            <div>Nome</div>
            <div>Documento</div>
            <div class="geral-table-num">Percentual</div>
            <div class="geral-table-center">Aceita restritivo</div>
            <div>Valor restritivo</div>
            <div />
          </div>
          <div
            v-for="e in excecoesPageItems"
            :key="e.id"
            class="geral-table-row geral-exc-table-row"
            :style="{ gridTemplateColumns: EXCECOES_TABLE_COLS }"
          >
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ e.sacadoNome }}</div>
            <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ e.sacadoDocumento || '—' }}</div>
            <div style="text-align: right; font-variant-numeric: tabular-nums">{{ e.percentual.toFixed(2).replace('.', ',') }}%</div>
            <div class="flex justify-center">
              <Checkbox :checked="e.aceitaRestritivo" @change="toggleExcRowRestritivo(e)" />
            </div>
            <div>
              <input
                v-if="e.aceitaRestritivo"
                type="text"
                :value="e.valorRestritivoAceito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })"
                style="width: 100%; height: 34px; padding: 0 10px; border: 1px solid var(--border-default); border-radius: var(--radius-md); outline: none; font-size: var(--text-xs)"
                @input="onExcRowValor(e, ($event.target as HTMLInputElement).value)"
              />
              <span v-else style="color: var(--text-muted); font-size: var(--text-xs)">—</span>
            </div>
            <div class="flex justify-end">
              <button aria-label="Remover" class="flex items-center justify-center" style="width: 26px; height: 26px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--action-danger-text-only)" @click="removeExcecao(e.id)">
                <Trash2 :size="13" />
              </button>
            </div>
          </div>
          <TablePagination
            sunken
            compact
            :total="excecoesTotal"
            :page="excecoesPage"
            :page-size="excecoesPageSize"
            :page-size-options="[5, 10, 25]"
            @update:page="setExcecoesPage"
            @update:page-size="setExcecoesPageSize"
          />
        </div>
      </div>
    </TabCard>

    <TabCard title="Partes Relacionadas" :icon="Users" has-save @save="handleSavePartes">
      <EmptyState v-if="partes.length === 0" :icon="Users" title="Nenhuma parte relacionada cadastrada" hint="Partes relacionadas são herdadas do cadastro do grupo." />
      <div v-else class="geral-table-wrap">
        <div class="geral-table-head geral-partes-table-row" :style="{ gridTemplateColumns: PARTES_TABLE_COLS }">
          <div>Nome + Documento</div>
          <div>E-mail + Telefone</div>
          <div>Estado Civil</div>
          <div class="geral-table-center">Cônjuge anuente</div>
          <div class="geral-table-center">Assin. obrig.</div>
          <div class="geral-table-center">Aceita restritivo</div>
          <div>Valor restritivo</div>
          <div class="geral-table-num">Ação</div>
        </div>
        <div
          v-for="p in partesPageItems"
          :key="p.id"
          class="geral-table-row geral-partes-table-row"
          :style="{ gridTemplateColumns: PARTES_TABLE_COLS }"
        >
          <div>
            <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ p.nome }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">{{ p.documento }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">{{ p.papel }}</div>
          </div>
          <div>
            <div style="color: var(--text-default)">{{ p.email }}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">{{ p.telefone }}</div>
          </div>
          <div style="color: var(--text-default)">{{ p.estadoCivil }}</div>
          <div>
            <Checkbox :checked="p.conjugeAnuente" @change="toggleConjugeAnuente(p.id)" />
          </div>
          <div>
            <Checkbox :checked="p.assinaturaObrigatoria" @change="toggleAssinaturaObrigatoria(p.id)" />
          </div>
          <div>
            <Checkbox :checked="p.aceitaRestritivo" @change="toggleAceitaRestritivo(p.id)" />
          </div>
          <div>
            <input
              v-if="p.aceitaRestritivo"
              type="text"
              :value="p.valorRestritivoAceito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })"
              style="width: 100%; height: 34px; padding: 0 10px; border: 1px solid var(--border-default); border-radius: var(--radius-md); outline: none; font-size: var(--text-xs)"
              @input="handleRestritivoInput(p.id, $event)"
            />
            <span v-else style="color: var(--text-muted); font-size: var(--text-xs)">—</span>
          </div>
          <div class="flex justify-end">
            <button
              type="button"
              aria-label="Editar parte relacionada"
              class="flex items-center justify-center"
              style="width: 32px; height: 32px; border-radius: var(--radius-md); background: none; border: 1px solid var(--border-default); cursor: pointer; color: var(--text-muted)"
              @click="emit('edit-parte', p)"
            >
              <Pencil :size="14" />
            </button>
          </div>
        </div>
        <TablePagination
          sunken
          compact
          :total="partesTotal"
          :page="partesPage"
          :page-size="partesPageSize"
          :page-size-options="[5, 10, 25]"
          @update:page="setPartesPage"
          @update:page-size="setPartesPageSize"
        />
      </div>
    </TabCard>

    <TabCard title="Ativos Não Performados" :icon="Truck">
      <div class="flex flex-col" style="gap: 16px">
        <ToggleRow label="Pode operar NFe de Entrega Futura" :on="form.nfEntregaFuturaPodeOperar" @toggle="form.nfEntregaFuturaPodeOperar = !form.nfEntregaFuturaPodeOperar" />
        <div style="max-width: 320px">
          <PctInput label="Percentual máximo para NFe Entrega Futura" :value="form.nfEntregaFuturaOperacaoMaximaPct" :disabled="!form.nfEntregaFuturaPodeOperar" @change="form.nfEntregaFuturaOperacaoMaximaPct = $event" />
        </div>
      </div>
    </TabCard>

    <TabCard title="Crédito e Serasa" :icon="ShieldCheck" has-save @save="handleSaveGeral">
      <div class="flex flex-col" style="gap: 16px">
        <ToggleRow label="Exige Aprovação do Sacado Pelo Setor de Crédito" :on="form.creditoPreAprovacaoSacado" @toggle="form.creditoPreAprovacaoSacado = !form.creditoPreAprovacaoSacado" />
        <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 16px">
          <div style="grid-column: span 4">
            <DiasInput label="Validade da consulta Serasa do sacado (Dias)" :value="form.validadeSerasaSacadoDias" @change="form.validadeSerasaSacadoDias = $event" />
          </div>
          <div style="grid-column: span 4">
            <DiasInput label="Validade da consulta Serasa do Avalista (Dias)" :value="form.validadeSerasaAvalistaDias" @change="form.validadeSerasaAvalistaDias = $event" />
          </div>
          <div style="grid-column: span 4">
            <DiasInput label="Validade da consulta Serasa do Cedente (Dias)" :value="form.validadeSerasaCedenteDias" @change="form.validadeSerasaCedenteDias = $event" />
          </div>
        </div>
        <TransferorSerasaExceptionsBlock v-model:excecoes="form.excecoesSerasaCedente" :cedentes="cedentes" />
      </div>
    </TabCard>
  </div>
</template>

<style scoped>
.geral-exc-form,
.geral-exc-table-row,
.geral-partes-table-row {
  column-gap: 16px;
}

.geral-table-wrap {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow-x: auto;
}

.geral-exc-table-row {
  min-width: 880px;
}

.geral-partes-table-row {
  min-width: 1080px;
}

.geral-table-head,
.geral-table-row {
  display: grid;
  align-items: center;
  padding: 10px 16px;
}

.geral-table-head {
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.geral-table-head > div {
  white-space: nowrap;
}

.geral-table-row {
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
}

.geral-table-num {
  text-align: right;
}

.geral-table-center {
  text-align: center;
}

.geral-field-nowrap {
  white-space: nowrap;
}

.geral-exc-restritivo-col {
  min-width: 148px;
}
</style>

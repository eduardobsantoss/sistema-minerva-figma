<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChevronDown, Filter, X } from 'lucide-vue-next';
import Checkbox from '@/components/ui/Checkbox.vue';
import {
  FILTRO_VAZIO,
  SEVERIDADE_LABEL,
  TIPO_ALERTA_LABEL,
  tiposDoModulo,
  veiculosSeed,
  type FiltroSentinela,
  type ModuloSentinela,
  type Severidade,
  type TipoAlerta,
} from '../data/sentinelaData';
import AdminDateField from '@/components/ui/AdminDateField.vue';
import AdminSelect from '@/components/ui/AdminSelect.vue';

const props = defineProps<{
  filtro: FiltroSentinela;
  modulo: ModuloSentinela;
}>();

const emit = defineEmits<{ 'update:filtro': [value: FiltroSentinela] }>();

const open = ref(false);
const veiculos = veiculosSeed();
const tipos = computed(() => tiposDoModulo(props.modulo));

interface Draft {
  tiposAlerta: TipoAlerta[];
  severidade: '' | Severidade;
  veiculoId: string;
  exposicaoMin: string;
  exposicaoMax: string;
  periodoInicio: string;
  periodoFim: string;
}

function toDraft(filtro: FiltroSentinela): Draft {
  return {
    tiposAlerta: [...filtro.tiposAlerta],
    severidade: filtro.severidade,
    veiculoId: filtro.veiculoId,
    exposicaoMin: filtro.exposicaoMin == null ? '' : String(filtro.exposicaoMin),
    exposicaoMax: filtro.exposicaoMax == null ? '' : String(filtro.exposicaoMax),
    periodoInicio: filtro.periodoInicio,
    periodoFim: filtro.periodoFim,
  };
}

const draft = ref<Draft>(toDraft(props.filtro));

const badge = computed(() => {
  const f = props.filtro;
  let count = 0;
  if (f.tiposAlerta.length > 0) count += 1;
  if (f.severidade) count += 1;
  if (f.veiculoId) count += 1;
  if (f.exposicaoMin != null || f.exposicaoMax != null) count += 1;
  if (f.periodoInicio || f.periodoFim) count += 1;
  return count;
});

const chips = computed(() => {
  const f = props.filtro;
  const items: { key: string; label: string }[] = [];
  if (f.escopo !== 'total') {
    const label = f.escopo === 'fundo' ? 'Fundos' : f.escopo === 'cra' ? 'CRAs' : f.escopo === 'cedente' ? 'Cedentes' : 'Sacados';
    items.push({ key: 'escopo', label });
  }
  for (const tipo of f.tiposAlerta) {
    items.push({ key: `tipo:${tipo}`, label: TIPO_ALERTA_LABEL[tipo] });
  }
  if (f.severidade) items.push({ key: 'severidade', label: SEVERIDADE_LABEL[f.severidade] });
  if (f.veiculoId) {
    const nome = veiculos.find((item) => item.id === f.veiculoId)?.nome ?? 'Veículo';
    items.push({ key: 'veiculo', label: nome });
  }
  if (f.exposicaoMin != null || f.exposicaoMax != null) {
    const min = f.exposicaoMin == null ? '0' : f.exposicaoMin.toLocaleString('pt-BR');
    const max = f.exposicaoMax == null ? '∞' : f.exposicaoMax.toLocaleString('pt-BR');
    items.push({ key: 'exposicao', label: `Exposição ${min} – ${max}` });
  }
  if (f.periodoInicio || f.periodoFim) {
    items.push({ key: 'periodo', label: `Período ${f.periodoInicio || '…'} – ${f.periodoFim || '…'}` });
  }
  return items;
});

function toggleOpen() {
  if (!open.value) draft.value = toDraft(props.filtro);
  open.value = !open.value;
}

function toggleTipo(tipo: TipoAlerta) {
  const next = new Set(draft.value.tiposAlerta);
  if (next.has(tipo)) next.delete(tipo);
  else next.add(tipo);
  draft.value.tiposAlerta = tipos.value.filter((item) => next.has(item));
}

function parseValor(value: string): number | null {
  if (!value.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function apply() {
  emit('update:filtro', {
    ...props.filtro,
    tiposAlerta: [...draft.value.tiposAlerta],
    severidade: draft.value.severidade,
    veiculoId: draft.value.veiculoId,
    exposicaoMin: parseValor(draft.value.exposicaoMin),
    exposicaoMax: parseValor(draft.value.exposicaoMax),
    periodoInicio: draft.value.periodoInicio,
    periodoFim: draft.value.periodoFim,
  });
  open.value = false;
}

function clearAll() {
  draft.value = toDraft(FILTRO_VAZIO);
  emit('update:filtro', { ...FILTRO_VAZIO });
  open.value = false;
}

function removeChip(key: string) {
  const next = { ...props.filtro, tiposAlerta: [...props.filtro.tiposAlerta] };
  if (key === 'escopo') next.escopo = 'total';
  else if (key.startsWith('tipo:')) {
    const tipo = key.slice(5) as TipoAlerta;
    next.tiposAlerta = next.tiposAlerta.filter((item) => item !== tipo);
  } else if (key === 'severidade') next.severidade = '';
  else if (key === 'veiculo') next.veiculoId = '';
  else if (key === 'exposicao') {
    next.exposicaoMin = null;
    next.exposicaoMax = null;
  } else if (key === 'periodo') {
    next.periodoInicio = '';
    next.periodoFim = '';
  }
  emit('update:filtro', next);
}

function filterBtnStyle(on: boolean) {
  return {
    gap: '8px',
    height: '38px',
    padding: '0 16px',
    cursor: 'pointer',
    background: on ? 'var(--surface-selected)' : 'var(--surface-card)',
    border: `1px solid ${on ? 'var(--border-focus)' : 'var(--border-default)'}`,
    borderRadius: 'var(--radius-lg)',
    color: on ? 'var(--text-strong)' : 'var(--text-default)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--weight-bold)',
  };
}
</script>

<template>
  <div class="flex flex-col" style="gap: 10px">
    <div class="flex items-center" style="gap: 10px; flex-wrap: wrap">
      <slot />
      <div style="position: relative; margin-left: auto">
        <button type="button" class="sn-focus flex items-center" :style="filterBtnStyle(open)" @click="toggleOpen">
          <Filter :size="15" />
          Filtros
          <span
            v-if="badge > 0"
            style="font-size: 10px; font-weight: var(--weight-bold); padding: 2px 8px; border-radius: var(--radius-full); background: var(--accent-bg); color: var(--accent)"
          >
            {{ badge }}
          </span>
          <ChevronDown :size="14" :style="{ transform: open ? 'rotate(180deg)' : 'none' }" />
        </button>
        <template v-if="open">
          <div style="position: fixed; inset: 0; z-index: 30" @click="open = false" />
          <div
            style="position: absolute; top: calc(100% + 8px); right: 0; z-index: 31; width: 460px; max-width: calc(100vw - 48px); background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); padding: 20px"
          >
            <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 14px">
              <div style="grid-column: 1 / -1">
                <div class="filter-label">Tipo de alerta</div>
                <div class="flex flex-col" style="gap: 8px">
                  <div v-for="tipo in tipos" :key="tipo" class="flex items-center" style="gap: 8px">
                    <Checkbox :checked="draft.tiposAlerta.includes(tipo)" @change="toggleTipo(tipo)" />
                    <span style="font-size: var(--text-sm); color: var(--text-default)">{{ TIPO_ALERTA_LABEL[tipo] }}</span>
                  </div>
                </div>
              </div>
              <div>
                <div class="filter-label">Severidade</div>
                <AdminSelect v-model="draft.severidade" :options="[{ value: '', label: 'Todas' }, { value: 'critico', label: 'Crítico' }, { value: 'atencao', label: 'Atenção' }, { value: 'ok', label: 'Ok' }]" />
              </div>
              <div>
                <div class="filter-label">Fundo ou CRA</div>
                <AdminSelect v-model="draft.veiculoId" :options="[{ value: '', label: 'Todos' }, ...veiculos.map((veiculo) => ({ value: veiculo.id, label: veiculo.nome }))]" />
              </div>
              <div>
                <div class="filter-label">Exposição mín.</div>
                <input v-model="draft.exposicaoMin" type="number" min="0" class="filter-input sn-focus" placeholder="0" />
              </div>
              <div>
                <div class="filter-label">Exposição máx.</div>
                <input v-model="draft.exposicaoMax" type="number" min="0" class="filter-input sn-focus" placeholder="Sem teto" />
              </div>
              <div>
                <div class="filter-label">Período (de)</div>
                <AdminDateField v-model="draft.periodoInicio" />
              </div>
              <div>
                <div class="filter-label">Período (até)</div>
                <AdminDateField v-model="draft.periodoFim" />
              </div>
            </div>
            <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
              <button type="button" class="sn-focus" style="height: 38px; padding: 0 16px; background: none; border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)" @click="clearAll">
                Limpar
              </button>
              <button type="button" class="sn-focus btn-animated btn-primary flex items-center" style="gap: 6px; height: 38px; padding: 0 18px; background: var(--action-primary-bg); color: var(--action-primary-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em" @click="apply">
                <Filter :size="13" /> FILTRAR
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-if="chips.length > 0" class="flex items-center" style="gap: 8px; flex-wrap: wrap">
      <button
        v-for="chip in chips"
        :key="chip.key"
        type="button"
        class="sn-focus flex items-center"
        style="gap: 6px; height: 28px; padding: 0 10px; border-radius: var(--radius-full); background: var(--accent-bg); color: var(--accent); border: 1px solid var(--accent); cursor: pointer; font-size: var(--text-xs); font-weight: var(--weight-semibold)"
        @click="removeChip(chip.key)"
      >
        {{ chip.label }}
        <X :size="12" />
      </button>
      <button type="button" class="sn-focus" style="height: 28px; padding: 0 10px; background: none; border: none; cursor: pointer; color: var(--text-link); font-size: var(--text-xs); font-weight: var(--weight-bold)" @click="clearAll">
        Limpar
      </button>
    </div>
  </div>
</template>

<style scoped>
.sn-focus:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}

.filter-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 6px;
}

.filter-input {
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

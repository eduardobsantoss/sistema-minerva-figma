<script setup lang="ts">
import { computed, ref } from 'vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import TablePagination from '@/components/ui/TablePagination.vue';
import { useTablePagination } from '@/composables/useTablePagination';
import { type Sacado } from '../../data/fidcsData';

const props = defineProps<{ sacados: Sacado[] }>();
const emit = defineEmits<{
  open: [id: string];
  update: [Sacado];
}>();

const filterDocumento = ref('');
const filterNome = ref('');
const filterTipo = ref('');

const filtered = computed(() =>
  props.sacados.filter((s) => {
    if (filterDocumento.value && !s.documento.includes(filterDocumento.value)) return false;
    if (filterNome.value && !s.nome.toLowerCase().includes(filterNome.value.toLowerCase())) return false;
    if (filterTipo.value && !s.tipo.toLowerCase().includes(filterTipo.value.toLowerCase())) return false;
    return true;
  }),
);

const { page, pageSize, total, pageItems, setPage, setPageSize } = useTablePagination(
  () => filtered.value,
  { defaultPageSize: 10 },
);

const COLS = '1.1fr 1.35fr 0.75fr 0.95fr 0.7fr 0.9fr 1.1fr';

const filterInputStyle = {
  width: '100%',
  height: '38px',
  padding: '0 12px',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-lg)',
  outline: 'none',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-strong)',
} as const;

function onLimiteBlur(s: Sacado, e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/[^\d,]/g, '').replace(',', '.');
  const limite = parseFloat(raw) || 0;
  if (limite === s.limite) return;
  emit('update', { ...s, limite });
}

function onEspecialChange(s: Sacado, checked: boolean) {
  if (checked === s.especial) return;
  emit('update', { ...s, especial: checked });
}

function formatLimiteInput(n: number) {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(n);
}
</script>

<template>
  <div>
    <div style="padding: 20px; border-bottom: 1px solid var(--border-default)">
      <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Sacados</div>
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-top: 4px">
        {{ sacados.length }} sacados cadastrados
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--border-default); background: var(--surface-sunken)">
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Documento</div>
        <input v-model="filterDocumento" placeholder="Filtrar..." :style="filterInputStyle" @input="setPage(1)" />
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Nome</div>
        <input v-model="filterNome" placeholder="Filtrar..." :style="filterInputStyle" @input="setPage(1)" />
      </div>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">Tipo</div>
        <input v-model="filterTipo" placeholder="Filtrar..." :style="filterInputStyle" @input="setPage(1)" />
      </div>
    </div>

    <div v-if="!filtered.length" style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm)">
      Nenhum sacado encontrado.
    </div>
    <div v-else>
      <div
        class="grid"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }"
      >
        <div>Documento</div>
        <div>Nome</div>
        <div>Tipo</div>
        <div>Limite</div>
        <div style="text-align: center">Especial</div>
        <div>Parte relacionada</div>
        <div>Grupo Econômico</div>
      </div>
      <div
        v-for="r in pageItems"
        :key="r.id"
        class="sacado-row grid items-center"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          transition: 'background var(--duration-fast)',
        }"
        @click="emit('open', r.id)"
      >
        <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ r.documento }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.nome }}</div>
        <div>{{ r.tipo }}</div>
        <div @click.stop style="padding-right: 12px">
          <input
            :value="formatLimiteInput(r.limite)"
            :style="{
              width: '100%',
              maxWidth: '120px',
              height: '34px',
              padding: '0 8px',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-xs)',
              fontVariantNumeric: 'tabular-nums',
            }"
            @blur="onLimiteBlur(r, $event)"
          />
        </div>
        <div class="flex items-center justify-center" @click.stop>
          <Checkbox :checked="r.especial" @change="onEspecialChange(r, !r.especial)" />
        </div>
        <div>
          <span
            :style="{
              fontSize: '9px',
              fontWeight: 'var(--weight-bold)',
              padding: '4px 8px',
              borderRadius: '9999px',
              background: r.parteRelacionada ? 'var(--status-warning-bg)' : 'var(--status-neutral-bg)',
              color: r.parteRelacionada ? 'var(--status-warning-text)' : 'var(--status-neutral-text)',
            }"
          >
            {{ r.parteRelacionada ? 'Sim' : 'Não' }}
          </span>
        </div>
        <div style="color: var(--text-muted); font-size: var(--text-xs)">{{ r.grupoEconomico }}</div>
      </div>
      <TablePagination
        :total="total"
        :page="page"
        :page-size="pageSize"
        @update:page="setPage"
        @update:page-size="setPageSize"
      />
    </div>
  </div>
</template>

<style scoped>
.sacado-row:hover {
  background: var(--surface-sunken);
}
</style>

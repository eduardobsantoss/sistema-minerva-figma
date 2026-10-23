<script setup lang="ts">
import { computed, ref } from 'vue';
import { ShieldCheck, Trash2, MoreVertical } from 'lucide-vue-next';
import { useActionMenuTeleport } from '../../composables/useActionMenuTeleport';
import type { Cedente, ExcecaoSerasaCedente } from '../../data/riscoData';
import { cedentesMatriz } from '../../data/riscoData';
import { FieldLabel, EmptyState, AddButton } from '../../screens/detail-tabs/shared';
import Checkbox from '@/components/ui/Checkbox.vue';
import AdminSelect from '@/components/ui/AdminSelect.vue';

const props = defineProps<{ cedentes: Cedente[] }>();
const excecoes = defineModel<ExcecaoSerasaCedente[]>('excecoes', { required: true });

const draftCedenteId = ref('');
const draftAceita = ref(false);
const draftValor = ref('');
const { openId, menuStyle, toggle, close } = useActionMenuTeleport();

const matrizes = computed(() => cedentesMatriz(props.cedentes));

const matrizOptions = computed(() => {
  const used = new Set(excecoes.value.map((e) => e.cedenteId));
  return matrizes.value
    .filter((c) => !used.has(c.id))
    .map((c) => ({ value: c.id, label: c.nome }));
});

function cedenteById(id: string): Cedente | undefined {
  return props.cedentes.find((c) => c.id === id);
}

function addExcecao() {
  if (!draftCedenteId.value) return;
  if (draftAceita.value && !draftValor.value.trim()) return;
  const nova: ExcecaoSerasaCedente = {
    id: `serasa-exc-${Date.now()}`,
    cedenteId: draftCedenteId.value,
    aceitaRestritivo: draftAceita.value,
    valorRestritivoAceito: draftAceita.value
      ? Number(draftValor.value.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0
      : 0,
  };
  excecoes.value = [...excecoes.value, nova];
  draftCedenteId.value = '';
  draftAceita.value = false;
  draftValor.value = '';
}

function removeExcecao(id: string) {
  excecoes.value = excecoes.value.filter((e) => e.id !== id);
  close();
}

function toggleAceita(item: ExcecaoSerasaCedente) {
  const next = !item.aceitaRestritivo;
  excecoes.value = excecoes.value.map((e) =>
    e.id === item.id
      ? { ...e, aceitaRestritivo: next, valorRestritivoAceito: next ? e.valorRestritivoAceito : 0 }
      : e,
  );
}

function onValorInput(item: ExcecaoSerasaCedente, raw: string) {
  const valor = Number(raw.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
  excecoes.value = excecoes.value.map((e) => (e.id === item.id ? { ...e, valorRestritivoAceito: valor } : e));
}

function toggleDraftAceita() {
  draftAceita.value = !draftAceita.value;
  if (!draftAceita.value) draftValor.value = '';
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px; margin-top: 8px; padding-top: 16px; border-top: 1px solid var(--border-default)">
    <div>
      <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
        Exceções Serasa por cedente (matriz)
      </div>
      <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">
        Uma configuração por cedente matriz do grupo.
      </p>
    </div>

    <p v-if="!matrizes.length" style="font-size: var(--text-xs); color: var(--text-muted); margin: 0">
      Nenhum cedente matriz neste grupo empresarial.
    </p>

    <div v-else class="serasa-exc-form grid items-end">
      <div>
        <FieldLabel>Cedente matriz</FieldLabel>
        <AdminSelect v-model="draftCedenteId" :options="matrizOptions" placeholder="Selecione" />
      </div>
      <div class="serasa-exc-restritivo-col flex flex-col items-center" style="gap: 6px; padding-bottom: 8px">
        <FieldLabel class="serasa-field-nowrap">Aceita restritivo</FieldLabel>
        <Checkbox :checked="draftAceita" @change="toggleDraftAceita" />
      </div>
      <div>
        <FieldLabel class="serasa-field-nowrap">Valor restritivo</FieldLabel>
        <input
          v-model="draftValor"
          :disabled="!draftAceita"
          placeholder="R$ 0,00"
          style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm)"
          :style="{ opacity: draftAceita ? 1 : 0.55 }"
        />
      </div>
      <AddButton @click="addExcecao" />
    </div>

    <EmptyState
      v-if="!excecoes.length && matrizes.length"
      :icon="ShieldCheck"
      title="Nenhuma exceção de cedente cadastrada"
      hint="Cadastre exceções Serasa por matriz."
    />

    <div v-if="excecoes.length" class="serasa-table-wrap">
      <div class="serasa-table-head serasa-table-row">
        <div>Cedente</div>
        <div>Documento</div>
        <div class="serasa-table-center">Aceita restritivo</div>
        <div>Valor restritivo</div>
        <div class="serasa-table-center">Ação</div>
      </div>
      <div v-for="row in excecoes" :key="row.id" class="serasa-table-body serasa-table-row">
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">
          {{ cedenteById(row.cedenteId)?.nome ?? '—' }}
        </div>
        <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">
          {{ cedenteById(row.cedenteId)?.documento ?? '—' }}
        </div>
        <div class="flex justify-center">
          <Checkbox :checked="row.aceitaRestritivo" @change="toggleAceita(row)" />
        </div>
        <div>
          <input
            v-if="row.aceitaRestritivo"
            type="text"
            :value="row.valorRestritivoAceito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })"
            style="width: 100%; height: 34px; padding: 0 10px; border: 1px solid var(--border-default); border-radius: var(--radius-md); outline: none; font-size: var(--text-xs)"
            @input="onValorInput(row, ($event.target as HTMLInputElement).value)"
          />
          <span v-else style="color: var(--text-muted); font-size: var(--text-xs)">—</span>
        </div>
        <div class="serasa-table__actions">
          <button
            type="button"
            class="serasa-table__actions-trigger"
            aria-label="Ações da exceção"
            data-action-menu-anchor
            @click.stop="toggle(row.id, $event.currentTarget as HTMLElement)"
          >
            <MoreVertical :size="16" />
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="openId"
        data-action-menu-floating
        class="serasa-table__menu serasa-table__menu--floating"
        :style="menuStyle"
      >
        <button
          type="button"
          class="serasa-table__menu-item serasa-table__menu-item--danger"
          @click="removeExcecao(openId)"
        >
          <Trash2 :size="15" />
          Remover exceção
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.serasa-exc-form {
  display: grid;
  grid-template-columns: minmax(200px, 1.4fr) minmax(148px, 152px) minmax(168px, 1fr) auto;
  column-gap: 16px;
}

.serasa-exc-restritivo-col {
  min-width: 148px;
}

.serasa-field-nowrap {
  white-space: nowrap;
}

.serasa-table-wrap {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow-x: auto;
  overflow-y: visible;
}

.serasa-table-row {
  display: grid;
  grid-template-columns: minmax(160px, 1.4fr) minmax(120px, 1fr) minmax(148px, 152px) minmax(168px, 1fr) 44px;
  column-gap: 16px;
  align-items: center;
  padding: 10px 16px;
  min-width: 720px;
}

.serasa-table-head {
  background: var(--surface-sunken);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.serasa-table-head > div {
  white-space: nowrap;
}

.serasa-table-body {
  border-top: 1px solid var(--border-default);
  font-size: var(--text-sm);
}

.serasa-table-center {
  text-align: center;
}

.serasa-table__actions {
  position: relative;
  display: flex;
  justify-content: center;
}

.serasa-table__actions-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  background: var(--surface-card);
  cursor: pointer;
  color: var(--text-muted);
}

.serasa-table__actions-trigger:hover {
  background: var(--surface-sunken);
  color: var(--text-strong);
}

.serasa-table__menu--floating {
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 6px;
}

.serasa-table__menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: var(--radius-md);
  background: none;
  cursor: pointer;
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  text-align: left;
  color: var(--text-default);
  transition: background var(--duration-fast);
}

.serasa-table__menu-item:hover {
  background: var(--surface-sunken);
}

.serasa-table__menu-item--danger {
  color: var(--action-danger-text-only);
}
</style>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import { useToast } from '@/composables/useToast';
import {
  FAMILIA_LABEL,
  PERMISSOES,
  salvarVeiculos,
  veiculos,
  type FamiliaVeiculo,
} from '../data/gerencialData';

const { success } = useToast();
const aba = ref<FamiliaVeiculo>('fidc');
const buscaId = ref('');
const buscaNome = ref('');
const confirmando = ref(false);
const salvando = ref(false);
const draft = reactive<Record<string, boolean>>(Object.fromEntries(veiculos.map((v) => [v.id, v.ativo])));

const abas = [
  { key: 'fidc', label: 'FIDC' },
  { key: 'cra', label: 'CRA' },
  { key: 'garantia', label: 'Garantias' },
];

const daAba = computed(() => veiculos.filter((v) => v.familia === aba.value));
const visiveis = computed(() => {
  const id = buscaId.value.trim().toLowerCase();
  const nome = buscaNome.value.trim().toLowerCase();
  return daAba.value.filter((v) => {
    if (id && !v.id.toLowerCase().includes(id)) return false;
    if (nome && !v.nome.toLowerCase().includes(nome)) return false;
    return true;
  });
});
const marcados = computed(() => daAba.value.filter((v) => draft[v.id]).length);
const todos = computed(() => daAba.value.length > 0 && marcados.value === daAba.value.length);
const parcial = computed(() => marcados.value > 0 && marcados.value < daAba.value.length);

function toggle(id: string) {
  if (!PERMISSOES.escreverParametrizacao) return;
  draft[id] = !draft[id];
}

function toggleTodos() {
  if (!PERMISSOES.escreverParametrizacao) return;
  const next = !todos.value;
  for (const v of daAba.value) draft[v.id] = next;
}

function setAba(key: string) {
  aba.value = key as FamiliaVeiculo;
}

function salvar() {
  if (!PERMISSOES.escreverParametrizacao || salvando.value) return;
  salvando.value = true;
  window.setTimeout(() => {
    salvarVeiculos(aba.value, { ...draft });
    salvando.value = false;
    confirmando.value = false;
    success(`Veículos de ${FAMILIA_LABEL[aba.value]} salvos. O Gerencial passa a listar só os ativos.`);
  }, 400);
}
</script>

<template>
  <div class="ger-page">
    <div>
      <div class="ger-kicker">Parametrização</div>
      <h1 class="ger-title">Veículos no gerencial</h1>
      <p class="ger-sub">
        Liga e desliga quais veículos entram no filtro do Gerencial. Cada aba grava só a própria família.
      </p>
    </div>

    <div class="flex items-center justify-between" style="gap: 12px; flex-wrap: wrap">
      <SegmentedToggle :options="abas" :model-value="aba" @update:model-value="setAba" />
      <button
        v-if="PERMISSOES.escreverParametrizacao"
        type="button"
        class="ger-btn-primary"
        :disabled="salvando"
        @click="confirmando = true"
      >
        {{ salvando ? 'Salvando…' : 'Salvar' }}
      </button>
      <p v-else class="ger-hint" style="margin: 0">Você pode consultar esta lista. Salvar exige permissão de escrita.</p>
    </div>

    <div class="flex items-end" style="gap: 10px; flex-wrap: wrap">
      <label style="min-width: 180px">
        <div class="ger-label">ID</div>
        <input v-model="buscaId" class="ger-input" placeholder="Contém" />
      </label>
      <label style="min-width: 220px; flex: 1">
        <div class="ger-label">Nome</div>
        <input v-model="buscaNome" class="ger-input" placeholder="Contém" />
      </label>
    </div>

    <div class="ger-card">
      <div class="grid ger-table-head" style="grid-template-columns: 44px 140px 1fr">
        <div>
          <Checkbox
            :checked="todos"
            :indeterminate="parcial"
            :disabled="!PERMISSOES.escreverParametrizacao"
            @change="toggleTodos"
          />
        </div>
        <div>ID</div>
        <div>Nome</div>
      </div>
      <div v-if="visiveis.length === 0" style="padding: 32px; text-align: center; color: var(--text-muted)">
        Nenhum veículo com esse ID ou nome.
      </div>
      <div
        v-for="v in visiveis"
        :key="v.id"
        class="grid ger-row"
        style="grid-template-columns: 44px 140px 1fr"
      >
        <div>
          <Checkbox
            :checked="!!draft[v.id]"
            :disabled="!PERMISSOES.escreverParametrizacao"
            @change="toggle(v.id)"
          />
        </div>
        <div class="ger-num">{{ v.id }}</div>
        <div>{{ v.nome }}</div>
      </div>
    </div>

    <div
      v-if="confirmando"
      class="flex items-center justify-center"
      style="position: fixed; inset: 0; z-index: 80; background: rgba(15, 23, 42, 0.45); padding: 24px"
      @click.self="!salvando && (confirmando = false)"
    >
      <div style="width: 100%; max-width: 440px; background: var(--surface-card); border-radius: var(--radius-xl); padding: 24px" @click.stop>
        <h2 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 8px">
          Deseja salvar as configurações de veículos?
        </h2>
        <p class="ger-sub" style="margin-bottom: 20px">
          A aba {{ FAMILIA_LABEL[aba] }} inteira será gravada, inclusive linhas ocultas pelo filtro.
        </p>
        <div class="flex items-center justify-end" style="gap: 10px">
          <button type="button" class="ger-btn-ghost" :disabled="salvando" @click="confirmando = false">Cancelar</button>
          <button type="button" class="ger-btn-primary" :disabled="salvando" @click="salvar">
            {{ salvando ? 'Salvando…' : 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

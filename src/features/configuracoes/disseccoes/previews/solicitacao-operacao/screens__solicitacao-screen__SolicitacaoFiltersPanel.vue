<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { Filter, X } from 'lucide-vue-next';
withDefaults(defineProps<{ modelValue: SolicitacaoFilters; veiculos: string[]; tiposPedido: string[]; grupos: string[]; gerentes: string[]; requerentes: string[]; atendentes: string[] }>(), {
  modelValue: '',
  veiculos: [],
  tiposPedido: [],
  grupos: [],
  gerentes: [],
  requerentes: [],
  atendentes: []
});
</script>

<template>
  <div class="flex items-center justify-between" style="margin-bottom: 16px">
    <span style="font-size: 11px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">
      Filtros adicionais
    </span>
    <button
      v-if="hasDraft"
      class="flex items-center"
      style="gap: 4px; background: none; border: none; cursor: pointer; font-size: var(--text-xs); color: var(--text-muted); font-weight: var(--weight-semibold)"
     
    >
      <X :size="12" /> Limpar filtros
    </button>
  </div>

  <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px">
    <div style="grid-column: 1 / -1">
      <div :style="labelStyle">ID do Pedido</div>
      <input v-model="draft.idPedido" placeholder="Buscar por ID" :style="inputStyle" />
    </div>

    <div style="grid-column: 1 / -1">
      <div :style="labelStyle">Veículo</div>
      <select v-model="draft.veiculo" :style="inputStyle">
        <option value="">Todos</option>
        <option v-for="opt in veiculos" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>

    <div>
      <div :style="labelStyle">Tipo de pedido</div>
      <select v-model="draft.tipoPedido" :style="inputStyle">
        <option value="">Todos</option>
        <option v-for="opt in tiposPedido" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>

    <div>
      <div :style="labelStyle">Data de abertura</div>
      <input v-model="draft.dataAbertura" type="date" :style="inputStyle" />
    </div>

    <div style="grid-column: 1 / -1">
      <div :style="labelStyle">Grupo Empresarial</div>
      <select v-model="draft.grupoEmpresarial" :style="inputStyle">
        <option value="">Todos</option>
        <option v-for="opt in grupos" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>

    <div style="grid-column: 1 / -1">
      <div :style="labelStyle">Gerente Comercial</div>
      <select v-model="draft.gerenteComercial" :style="inputStyle">
        <option value="">Todos</option>
        <option v-for="opt in gerentes" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>

    <div>
      <div :style="labelStyle">Requerente do pedido</div>
      <select v-model="draft.requerente" :style="inputStyle">
        <option value="">Todos</option>
        <option v-for="opt in requerentes" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>

    <div>
      <div :style="labelStyle">Usuário de atendimento</div>
      <select v-model="draft.usuarioAtendimento" :style="inputStyle">
        <option value="">Todos</option>
        <option v-for="opt in atendentes" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>
  </div>

  <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
    <button
      style="height: 38px; padding: 0 16px; background: none; border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
     
    >
      Limpar
    </button>
    <button
      class="flex items-center"
      style="gap: 6px; height: 38px; padding: 0 18px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
     
    >
      <Filter :size="13" /> FILTRAR
    </button>
  </div>
</template>

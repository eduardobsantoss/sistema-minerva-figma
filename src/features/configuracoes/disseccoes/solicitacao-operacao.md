# Solicitação de Operação

## Lista

### SolicitacaoScreen

```vue
<script setup lang="ts">
import type { Component } from 'vue';
</script>

<template>
  <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">SolicitacaoDetailScreen</div>
  <div v-else class="flex flex-col" style="gap: 24px">
    <!-- Camada 1: Identificação + ação primária -->
    <div class="flex items-center justify-between" style="gap: 16px">
      <div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); font-weight: var(--weight-bold); margin-bottom: 6px">
          Workflow Operacional
        </div>
        <h1 style="font-size: 26px; font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.02em; line-height: 1.15">
          Solicitação de Operação
        </h1>
      </div>
      <button
        class="flex items-center btn-animated btn-agro"
        style="
          gap: 8px;
          height: 48px;
          padding: 0 22px;
          background: var(--agro-base);
          color: #fff;
          border-radius: var(--radius-lg);
          border: none;
          cursor: pointer;
          font-weight: var(--weight-bold);
          font-size: var(--text-xs);
          letter-spacing: 0.10em;
          box-shadow: 0 10px 24px -8px rgba(242, 125, 38, 0.4);
        "
       
      >
        <span class="flex items-center justify-center" style="width: 22px; height: 22px; border-radius: 9999px; background: rgba(255, 255, 255, 0.2)">
          <Plus :size="14" />
        </span>
        NOVA SOLICITAÇÃO
      </button>
    </div>

    <!-- Tabs de esteira -->
    <div class="flex items-center" style="gap: 6px; flex-wrap: wrap">
      <button
        v-for="e in ESTEIRA_FILTERS"
        :key="e.key"
        :style="{
          padding: '8px 16px',
          borderRadius: '9999px',
          cursor: 'pointer',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.04em',
          border: '1px solid',
          borderColor: esteira === e.key ? 'var(--gci-base)' : 'var(--border-default)',
          background: esteira === e.key ? 'var(--gci-base)' : 'var(--surface-card)',
          color: esteira === e.key ? '#fff' : 'var(--text-muted)',
          transition: 'all var(--duration-fast)',
        }"
       
      >
        {{ e.label }}
      </button>
    </div>

    <!-- Barra de filtros + toggle de visualização -->
    <div class="flex flex-col" style="gap: 10px">
      <div class="flex items-center" style="gap: 12px; flex-wrap: wrap">
        <!-- Search -->
        <div class="relative" style="flex: 1; min-width: 240px; background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-default)">
          <Search :size="16" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)" />
          <input
            v-model="q"
            placeholder="Buscar por ID, cedente ou veículo..."
            style="width: 100%; height: 42px; padding-left: 40px; padding-right: 14px; background: transparent; border: none; outline: none; font-size: var(--text-sm); color: var(--text-strong); border-radius: var(--radius-lg)"
          />
        </div>

        <!-- Filtros (popover) -->
        <div style="position: relative">
          <button
            ref="filterBtnRef"
            class="flex items-center"
            :style="{
              gap: '8px',
              height: '42px',
              padding: '0 16px',
              cursor: 'pointer',
              background: showFilters || activeFilterCount > 0 ? 'var(--gci-light)' : 'var(--surface-card)',
              border: `1px solid ${showFilters || activeFilterCount > 0 ? 'var(--gci-base)' : 'var(--border-default)'}`,
              borderRadius: 'var(--radius-lg)',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.04em',
              color: showFilters || activeFilterCount > 0 ? 'var(--gci-base)' : 'var(--text-muted)',
              transition: 'all var(--duration-fast)',
            }"
           
          >
            <SlidersHorizontal :size="15" :stroke-width="2" />
            Filtros
            <span
              v-if="activeFilterCount > 0"
              style="min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9999px; background: var(--gci-base); color: #fff; font-size: 10px; font-weight: var(--weight-bold); display: flex; align-items: center; justify-content: center"
            >
              {{ activeFilterCount }}
            </span>
            <ChevronDown :size="14" :style="{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base)' }" />
          </button>

          <template v-if="showFilters">
            <div style="position: relative; width: 100%; min-height: 320px; z-index: 30" />
            <div :style="filterPanelStyle">
              <SolicitacaoFiltersPanel
                v-model="filters"
                :veiculos="veiculos"
                :tipos-pedido="tiposPedido"
                :grupos="grupos"
                :gerentes="gerentes"
                :requerentes="requerentes"
                :atendentes="atendentes"
               
               
              />
            </div>
          </template>
```

### SolicitacaoFiltersPanel

```vue
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
```

### FilterSelect

```vue
<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
const model = defineModel({ default: '' });
withDefaults(defineProps<{ placeholder: string; options: string[] }>(), {
  placeholder: 'Label',
  options: []
});
</script>

<template>
  <div style="position: relative; min-width: 180px">
    <select
      v-model="model"
      :style="{
        width: '100%',
        height: '42px',
        padding: '0 36px 0 14px',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        outline: 'none',
        cursor: 'pointer',
        fontSize: 'var(--text-sm)',
        color: model ? 'var(--text-strong)' : 'var(--text-muted)',
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
      }"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
    </select>
    <ChevronDown
      :size="16"
      style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400); pointer-events: none"
    />
  </div>
</template>
```

### SolicitacaoCard

```vue
<script setup lang="ts">
import type { Component } from 'vue';
</script>

<template>
  <div
    class="flex flex-col"
    :style="{
      background: 'var(--surface-card)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: hover ? 'rgba(8,60,74,0.25)' : 'var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: compact ? '12px' : '16px',
      gap: compact ? '10px' : '12px',
      cursor: 'pointer',
      boxShadow: hover ? '0 12px 28px -14px rgba(8,60,74,0.18)' : 'var(--shadow-xs)',
      transform: hover && !compact ? 'translateY(-3px)' : 'translateY(0)',
      transition:
        'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
    }"
   
   
   
  >
    <!-- Badges: tipo de contrato + validação -->
    <div class="flex items-center justify-between" style="gap: 8px">
      <span
        :style="{
          fontSize: '9px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.08em',
          padding: '3px 8px',
          borderRadius: 'var(--radius-sm)',
          background: ct.bg,
          color: ct.fg,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '60%',
        }"
      >
        {{ s.tipoContrato }}
      </span>
      <span
        class="flex items-center"
        :style="{
          gap: '4px',
          flexShrink: 0,
          fontSize: '9px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.06em',
          padding: '3px 8px',
          borderRadius: '9999px',
          background: valido ? 'var(--status-success-bg)' : 'var(--status-danger-bg)',
          color: valido ? 'var(--status-success-text)' : 'var(--status-danger-text)',
        }"
      >
        <CheckCircle2 v-if="valido" :size="10" :stroke-width="2.5" />
        <XCircle v-else :size="10" :stroke-width="2.5" />
        {{ valido ? 'VÁLIDO' : 'INVÁLIDO' }}
      </span>
    </div>

    <div
      v-if="isCliente"
      class="flex items-center justify-center"
      :style="{
        padding: '8px 12px',
        borderRadius: 'var(--radius-md)',
        background: 'color-mix(in srgb, var(--agro-base) 14%, #fff)',
        fontSize: '11px',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.06em',
        color: 'var(--agro-base)',
        textTransform: 'uppercase',
      }"
    >
      Esteira Automática
    </div>

    <!-- Cedente + ID -->
    <div>
      <div
        :style="{
          fontSize: compact ? 'var(--text-sm)' : 'var(--text-base)',
          fontWeight: 'var(--weight-bold)',
          color: 'var(--text-strong)',
          letterSpacing: '-0.01em',
          lineHeight: 1.25,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }"
      >
        {{ s.cedente }}
      </div>
      <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
        {{ s.id }}
      </div>
    </div>

    <!-- Valor -->
    <div
      :style="{
        fontSize: compact ? 'var(--text-md)' : 'var(--text-lg)',
        fontWeight: 'var(--weight-bold)',
        color: 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.01em',
      }"
    >
      {{ brl(s.valor) }}
    </div>

    <!-- Vínculo (pill) -->
    <div
      class="flex items-center"
      :style="{
        gap: '8px',
        padding: '8px 12px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-sunken)',
        fontSize: '11px',
        color: s.vinculo ? 'var(--text-default)' : 'var(--text-muted)',
      }"
    >
      <Building2 :size="13" :stroke-width="2" style="flex-shrink: 0; color: var(--text-muted)" />
      <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
        {{ s.vinculo || 'Sem vínculo' }}
      </span>
    </div>

    <!-- Divisor -->
    <div style="height: 1px; background: var(--border-default)" />

    <!-- TOTAL | ETAPA -->
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 12px">
      <div v-for="tc in timeCols" :key="tc.label" class="flex flex-col" style="gap: 5px">
        <div
          class="flex items-center"
          style="
            gap: 5px;
            font-size: 9px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.10em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <component :is="tc.icon" :size="11" :stroke-width="2" /> {{ tc.label }}
        </div>
        <div
          :style="{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-bold)',
            color: tc.emphasize ? 'var(--danger-base)' : 'var(--text-strong)',
            fontVariantNumeric: 'tabular-nums',
          }"
        >
          {{ tc.value }}
        </div>
        <div :style="{ height: '3px', borderRadius: '9999px', background: barColor }" />
      </div>
    </div>

    <!-- Detalhes expandidos -->
    <div v-if="expanded" class="flex flex-col" style="gap: 10px; padding-top: 4px">
      <div v-for="row in detailRows" :key="row.label" class="flex items-center justify-between" style="gap: 12px">
        <span
          style="
            font-size: 9px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.12em;
            color: var(--text-muted);
            text-transform: uppercase;
            flex-shrink: 0;
          "
        >
          {{ row.label }}
        </span>
        <span
          style="
            font-size: var(--text-xs);
            font-weight: var(--weight-semibold);
            color: var(--text-strong);
            text-align: right;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          "
        >
          {{ row.value || '—' }}
        </span>
      </div>
    </div>

    <!-- Toggle Mais/Menos detalhes -->
    <button
      class="flex items-center justify-center"
      style="
        gap: 6px;
        margin-top: 2px;
        padding: 6px 0;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-muted);
        font-size: 11px;
        font-weight: var(--weight-semibold);
      "
     
    >
      <template v-if="expanded"><ChevronUp :size="14" /> Menos detalhes</template>
```

### SolicitacaoTable

```vue
<script setup lang="ts">
import { CheckCircle2, XCircle } from 'lucide-vue-next';
withDefaults(defineProps<{ solicitacoes: Solicitacao[] }>(), {
  solicitacoes: []
});
</script>

<template>
  <div
    style="
      border-width: 1px;
      border-style: solid;
      border-color: var(--border-default);
      border-radius: var(--radius-xl);
      overflow: hidden;
      background: var(--surface-card);
    "
  >
    <!-- Header -->
    <div
      class="grid"
      :style="{
        gridTemplateColumns: COLS,
        padding: '12px 20px',
        background: 'var(--surface-sunken)',
        fontSize: '10px',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.12em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
      }"
    >
      <div>ID</div>
      <div>Cedente</div>
      <div>Tipo</div>
      <div>Veículo</div>
      <div style="text-align: right">Valor</div>
      <div>Etapa</div>
      <div>SLA da Etapa</div>
    </div>

    <!-- Rows -->
    <div
      v-if="solicitacoes.length === 0"
      style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
    >
      Nenhuma solicitação encontrada.
    </div>
    <template v-else>
      <div
        v-for="s in pageItems"
        :key="s.id"
        class="grid items-center"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          transition: 'background var(--duration-fast)',
          background: hoveredId === s.id ? 'var(--surface-sunken)' : 'transparent',
        }"
       
       
       
      >
        <div style="font-weight: var(--weight-bold); color: var(--text-muted); font-variant-numeric: tabular-nums">
          {{ s.id }}
        </div>
        <div class="flex items-center" style="gap: 8px; min-width: 0">
          <span
            class="flex items-center justify-center"
            :style="{ flexShrink: 0, color: s.validacao === 'VALIDO' ? 'var(--success-base)' : 'var(--danger-base)' }"
            :title="s.validacao === 'VALIDO' ? 'Válido' : 'Inválido'"
          >
            <CheckCircle2 v-if="s.validacao === 'VALIDO'" :size="15" :stroke-width="2.25" />
            <XCircle v-else :size="15" :stroke-width="2.25" />
          </span>
          <span
            style="
              font-weight: var(--weight-semibold);
              color: var(--text-strong);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            {{ s.cedente }}
          </span>
        </div>
        <div style="color: var(--text-default)">{{ s.tipoContrato }}</div>
        <div style="color: var(--text-default); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
          {{ s.veiculo }}
        </div>
        <div style="text-align: right; font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(s.valor) }}
        </div>
        <div>
          <span
            class="flex items-center"
            :style="{
              gap: '6px',
              width: 'fit-content',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.06em',
              padding: '4px 9px',
              borderRadius: '9999px',
              background: `color-mix(in srgb, ${etapaCor(s.etapa)} 14%, transparent)`,
              color: etapaCor(s.etapa),
              whiteSpace: 'nowrap',
            }"
          >
            <span :style="{ width: '6px', height: '6px', borderRadius: '9999px', background: etapaCor(s.etapa) }" />
            {{ etapaLabel(s.etapa) }}
          </span>
        </div>
        <div class="flex items-center" style="gap: 8px">
          <div
            :style="{
              flex: 1,
              height: '5px',
              background: slaRatio(s) > 1 ? 'var(--danger-light)' : 'var(--success-light)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }"
          >
            <div
              :style="{
                height: '100%',
                width: `${Math.min(Math.max(slaRatio(s), 0), 1) * 100}%`,
                background: slaRatio(s) > 1 ? 'var(--danger-base)' : 'var(--success-base)',
                borderRadius: '9999px',
              }"
            />
          </div>
          <span
            :style="{
              fontSize: '10px',
              color: slaRatio(s) > 1 ? 'var(--danger-base)' : 'var(--text-muted)',
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
              fontWeight: slaRatio(s) > 1 ? 'var(--weight-bold)' : 'var(--weight-regular)',
            }"
          >
            {{ fmtDuracao(s.tempoEtapaHoras) }} / {{ fmtDuracao(s.slaEtapaHoras) }}
          </span>
        </div>
      </div>
      <TablePagination
        :total="total"
        :page="page"
        :page-size="pageSize"
       
       
      />
    </template>
```

### SolicitacaoKanban

```vue
<script setup lang="ts">
import { FolderOpen } from 'lucide-vue-next';
withDefaults(defineProps<{ solicitacoes: Solicitacao[]; /** Filtro de esteira da listagem — controla colunas exclusivas da esteira Cliente. */
    esteiraFilter?: Esteira | 'TODAS' }>(), {
  solicitacoes: []
});
</script>

<template>
  <div style="display: flex; gap: 16px; overflow-x: auto; padding-bottom: 12px">
    <div
      v-for="etapa in colunas"
      :key="etapa.key"
      class="flex flex-col"
      :style="{
        flex: '0 0 280px',
        width: '280px',
        background: dragOverEtapa === etapa.key
          ? `color-mix(in srgb, ${etapa.cor} 10%, var(--surface-sunken))`
          : 'var(--surface-sunken)',
        borderRadius: 'var(--radius-lg)',
        borderTop: `3px solid ${etapa.cor}`,
        outline: dragOverEtapa === etapa.key ? `2px dashed ${etapa.cor}` : '2px solid transparent',
        outlineOffset: '-2px',
        padding: '12px',
        gap: '12px',
        minHeight: '200px',
        transition: 'background var(--duration-fast), outline-color var(--duration-fast)',
      }"
     
     
     
    >
      <!-- Header da coluna -->
      <div class="flex items-center justify-between" style="gap: 8px">
        <div class="flex items-center" style="gap: 8px; min-width: 0">
          <span :style="{ width: '8px', height: '8px', borderRadius: '9999px', background: etapa.cor, flexShrink: 0 }" />
          <span
            style="
              font-size: 11px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.06em;
              color: var(--text-strong);
              text-transform: uppercase;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            {{ etapa.label }}
          </span>
        </div>
        <span
          class="flex items-center justify-center"
          :style="{
            minWidth: '22px',
            height: '22px',
            padding: '0 7px',
            borderRadius: '9999px',
            background: `color-mix(in srgb, ${etapa.cor} 16%, transparent)`,
            fontSize: '11px',
            fontWeight: 'var(--weight-bold)',
            color: etapa.cor,
            fontVariantNumeric: 'tabular-nums',
            flexShrink: 0,
          }"
        >
          {{ grupos[etapa.key].length }}
        </span>
      </div>

      <!-- Cards -->
      <div class="flex flex-col" style="gap: 10px; flex: 1">
        <div
          v-if="grupos[etapa.key].length === 0"
          class="flex flex-col items-center justify-center"
          style="padding: 28px 8px; gap: 8px; text-align: center; color: var(--text-muted)"
        >
          <FolderOpen :size="22" :stroke-width="1.5" style="opacity: 0.5" />
          <span style="font-size: 11px">Nenhuma solicitação</span>
        </div>
        <div
          v-for="s in grupos[etapa.key]"
          :key="s.id"
          draggable="true"
          :style="{
            opacity: draggingId === s.id ? 0.45 : 1,
            cursor: 'grab',
            transition: 'opacity var(--duration-fast)',
          }"
         
         
        >
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">SolicitacaoCard</div>
        </div>
      </div>
    </div>
  </div>

  <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">MoverEtapaModal</div>
</template>
```

## Detalhe

### SolicitacaoDetailScreen

```vue
<script setup lang="ts">
import type { Component } from 'vue';
withDefaults(defineProps<{ solicitacao: Solicitacao }>(), {
  solicitacao: ''
});
</script>

<template>
  <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ValidacoesFullView</div>
  <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ParteRelacionadaDetailView</div>
  <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">AtivoDetailView</div>
  <div v-else class="flex flex-col" style="gap: 24px">
    <!-- Header + barra de ações -->
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
       
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          Solicitação de Operação
        </div>
        <h2 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2; gap: 8px">
          {{ solicitacao.id }}
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">CopyButton</div>
          <span
            class="flex items-center"
            :style="{
              gap: '6px',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.10em',
              padding: '5px 11px',
              borderRadius: '9999px',
              background: `color-mix(in srgb, ${cor} 14%, transparent)`,
              color: cor,
            }"
          >
            <span :style="{ width: '7px', height: '7px', borderRadius: '9999px', background: cor }" />
            {{ etapaLabel(solicitacao.etapa).toUpperCase() }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ solicitacao.cedente }} · {{ solicitacao.tipoContrato }} · {{ esteiraLabel(solicitacao.esteira) }}
        </p>
      </div>

      <!-- Ação primária + menu overflow -->
      <div class="flex items-center" style="gap: 10px; flex-shrink: 0">
        <button
          class="flex items-center btn-animated btn-primary"
          style="gap: 8px; height: 44px; padding: 0 20px; background: var(--action-primary-bg); color: var(--action-primary-text); border-radius: var(--radius-lg); border: none; cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em; box-shadow: 0 10px 24px -10px rgba(8, 60, 74, 0.45)"
        >
          ANÁLISE OPERAÇÕES
          <ChevronRight :size="16" />
        </button>
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ActionMenu</div>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
     
    />

    <!-- Conteúdo -->
    <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 24px">
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">DadosGeraisTab</div>
      <AtivosTab
        v-else-if="tab === 'ativos'"
        :det="det"
       
       
       
       
       
       
       
      />
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">GarantiasTab</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ValidacoesTab</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">AnexosTab</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">AtaTab</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">HistoricoTab</div>
    </div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">RejectModal</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ParteRelacionadaModal</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">AdicionarContratoModal</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">VincularAtivosModal</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ConfirmarTituloModal</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ProrrogarVencimentoModal</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">AtualizarCessaoModal</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">GerarTermoCessaoModal</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">GerarCnabModal</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">InserirEvidenciaModal</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">DetalheEvidenciaModal</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">DetalheValidacaoModal</div>
  </div>
</template>
```

### ActionMenu

```vue
<script setup lang="ts">
import type { Component } from 'vue';
</script>

<template>
  <div ref="rootRef" style="position: relative">
    <button
      aria-label="Mais ações"
      class="flex items-center justify-center"
      style="
        width: 44px;
        height: 44px;
        border-radius: var(--radius-lg);
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        cursor: pointer;
        color: var(--text-strong);
      "
     
    >
      <MoreVertical :size="20" />
    </button>
    <div
      v-if="open"
      class="flex flex-col"
      style="
        position: absolute;
        top: 52px;
        right: 0;
        z-index: 50;
        min-width: 260px;
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-lg);
        box-shadow: 0 20px 48px -16px rgba(8, 60, 74, 0.28);
        padding: 6px;
      "
    >
      <button
        v-for="a in secondary"
        :key="a.label"
        class="flex items-center action-item"
        style="
          gap: 10px;
          padding: 10px 12px;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: var(--radius-md);
          text-align: left;
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
          color: var(--text-default);
          width: 100%;
          transition: background var(--duration-fast);
        "
       
      >
        <component :is="a.icon" :size="16" style="color: var(--text-muted)" />
        {{ a.label }}
      </button>
      <div style="height: 1px; background: var(--border-default); margin: 6px 4px" />
      <button
        class="flex items-center action-item-danger"
        style="
          gap: 10px;
          padding: 10px 12px;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: var(--radius-md);
          text-align: left;
          font-size: var(--text-sm);
          font-weight: var(--weight-bold);
          color: var(--action-danger-text-only);
          width: 100%;
          transition: background var(--duration-fast);
        "
       
      >
        <XCircle :size="16" />
        Rejeitar solicitação
      </button>
    </div>
  </div>
</template>

<style scoped>
.action-item:hover {
  background: var(--surface-sunken);
}
.action-item-danger:hover {
  background: var(--status-danger-bg);
}
</style>
```

### RejectModal

```vue
<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';
withDefaults(defineProps<{ id: string }>(), {
  id: '10482'
});
</script>

<template>
  <div class="flex items-center justify-center" style="position: relative; width: 100%; min-height: 320px; z-index: 1; background: rgba(15, 23, 42, 0.45); padding: 24px">
    <div style="width: 100%; max-width: 440px; background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: 0 30px 60px -20px rgba(8, 60, 74, 0.4); padding: 28px">
      <div
        class="flex items-center justify-center"
        style="width: 52px; height: 52px; border-radius: 9999px; background: var(--status-danger-bg); color: var(--danger-base); margin-bottom: 18px"
      >
        <AlertTriangle :size="26" />
      </div>
      <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 8px">
        Rejeitar a solicitação {{ id }}?
      </h3>
      <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 24px">
        Esta ação encerra o fluxo da operação e move a solicitação para a etapa <strong>Rejeitada</strong>. Você poderá consultá-la no histórico, mas não poderá retomá-la por aqui.
      </p>
      <div class="flex items-center justify-end" style="gap: 10px">
        <button
          style="height: 42px; padding: 0 18px; background: var(--surface-card); color: var(--text-strong); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
         
        >
          Cancelar
        </button>
        <button
          style="height: 42px; padding: 0 18px; background: var(--action-danger-bg); color: var(--action-danger-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
         
        >
          Confirmar rejeição
        </button>
      </div>
    </div>
  </div>
</template>
```

## Detalhe / Dados Gerais

### DadosGeraisTab

```vue
<script setup lang="ts">
import { Plus, Banknote, ArrowRightLeft, Layers, Pencil } from 'lucide-vue-next';
withDefaults(defineProps<{ s: Solicitacao; det: ReturnType<typeof detalheSolicitacao> }>(), {
  s: '',
  det: ''
});
</script>

<template>
  <div class="flex flex-col" style="gap: 32px">
    <!-- Valor em destaque -->
    <div
      class="flex items-center justify-between"
      style="
        gap: 16px;
        flex-wrap: wrap;
        background: var(--gci-base);
        border-radius: var(--radius-xl);
        padding: 22px 26px;
        color: #fff;
      "
    >
      <div>
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--agro-base);
            text-transform: uppercase;
            margin-bottom: 8px;
          "
        >
          Valor da Operação (Nominal)
        </div>
        <div class="flex items-center" style="gap: 12px">
          <div
            style="
              font-size: 32px;
              font-weight: var(--weight-bold);
              letter-spacing: -0.02em;
              font-variant-numeric: tabular-nums;
              line-height: 1.1;
            "
          >
            {{ brl(s.valor) }}
          </div>
          <button
            type="button"
            aria-label="Editar valor da operação"
            class="flex items-center"
            style="
              gap: 6px;
              height: 32px;
              padding: 0 12px;
              background: rgba(255, 255, 255, 0.12);
              border: 1px solid rgba(255, 255, 255, 0.28);
              border-radius: var(--radius-lg);
              cursor: pointer;
              color: #fff;
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.08em;
              text-transform: uppercase;
            "
           
          >
            <Pencil :size="13" /> Editar
          </button>
        </div>
      </div>
      <div class="flex items-center" style="gap: 28px; flex-wrap: wrap">
        <div>
          <div
            style="
              font-size: 9px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: rgba(255, 255, 255, 0.6);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            Taxa
          </div>
          <div style="font-size: var(--text-md); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">
            {{ `${s.taxa.toFixed(2).replace('.', ',')}%` }}
          </div>
        </div>
        <div>
          <div
            style="
              font-size: 9px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: rgba(255, 255, 255, 0.6);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            FEE
          </div>
          <div style="font-size: var(--text-md); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">
            {{ `${d.fee}%` }}
          </div>
        </div>
        <div>
          <div
            style="
              font-size: 9px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: rgba(255, 255, 255, 0.6);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            Valor FEE
          </div>
          <div style="font-size: var(--text-md); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">
            {{ brl(d.valorFee) }}
          </div>
        </div>
      </div>
    </div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>

    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Card</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Card</div>
    </div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>

    <Section title="Partes Relacionadas">
      <template #action>
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">GhostButton</div>
      </template>

<style scoped>
.parte-row:hover {
  background: var(--surface-sunken);
}
</style>
```

### Section

```vue
<script setup lang="ts">
withDefaults(defineProps<{ title: string }>(), {
  title: 'Label'
});
</script>

<template>
  <div>
    <div class="flex items-center justify-between" style="margin-bottom: 16px; gap: 12px">
      <div
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.18em;
          color: var(--accent);
          text-transform: uppercase;
        "
      >
        {{ title }}
      </div>
      <slot name="action" />
    </div>
    <slot />
  </div>
</template>
```

### Field

```vue
<script setup lang="ts">
withDefaults(defineProps<{ label: string }>(), {
  label: 'Label'
});
</script>

<template>
  <div>
    <div
      style="
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.14em;
        color: var(--text-muted);
        text-transform: uppercase;
        margin-bottom: 6px;
      "
    >
      {{ label }}
    </div>
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
      <slot />
    </div>
  </div>
</template>
```

### Card

```vue
<script setup lang="ts">
import { FileText } from 'lucide-vue-next';
import type { Component } from 'vue';
withDefaults(defineProps<{ title: string; icon: Component }>(), {
  title: 'Label',
  icon: FileText
});
</script>

<template>
  <div style="background: var(--surface-sunken); border-radius: var(--radius-lg); padding: 20px">
    <div class="flex items-center" style="gap: 8px; margin-bottom: 16px">
      <component :is="icon" :size="15" style="color: var(--gci-base)" />
      <span
        style="
          font-size: 11px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.10em;
          color: var(--text-strong);
          text-transform: uppercase;
        "
      >
        {{ title }}
      </span>
    </div>
    <slot />
  </div>
</template>
```

### EmptyState

```vue
<script setup lang="ts">
import { FileText } from 'lucide-vue-next';
import type { Component } from 'vue';
withDefaults(defineProps<{ icon: Component; title: string; hint?: string }>(), {
  icon: FileText,
  title: 'Label',
  hint: ''
});
</script>

<template>
  <div
    class="flex flex-col items-center justify-center"
    style="
      gap: 10px;
      padding: 48px 24px;
      text-align: center;
      background: var(--surface-sunken);
      border-radius: var(--radius-lg);
      border: 1px dashed var(--border-default);
    "
  >
    <component :is="icon" :size="30" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
      {{ title }}
    </div>
    <div v-if="hint" style="font-size: var(--text-xs); color: var(--text-muted); max-width: 360px">
      {{ hint }}
    </div>
  </div>
</template>
```

### GhostButton

```vue
<script setup lang="ts">
import { FileText } from 'lucide-vue-next';
import type { Component } from 'vue';
withDefaults(defineProps<{ icon: Component }>(), {
  icon: FileText
});
</script>

<template>
  <button
    class="flex items-center"
    style="
      gap: 8px;
      height: 38px;
      padding: 0 16px;
      background: var(--surface-card);
      color: var(--text-strong);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      cursor: pointer;
      font-weight: var(--weight-bold);
      font-size: var(--text-xs);
      letter-spacing: 0.06em;
    "
   
  >
    <component :is="icon" :size="15" /><slot />
  </button>
</template>
```

### CopyButton

```vue
<script setup lang="ts">
import { Copy, Check as CheckIcon } from 'lucide-vue-next';
withDefaults(defineProps<{ value: string }>(), {
  value: ''
});
</script>

<template>
  <button
    :title="copied ? 'Copiado!' : 'Copiar'"
    :style="{
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '2px',
      color: copied ? 'var(--success-base)' : 'var(--text-muted)',
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: '4px',
      flexShrink: 0,
    }"
   
  >
    <CheckIcon v-if="copied" :size="13" />
    <Copy v-else :size="13" />
  </button>
</template>
```

## Detalhe / Ativos

### AtivosTab

```vue
<script setup lang="ts">
import { Plus, Boxes, Search, Link2, Download, MoreVertical, Trash2, CalendarClock, CheckCircle2 } from 'lucide-vue-next';
withDefaults(defineProps<{ det: ReturnType<typeof detalheSolicitacao> }>(), {
  det: ''
});
</script>

<template>
  <Section title="Ativos Vinculados">
    <template #action>
      <div class="flex items-center" style="gap: 8px; flex-wrap: wrap">
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">GhostButton</div>
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">GhostButton</div>
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">GhostButton</div>
        <div ref="menuRef" style="position: relative">
          <button
            aria-label="Mais ações"
            class="flex items-center justify-center"
            style="
              width: 40px;
              height: 40px;
              border-radius: var(--radius-lg);
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              cursor: pointer;
              color: var(--text-strong);
            "
           
          >
            <MoreVertical :size="18" />
          </button>
          <div
            v-if="menuOpen"
            class="flex flex-col"
            style="
              position: absolute;
              top: 46px;
              right: 0;
              z-index: 50;
              min-width: 220px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              box-shadow: 0 20px 48px -16px rgba(8, 60, 74, 0.28);
              padding: 6px;
            "
          >
            <button
              v-for="a in menuActions"
              :key="a.key"
              :disabled="!hasSelection"
              class="flex items-center menu-item"
              :class="{ danger: a.danger }"
              style="
                gap: 10px;
                padding: 10px 12px;
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
             
            >
              <component :is="a.icon" :size="16" style="color: var(--text-muted)" />
              {{ a.label }}
            </button>
          </div>
        </div>
      </div>
    </template>

<style scoped>
.filter-input {
  width: 100%;
  height: 40px;
  padding-left: 36px;
  padding-right: 12px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  outline: none;
  font-size: var(--text-sm);
  color: var(--text-strong);
}
.menu-item:hover:not(:disabled) {
  background: var(--surface-sunken);
}
.menu-item:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.menu-item.danger:not(:disabled) {
  color: var(--action-danger-text-only);
}
</style>
```

### AtivosTable

```vue
<script setup lang="ts">
withDefaults(defineProps<{ ativos: ContratoAtivo[]; selectedIds: Set<string> }>(), {
  ativos: [],
  selectedIds: ''
});
</script>

<template>
  <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
    <div style="overflow-x: auto">
      <div style="min-width: 1400px">
        <div
          class="grid items-center"
          style="
            grid-template-columns: 40px 90px 120px 80px 90px 70px 100px 120px 1.2fr 1.2fr 100px 100px 110px 90px 100px;
            padding: 12px 16px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.08em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <div class="flex items-center justify-center">
            <Checkbox :checked="allSelected" :indeterminate="someSelected" />
          </div>
          <div>Registro</div>
          <div>Status anexos</div>
          <div>Anexos</div>
          <div>Lastro</div>
          <div>Entrega</div>
          <div>Número</div>
          <div>Valor nominal</div>
          <div>Cedente</div>
          <div>Sacado</div>
          <div>Confirmação</div>
          <div>Situação</div>
          <div>Sit. pagamento</div>
          <div>Entrada</div>
          <div>Vencimento</div>
        </div>
        <div
          v-for="a in pageItems"
          :key="a.id"
          class="grid items-center row-clickable"
          style="
            grid-template-columns: 40px 90px 120px 80px 90px 70px 100px 120px 1.2fr 1.2fr 100px 100px 110px 90px 100px;
            padding: 12px 16px;
            border-top: 1px solid var(--border-default);
            font-size: var(--text-sm);
            cursor: pointer;
          "
         
        >
          <div class="flex items-center justify-center">
            <Checkbox :checked="selectedIds.has(a.id)" />
          </div>
          <div style="color: var(--text-muted)">{{ a.registro }}</div>
          <div>
            <span
              class="badge"
              :style="{
                background: TONE_STATUS_ANEXOS[a.statusAnexos].bg,
                color: TONE_STATUS_ANEXOS[a.statusAnexos].fg,
              }"
            >
              {{ a.statusAnexos }}
            </span>
          </div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">
            {{ a.anexosEnviados }}/{{ a.anexosTotal }}
          </div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ a.lastro }}
          </div>
          <div>
            <span
              class="badge"
              :style="{ background: TONE_ENTREGA[a.entrega].bg, color: TONE_ENTREGA[a.entrega].fg }"
            >
              {{ a.entrega }}
            </span>
          </div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ a.numero }}</div>
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ brl(a.valorTotal) }}
          </div>
          <div style="color: var(--text-default); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
            {{ a.cedenteNome }}
          </div>
          <div style="color: var(--text-default); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
            {{ a.sacadoNome }}
          </div>
          <div>
            <span
              class="badge"
              :style="{
                background: TONE_SITUACAO[a.confirmacao === 'CONFIRMADO' ? 'VALIDADO' : a.confirmacao === 'REJEITADO' ? 'REJEITADO' : 'PENDENTE'].bg,
                color: TONE_SITUACAO[a.confirmacao === 'CONFIRMADO' ? 'VALIDADO' : a.confirmacao === 'REJEITADO' ? 'REJEITADO' : 'PENDENTE'].fg,
              }"
            >
              {{ a.confirmacao }}
            </span>
          </div>
          <div>
            <span
              class="badge"
              :style="{ background: TONE_SITUACAO[a.situacao].bg, color: TONE_SITUACAO[a.situacao].fg }"
            >
              {{ a.situacao }}
            </span>
          </div>
          <div>
            <span
              class="badge"
              :style="{
                background: TONE_SIT_PAGAMENTO[a.situacaoPagamento].bg,
                color: TONE_SIT_PAGAMENTO[a.situacaoPagamento].fg,
              }"
            >
              {{ a.situacaoPagamento.replace('_', ' ') }}
            </span>
          </div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ a.entrada }}</div>
          <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ a.vencimento }}</div>
        </div>
      </div>
    </div>
    <TablePagination
      v-if="ativos.length > 0"
      sunken
      compact
      :total="total"
      :page="page"
      :page-size="pageSize"
     
     
    />
  </div>
</template>

<style scoped>
.badge {
  display: inline-block;
  font-size: 9px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 9999px;
  text-transform: uppercase;
  white-space: nowrap;
}
.row-clickable:hover {
  background: var(--surface-sunken);
}
</style>
```

## Detalhe / Ativo

### AtivoDetailView

```vue
<script setup lang="ts">
import { ArrowLeft, FileText, User, Building2 } from 'lucide-vue-next';
import type { Component } from 'vue';
withDefaults(defineProps<{ ativo: ContratoAtivo; solicitacaoId: string }>(), {
  ativo: '',
  solicitacaoId: ''
});
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
       
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          {{ solicitacaoId }} · Detalhes do Ativo
        </div>
        <h2 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; gap: 8px; flex-wrap: wrap">
          Título {{ ativo.numero }}
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">CopyButton</div>
          <span
            class="flex items-center"
            :style="{ gap: '6px', fontSize: '10px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', padding: '5px 11px', borderRadius: '9999px', background: tone.bg, color: tone.fg }"
          >
            {{ ativo.situacao }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Lastro {{ ativo.lastro }} · {{ ativo.cedenteNome }} → {{ ativo.sacadoNome }}
        </p>
      </div>
      <div style="text-align: right; flex-shrink: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">Valor nominal</div>
        <div style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums; letter-spacing: -0.02em">
          {{ brl(ativo.valorTotal) }}
        </div>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
     
    />

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">TituloTab</div>
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">PessoaDetailTabs</div>
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">PessoaDetailTabs</div>
  </div>
</template>
```

### PessoaDetailTabs

```vue
<script setup lang="ts">
withDefaults(defineProps<{ pessoa: AtivoPessoa; titulo: string; historico?: EventoHistorico[] }>(), {
  pessoa: '',
  titulo: '',
  historico: []
});
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center" style="gap: 6px; border-bottom: 1px solid var(--border-default); flex-wrap: wrap">
      <button
        v-for="t in tabs"
        :key="t"
        :style="{
          padding: '10px 4px',
          marginRight: '22px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-bold)',
          color: tab === t ? 'var(--text-strong)' : 'var(--text-muted)',
          borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
          marginBottom: '-1px',
          whiteSpace: 'nowrap',
        }"
       
      >
        {{ t }}
      </button>
    </div>

    <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 24px">
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">DadosSubTab</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ContatosSubTab</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">EnderecosSubTab</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">HistoricoSubTab</div>
    </div>
  </div>
</template>
```

### DadosSubTab

```vue
<script setup lang="ts">
withDefaults(defineProps<{ pessoa: AtivoPessoa; titulo: string }>(), {
  pessoa: '',
  titulo: ''
});
</script>

<template>
  <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
</template>
```

### EnderecosSubTab

```vue
<script setup lang="ts">
import { MapPin } from 'lucide-vue-next';
withDefaults(defineProps<{ pessoa: AtivoPessoa }>(), {
  pessoa: ''
});
</script>

<template>
  <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">EmptyState</div>
  <div v-else class="flex flex-col" style="gap: 12px">
    <div
      v-for="e in pessoa.enderecos"
      :key="e.id"
      style="padding: 16px; background: var(--surface-sunken); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
    >
      <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
        {{ e.localidade }}, {{ e.numero }} — {{ e.bairro }}
      </div>
      <div style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        {{ e.cidade }}/{{ e.uf }} · CEP {{ e.cep }} · {{ e.pais }}
      </div>
      <div v-if="e.infoAdicionais" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px">
        {{ e.infoAdicionais }}
      </div>
    </div>
  </div>
</template>
```

### ContatosSubTab

```vue
<script setup lang="ts">
import { Phone, Trash2 } from 'lucide-vue-next';
withDefaults(defineProps<{ pessoa: AtivoPessoa }>(), {
  pessoa: ''
});
</script>

<template>
  <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">EmptyState</div>
  <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
    <div
      class="grid items-center"
      style="grid-template-columns: 1.2fr 1.6fr 1.2fr 40px; padding: 10px 16px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.08em; color: var(--text-muted); text-transform: uppercase"
    >
      <div>Nome</div>
      <div>E-mail</div>
      <div>Telefone</div>
      <div />
    </div>
    <div
      v-for="c in pageItems"
      :key="c.id"
      class="grid items-center"
      style="grid-template-columns: 1.2fr 1.6fr 1.2fr 40px; padding: 10px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
    >
      <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ c.nome }}</div>
      <div style="color: var(--text-muted)">{{ c.email }}</div>
      <div style="color: var(--text-muted); font-variant-numeric: tabular-nums">{{ c.ddi }} {{ c.telefone }}</div>
      <div class="flex justify-end">
        <button aria-label="Remover" class="flex items-center justify-center" style="width: 26px; height: 26px; border: none; background: none; border-radius: var(--radius-md); cursor: pointer; color: var(--action-danger-text-only)">
          <Trash2 :size="13" />
        </button>
      </div>
    </div>
    <TablePagination
      sunken
      compact
      :total="total"
      :page="page"
      :page-size="pageSize"
     
     
    />
  </div>
</template>
```

### HistoricoSubTab

```vue
<script setup lang="ts">
import { Clock } from 'lucide-vue-next';
withDefaults(defineProps<{ historico: EventoHistorico[] }>(), {
  historico: []
});
</script>

<template>
  <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
</template>
```

### TituloTab

```vue
<script setup lang="ts">
withDefaults(defineProps<{ ativo: ContratoAtivo }>(), {
  ativo: ''
});
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center" style="gap: 6px; border-bottom: 1px solid var(--border-default); flex-wrap: wrap">
      <button
        v-for="t in SUB_TABS"
        :key="t"
        :style="{
          padding: '10px 4px',
          marginRight: '22px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-bold)',
          color: tab === t ? 'var(--text-strong)' : 'var(--text-muted)',
          borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
          marginBottom: '-1px',
          whiteSpace: 'nowrap',
        }"
       
      >
        {{ t }}
      </button>
    </div>

    <div style="background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 24px">
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">DetalhesTituloTab</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">AnexosTituloTab</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">PagamentosTituloTab</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ConfirmacoesTituloTab</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ObservacoesCobrancaTab</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">MovimentacoesTituloTab</div>
    </div>
  </div>
</template>
```

### DetalhesTituloTab

```vue
<script setup lang="ts">
import { Building2, User } from 'lucide-vue-next';
withDefaults(defineProps<{ ativo: ContratoAtivo }>(), {
  ativo: ''
});
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
  </div>
</template>
```

### PagamentosTituloTab

```vue
<script setup lang="ts">
import { Wallet, ChevronDown, ChevronUp } from 'lucide-vue-next';
withDefaults(defineProps<{ ativo: ContratoAtivo }>(), {
  ativo: ''
});
</script>

<template>
  <div class="flex flex-col" style="gap: 28px">
    <div class="flex items-center justify-end" style="gap: 32px; flex-wrap: wrap">
      <div style="text-align: right">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase">Valor em aberto</div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(Math.max(ativo.valorTotal - totalPago, 0)) }}
        </div>
      </div>
      <div style="text-align: right">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase">Juros remuneratórios em aberto</div>
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
          {{ brl(det.jurosRemuneratorioAberto) }}
        </div>
      </div>
    </div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
  </div>
</template>
```

### ConfirmacoesTituloTab

```vue
<script setup lang="ts">
import { CheckCircle2 } from 'lucide-vue-next';
withDefaults(defineProps<{ ativo: ContratoAtivo }>(), {
  ativo: ''
});
</script>

<template>
  <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">EmptyState</div>
  <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
    <div
      class="grid"
      style="
        grid-template-columns: 1.5fr 1fr 1fr 100px 80px;
        padding: 12px 16px;
        background: var(--surface-sunken);
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.08em;
        color: var(--text-muted);
        text-transform: uppercase;
      "
    >
      <div>Observação</div>
      <div>Confirmado por</div>
      <div>Data</div>
      <div>Status</div>
      <div>Ações</div>
    </div>
    <div
      v-for="(c, i) in pageItems"
      :key="i"
      class="grid items-center"
      style="grid-template-columns: 1.5fr 1fr 1fr 100px 80px; padding: 12px 16px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
    >
      <div style="color: var(--text-default)">{{ c.observacao || '—' }}</div>
      <div>{{ c.confirmadoPor }}</div>
      <div style="font-variant-numeric: tabular-nums">{{ c.data }}</div>
      <div>{{ c.status }}</div>
      <div style="color: var(--accent); font-weight: var(--weight-semibold); cursor: pointer">Ver</div>
    </div>
    <TablePagination
      sunken
      compact
      :total="total"
      :page="page"
      :page-size="pageSize"
     
     
    />
  </div>
</template>
```

### MovimentacoesTituloTab

```vue
<script setup lang="ts">
import { Clock } from 'lucide-vue-next';
withDefaults(defineProps<{ ativo: ContratoAtivo }>(), {
  ativo: ''
});
</script>

<template>
  <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
</template>
```

### AnexosTituloTab

```vue
<script setup lang="ts">
import { CheckCircle2, XCircle } from 'lucide-vue-next';
withDefaults(defineProps<{ ativo: ContratoAtivo }>(), {
  ativo: ''
});
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center" style="gap: 10px">
      <button
        class="flex items-center"
        style="gap: 8px; height: 40px; padding: 0 16px; background: var(--success-light); color: var(--success-dark); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
      >
        <CheckCircle2 :size="16" /> Confirmar Anexos
      </button>
      <button
        class="flex items-center"
        style="gap: 8px; height: 40px; padding: 0 16px; background: var(--danger-light); color: var(--danger-dark); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em"
      >
        <XCircle :size="16" /> Rejeitar Anexos
      </button>
    </div>
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">DocGroup</div>
  </div>
</template>
```

### ObservacoesCobrancaTab

```vue
<script setup lang="ts">
import { MessageSquare, Paperclip, Send, User } from 'lucide-vue-next';
withDefaults(defineProps<{ ativo: ContratoAtivo }>(), {
  ativo: ''
});
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex" style="gap: 14px">
      <div class="flex items-center justify-center" style="width: 44px; height: 44px; border-radius: 9999px; background: var(--gci-light); color: var(--gci-base); flex-shrink: 0">
        <User :size="20" />
      </div>
      <div style="flex: 1">
        <textarea
          v-model="mensagem"
          placeholder="Escreva uma observação de cobrança..."
          rows="3"
          style="width: 100%; padding: 14px; background: var(--surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; resize: vertical; font-size: var(--text-sm); color: var(--text-strong); font-family: inherit"
        />
        <div class="flex items-center justify-between" style="margin-top: 12px">
          <button class="flex items-center" style="gap: 8px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: var(--text-xs); font-weight: var(--weight-bold); letter-spacing: 0.06em">
            <Paperclip :size="15" /> ANEXAR
          </button>
          <button class="flex items-center" style="gap: 8px; height: 40px; padding: 0 18px; background: var(--action-primary-bg); color: var(--action-primary-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.06em">
            <Send :size="14" /> Postar
          </button>
        </div>
      </div>
    </div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">EmptyState</div>
    <div v-else class="flex flex-col" style="gap: 12px">
      <div
        v-for="(obs, i) in ativo.observacoesCobranca"
        :key="i"
        style="padding: 16px; background: var(--surface-sunken); border-radius: var(--radius-lg); border: 1px solid var(--border-default)"
      >
        <div style="font-size: var(--text-sm); color: var(--text-strong)">{{ obs.mensagem }}</div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 8px">{{ obs.autor }} · {{ obs.data }}</div>
      </div>
    </div>
  </div>
</template>
```

### DynamicPagamentoFormGrid

```vue
<script setup lang="ts">
const form = defineModel({ default: '' });
withDefaults(defineProps<{ fields: PagamentoFormFieldDef[]; cols?: number }>(), {
  fields: [],
  cols: 2
});
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '16px' }">
    <div
      v-for="field in fields"
      :key="field.key"
      :style="field.span ? { gridColumn: `span ${Math.min(field.span, cols)}` } : undefined"
    >
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">SelectField</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ToggleRow</div>
    </div>
  </div>
</template>
```

### DynamicConfigGrid

```vue
<script setup lang="ts">
withDefaults(defineProps<{ fields: ConfiguracaoTituloFieldDef[]; data: ConfiguracaoTituloDisplay; cols?: number }>(), {
  fields: [],
  data: '',
  cols: 2
});
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '20px' }">
    <div
      v-for="field in fields"
      :key="field.key"
      :style="field.span ? { gridColumn: `span ${Math.min(field.span, cols)}` } : undefined"
    >
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Field</div>
    </div>
  </div>
</template>
```

### Participant

```vue
<script setup lang="ts">
import { FileText } from 'lucide-vue-next';
import type { Component } from 'vue';
withDefaults(defineProps<{ role: string; name: string; cnpj: string; icon: Component }>(), {
  role: '',
  name: '',
  cnpj: '',
  icon: FileText
});
</script>

<template>
  <div
    class="flex items-center"
    style="gap: 14px; padding: 16px; background: var(--surface-sunken); border-radius: var(--radius-lg)"
  >
    <div
      class="flex items-center justify-center"
      style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: var(--surface-card); color: var(--gci-base); flex-shrink: 0"
    >
      <component :is="icon" :size="20" />
    </div>
    <div style="flex: 1; min-width: 0">
      <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
        {{ role }}
      </div>
      <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
        {{ name }}
      </div>
      <div class="flex items-center" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; gap: 4px">
        {{ cnpj }}<div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">CopyButton</div>
      </div>
    </div>
  </div>
</template>
```

## Detalhe / Parte relacionada

### ParteRelacionadaDetailView

```vue
<script setup lang="ts">
import { ArrowLeft, User, MapPin, Phone } from 'lucide-vue-next';
import type { Component } from 'vue';
withDefaults(defineProps<{ parte: ParteRelacionada; solicitacaoId: string }>(), {
  parte: '',
  solicitacaoId: ''
});
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Header -->
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
          flex-shrink: 0;
        "
       
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          {{ solicitacaoId }} · Parte Relacionada
        </div>
        <h2
          class="flex items-center"
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.2;
            gap: 8px;
            flex-wrap: wrap;
          "
        >
          {{ parte.nome }}
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">CopyButton</div>
        </h2>
        <p
          style="
            font-size: var(--text-sm);
            color: var(--text-muted);
            margin-top: 4px;
            font-variant-numeric: tabular-nums;
          "
        >
          {{ parte.documento }} · {{ parte.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica' }}
        </p>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="tabOptions"
      variant="brand"
     
    />

    <!-- Conteúdo do anexo ativo -->
    <div
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
      "
    >
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">DynamicFieldGrid</div>

      <!-- Tabela de contatos relacionados (Anexo 1) -->
      <div v-if="tab === 'anexo-1'" style="margin-top: 32px">
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
      </div>

      <!-- Tipos (Anexo 3) -->
      <div v-if="tab === 'anexo-3'" style="margin-top: 32px">
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
      </div>
    </div>
  </div>
</template>
```

### DynamicFieldGrid

```vue
<script setup lang="ts">
withDefaults(defineProps<{ parte: ParteRelacionada; fields: ParteFieldDef[]; cols?: number }>(), {
  parte: '',
  fields: [],
  cols: 2
});
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: '24px' }">
    <div
      v-for="field in visible"
      :key="field.key"
      :style="field.span ? { gridColumn: `span ${Math.min(field.span, gridCols)}` } : undefined"
    >
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Field</div>
    </div>
  </div>
</template>
```

## Detalhe / Garantias

### GarantiasTab

```vue
<script setup lang="ts">
withDefaults(defineProps<{ det: ReturnType<typeof detalheSolicitacao> }>(), {
  det: ''
});
</script>

<template>
  <Section title="Garantias">
    <template #action>
      <div class="flex items-center" style="gap: 10px">
        <SegmentedToggle
          v-if="det.garantias.length > 0"
          :model-value="view"
          :options="VIEW_OPTS"
          icon-only
         
        />
        <GhostButton :icon="Plus"
          >Adicionar garantia</GhostButton
        >
      </div>
    </template>
```

## Detalhe / Validações

### ValidacoesTab

```vue
<script setup lang="ts">
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-vue-next';
withDefaults(defineProps<{ det: ReturnType<typeof detalheSolicitacao> }>(), {
  det: ''
});
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center justify-between" style="gap: 12px; flex-wrap: wrap">
      <div class="flex items-center" style="gap: 8px; font-size: var(--text-xs); color: var(--text-muted)">
        <AlertCircle :size="15" style="color: var(--text-muted)" />
        As validações só rodam quando a operação tiver título e veículo vinculado.
      </div>
      <div class="flex items-center" style="gap: 8px">
        <button
          class="flex items-center"
          style="
            gap: 6px;
            height: 38px;
            padding: 0 14px;
            background: none;
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.04em;
            color: var(--text-strong);
          "
         
        >
          <CheckCircle2 :size="14" /> Ver tela de validações
        </button>
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">GhostButton</div>
      </div>
    </div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
  </div>
</template>
```

### ValidacoesFullView

```vue
<script setup lang="ts">
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, Loader2, RefreshCw, XCircle } from 'lucide-vue-next';
import type { Component } from 'vue';
withDefaults(defineProps<{ det: ReturnType<typeof detalheSolicitacao>; solicitacaoId: string }>(), {
  det: '',
  solicitacaoId: ''
});
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
          flex-shrink: 0;
        "
       
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          {{ solicitacaoId }} · Solicitação de Operação
        </div>
        <h2
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.2;
          "
        >
          Validações
        </h2>
      </div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">GhostButton</div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(5, 1fr); gap: 12px">
      <div
        v-for="k in kpis"
        :key="k.label"
        class="flex items-center"
        :style="{ gap: '12px', padding: '16px 18px', background: k.bg, borderRadius: 'var(--radius-xl)' }"
      >
        <div
          class="flex items-center justify-center"
          :style="{
            width: '40px',
            height: '40px',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.60)',
            color: k.fg,
            flexShrink: 0,
          }"
        >
          <component :is="k.icon" :size="18" />
        </div>
        <div>
          <div
            :style="{
              fontSize: '9px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.12em',
              color: k.fg,
              textTransform: 'uppercase',
              marginBottom: '4px',
              opacity: 0.8,
            }"
          >
            {{ k.label }}
          </div>
          <div :style="{ fontSize: '24px', fontWeight: 'var(--weight-bold)', color: k.fg, lineHeight: 1 }">
            {{ k.count }}
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex items-center"
      style="
        gap: 8px;
        font-size: var(--text-xs);
        color: var(--text-muted);
        padding: 10px 14px;
        background: var(--surface-sunken);
        border-radius: var(--radius-lg);
      "
    >
      <AlertCircle :size="14" />
      As validações só rodam quando a operação tiver título e veículo vinculado. Use "Revalidar todas" para
      atualizar.
    </div>

    <div
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
      "
    >
      <div class="flex flex-col" style="gap: 32px">
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
      </div>
    </div>
  </div>
</template>
```

### ValidacaoRow

```vue
<script setup lang="ts">
import { AlertCircle, CheckCircle2, XCircle, Clock, Loader2, Send, Eye, ListTree } from 'lucide-vue-next';
import type { Component } from 'vue';
withDefaults(defineProps<{ v: ItemValidacao }>(), {
  v: ''
});
</script>

<template>
  <div
    :style="{
      borderRadius: 'var(--radius-lg)',
      border: `1px solid ${v.status === 'NAO_OK' || v.status === 'EXCECAO' ? 'var(--danger-light)' : 'var(--border-default)'}`,
      background: v.status === 'NAO_OK' ? 'var(--status-danger-bg)' : 'var(--surface-card)',
      padding: '16px',
    }"
  >
    <div class="flex items-center justify-between" style="gap: 12px">
      <div class="flex items-center" style="gap: 12px; min-width: 0">
        <span
          class="flex items-center justify-center"
          :style="{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            background: valTone[v.status].bg,
            color: valTone[v.status].fg,
            flexShrink: 0,
          }"
        >
          <component :is="valTone[v.status].icon" :size="17" />
        </span>
        <div style="min-width: 0">
          <div class="flex items-center" style="gap: 8px; flex-wrap: wrap">
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{
              v.titulo
            }}</span>
            <span
              style="
                font-size: 9px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.06em;
                padding: 2px 7px;
                border-radius: var(--radius-sm);
                background: var(--status-active-bg);
                color: var(--gci-base);
                text-transform: uppercase;
              "
            >
              {{ v.area }}
            </span>
            <span
              :style="{
                fontSize: '9px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.06em',
                padding: '2px 7px',
                borderRadius: 'var(--radius-sm)',
                background: valTone[v.status].bg,
                color: valTone[v.status].fg,
                textTransform: 'uppercase',
              }"
            >
              {{ VALIDACAO_STATUS_LABEL[v.status] }}
            </span>
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 3px">{{ v.descricao }}</div>
        </div>
      </div>
      <div class="flex items-center" style="gap: 8px; flex-shrink: 0">
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">GhostButton</div>
        <template v-if="v.exigeAutorizacao">
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">GhostButton</div>
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">GhostButton</div>
          <button
            class="flex items-center"
            style="
              gap: 6px;
              height: 38px;
              padding: 0 16px;
              background: var(--action-primary-bg);
              color: var(--action-primary-text);
              border: none;
              border-radius: var(--radius-lg);
              cursor: pointer;
              font-weight: var(--weight-bold);
              font-size: var(--text-xs);
              letter-spacing: 0.06em;
            "
           
          >
            <CheckCircle2 :size="15" /> Autorizar
          </button>
        </template>
```

## Detalhe / Anexos · Ata · Histórico

### AnexosTab

```vue
<script setup lang="ts">
import { Download, FileText, Paperclip, Plus, Trash2 } from 'lucide-vue-next';
withDefaults(defineProps<{ det: ReturnType<typeof detalheSolicitacao> }>(), {
  det: ''
});
</script>

<template>
  <Section title="Documentos Anexados">
    <template #action>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">GhostButton</div>
    </template>
```

### AtaTab

```vue
<script setup lang="ts">
import { MessageSquare, Paperclip, Send, User } from 'lucide-vue-next';
</script>

<template>
  <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
</template>
```

### HistoricoTab

```vue
<script setup lang="ts">
import { Clock } from 'lucide-vue-next';
withDefaults(defineProps<{ det: ReturnType<typeof detalheSolicitacao> }>(), {
  det: ''
});
</script>

<template>
  <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Section</div>
</template>
```

## Novo Pedido

### NovoPedidoModal

```vue
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { Component } from 'vue';
</script>

<template>
  <div
    style="
      position: relative; width: 100%; min-height: 320px;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      animation: fadeIn 0.2s ease-out;
    "
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 980px;
        height: 85vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
     
    >
      <div
        class="flex items-start justify-between"
        style="padding: 24px 32px; border-bottom: 1px solid var(--border-default)"
      >
        <div>
          <h2 style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            Novo Pedido de Operação
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ step.hint }} · Etapa {{ stepIdx + 1 }} de {{ steps.length }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="
            width: 36px;
            height: 36px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-default);
            background: var(--surface-card);
            cursor: pointer;
            color: var(--text-muted);
          "
         
        >
          <X :size="18" />
        </button>
      </div>

      <div class="flex" style="background: var(--surface-sunken); border-bottom: 1px solid var(--border-default)">
        <div
          v-for="(s, i) in steps"
          :key="s.key"
          class="flex items-center justify-center"
          :style="{
            flex: 1,
            gap: '8px',
            padding: '16px 8px 13px',
            borderBottom: i === stepIdx ? '3px solid var(--agro-base)' : '3px solid transparent',
            color: i === stepIdx ? 'var(--agro-base)' : i < stepIdx ? 'var(--stepper-done)' : 'var(--text-muted)',
            opacity: i !== stepIdx && i >= stepIdx ? 0.6 : 1,
          }"
        >
          <Check v-if="i < stepIdx" :size="16" :stroke-width="2.5" />
          <component :is="s.icon" v-else :size="16" :stroke-width="i === stepIdx ? 2.25 : 1.75" />
          <span style="font-size: var(--text-xs); font-weight: var(--weight-bold); letter-spacing: 0.08em; text-transform: uppercase">
            {{ s.label }}
          </span>
        </div>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 32px">
        <DadosGeraisStep v-if="step.key === 'dados'" :form="form" />

        <GarantiaStep
          v-else-if="step.key === 'garantia'"
          :requer="form.requerGarantia"
          :itens="garantiaItens"
          :g-form="garantiaForm"
         
         
         
        />

        <AtivosDuplicataStep
          v-else-if="step.key === 'ativos'"
          :phase="duplicataPhase"
          :xml-files="xmlFiles"
          :titulos-extraidos="titulosExtraidos"
          :ativos-vinculados="ativosVinculados"
         
         
         
        />

        <AnexosStep
          v-else-if="step.key === 'anexos'"
          :docs-gerais="docsAnexos"
          :docs-garantia="docsGarantia"
          :doc-files="docFiles"
          :hide-garantia-docs="isDescontoDuplicata"
          :gerais-title="isDescontoDuplicata ? 'Documentos da operação' : 'Documentos gerais'"
         
        />
      </div>

      <div
        class="flex items-center justify-between"
        style="padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)"
      >
        <button
          class="flex items-center"
          style="
            gap: 6px;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-muted);
            font-weight: var(--weight-semibold);
            font-size: var(--text-sm);
            padding: 10px 4px;
          "
         
        >
          <template v-if="isFirst">Cancelar</template>
```

### DadosGeraisStep

```vue
<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
withDefaults(defineProps<{ form: NewPedidoData }>(), {
  form: ''
});
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">BentoBox</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">BentoBox</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">BentoBox</div>

    <BentoBox title="Taxas">
      <BentoGrid :cols="form.tipoTaxa === 'Pós-fixado' ? 4 : 3">
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">SelectField</div>
        <template v-if="form.tipoTaxa === 'Pós-fixado'">
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">SelectField</div>
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">SelectField</div>
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
        </template>
```

### AtivosDuplicataStep

```vue
<script setup lang="ts">
import { CloudUpload, Download, Link2, Trash2 } from 'lucide-vue-next';
withDefaults(defineProps<{ phase: 'upload' | 'extracted'; xmlFiles: XmlUploadItem[]; titulosExtraidos: TituloExtraidoDuplicata[]; ativosVinculados: ContratoAtivo[] }>(), {
  phase: '',
  xmlFiles: [],
  titulosExtraidos: [],
  ativosVinculados: []
});
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center justify-end">
      <button
        type="button"
        class="flex items-center"
        style="
          gap: 8px;
          height: 40px;
          padding: 0 16px;
          background: var(--action-primary-bg);
          color: var(--action-primary-text);
          border: none;
          border-radius: var(--radius-lg);
          cursor: pointer;
          font-weight: var(--weight-bold);
          font-size: var(--text-xs);
          letter-spacing: 0.06em;
        "
       
      >
        <Link2 :size="15" /> Vincular ativos
      </button>
    </div>

    <!-- Fase upload: dropzone + arquivos -->
    <template v-if="phase === 'upload'">
      <button
        type="button"
        class="flex flex-col items-center justify-center"
        style="
          width: 100%;
          gap: 8px;
          padding: 48px 24px;
          background: var(--surface-sunken);
          border: 1px dashed var(--border-default);
          border-radius: var(--radius-xl);
          cursor: pointer;
          color: var(--text-muted);
          transition: border-color var(--duration-base), background var(--duration-base);
        "
       
      >
        <div
          class="flex items-center justify-center"
          style="
            width: 56px;
            height: 56px;
            border-radius: 9999px;
            background: var(--gci-light);
            color: var(--gci-base);
            margin-bottom: 4px;
          "
        >
          <CloudUpload :size="26" />
        </div>
        <div style="font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong)">
          Solte seu arquivo
        </div>
        <div style="font-size: var(--text-sm); color: var(--text-muted)">ou</div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--gci-base)">
          clique aqui para procurar
        </div>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px">
          XML de NF-e · mock de upload
        </div>
      </button>

      <div v-if="xmlFiles.length > 0" class="flex flex-col" style="gap: 10px">
        <div
          v-for="f in xmlFiles"
          :key="f.id"
          class="flex items-center"
          style="
            gap: 14px;
            padding: 12px 16px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
          "
        >
          <div class="flex items-center" style="gap: 6px">
            <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">IconAction</div>
            <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">IconAction</div>
          </div>
          <div style="flex: 1; min-width: 0; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ f.nome }}
          </div>
        </div>
      </div>
    </template>
```

### GarantiaStep

```vue
<script setup lang="ts">
import { Shield, ShieldCheck } from 'lucide-vue-next';
withDefaults(defineProps<{ requer: boolean; itens: GarantiaItem[]; gForm: GarantiaItem }>(), {
  requer: true,
  itens: [],
  gForm: ''
});
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <!-- Toggle em destaque -->
    <div
      class="flex items-center justify-between"
      :style="{
        padding: '16px 20px',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: requer ? 'var(--gci-base)' : 'var(--border-default)',
        background: requer ? 'var(--gci-light)' : 'var(--surface-card)',
        transition: 'all var(--duration-base)',
      }"
     
    >
      <div class="flex items-center" style="gap: 12px">
        <Shield :size="20" :color="requer ? 'var(--gci-base)' : 'var(--text-muted)'" />
        <div>
          <div style="font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong)">
            Requer garantia
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px">
            Ative para vincular garantias reais ou fidejussórias à operação.
          </div>
        </div>
      </div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">Switch</div>
    </div>

    <!-- Empty state orientativo -->
    <div
      v-if="!requer"
      class="flex flex-col items-center justify-center"
      style="gap: 12px; padding: 48px 24px; text-align: center"
    >
      <div
        class="flex items-center justify-center"
        style="width: 64px; height: 64px; border-radius: 9999px; background: var(--surface-sunken); color: var(--neutral-400)"
      >
        <Shield :size="28" :stroke-width="1.5" />
      </div>
      <div style="font-size: var(--text-sm); color: var(--text-muted); max-width: 360px; line-height: 1.5">
        Esta operação não requer garantia. Clique em
        <strong style="color: var(--text-default)">"Próxima etapa"</strong> para continuar.
      </div>
    </div>

    <template v-else>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">SectionGroup</div>

      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">DataTable</div>
    </template>
```

### AnexosStep

```vue
<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">DocGroup</div>
    <DocGroup
      v-if="!hideGarantiaDocs && docsGarantia.length > 0"
      title="Documentos das garantias"
      :docs="docsGarantia"
      :doc-files="docFiles"
     
    />
  </div>
</template>
```

### FormField

```vue
<script setup lang="ts">
const model = defineModel({ default: '' });
withDefaults(defineProps<{ label: string; placeholder?: string; disabled?: boolean }>(), {
  label: 'Label',
  placeholder: 'Label',
  disabled: true
});
</script>

<template>
  <div>
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FieldLabel</div>
    <input
      v-model="model"
      :placeholder="placeholder"
      :disabled="disabled"
      :style="{
        width: '100%',
        height: '40px',
        padding: '0 14px',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        outline: 'none',
        fontSize: 'var(--text-sm)',
        color: disabled ? 'var(--text-muted)' : 'var(--text-strong)',
        cursor: disabled ? 'not-allowed' : 'text',
      }"
    />
  </div>
</template>
```

### SelectField

```vue
<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
const model = defineModel({ default: '' });
withDefaults(defineProps<{ label?: string; options: string[]; placeholder?: string; disabled?: boolean }>(), {
  label: 'Label',
  options: [],
  placeholder: 'Label',
  disabled: true
});
</script>

<template>
  <div>
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FieldLabel</div>
    <div style="position: relative">
      <select
        v-model="model"
        :disabled="disabled"
        :style="{
          width: '100%',
          height: '40px',
          padding: '0 36px 0 14px',
          background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontSize: 'var(--text-sm)',
          color: model ? 'var(--text-strong)' : 'var(--text-muted)',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
        }"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
      </select>
      <ChevronDown
        :size="16"
        style="
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--neutral-400);
          pointer-events: none;
        "
      />
    </div>
  </div>
</template>
```

### FieldLabel

```vue
<script setup lang="ts">
</script>

<template>
  <div
    style="
      font-size: 10px;
      font-weight: var(--weight-bold);
      letter-spacing: 0.14em;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-bottom: 6px;
    "
  >
    <slot />
  </div>
</template>
```

### DataTable

```vue
<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';
</script>

<template>
  <div style="border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
    <div
      class="grid"
      :style="{
        gridTemplateColumns: template(),
        padding: '10px 14px',
        background: 'var(--surface-sunken)',
        fontSize: '10px',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: '0.12em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
      }"
    >
      <div v-for="c in cols" :key="String(c.key)">{{ c.label }}</div>
      <div />
    </div>
    <div
      v-if="rows.length === 0"
      style="padding: 20px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
    >
      {{ empty }}
    </div>
    <template v-else>
      <div
        v-for="(r, i) in displayRows"
        :key="i"
        class="npm-row grid items-center"
        :style="{
          gridTemplateColumns: template(),
          padding: '12px 14px',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-strong)',
          borderTop: '1px solid var(--border-default)',
        }"
      >
        <div
          v-for="c in cols"
          :key="String(c.key)"
          :style="{
            fontVariantNumeric: 'tabular-nums',
            fontWeight: c.key === cols[0].key ? 'var(--weight-bold)' : 'var(--weight-regular)',
          }"
        >
          {{ (r[c.key] as string) || '—' }}
        </div>
        <div style="text-align: center">
          <button
            class="npm-trash"
            aria-label="Remover"
            style="background: none; border: none; cursor: pointer; color: var(--danger-base); display: inline-flex"
           
          >
            <Trash2 :size="15" />
          </button>
        </div>
      </div>
      <TablePagination
        v-if="paginated"
        :sunken="sunken"
        :compact="compact"
        :total="total"
        :page="page"
        :page-size="pageSize"
       
       
      />
    </template>

<style scoped>
.npm-row .npm-trash {
  opacity: 0;
  transition: opacity 0.15s;
}
.npm-row:hover .npm-trash {
  opacity: 1;
}
</style>
```

### AddButton

```vue
<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
</script>

<template>
  <button
    class="flex items-center justify-center"
    style="
      height: 40px;
      min-width: 40px;
      padding: 0 16px;
      gap: 6px;
      background: var(--success-base);
      color: #fff;
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      font-size: var(--text-xs);
      font-weight: var(--weight-bold);
      letter-spacing: 0.08em;
    "
   
  >
    <Plus :size="14" /> ADICIONAR
  </button>
</template>
```

### ToggleRow

```vue
<script setup lang="ts">
withDefaults(defineProps<{ label: string; on: boolean }>(), {
  label: 'Label',
  on: true
});
</script>

<template>
  <div
    class="flex items-center justify-between"
    :style="{
      padding: '14px 18px',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: on ? 'var(--success-base)' : 'var(--border-default)',
      background: on ? 'var(--success-light)' : 'var(--surface-card)',
      transition: 'all var(--duration-base)',
    }"
   
  >
    <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">{{
      label
    }}</span>
    <div
      :style="{
        position: 'relative',
        width: '44px',
        height: '24px',
        borderRadius: '9999px',
        background: on ? 'var(--success-base)' : 'var(--border-strong)',
        transition: 'background var(--duration-base)',
        flexShrink: 0,
      }"
    >
      <span
        :style="{
          position: 'absolute',
          top: '3px',
          left: on ? '23px' : '3px',
          width: '18px',
          height: '18px',
          borderRadius: '9999px',
          background: '#fff',
          transition: 'left var(--duration-base)',
          boxShadow: 'var(--shadow-xs)',
        }"
      />
    </div>
  </div>
</template>
```

### Switch

```vue
<script setup lang="ts">
withDefaults(defineProps<{ on: boolean }>(), {
  on: true
});
</script>

<template>
  <div
    :style="{
      position: 'relative',
      width: '44px',
      height: '24px',
      borderRadius: '9999px',
      background: on ? 'var(--gci-base)' : 'var(--border-strong)',
      transition: 'background var(--duration-base)',
      flexShrink: 0,
    }"
  >
    <span
      :style="{
        position: 'absolute',
        top: '3px',
        left: on ? '23px' : '3px',
        width: '18px',
        height: '18px',
        borderRadius: '9999px',
        background: '#fff',
        transition: 'left var(--duration-base)',
        boxShadow: 'var(--shadow-xs)',
      }"
    />
  </div>
</template>
```

### IconAction

```vue
<script setup lang="ts">
import { FileText } from 'lucide-vue-next';
import type { Component } from 'vue';
withDefaults(defineProps<{ icon: Component; label: string; danger?: boolean }>(), {
  icon: FileText,
  label: 'Label',
  danger: true
});
</script>

<template>
  <button
    :aria-label="label"
    :title="label"
    class="flex items-center justify-center"
    :style="{
      width: '34px',
      height: '34px',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      border: '1px solid var(--border-default)',
      background: 'var(--surface-card)',
      color: danger ? 'var(--danger-base)' : 'var(--text-muted)',
    }"
   
  >
    <component :is="icon" :size="15" />
  </button>
</template>
```

### SectionGroup

```vue
<script setup lang="ts">
import { FileText } from 'lucide-vue-next';
import type { Component } from 'vue';
withDefaults(defineProps<{ title: string; icon?: Component }>(), {
  title: 'Label',
  icon: FileText
});
</script>

<template>
  <div
    style="
      padding: 20px;
      background: var(--surface-card);
      border-width: 1px;
      border-style: solid;
      border-color: var(--border-default);
      border-radius: var(--radius-lg);
    "
  >
    <div
      class="flex items-center"
      style="
        gap: 8px;
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.18em;
        color: var(--accent);
        text-transform: uppercase;
        margin-bottom: 16px;
      "
    >
      <component :is="icon" v-if="icon" :size="14" :stroke-width="2" />
      {{ title }}
    </div>
    <slot />
  </div>
</template>
```

### BentoGrid

```vue
<script setup lang="ts">
withDefaults(defineProps<{ cols: number }>(), {
  cols: 2
});
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '14px' }">
    <slot />
  </div>
</template>
```

### BentoBox

```vue
<script setup lang="ts">
withDefaults(defineProps<{ title: string }>(), {
  title: 'Label'
});
</script>

<template>
  <div style="background: var(--surface-sunken); border-radius: var(--radius-lg); padding: 20px">
    <div
      style="
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.18em;
        color: var(--accent);
        text-transform: uppercase;
        margin-bottom: 14px;
      "
    >
      {{ title }}
    </div>
    <slot />
  </div>
</template>
```

### DocGroup

```vue
<script setup lang="ts">
import { CheckCircle2, Download, FileText, Trash2, Upload } from 'lucide-vue-next';
</script>

<template>
  <div>
    <div
      style="
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.18em;
        color: var(--accent);
        text-transform: uppercase;
        margin-bottom: 12px;
      "
    >
      {{ title }}
    </div>
    <div class="flex flex-col" style="gap: 10px">
      <div
        v-for="doc in docs"
        :key="doc.id"
        class="flex items-center"
        :style="{
          gap: '14px',
          padding: '12px 16px',
          background: 'var(--surface-card)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--border-default)',
          borderLeft:
            doc.obrigatorio && !docFiles[doc.id] ? '3px solid var(--warning-base)' : '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
        }"
      >
        <div
          class="flex items-center justify-center"
          :style="{
            width: '38px',
            height: '38px',
            flexShrink: 0,
            borderRadius: 'var(--radius-md)',
            background: docFiles[doc.id] ? 'var(--success-light)' : 'var(--surface-sunken)',
            color: docFiles[doc.id] ? 'var(--success-base)' : 'var(--text-muted)',
          }"
        >
          <CheckCircle2 v-if="docFiles[doc.id]" :size="18" />
          <FileText v-else :size="18" />
        </div>

        <div style="flex: 1; min-width: 0">
          <div class="flex items-center" style="gap: 8px">
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">{{
              doc.nome
            }}</span>
            <span
              :style="{
                fontSize: '9px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.08em',
                padding: '2px 7px',
                borderRadius: '9999px',
                background: doc.obrigatorio ? 'var(--status-warning-bg)' : 'var(--status-neutral-bg)',
                color: doc.obrigatorio ? 'var(--status-warning-text)' : 'var(--status-neutral-text)',
                textTransform: 'uppercase',
              }"
            >
              {{ doc.obrigatorio ? 'Obrigatório' : 'Opcional' }}
            </span>
          </div>
          <div
            :style="{
              fontSize: '11px',
              color: docFiles[doc.id] ? 'var(--success-dark)' : 'var(--text-muted)',
              marginTop: '2px',
            }"
          >
            {{ docFiles[doc.id] ? 'Arquivo anexado · documento.pdf' : 'Nenhum arquivo anexado' }}
          </div>
        </div>

        <div class="flex items-center" style="gap: 6px">
          <template v-if="docFiles[doc.id]">
            <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">IconAction</div>
            <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">IconAction</div>
          </template>
```

## Detalhe / Modais

### MoverEtapaModal

```vue
<script setup lang="ts">
import { ArrowRight, X } from 'lucide-vue-next';
withDefaults(defineProps<{ solicitacaoId: string; cedente: string; etapaOrigem: string; etapaDestino: string }>(), {
  solicitacaoId: '',
  cedente: '',
  etapaOrigem: '',
  etapaDestino: ''
});
</script>

<template>
  <div
    style="
      position: relative; width: 100%; min-height: 320px;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      animation: fadeIn 0.2s ease-out;
    "
   
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 520px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
     
    >
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.18em;
              color: var(--gci-base);
              text-transform: uppercase;
              margin-bottom: 6px;
            "
          >
            Solicitação · Kanban
          </div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.25">
            Mover solicitação {{ solicitacaoId }}
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ cedente }}
          </p>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="
            width: 40px;
            height: 40px;
            border-radius: var(--radius-lg);
            background: var(--surface-sunken);
            border: none;
            cursor: pointer;
            color: var(--text-muted);
            flex-shrink: 0;
          "
         
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Body -->
      <div style="padding: 24px 28px; background: var(--surface-sunken)">
        <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 16px">
          Confirme a mudança de etapa no kanban. A solicitação será movida imediatamente após a confirmação.
        </p>

        <div
          class="flex items-center"
          style="
            gap: 12px;
            padding: 16px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
          "
        >
          <div style="flex: 1; min-width: 0">
            <div
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.12em;
                color: var(--text-muted);
                text-transform: uppercase;
                margin-bottom: 6px;
              "
            >
              De
            </div>
            <div
              style="
                font-size: var(--text-sm);
                font-weight: var(--weight-bold);
                color: var(--text-strong);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ etapaOrigem }}
            </div>
          </div>

          <div
            class="flex items-center justify-center"
            style="
              width: 32px;
              height: 32px;
              border-radius: 9999px;
              background: color-mix(in srgb, var(--gci-base) 12%, transparent);
              color: var(--gci-base);
              flex-shrink: 0;
            "
          >
            <ArrowRight :size="16" />
          </div>

          <div style="flex: 1; min-width: 0; text-align: right">
            <div
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.12em;
                color: var(--text-muted);
                text-transform: uppercase;
                margin-bottom: 6px;
              "
            >
              Para
            </div>
            <div
              style="
                font-size: var(--text-sm);
                font-weight: var(--weight-bold);
                color: var(--text-strong);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ etapaDestino }}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="flex items-center justify-between"
        style="padding: 16px 28px; border-top: 1px solid var(--border-default); background: var(--surface-card)"
      >
        <button
          type="button"
          style="
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-muted);
            font-weight: var(--weight-semibold);
            font-size: var(--text-sm);
            padding: 10px 4px;
          "
         
        >
          Cancelar
        </button>
        <button
          type="button"
          style="
            height: 44px;
            padding: 0 24px;
            background: var(--action-primary-bg);
            color: #fff;
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-sm);
          "
         
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>
```

### AdicionarContratoModal

```vue
<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { X, Tag, Paperclip, Trash2, FileText, AlertTriangle, Layers, MoreVertical, Copy, BadgeCheck } from 'lucide-vue-next';
withDefaults(defineProps<{ valorOperacao: number; tipoCalculo: string; partes?: ParteRelacionada[]; unidadeNegocio?: string }>(), {
  valorOperacao: 2,
  tipoCalculo: '',
  partes: [],
  unidadeNegocio: ''
});
</script>

<template>
  <div
    style="
      position: relative; width: 100%; min-height: 320px;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      animation: fadeIn 0.2s ease-out;
    "
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 1040px;
        height: 88vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
     
    >
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            Adicionar Contrato
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ showWizard ? wizardSubtitle : 'Dados do título, parcelas e dados do sacado' }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="
            width: 36px;
            height: 36px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-default);
            background: var(--surface-card);
            cursor: pointer;
            color: var(--text-muted);
          "
         
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Wizard de minuta -->
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">MinutaWizard</div>

      <!-- Body padrão (sem minuta) -->
      <template v-else>
        <div style="flex: 1; overflow-y: auto; padding: 32px">
          <div class="flex flex-col" style="gap: 24px">
            <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ToggleRow</div>
            <div
              v-if="!minutaHabilitada && form.tipo"
              style="font-size: var(--text-xs); color: var(--text-muted); margin-top: -12px"
            >
              Disponível apenas para Contrato CPR, CPRF, NC e CCB nesta versão.
            </div>
            <div
              v-else-if="!form.tipo"
              style="font-size: var(--text-xs); color: var(--text-muted); margin-top: -12px"
            >
              Selecione o tipo do título (CPR, CPRF, NC ou CCB) em Dados do Título para habilitar a geração de minuta.
            </div>

            <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">BentoBox</div>

            <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ToggleRow</div>
            <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">BentoBox</div>

            <BentoBox title="Dados do Sacado" :icon="Tag">
              <div class="flex flex-col" style="gap: 14px">
                <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 14px">
                  <div style="grid-column: span 4">
                    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
                  </div>
                  <div style="grid-column: span 5">
                    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
                  </div>
                  <div
                    v-if="sacadoEncontrado"
                    class="flex items-end"
                    style="grid-column: span 3; padding-bottom: 11px; gap: 6px; font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--success-base)"
                  >
                    <BadgeCheck :size="14" /> Sacado encontrado na base
                  </div>

                  <template v-if="!sacadoEncontrado">
                    <div style="grid-column: span 3">
                      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
                    </div>

                    <div style="grid-column: span 2">
                      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">SelectField</div>
                    </div>
                    <div style="grid-column: span 4">
                      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
                    </div>
                    <div style="grid-column: span 3">
                      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
                    </div>
                    <div style="grid-column: span 3">
                      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
                    </div>

                    <div style="grid-column: span 6">
                      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
                    </div>
                    <div style="grid-column: span 6">
                      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
                    </div>

                    <div style="grid-column: span 4">
                      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
                    </div>
                    <div style="grid-column: span 4">
                      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
                    </div>
                    <div style="grid-column: span 2">
                      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">SelectField</div>
                    </div>
                    <div style="grid-column: span 2">
                      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">SelectField</div>
                    </div>
                  </template>

<style scoped>
.parcela-action-item:hover {
  background: var(--surface-sunken);
}
</style>
```

### VincularAtivosModal

```vue
<script setup lang="ts">
import { X } from 'lucide-vue-next';
</script>

<template>
  <div
    style="
      position: relative; width: 100%; min-height: 320px;
      z-index: 1;
      background: rgba(8, 60, 74, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    "
   
  >
    <div
      class="flex flex-col"
      style="
        width: 100%;
        max-width: 1100px;
        max-height: 90vh;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        border: 1px solid var(--border-default);
        overflow: hidden;
      "
    >
      <div class="flex items-center justify-between" style="padding: 20px 24px; border-bottom: 1px solid var(--border-default); flex-shrink: 0">
        <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Vincular Ativos</h3>
        <button aria-label="Fechar" style="background: none; border: none; cursor: pointer; color: var(--text-muted)">
          <X :size="20" />
        </button>
      </div>

      <div style="padding: 20px 24px; overflow-y: auto; flex: 1; min-height: 0">
        <div class="grid" style="grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px">
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
        </div>

        <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
          <div class="vincular-ativos-scroll" style="overflow-x: auto; overflow-y: visible; -webkit-overflow-scrolling: touch">
            <div :style="{ minWidth: TABLE_MIN_WIDTH }">
              <div
                class="grid items-center"
                :style="{
                  gridTemplateColumns: COLS,
                  columnGap: '12px',
                  padding: '12px 16px',
                  background: 'var(--surface-sunken)',
                  fontSize: '10px',
                  fontWeight: 'var(--weight-bold)',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                }"
              >
                <div class="flex items-center justify-center">
                  <Checkbox :checked="allSelected" :indeterminate="someSelected" />
                </div>
                <div>Lastro</div>
                <div>Número</div>
                <div>Tipo</div>
                <div>Situação</div>
                <div>Confirmação</div>
                <div>Criação</div>
                <div>Emissão</div>
                <div>Valor nominal</div>
                <div>Cedente</div>
                <div>Sacado</div>
                <div>Vencimento</div>
                <div>Entrega</div>
              </div>
              <div
                v-if="titulos.length === 0"
                style="padding: 28px 16px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); border-top: 1px solid var(--border-default)"
              >
                Não foi encontrado nenhum título pendente.
              </div>
              <div
                v-for="t in pageItems"
                :key="t.id"
                class="grid items-center"
                :style="{
                  gridTemplateColumns: COLS,
                  columnGap: '12px',
                  padding: '14px 16px',
                  borderTop: '1px solid var(--border-default)',
                  fontSize: 'var(--text-sm)',
                }"
              >
                <div class="flex items-center justify-center">
                  <Checkbox :checked="selectedIds.has(t.id)" />
                </div>
                <div style="white-space: nowrap">{{ t.lastro }}</div>
                <div style="font-weight: var(--weight-semibold); white-space: nowrap">{{ t.numero }}</div>
                <div style="white-space: nowrap">{{ t.tipoOperacao }}</div>
                <div style="white-space: nowrap">{{ t.situacao }}</div>
                <div style="white-space: nowrap">{{ t.confirmacao }}</div>
                <div style="white-space: nowrap">{{ t.dataCriacao }}</div>
                <div style="white-space: nowrap">{{ t.dataEmissao }}</div>
                <div style="font-variant-numeric: tabular-nums; white-space: nowrap">{{ brl(t.valorNominal) }}</div>
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap" :title="t.cedente">{{ t.cedente }}</div>
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap" :title="t.sacado">{{ t.sacado }}</div>
                <div style="white-space: nowrap">{{ t.vencimento }}</div>
                <div>
                  <span
                    :style="{
                      display: 'inline-block',
                      fontSize: '10px',
                      fontWeight: 'var(--weight-bold)',
                      letterSpacing: '0.06em',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: t.entrega === 'FUT' ? 'var(--gci-light)' : 'var(--agro-light)',
                      color: t.entrega === 'FUT' ? 'var(--gci-base)' : 'var(--agro-base)',
                      whiteSpace: 'nowrap',
                    }"
                  >
                    {{ t.entrega }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <TablePagination
            v-if="titulos.length > 0"
            :total="total"
            :page="page"
            :page-size="pageSize"
           
           
          />
        </div>
      </div>

      <div
        class="flex items-center justify-between"
        style="padding: 16px 24px; border-top: 1px solid var(--border-default); flex-wrap: wrap; gap: 12px; flex-shrink: 0"
      >
        <div class="flex items-center" style="gap: 20px; flex-wrap: wrap">
          <div>
            <span style="font-size: var(--text-xs); color: var(--text-muted)">Total selecionado</span>
            <div style="font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(totalSelecionado) }}</div>
          </div>
          <div>
            <span style="font-size: var(--text-xs); color: var(--text-muted)">Total confirmado</span>
            <div style="font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">{{ brl(totalConfirmado) }}</div>
          </div>
          <div>
            <span style="font-size: var(--text-xs); color: var(--text-muted)">Percentual</span>
            <div style="font-weight: var(--weight-bold)">{{ percentual }}%</div>
          </div>
        </div>
        <button
          :disabled="selectedIds.size === 0"
          style="
            height: 44px;
            padding: 0 24px;
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.08em;
            opacity: selectedIds.size === 0 ? 0.5 : 1;
          "
         
        >
          VINCULAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### CadastrarGarantiaModal

```vue
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { X } from 'lucide-vue-next';
withDefaults(defineProps<{ garantia?: GarantiaOperacao | null }>(), {
  garantia: ''
});
</script>

<template>
  <div
    style="
      position: relative; width: 100%; min-height: 320px;
      z-index: 1;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    "
   
  >
    <div
      style="
        width: 100%;
        max-width: 720px;
        max-height: calc(100vh - 64px);
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
     
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ isEdit ? 'Editar garantia' : 'Cadastrar garantia' }}
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Dados da garantia e documentos comprobatórios
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted)"
         
        >
          <X :size="18" />
        </button>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 24px 28px">
        <div class="flex flex-col" style="gap: 20px">
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">StepGrid</div>

          <div v-if="!showAnexos" class="flex justify-end">
            <button
              type="button"
              :disabled="!dadosOk"
              :style="{
                height: '42px',
                padding: '0 20px',
                background: dadosOk ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
                color: dadosOk ? '#fff' : 'var(--text-disabled)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                cursor: dadosOk ? 'pointer' : 'not-allowed',
                fontWeight: 'var(--weight-bold)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.08em',
              }"
             
            >
              CONTINUAR
            </button>
          </div>

          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">DocGroup</div>
        </div>
      </div>

      <div class="flex items-center justify-between" style="padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
         
        >
          Cancelar
        </button>
        <button
          type="button"
          :disabled="!canSave"
          :style="{
            height: '44px',
            padding: '0 24px',
            background: canSave ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canSave ? '#fff' : 'var(--text-disabled)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canSave ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
          }"
         
        >
          {{ isEdit ? 'SALVAR' : 'ADICIONAR' }}
        </button>
      </div>
    </div>
  </div>
</template>
```

### ExcluirGarantiaModal

```vue
<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';
withDefaults(defineProps<{ garantia: GarantiaOperacao }>(), {
  garantia: ''
});
</script>

<template>
  <div
    class="flex items-center justify-center"
    style="position: relative; width: 100%; min-height: 320px; z-index: 1; background: rgba(15, 23, 42, 0.45); padding: 24px"
   
  >
    <div
      style="
        width: 100%;
        max-width: 440px;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: 0 30px 60px -20px rgba(8, 60, 74, 0.4);
        padding: 28px;
      "
     
    >
      <div
        class="flex items-center justify-center"
        style="
          width: 52px;
          height: 52px;
          border-radius: 9999px;
          background: var(--status-danger-bg);
          color: var(--danger-base);
          margin-bottom: 18px;
        "
      >
        <AlertTriangle :size="26" />
      </div>
      <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 8px">
        Excluir a garantia "{{ garantia.nome }}"?
      </h3>
      <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 24px">
        Esta ação remove a garantia e os anexos vinculados desta solicitação. Não será possível desfazer por aqui.
      </p>
      <div class="flex items-center justify-end" style="gap: 10px">
        <button
          type="button"
          style="
            height: 42px;
            padding: 0 18px;
            background: var(--surface-card);
            color: var(--text-strong);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-sm);
          "
         
        >
          Cancelar
        </button>
        <button
          type="button"
          style="
            height: 42px;
            padding: 0 18px;
            background: var(--action-danger-bg);
            color: var(--action-danger-text);
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-sm);
          "
         
        >
          Confirmar exclusão
        </button>
      </div>
    </div>
  </div>
</template>
```

### ParteRelacionadaModal

```vue
<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { X, User, Building2, Phone, MapPin } from 'lucide-vue-next';
</script>

<template>
  <div
    style="
      position: relative; width: 100%; min-height: 320px;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      animation: fadeIn 0.2s ease-out;
    "
  >
    <div
      style="
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 960px;
        height: 85vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      "
     
    >
      <!-- Header -->
      <div class="flex items-start justify-between" style="padding: 24px 32px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
            Nova Parte Relacionada
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Identificação, endereço, contato e vínculo com a solicitação
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="
            width: 36px;
            height: 36px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-default);
            background: var(--surface-card);
            cursor: pointer;
            color: var(--text-muted);
          "
         
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Body -->
      <div style="flex: 1; overflow-y: auto; padding: 32px">
        <div class="flex flex-col" style="gap: 24px">
          <BentoBox title="Identificação">
            <div class="flex flex-col" style="gap: 14px">
              <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">StepGrid</div>

              <template v-if="form.tipoPessoa === 'FISICA'">
                <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">StepGrid</div>
                <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ToggleRow</div>
                <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">SpouseFields</div>
              </template>
```

### NovaContaBancariaModal

```vue
<script setup lang="ts">
import { X } from 'lucide-vue-next';
</script>

<template>
  <div
    style="
      position: relative; width: 100%; min-height: 320px;
      z-index: 1;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    "
   
  >
    <div
      style="
        width: 100%;
        max-width: 520px;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
     
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Nova Conta Bancária
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Cadastro rápido para uso no veículo da operação
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted)"
         
        >
          <X :size="18" />
        </button>
      </div>

      <div style="padding: 24px 28px">
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">StepGrid</div>
      </div>

      <div class="flex items-center justify-between" style="padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
         
        >
          Cancelar
        </button>
        <button
          type="button"
          :disabled="!canSubmit"
          :style="{
            height: '44px',
            padding: '0 24px',
            background: canSubmit ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canSubmit ? '#fff' : 'var(--text-disabled)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
          }"
         
        >
          CADASTRAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### InserirEvidenciaModal

```vue
<script setup lang="ts">
import { X, Paperclip } from 'lucide-vue-next';
withDefaults(defineProps<{ tituloValidacao: string }>(), {
  tituloValidacao: ''
});
</script>

<template>
  <div
    style="
      position: relative; width: 100%; min-height: 320px;
      z-index: 1;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    "
   
  >
    <div
      style="
        width: 100%;
        max-width: 520px;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
     
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Inserir evidência de autorização
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ tituloValidacao }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted)"
         
        >
          <X :size="18" />
        </button>
      </div>

      <div class="flex flex-col" style="padding: 24px 28px; gap: 16px">
        <div>
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-bottom: 8px;
            "
          >
            Arquivo
          </div>
          <div
            class="flex items-center"
            style="
              gap: 8px;
              height: 42px;
              padding: 0 14px;
              background: var(--surface-sunken);
              border: 1px dashed var(--border-default);
              border-radius: var(--radius-lg);
              color: var(--text-default);
              font-size: var(--text-sm);
            "
          >
            <Paperclip :size="15" style="color: var(--text-muted)" />
            {{ arquivo }}
          </div>
        </div>

        <div>
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-bottom: 8px;
            "
          >
            Descrição
          </div>
          <textarea
            v-model="descricao"
            rows="4"
            maxlength="500"
            placeholder="Descreva a evidência..."
            style="
              width: 100%;
              padding: 12px 14px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              outline: none;
              font-size: var(--text-sm);
              color: var(--text-strong);
              font-family: inherit;
              resize: vertical;
            "
          />
          <div style="text-align: right; font-size: 11px; color: var(--text-muted); margin-top: 4px">
            {{ descricao.length }} / 500
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between" style="padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
         
        >
          Cancelar
        </button>
        <button
          type="button"
          :disabled="!canSubmit"
          :style="{
            height: '44px',
            padding: '0 24px',
            background: canSubmit ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canSubmit ? '#fff' : 'var(--text-disabled)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
          }"
         
        >
          INSERIR
        </button>
      </div>
    </div>
  </div>
</template>
```

### DetalheEvidenciaModal

```vue
<script setup lang="ts">
import { X, Paperclip } from 'lucide-vue-next';
withDefaults(defineProps<{ tituloValidacao: string; evidencia: ValidacaoEvidencia }>(), {
  tituloValidacao: '',
  evidencia: ''
});
</script>

<template>
  <div
    style="
      position: relative; width: 100%; min-height: 320px;
      z-index: 1;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    "
   
  >
    <div
      style="
        width: 100%;
        max-width: 560px;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
     
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div style="min-width: 0; padding-right: 12px">
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); line-height: 1.3">
            Detalhes da autorização
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ tituloValidacao }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
         
        >
          <X :size="18" />
        </button>
      </div>

      <div class="flex flex-col" style="padding: 24px 28px; gap: 16px">
        <div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            De: {{ evidencia.autor }}
          </div>
          <div style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ evidencia.data }}
          </div>
        </div>

        <div
          v-if="evidencia.arquivo"
          class="flex items-center"
          style="gap: 8px; font-size: var(--text-sm); color: var(--text-default)"
        >
          <Paperclip :size="15" style="color: var(--text-muted)" />
          {{ evidencia.arquivo }}
        </div>

        <div
          style="
            padding: 16px;
            background: var(--surface-sunken);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            font-size: var(--text-sm);
            color: var(--text-strong);
            line-height: 1.5;
            min-height: 96px;
          "
        >
          {{ evidencia.descricao }}
        </div>
      </div>

      <div class="flex items-center justify-end" style="padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
         
        >
          FECHAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### DetalheValidacaoModal

```vue
<script setup lang="ts">
import type { Component } from 'vue';
withDefaults(defineProps<{ v: ItemValidacao }>(), {
  v: ''
});
</script>

<template>
  <div
    style="
      position: relative; width: 100%; min-height: 320px;
      z-index: 1;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    "
   
  >
    <div
      style="
        width: 100%;
        max-width: 640px;
        max-height: calc(100vh - 64px);
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
     
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div style="min-width: 0; padding-right: 12px">
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); line-height: 1.3">
            Detalhes da validação
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ v.titulo }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
         
        >
          <X :size="18" />
        </button>
      </div>

      <div class="flex flex-col" style="flex: 1; overflow-y: auto; padding: 24px 28px; gap: 16px">
        <div class="flex items-center" style="gap: 8px; flex-wrap: wrap">
          <span
            style="
              font-size: 9px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.06em;
              padding: 2px 7px;
              border-radius: var(--radius-sm);
              background: var(--status-active-bg);
              color: var(--gci-base);
              text-transform: uppercase;
            "
          >
            {{ v.area }}
          </span>
          <span
            class="flex items-center"
            :style="{
              gap: '4px',
              fontSize: '9px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.06em',
              padding: '2px 7px',
              borderRadius: 'var(--radius-sm)',
              background: valTone[v.status].bg,
              color: valTone[v.status].fg,
              textTransform: 'uppercase',
            }"
          >
            <component :is="valTone[v.status].icon" :size="11" />
            {{ VALIDACAO_STATUS_LABEL[v.status] }}
          </span>
        </div>

        <p style="font-size: var(--text-sm); color: var(--text-default); line-height: 1.5; margin: 0">
          {{ v.descricao }}
        </p>

        <div v-if="v.erros?.length">
          <div
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              color: var(--text-muted);
              text-transform: uppercase;
              margin-bottom: 8px;
            "
          >
            Erros
          </div>
          <div class="flex flex-col" style="gap: 8px">
            <div
              v-for="(erro, i) in v.erros"
              :key="i"
              style="
                padding: 12px 14px;
                background: var(--status-danger-bg);
                border: 1px solid var(--danger-light);
                border-radius: var(--radius-lg);
                font-size: var(--text-sm);
                color: var(--text-strong);
                line-height: 1.5;
              "
            >
              {{ erro }}
            </div>
          </div>
        </div>

        <div
          v-else
          style="
            padding: 16px;
            background: var(--surface-sunken);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            font-size: var(--text-sm);
            color: var(--text-muted);
          "
        >
          Nenhum erro detalhado para esta validação.
        </div>
      </div>

      <div class="flex items-center justify-end" style="padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
         
        >
          FECHAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### GerarTermoCessaoModal

```vue
<script setup lang="ts">
import { X, MapPin, Building2, PenLine } from 'lucide-vue-next';
</script>

<template>
  <div
    style="
      position: relative; width: 100%; min-height: 320px;
      z-index: 1;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    "
   
  >
    <div
      style="
        width: 100%;
        max-width: 640px;
        max-height: calc(100vh - 64px);
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
     
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Gerar Termo de Cessão
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Dados do termo, endereço, gestoras e signatários
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted)"
         
        >
          <X :size="18" />
        </button>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 24px 28px">
        <div class="flex flex-col" style="gap: 20px">
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">StepGrid</div>

          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">BentoBox</div>

          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">BentoBox</div>

          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">BentoBox</div>
        </div>
      </div>

      <div class="flex items-center justify-between" style="padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
         
        >
          Cancelar
        </button>
        <button
          type="button"
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
         
        >
          GERAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### GerarCnabModal

```vue
<script setup lang="ts">
import { X } from 'lucide-vue-next';
</script>

<template>
  <div
    style="
      position: relative; width: 100%; min-height: 320px;
      z-index: 1;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    "
   
  >
    <div
      style="
        width: 100%;
        max-width: 560px;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
     
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Gerar CNAB
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Configuração do arquivo de remessa
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted)"
         
        >
          <X :size="18" />
        </button>
      </div>

      <div style="padding: 24px 28px">
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">StepGrid</div>
      </div>

      <div class="flex items-center justify-between" style="padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
         
        >
          Cancelar
        </button>
        <button
          type="button"
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
         
        >
          GERAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### AtualizarCessaoModal

```vue
<script setup lang="ts">
import { X } from 'lucide-vue-next';
</script>

<template>
  <div
    style="
      position: relative; width: 100%; min-height: 320px;
      z-index: 1;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    "
   
  >
    <div
      style="
        width: 100%;
        max-width: 900px;
        max-height: calc(100vh - 64px);
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
     
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Atualizar Cessão
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Parâmetros financeiros e de cálculo da cessão
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted)"
         
        >
          <X :size="18" />
        </button>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 24px 28px">
        <div class="flex flex-col" style="gap: 16px">
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">StepGrid</div>

          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">StepGrid</div>
        </div>
      </div>

      <div class="flex items-center justify-between" style="padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          type="button"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
         
        >
          Cancelar
        </button>
        <button
          type="button"
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
         
        >
          ATUALIZAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### ProrrogarVencimentoModal

```vue
<script setup lang="ts">
import { X, Upload } from 'lucide-vue-next';
withDefaults(defineProps<{ ativos: ContratoAtivo[] }>(), {
  ativos: []
});
</script>

<template>
  <div
    style="position: relative; width: 100%; min-height: 320px; z-index: 1; background: rgba(8, 60, 74, 0.45); display: flex; align-items: center; justify-content: center; padding: 24px"
   
  >
    <div style="width: 100%; max-width: 560px; background: var(--surface-card); border-radius: var(--radius-xl); border: 1px solid var(--border-default)">
      <div class="flex items-center justify-between" style="padding: 20px 24px; border-bottom: 1px solid var(--border-default)">
        <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Prorrogar Vencimento</h3>
        <button aria-label="Fechar" style="background: none; border: none; cursor: pointer; color: var(--text-muted)">
          <X :size="20" />
        </button>
      </div>
      <div class="flex flex-col" style="padding: 24px; gap: 16px">
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
        <div>
          <label style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-muted); letter-spacing: 0.06em; display: block; margin-bottom: 8px">CARTA DE CORREÇÃO</label>
          <button
            class="flex items-center"
            style="gap: 8px; padding: 10px 16px; background: var(--surface-sunken); border: 1px dashed var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-size: var(--text-sm); color: var(--text-muted)"
          >
            <Upload :size="16" /> Selecionar arquivo
          </button>
        </div>
        <div>
          <label style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-muted); letter-spacing: 0.06em; display: block; margin-bottom: 8px">MOTIVO DA PRORROGAÇÃO</label>
          <textarea
            v-model="motivo"
            rows="3"
            placeholder="Descreva o motivo da prorrogação..."
            style="width: 100%; padding: 12px 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-family: inherit; resize: vertical"
          />
        </div>
      </div>
      <div style="padding: 16px 24px; border-top: 1px solid var(--border-default); display: flex; justify-content: flex-end">
        <button
          :disabled="!novoVencimento.trim()"
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: var(--action-primary-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
         
        >
          CONFIRMAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### ConfirmarTituloModal

```vue
<script setup lang="ts">
import { X, Upload } from 'lucide-vue-next';
withDefaults(defineProps<{ ativos: ContratoAtivo[] }>(), {
  ativos: []
});
</script>

<template>
  <div
    style="position: relative; width: 100%; min-height: 320px; z-index: 1; background: rgba(8, 60, 74, 0.45); display: flex; align-items: center; justify-content: center; padding: 24px"
   
  >
    <div style="width: 100%; max-width: 560px; background: var(--surface-card); border-radius: var(--radius-xl); border: 1px solid var(--border-default)">
      <div class="flex items-center justify-between" style="padding: 20px 24px; border-bottom: 1px solid var(--border-default)">
        <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">Confirmar Título</h3>
        <button aria-label="Fechar" style="background: none; border: none; cursor: pointer; color: var(--text-muted)">
          <X :size="20" />
        </button>
      </div>
      <div style="padding: 24px">
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: 16px">
          {{ ativos.length }} título(s) selecionado(s)
        </p>
        <div class="flex flex-col" style="gap: 16px">
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">SelectField</div>
          <div>
            <label style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-muted); letter-spacing: 0.06em; display: block; margin-bottom: 8px">EVIDÊNCIA</label>
            <button
              class="flex items-center"
              style="gap: 8px; padding: 10px 16px; background: var(--surface-sunken); border: 1px dashed var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-size: var(--text-sm); color: var(--text-muted)"
            >
              <Upload :size="16" /> Selecionar arquivo
            </button>
          </div>
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>
          <div>
            <label style="font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--text-muted); letter-spacing: 0.06em; display: block; margin-bottom: 8px">OBSERVAÇÃO</label>
            <textarea
              v-model="observacao"
              rows="3"
              placeholder="Observações sobre a confirmação..."
              style="width: 100%; padding: 12px 14px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); outline: none; font-size: var(--text-sm); color: var(--text-strong); font-family: inherit; resize: vertical"
            />
          </div>
        </div>
      </div>
      <div style="padding: 16px 24px; border-top: 1px solid var(--border-default); display: flex; justify-content: flex-end">
        <button
          style="height: 44px; padding: 0 24px; background: var(--action-primary-bg); color: var(--action-primary-text); border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
         
        >
          REGISTRAR CONFIRMAÇÃO
        </button>
      </div>
    </div>
  </div>
</template>
```

### EditarValorOperacaoModal

```vue
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { X, AlertTriangle } from 'lucide-vue-next';
withDefaults(defineProps<{ valorAtual: number; feePercent: number }>(), {
  valorAtual: 2,
  feePercent: 2
});
</script>

<template>
  <div
    style="
      position: relative; width: 100%; min-height: 320px;
      z-index: 1;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    "
   
  >
    <div
      style="
        width: 100%;
        max-width: 480px;
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        border: 1px solid var(--border-default);
        box-shadow: var(--shadow-lg);
      "
     
    >
      <div class="flex items-center justify-between" style="padding: 20px 24px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong)">
            Editar valor da operação
          </h3>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Atual: {{ brl(valorAtual) }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted)"
         
        >
          <X :size="20" />
        </button>
      </div>

      <div class="flex flex-col" style="padding: 24px; gap: 16px">
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FormField</div>

        <div
          style="
            padding: 14px 16px;
            background: var(--surface-sunken);
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-default);
          "
        >
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px">
            Prévia do impacto
          </div>
          <div class="flex items-center justify-between" style="margin-bottom: 8px">
            <span style="font-size: var(--text-sm); color: var(--text-muted)">FEE ({{ feePercent }}%)</span>
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ novoFee != null ? brl(novoFee) : '—' }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span style="font-size: var(--text-sm); color: var(--text-muted)">Valor da operação</span>
            <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ novoValor != null ? brl(novoValor) : '—' }}
            </span>
          </div>
        </div>

        <div
          class="flex items-start"
          style="gap: 8px; font-size: var(--text-xs); color: var(--warning-dark); font-weight: var(--weight-semibold)"
        >
          <AlertTriangle :size="14" style="flex-shrink: 0; margin-top: 1px" />
          Alterar o valor recalcula o Valor FEE e pode afetar validações e ativos vinculados.
        </div>
      </div>

      <div class="flex items-center justify-end" style="gap: 12px; padding: 16px 24px; border-top: 1px solid var(--border-default)">
        <button
          style="
            height: 44px;
            padding: 0 20px;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-muted);
            font-weight: var(--weight-semibold);
            font-size: var(--text-sm);
          "
         
        >
          Cancelar
        </button>
        <button
          :disabled="!canConfirm"
          :style="{
            height: '44px',
            padding: '0 24px',
            background: canConfirm ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
            color: canConfirm ? '#fff' : 'var(--text-disabled)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: canConfirm ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
          }"
         
        >
          CONFIRMAR
        </button>
      </div>
    </div>
  </div>
</template>
```

### FormField

```vue
<script setup lang="ts">
const model = defineModel({ default: '' });
withDefaults(defineProps<{ label: string; placeholder?: string; disabled?: boolean; required?: boolean; span?: number; /** Máscara R$ centavos (digitar 2 → R$ 0,02) */
    currency?: boolean }>(), {
  label: 'Label',
  placeholder: 'Label',
  disabled: true,
  required: true,
  span: 2
});
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FieldLabel</div>
    <input
      :value="model"
      :placeholder="currency ? 'R$ 0,00' : placeholder"
      :disabled="disabled"
      :inputmode="currency ? 'numeric' : undefined"
      :style="{
        width: '100%',
        height: '40px',
        padding: '0 14px',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        outline: 'none',
        fontSize: 'var(--text-sm)',
        color: disabled ? 'var(--text-muted)' : 'var(--text-strong)',
        cursor: disabled ? 'not-allowed' : 'text',
        fontVariantNumeric: currency ? 'tabular-nums' : undefined,
      }"
     
     
    />
  </div>
</template>
```

### SelectField

```vue
<script setup lang="ts">
const model = defineModel({ default: '' });
withDefaults(defineProps<{ label?: string; options: string[]; placeholder?: string; disabled?: boolean; required?: boolean; span?: number }>(), {
  label: 'Label',
  options: [],
  placeholder: 'Label',
  disabled: true,
  required: true,
  span: 2
});
</script>

<template>
  <div :style="{ gridColumn: span ? `span ${span}` : undefined }">
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FieldLabel</div>
    <div style="position: relative">
      <select
        v-model="model"
        :disabled="disabled"
        :style="{
          width: '100%',
          height: '40px',
          padding: '0 36px 0 14px',
          background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontSize: 'var(--text-sm)',
          color: model ? 'var(--text-strong)' : 'var(--text-muted)',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
        }"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
      </select>
    </div>
  </div>
</template>
```

### FieldLabel

```vue
<script setup lang="ts">
withDefaults(defineProps<{ showError?: boolean }>(), {
  showError: true
});
</script>

<template>
  <div
    :style="{
      fontSize: '10px',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: '0.14em',
      color: showError ? 'var(--danger-base)' : 'var(--text-muted)',
      textTransform: 'uppercase',
      marginBottom: '6px',
    }"
  >
    <template v-if="showError">* </template>
```

### ToggleRow

```vue
<script setup lang="ts">
withDefaults(defineProps<{ label: string; on: boolean; hint?: string; compact?: boolean; spacious?: boolean; disabled?: boolean }>(), {
  label: 'Label',
  on: true,
  hint: '',
  compact: true,
  spacious: true,
  disabled: true
});
</script>

<template>
  <div
    class="flex items-center justify-between"
    :class="{ 'toggle-row--match-field': compact && !hint }"
    :style="{
      width: spacious ? '100%' : undefined,
      padding: spacious ? '20px 24px' : compact ? '12px 16px' : '14px 18px',
      borderRadius: 'var(--radius-lg)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: on ? 'var(--success-base)' : 'var(--border-default)',
      background: on ? 'var(--success-light)' : 'var(--surface-card)',
      transition: 'all var(--duration-base)',
      gap: '12px',
    }"
   
  >
    <div style="min-width: 0">
      <div
        style="
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
          color: var(--text-strong);
          line-height: 1.35;
        "
      >{{ label }}</div>
      <div v-if="hint" style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px; line-height: 1.4">{{ hint }}</div>
    </div>
    <div
      :style="{
        position: 'relative',
        width: '44px',
        height: '24px',
        borderRadius: '9999px',
        background: on ? 'var(--success-base)' : 'var(--border-strong)',
        transition: 'background var(--duration-base)',
        flexShrink: 0,
      }"
    >
      <span
        :style="{
          position: 'absolute',
          top: '3px',
          left: on ? '23px' : '3px',
          width: '18px',
          height: '18px',
          borderRadius: '9999px',
          background: '#fff',
          transition: 'left var(--duration-base)',
          boxShadow: 'var(--shadow-xs)',
        }"
      />
    </div>
  </div>
</template>

<style scoped>
/* Altura alinhada ao bloco SelectField (label + input 40px) — só quando não há hint */
.toggle-row--match-field {
  min-height: 64px;
  height: 100%;
  align-self: stretch;
}
</style>
```

### AddButton

```vue
<script setup lang="ts">
withDefaults(defineProps<{ disabled?: boolean; fullWidth?: boolean }>(), {
  disabled: true,
  fullWidth: true
});
</script>

<template>
  <button
    class="flex items-center justify-center"
    :disabled="disabled"
    :style="{
      width: fullWidth ? '100%' : undefined,
      height: '40px',
      padding: '0 18px',
      background: disabled ? 'var(--neutral-200)' : 'var(--gci-base)',
      color: disabled ? 'var(--text-disabled)' : '#fff',
      border: 'none',
      borderRadius: 'var(--radius-lg)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-xs)',
      letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
      gap: '6px',
      opacity: disabled ? 0.7 : 1,
    }"
   
  >
    <slot />
  </button>
</template>
```

### EmptyState

```vue
<script setup lang="ts">
import { FileText } from 'lucide-vue-next';
import type { Component } from 'vue';
withDefaults(defineProps<{ icon: Component; title: string; hint?: string }>(), {
  icon: FileText,
  title: 'Label',
  hint: ''
});
</script>

<template>
  <div
    class="flex flex-col items-center justify-center"
    style="
      gap: 10px;
      padding: 40px 24px;
      text-align: center;
      background: var(--surface-sunken);
      border-radius: var(--radius-lg);
      border: 1px dashed var(--border-default);
    "
  >
    <component :is="icon" :size="28" :stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5" />
    <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
      {{ title }}
    </div>
    <div v-if="hint" style="font-size: var(--text-xs); color: var(--text-muted); max-width: 360px">{{ hint }}</div>
  </div>
</template>
```

### BentoGrid

```vue
<script setup lang="ts">
withDefaults(defineProps<{ cols: number }>(), {
  cols: 2
});
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '14px' }">
    <slot />
  </div>
</template>
```

### BentoBox

```vue
<script setup lang="ts">
import { FileText } from 'lucide-vue-next';
import type { Component } from 'vue';
withDefaults(defineProps<{ title: string; icon?: Component }>(), {
  title: 'Label',
  icon: FileText
});
</script>

<template>
  <div style="background: var(--surface-sunken); border-radius: var(--radius-lg); padding: 20px">
    <div
      class="flex items-center"
      style="
        gap: 8px;
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.18em;
        color: var(--accent);
        text-transform: uppercase;
        margin-bottom: 14px;
      "
    >
      <component :is="icon" v-if="icon" :size="13" :stroke-width="2" />
      {{ title }}
    </div>
    <slot />
  </div>
</template>
```

### StepGrid

```vue
<script setup lang="ts">
</script>

<template>
  <div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: 14px">
    <slot />
  </div>
</template>
```

### FormField

```vue
<script setup lang="ts">
const model = defineModel({ default: '' });
withDefaults(defineProps<{ label: string; placeholder?: string }>(), {
  label: 'Label',
  placeholder: 'Label'
});
</script>

<template>
  <div>
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FieldLabel</div>
    <input
      v-model="model"
      :placeholder="placeholder"
      style="
        width: 100%;
        height: 40px;
        padding: 0 14px;
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-lg);
        outline: none;
        font-size: var(--text-sm);
        color: var(--text-strong);
      "
    />
  </div>
</template>
```

### SelectField

```vue
<script setup lang="ts">
const model = defineModel({ default: '' });
withDefaults(defineProps<{ label?: string; options: string[]; placeholder?: string }>(), {
  label: 'Label',
  options: [],
  placeholder: 'Label'
});
</script>

<template>
  <div>
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">FieldLabel</div>
    <div style="position: relative">
      <select
        v-model="model"
        :style="{
          width: '100%',
          height: '40px',
          padding: '0 36px 0 14px',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          outline: 'none',
          cursor: 'pointer',
          fontSize: 'var(--text-sm)',
          color: model ? 'var(--text-strong)' : 'var(--text-muted)',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
        }"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
      </select>
    </div>
  </div>
</template>
```

### FieldLabel

```vue
<script setup lang="ts">
</script>

<template>
  <div
    style="
      font-size: 10px;
      font-weight: var(--weight-bold);
      letter-spacing: 0.14em;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-bottom: 6px;
    "
  >
    <slot />
  </div>
</template>
```

### BentoGrid

```vue
<script setup lang="ts">
withDefaults(defineProps<{ cols: number }>(), {
  cols: 2
});
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '14px' }">
    <slot />
  </div>
</template>
```

### BentoBox

```vue
<script setup lang="ts">
import { FileText } from 'lucide-vue-next';
import type { Component } from 'vue';
withDefaults(defineProps<{ title: string; icon?: Component }>(), {
  title: 'Label',
  icon: FileText
});
</script>

<template>
  <div style="background: var(--surface-sunken); border-radius: var(--radius-lg); padding: 20px">
    <div
      class="flex items-center"
      style="
        gap: 8px;
        font-size: 10px;
        font-weight: var(--weight-bold);
        letter-spacing: 0.18em;
        color: var(--accent);
        text-transform: uppercase;
        margin-bottom: 14px;
      "
    >
      <component :is="icon" v-if="icon" :size="13" :stroke-width="2" />
      {{ title }}
    </div>
    <slot />
  </div>
</template>
```

### MinutaWizard

```vue
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { Component } from 'vue';
withDefaults(defineProps<{ valorOperacao: number; tipoCalculo: string; tipo: string; partes: ParteRelacionada[]; gerarMinuta: boolean; unidadeNegocio?: string }>(), {
  valorOperacao: 2,
  tipoCalculo: '',
  tipo: '',
  partes: [],
  gerarMinuta: true,
  unidadeNegocio: ''
});
</script>

<template>
  <div class="flex flex-col" style="flex: 1; min-height: 0">
    <div
      class="grid"
      :style="{
        gridTemplateColumns: topBarCols,
        gap: '16px',
        padding: '16px 32px',
        borderBottom: '1px solid var(--border-default)',
        alignItems: 'stretch',
      }"
    >
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ToggleRow</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">SelectField</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ToggleRow</div>
    </div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">MinutaStepper</div>

    <div style="flex: 1; overflow-y: auto; padding: 32px">
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">EmitenteStep</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">CredoraStep</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">EscrituradorStep</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">AvalistaStep</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">EmissaoStep</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">InformacaoPagamentoStep</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ProdutoStep</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">GarantiaMinutaStep</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">BoletimSubscricaoStep</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">EndossatarioStep</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">TituloMinutaStep</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">CetStep</div>
    </div>

    <div
      class="flex items-center justify-between"
      style="padding: 16px 32px; border-top: 1px solid var(--border-default); background: var(--surface-card)"
    >
      <button
        class="flex items-center"
        :style="{
          gap: '6px',
          background: 'none',
          border: 'none',
          cursor: isFirst ? 'not-allowed' : 'pointer',
          color: 'var(--text-muted)',
          fontWeight: 'var(--weight-semibold)',
          fontSize: 'var(--text-sm)',
          padding: '10px 4px',
          opacity: isFirst ? 0.4 : 1,
        }"
        :disabled="isFirst"
       
      >
        <ChevronLeft :size="15" /> Voltar
      </button>

      <span style="font-size: var(--text-xs); color: var(--text-muted); font-weight: var(--weight-semibold)">
        {{ stepIdx + 1 }} / {{ steps.length }}
        <span style="margin-left: 8px; font-weight: var(--weight-normal)">· {{ subtitleByCat }}</span>
      </span>

      <button
        class="flex items-center"
        :style="{
          gap: '8px',
          height: '44px',
          padding: '0 22px',
          border: 'none',
          borderRadius: 'var(--radius-lg)',
          cursor: 'pointer',
          fontWeight: 'var(--weight-bold)',
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.08em',
          background: 'var(--action-primary-bg)',
          color: '#fff',
        }"
       
      >
        <template v-if="isLast">
          <FileText :size="15" /> GERAR TÍTULO
        </template>
```

### MinutaStepper

```vue
<script setup lang="ts">
import type { Component } from 'vue';
</script>

<template>
  <div class="flex" style="background: var(--surface-sunken); border-bottom: 1px solid var(--border-default); overflow-x: auto">
    <button
      v-for="(s, i) in steps"
      :key="s.key"
      type="button"
      class="flex flex-col items-center justify-center"
      :style="{
        flex: 1,
        gap: '6px',
        minWidth: '88px',
        padding: '14px 8px 11px',
        background: 'transparent',
        border: 'none',
        borderBottom: i === current ? '3px solid var(--agro-base)' : '3px solid transparent',
        cursor: 'pointer',
        color: i === current ? 'var(--agro-base)' : i < current ? 'var(--gci-base)' : 'var(--text-muted)',
        opacity: i !== current && i >= current ? 0.6 : 1,
        transition: 'color var(--duration-base), opacity var(--duration-base), border-color var(--duration-base)',
      }"
     
    >
      <component :is="s.icon" :size="18" :stroke-width="i === current ? 2.25 : 1.5" />
      <span style="font-size: 9px; font-weight: 800; letter-spacing: 0.20em; text-transform: uppercase; line-height: 1.2; white-space: nowrap">
        {{ s.label }}
      </span>
    </button>
  </div>
</template>
```

### EmissaoStep

```vue
<script setup lang="ts">
import { computed, watch } from 'vue';
import { FileText } from 'lucide-vue-next';
const form = defineModel({ default: '' });
withDefaults(defineProps<{ modoNc?: boolean }>(), {
  modoNc: true
});
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">BentoBox</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">BentoBox</div>
  </div>
</template>
```

### CredoraStep

```vue
<script setup lang="ts">
import { computed, watch } from 'vue';
import { User } from 'lucide-vue-next';
const credoraPadrao = defineModel({ default: '' });
const form = defineModel({ default: '' });
const docBusca = defineModel({ default: '' });
const contatoSel = defineModel({ default: '' });
const enderecoSel = defineModel({ default: '' });
const representanteSel = defineModel({ default: '' });
withDefaults(defineProps<{ padraoOptions?: string[]; legalRepFieldsOptional?: boolean }>(), {
  padraoOptions: [],
  legalRepFieldsOptional: true
});
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">StepGrid</div>

    <template v-if="modoCliente">
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">StepGrid</div>
    </template>
```

### EmitenteStep

```vue
<script setup lang="ts">
import { computed, watch } from 'vue';
import { Mail, MapPin, User, Trash2, Users } from 'lucide-vue-next';
const form = defineModel({ default: '' });
const docBusca = defineModel({ default: '' });
withDefaults(defineProps<{ apenasPessoaJuridica?: boolean; maxEmitentes?: number }>(), {
  apenasPessoaJuridica: true,
  maxEmitentes: 2
});
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <template v-if="!atingiuLimite">
      <StepGrid>
        <SelectField
          label="Insira o doc. do cliente"
          :options="docOptsFiltrados"
          placeholder="Selecione"
          :span="apenasPessoaJuridica ? 12 : 7"
          :model-value="docBusca"
         
        />
        <SelectField
          v-if="!apenasPessoaJuridica"
          label="Natureza"
          :options="NATUREZA_OPTS"
          :span="5"
          v-model="natureza"
        />
      </StepGrid>

    <template v-if="form.tipoPessoa === 'FISICA'">
      <StepGrid>
        <FormField label="CPF" placeholder="000.000.000-00" required :span="3" v-model="form.cpf!" />
        <FormField label="Nome completo" placeholder="—" required :span="5" v-model="form.nome" />
        <FormField label="RG" placeholder="—" :span="2" v-model="form.rg!" />
        <FormField label="Órgão emissor do RG" placeholder="SSP/SP" :span="2" v-model="form.orgaoEmissorRg!" />
        <FormField label="Inscrição do produtor rural" placeholder="—" :span="4" v-model="form.inscricaoProdutorRural!" />
        <SelectField label="Nacionalidade" :options="NACIONALIDADE_OPTS" placeholder="Selecione" required :span="4" v-model="form.nacionalidade!" />
        <FormField label="Data de nascimento" placeholder="dd/mm/aaaa" required :span="4" v-model="form.dataNascimento!" />
        <FormField label="Profissão" placeholder="—" :span="4" v-model="form.profissao!" />
        <SelectField label="Estado Civil" :options="ESTADO_CIVIL_OPTS" placeholder="Selecione" required :span="4" v-model="form.estadoCivil!" />
        <FormField label="E-mail do representante" placeholder="—" :span="4" v-model="form.emailRepresentante!" />
      </StepGrid>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">SpouseFields</div>
    </template>
```

### EndossatarioStep

```vue
<script setup lang="ts">
import { computed, watch } from 'vue';
import { User } from 'lucide-vue-next';
const endossatarioPadrao = defineModel({ default: '' });
const form = defineModel({ default: '' });
const docBusca = defineModel({ default: '' });
const contatoSel = defineModel({ default: '' });
const enderecoSel = defineModel({ default: '' });
const representanteSel = defineModel({ default: '' });
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">StepGrid</div>

    <template v-if="modoCliente">
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">StepGrid</div>
    </template>
```

### AvalistaStep

```vue
<script setup lang="ts">
import { Check, Plus, X } from 'lucide-vue-next';
withDefaults(defineProps<{ possuiAvalistas: boolean; rows: AvalistaMinutaRow[] }>(), {
  possuiAvalistas: true,
  rows: []
});
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center justify-between" style="gap: 16px; flex-wrap: wrap">
      <div style="flex: 1; min-width: 240px">
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ToggleRow</div>
      </div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">AddButton</div>
    </div>

    <template v-if="possuiAvalistas">
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div
          class="grid"
          style="
            grid-template-columns: 40px 1.4fr 1fr 0.9fr 1.4fr;
            padding: 10px 14px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.1em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <div />
          <div>Nome</div>
          <div>Documento</div>
          <div>Possui cônjuge</div>
          <div>Cônjuge é interveniente anuente</div>
        </div>
        <div
          v-for="(r, pageIdx) in pageItems"
          :key="r.documento"
          class="grid items-center"
          style="
            grid-template-columns: 40px 1.4fr 1fr 0.9fr 1.4fr;
            padding: 12px 14px;
            border-top: 1px solid var(--border-default);
            font-size: var(--text-sm);
          "
        >
          <Checkbox :checked="r.selecionadoAssinatura" />
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ r.nome }}</div>
          <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ r.documento }}</div>
          <div class="flex items-center" style="color: r.possuiConjuge ? 'var(--success-base)' : 'var(--danger-base)'">
            <Check v-if="r.possuiConjuge" :size="16" style="color: var(--success-base)" />
            <X v-else :size="16" style="color: var(--danger-base)" />
          </div>
          <div>
            <Checkbox
              :checked="r.conjugeInterveniente"
              :disabled="!r.possuiConjuge"
             
            />
          </div>
        </div>
        <div
          v-if="rows.length === 0"
          style="padding: 24px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); border-top: 1px solid var(--border-default)"
        >
          Nenhum avalista cadastrado nesta solicitação.
        </div>
        <TablePagination
          v-if="rows.length > 0"
          :total="total"
          :page="page"
          :page-size="pageSize"
         
         
        />
      </div>
    </template>
```

### EscrituradorStep

```vue
<script setup lang="ts">
import { computed, watch } from 'vue';
import { Mail, MapPin } from 'lucide-vue-next';
const escrituradorPadrao = defineModel({ default: '' });
const form = defineModel({ default: '' });
const docBusca = defineModel({ default: '' });
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">StepGrid</div>

    <template v-if="camposHabilitados">
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">StepGrid</div>

      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">BentoBox</div>

      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">BentoBox</div>
    </template>
```

### ProdutoStep

```vue
<script setup lang="ts">
import { computed, watch } from 'vue';
import { Trash2, Package } from 'lucide-vue-next';
const form = defineModel({ default: '' });
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">StepGrid</div>

    <div class="flex justify-end">
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">AddButton</div>
    </div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">EmptyState</div>
    <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
      <div
        class="grid"
        style="
          grid-template-columns: 1.2fr 1fr 0.8fr 1fr auto;
          padding: 10px 14px;
          background: var(--surface-sunken);
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.12em;
          color: var(--text-muted);
          text-transform: uppercase;
        "
      >
        <div>Tipo</div>
        <div>Valor unitário</div>
        <div>Quantidade</div>
        <div>Safra</div>
        <div />
      </div>
      <div
        v-for="(p, i) in produtos"
        :key="i"
        class="grid items-center"
        style="
          grid-template-columns: 1.2fr 1fr 0.8fr 1fr auto;
          padding: 10px 14px;
          border-top: 1px solid var(--border-default);
          font-size: var(--text-sm);
        "
      >
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ p.tipo }}</div>
        <div style="font-variant-numeric: tabular-nums">{{ fmtValor(p.valorUnitario) }}</div>
        <div style="font-variant-numeric: tabular-nums">{{ p.quantidade || '—' }}</div>
        <div>{{ p.safra || '—' }}</div>
        <button
          aria-label="Remover"
          class="flex items-center justify-center"
          style="width: 28px; height: 28px; border: none; background: none; cursor: pointer; color: var(--danger-base)"
         
        >
          <Trash2 :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>
```

### TituloMinutaStep

```vue
<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { Tag, CalendarClock, Trash2, Handshake } from 'lucide-vue-next';
const form = defineModel({ default: '' });
withDefaults(defineProps<{ valorOperacao: number; tipoCalculo: string }>(), {
  valorOperacao: 2,
  tipoCalculo: ''
});
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <BentoBox title="Dados do Título" :icon="Tag">
      <div class="flex flex-col" style="gap: 14px">
        <StepGrid>
          <FormField label="Valor total" :model-value="brl(valorOperacao)" disabled :span="3" />
          <SelectField label="Tipo de cálculo" :options="[tipoCalculo]" :model-value="tipoCalculo" disabled :span="3" />
          <div style="grid-column: span 3; align-self: end">
            <ToggleRow
              :label="form.tipoValorLiquido ? 'Tipo de valor: LÍQUIDO' : 'Tipo de valor: NOMINAL'"
              :on="form.tipoValorLiquido"
              compact
             
            />
          </div>
          <FormField label="Número" placeholder="—" :span="3" v-model="form.numero" />
          <SelectField label="Tipo" :options="[form.tipo]" :model-value="form.tipo" disabled :span="3" />
          <FormField label="Emissão" placeholder="dd/mm/aaaa" required :span="3" v-model="form.emissao" />
          <FormField label="Vencimento" placeholder="dd/mm/aaaa" required :span="3" v-model="form.vencimento" />
          <FormField label="Chave da nota" placeholder="—" :span="3" v-model="form.chaveNota" />
          <SelectField
            label="Insira o doc. da cedente"
            :options="DOC_CEDENTE_OPTS"
            placeholder="Selecione"
            required
            :span="6"
            v-model="form.docCedente"
          />
          <div style="grid-column: span 6; align-self: end">
            <ToggleRow
              label="Gerar operação no módulo de garantias"
              :on="form.gerarOperacaoGarantias"
              compact
             
            />
          </div>
        </StepGrid>
      </div>
    </BentoBox>

    <BentoBox title="Dados da cessão" :icon="Handshake">
      <div class="flex flex-col" style="gap: 14px">
        <StepGrid>
          <FormField label="Nome" placeholder="—" required :span="5" v-model="form.cessao.nome" />
          <FormField label="Data do desembolso" placeholder="dd/mm/aaaa" required :span="4" v-model="form.cessao.dataDesembolso" />
          <FormField label="Taxa da cessão (%)" placeholder="0,00" required :span="3" v-model="form.cessao.taxaCessao" />
          <SelectField label="Tipo" :options="CESSAO_TIPO_OPTS" placeholder="Selecione" required :span="4" v-model="form.cessao.tipo" />
          <SelectField
            label="Parametrização de cálculo"
            :options="CESSAO_PARAM_OPTS"
            placeholder="Selecione"
            required
            :span="5"
            v-model="form.cessao.parametrizacaoCalculo"
          />
          <SelectField
            label="Tipo de cálculo"
            :options="CESSAO_TIPO_CALCULO_OPTS"
            placeholder="Selecione"
            required
            :span="3"
            v-model="form.cessao.tipoCalculoCessao"
          />
          <FormField label="% em garantia de recebíveis" placeholder="0,00" :span="4" v-model="form.cessao.pctGarantiaRecebiveis" />
          <FormField label="% em garantia de outras garantias" placeholder="0,00" :span="4" v-model="form.cessao.pctGarantiaOutras" />
          <FormField label="Desconto adicional (%)" placeholder="0" :span="4" v-model="form.cessao.descontoAdicional" />
          <FormField label="Taxa de multa (%)" placeholder="0,00" required :span="6" v-model="form.cessao.taxaMulta" />
          <FormField label="Taxa de mora (%)" placeholder="0,00" required :span="6" v-model="form.cessao.taxaMora" />
        </StepGrid>

        <ToggleRow
          label="Usar cálculo URA / de mercado"
          :on="form.cessao.usarCalculoUra"
          :disabled="!isPersonalizado && !!form.cessao.parametrizacaoCalculo"
         
        />

        <StepGrid v-if="isPersonalizado || form.cessao.parametrizacaoCalculo">
          <SelectField
            label="Frequência da taxa"
            :options="CESSAO_FREQUENCIA_OPTS"
            placeholder="Selecione"
            :span="4"
            :disabled="!isPersonalizado"
            v-model="form.cessao.frequenciaTaxa"
          />
          <SelectField
            label="Operador"
            :options="CESSAO_OPERADOR_OPTS"
            placeholder="Selecione"
            :span="4"
            :disabled="!isPersonalizado || !isPosFixado"
            v-model="form.cessao.operador"
          />
          <SelectField
            label="Indicador da taxa"
            :options="CESSAO_INDICADOR_OPTS"
            placeholder="Selecione"
            :span="4"
            :disabled="!isPersonalizado"
            v-model="form.cessao.indicadorTaxa"
          />
          <SelectField
            label="Tipo de capitalização"
            :options="CESSAO_CAPITALIZACAO_OPTS"
            placeholder="Selecione"
            :span="4"
            :disabled="!isPersonalizado"
            v-model="form.cessao.tipoCapitalizacao"
          />
          <SelectField
            label="Base de dias"
            :options="CESSAO_BASE_DIAS_OPTS"
            placeholder="Selecione"
            :span="4"
            :disabled="!isPersonalizado"
            v-model="form.cessao.baseDias"
          />
          <SelectField
            label="Início da contagem de juros"
            :options="CESSAO_INICIO_JUROS_OPTS"
            placeholder="Selecione"
            :span="4"
            :disabled="!isPersonalizado"
            v-model="form.cessao.inicioContagemJuros"
          />
          <SelectField
            label="Data usada para Accrual"
            :options="CESSAO_DATA_ACCRUAL_OPTS"
            placeholder="Selecione"
            :span="6"
            :disabled="!isPersonalizado"
            v-model="form.cessao.dataAccrual"
          />
        </StepGrid>

        <template v-if="isPersonalizado || form.cessao.parametrizacaoCalculo">
          <ToggleRow
            label="Usar certificador de e-mail"
            :on="form.cessao.usarCertificadorEmail"
           
          />
          <ToggleRow
            :label="conversaoLabel"
            :on="form.cessao.conversaoIndice"
           
          />
        </template>
```

### GarantiaMinutaStep

```vue
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { X, Trash2, Shield, Home, Scale } from 'lucide-vue-next';
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div class="flex items-center justify-between" style="gap: 16px; flex-wrap: wrap">
      <div style="flex: 1; min-width: 240px">
        <ToggleRow label="Possui garantias" :on="possuiGarantias" />
      </div>
      <AddButton v-if="possuiGarantias">Adicionar garantia</AddButton>
    </div>

    <template v-if="possuiGarantias">
      <EmptyState
        v-if="garantias.length === 0"
        :icon="Shield"
        title="Nenhuma garantia adicionada"
        hint="Clique em Adicionar garantia para cadastrar AF, Hipoteca, Penhor, Fiança e demais tipos."
      />
      <div v-else style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
        <div
          class="grid"
          style="
            grid-template-columns: 1.3fr 0.9fr 0.9fr 0.9fr 0.7fr auto;
            padding: 10px 14px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.1em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <div>Tipo</div>
          <div>Valor</div>
          <div>Instr. particular</div>
          <div>Constituir</div>
          <div>Testemunhas</div>
          <div />
        </div>
        <div
          v-for="(g, pageIdx) in pageItems"
          :key="pageIdx"
          class="grid items-center"
          style="
            grid-template-columns: 1.3fr 0.9fr 0.9fr 0.9fr 0.7fr auto;
            padding: 10px 14px;
            border-top: 1px solid var(--border-default);
            font-size: var(--text-sm);
            cursor: pointer;
          "
         
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ g.tipo }}</div>
          <div>{{ g.valor || '—' }}</div>
          <div>{{ g.instrumentoParticular ? 'Sim' : 'Não' }}</div>
          <div>{{ g.constituirGarantia ? 'Sim' : 'Não' }}</div>
          <div>{{ g.numeroTestemunhas || '—' }}</div>
          <button
            aria-label="Remover"
            style="width: 28px; height: 28px; border: none; background: none; cursor: pointer; color: var(--danger-base)"
           
          >
            <Trash2 :size="14" />
          </button>
        </div>
        <TablePagination
          :total="total"
          :page="page"
          :page-size="pageSize"
         
         
        />
      </div>
    </template>
```

### InformacaoPagamentoStep

```vue
<script setup lang="ts">
import { Landmark, Plus } from 'lucide-vue-next';
const contaBancariaId = defineModel({ default: '' });
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <BentoBox title="Informação de Pagamento" :icon="Landmark">
      <div class="flex flex-col" style="gap: 14px">
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">StepGrid</div>

        <template v-if="showNova && !temContaSelecionada">
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">StepGrid</div>
          <div class="flex justify-end" style="gap: 8px">
            <button
              type="button"
              style="
                height: 40px;
                padding: 0 16px;
                background: none;
                border: none;
                cursor: pointer;
                color: var(--text-muted);
                font-weight: var(--weight-semibold);
                font-size: var(--text-sm);
              "
             
            >
              Cancelar
            </button>
            <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">AddButton</div>
          </div>
        </template>
```

### CetStep

```vue
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Percent } from 'lucide-vue-next';
const form = defineModel({ default: '' });
withDefaults(defineProps<{ valorTitulo: number; dataEmissao: string; dataVencimento: string }>(), {
  valorTitulo: 2,
  dataEmissao: '',
  dataVencimento: ''
});
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">BentoBox</div>
  </div>
</template>
```

### BoletimSubscricaoStep

```vue
<script setup lang="ts">
import { computed, watch } from 'vue';
import { User, Mail, MapPin, Landmark } from 'lucide-vue-next';
const boletim = defineModel({ default: '' });
</script>

<template>
  <div class="flex flex-col" style="gap: 20px">
    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ToggleRow</div>

    <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">StepGrid</div>

    <template v-if="form.tipoPessoa === 'FISICA'">
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">StepGrid</div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">SpouseFields</div>
    </template>
```

### SpouseFields

```vue
<script setup lang="ts">
import { Users } from 'lucide-vue-next';
const conjuge = defineModel({ default: '' });
withDefaults(defineProps<{ disabled?: boolean }>(), {
  disabled: true
});
</script>

<template>
  <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">BentoBox</div>
</template>
```

## Relatórios

### RelatorioPedidosScreen

```vue
<script setup lang="ts">
import type { Component } from 'vue';
</script>

<template>
  <!-- Lista de cards (padrão Risco) -->
  <div v-if="!selected" class="flex flex-col" style="gap: 24px">
    <div>
      <div
        style="
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--accent);
          font-weight: var(--weight-bold);
          margin-bottom: 6px;
        "
      >
        Workflow Operacional · Solicitações
      </div>
      <h1
        style="
          font-size: 26px;
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          letter-spacing: -0.02em;
          line-height: 1.15;
        "
      >
        Relatórios
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        Selecione um relatório para configurar filtros e exportar.
      </p>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px">
      <button
        v-for="r in REQUEST_REPORTS"
        :key="r.value"
        class="flex flex-col"
        :style="{
          gap: '14px',
          textAlign: 'left',
          padding: '22px',
          background: 'var(--surface-card)',
          border: `1px solid ${hoveredKey === r.value ? 'rgba(242,125,38,0.30)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-xl)',
          cursor: 'pointer',
          boxShadow: hoveredKey === r.value ? '0 20px 40px -16px rgba(8,60,74,0.10)' : 'none',
          transform: hoveredKey === r.value ? 'translateY(-4px)' : 'translateY(0)',
          transition:
            'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base), border-color var(--duration-base)',
        }"
       
       
       
      >
        <div
          class="flex items-center justify-center"
          style="
            width: 42px;
            height: 42px;
            border-radius: var(--radius-lg);
            background: var(--accent-bg);
            color: var(--accent);
          "
        >
          <component :is="REPORT_ICONS[r.value]" :size="20" />
        </div>
        <div>
          <div
            style="
              font-size: var(--text-sm);
              font-weight: var(--weight-bold);
              color: var(--text-strong);
              margin-bottom: 6px;
            "
          >
            {{ r.text }}
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5">
            {{ r.description }}
          </div>
        </div>
        <div style="flex: 1" />
        <div
          class="flex items-center"
          :style="{
            gap: '4px',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--accent)',
            opacity: hoveredKey === r.value ? 1 : 0,
            transform: hoveredKey === r.value ? 'translateY(0)' : 'translateY(4px)',
            transition:
              'opacity var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
          }"
        >
          Configurar e exportar <ChevronRight :size="14" />
        </div>
      </button>
    </div>
  </div>

  <!-- Detalhe do relatório -->
  <div v-else class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
          flex-shrink: 0;
        "
       
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <div
          style="
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: var(--accent);
            font-weight: var(--weight-bold);
            margin-bottom: 4px;
          "
        >
          Relatórios · Solicitações
        </div>
        <h2
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
          "
        >
          {{ report?.text }}
        </h2>
      </div>
    </div>

    <!-- Filtros -->
    <div
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        padding: 22px;
      "
    >
      <!-- Dados da Solicitação (tipos ≠ 29) -->
      <div v-if="!showAbaixoDaTaxa" class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 14px">
        <div>
          <div :style="labelStyle">Número da solicitação</div>
          <input
            v-model="draft.numeroSolicitacao"
            type="text"
            inputmode="numeric"
            placeholder="Ex.: 10482"
            :style="{
              ...inputStyle,
              borderColor: errors.numeroSolicitacao
                ? 'var(--danger-base, #c53030)'
                : 'var(--border-default)',
            }"
           
           
          />
          <div v-if="errors.numeroSolicitacao" :style="errorTextStyle">
            {{ errors.numeroSolicitacao }}
          </div>
        </div>
        <div>
          <div :style="labelStyle">Gerente comercial</div>
          <select v-model="draft.gerenteComercial" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="g in GERENTES_COMERCIAIS" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Grupo empresarial</div>
          <select v-model="draft.grupoEmpresarial" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="gr in GRUPOS_EMPRESARIAIS" :key="gr" :value="gr">{{ gr }}</option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Tipo da solicitação</div>
          <select v-model="draft.tipoSolicitacao" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="tp in TIPO_PEDIDO_OPTS" :key="tp.value" :value="tp.text">
              {{ tp.text }}
            </option>
          </select>
        </div>
        <div v-if="showQuitacao" style="grid-column: 1 / -1">
          <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ToggleRow</div>
        </div>
      </div>

      <!-- Filtros Abaixo da Taxa (tipo 29) -->
      <div v-else class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 14px">
        <div>
          <div :style="labelStyle">Aprovação de</div>
          <input
            v-model="draft.aprovacaoDe"
            type="date"
            :style="inputStyle"
           
          />
        </div>
        <div>
          <div :style="labelStyle">Aprovação até</div>
          <input
            v-model="draft.aprovacaoAte"
            type="date"
            :style="inputStyle"
           
          />
        </div>
        <div>
          <div :style="labelStyle">Grupo empresarial</div>
          <select v-model="draft.grupoEmpresarial" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="gr in GRUPOS_EMPRESARIAIS" :key="gr" :value="gr">{{ gr }}</option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Tipo do pedido</div>
          <select v-model="draft.tipoPedido" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="tp in TIPO_PEDIDO_OPTS" :key="tp.value" :value="tp.text">
              {{ tp.text }}
            </option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Superintendente</div>
          <select v-model="draft.superintendente" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="s in SUPERINTENDENTES" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Gerente comercial</div>
          <select v-model="draft.gerenteComercial" :style="inputStyle">
            <option value="">Todos</option>
            <option v-for="g in GERENTES_COMERCIAIS" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>
        <div v-if="errors.aprovacaoDatas" style="grid-column: 1 / -1">
          <div :style="errorTextStyle">{{ errors.aprovacaoDatas }}</div>
        </div>
        <div style="grid-column: 1 / -1">
          <div :style="labelStyle">Veículo de operação</div>
          <div
            class="grid"
            style="
              grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
              gap: 10px;
              padding: 14px;
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              background: var(--surface-sunken);
            "
          >
            <label
              v-for="v in VEICULOS_OPERACAO"
              :key="v"
              class="flex items-center"
              style="gap: 8px; cursor: pointer; font-size: var(--text-sm); color: var(--text-default)"
            >
              <input
                type="checkbox"
                :checked="draft.veiculos.includes(v)"
                style="accent-color: var(--agro-base); width: 16px; height: 16px"
               
              />
              <span>{{ v }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
        <button
          class="flex items-center"
          style="
            gap: 8px;
            height: 42px;
            padding: 0 20px;
            background: var(--action-primary-bg);
            color: #fff;
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.08em;
          "
         
        >
          <FileSpreadsheet :size="15" /> GERAR RELATÓRIO
        </button>
      </div>
    </div>

    <!-- Resultado -->
    <div
      v-if="applied"
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        overflow: hidden;
      "
    >
      <div
        class="flex items-center justify-between"
        style="padding: 14px 20px; border-bottom: 1px solid var(--border-default)"
      >
        <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          {{ results.length }} {{ results.length === 1 ? 'resultado' : 'resultados' }}
        </span>
        <button
          v-if="isPdfReport"
          :disabled="results.length === 0"
          class="flex items-center"
          :style="{
            gap: '6px',
            height: '34px',
            padding: '0 14px',
            background: 'none',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            cursor: results.length === 0 ? 'not-allowed' : 'pointer',
            color: results.length === 0 ? 'var(--text-disabled)' : 'var(--text-default)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
          }"
         
        >
          <Download :size="13" /> EXPORTAR PDF
        </button>
        <button
          v-else
          :disabled="results.length === 0"
          class="flex items-center"
          :style="{
            gap: '6px',
            height: '34px',
            padding: '0 14px',
            background: 'none',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            cursor: results.length === 0 ? 'not-allowed' : 'pointer',
            color: results.length === 0 ? 'var(--text-disabled)' : 'var(--text-default)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
          }"
         
        >
          <Download :size="13" /> EXPORTAR CSV
        </button>
      </div>

      <div
        v-if="results.length === 0"
        style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
      >
        Nenhum resultado encontrado para os filtros selecionados.
      </div>
      <template v-else>
        <div
          class="grid"
          :style="{
            gridTemplateColumns: resultGridCols,
            padding: '10px 20px',
            background: 'var(--surface-sunken)',
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.10em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }"
        >
          <div v-for="col in resultColumns" :key="col">{{ col }}</div>
        </div>
        <div
          v-for="row in pageItems"
          :key="row.id"
          class="grid items-center"
          :style="{
            gridTemplateColumns: resultGridCols,
            padding: '12px 20px',
            borderTop: '1px solid var(--border-default)',
            fontSize: 'var(--text-sm)',
          }"
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ row.col1 }}</div>
          <div style="color: var(--text-default)">{{ row.col2 }}</div>
          <div style="color: var(--text-muted)">{{ row.col3 }}</div>
          <div style="color: var(--text-default)">{{ row.col4 }}</div>
          <div v-if="resultColumns.length > 4" style="color: var(--text-default)">{{ row.col5 }}</div>
        </div>
        <TablePagination
          :total="total"
          :page="page"
          :page-size="pageSize"
         
         
        />
      </template>
```

## Fundo Padrão

### FundoPadraoScreen

```vue
<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col" style="gap: 32px">
    <div>
      <div
        style="
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--accent);
          font-weight: var(--weight-bold);
          margin-bottom: 6px;
        "
      >
        Workflow Operacional · Solicitações
      </div>
      <h1
        style="
          font-size: 26px;
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          letter-spacing: -0.02em;
          line-height: 1.15;
        "
      >
        Fundo Padrão
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 8px; max-width: 640px; line-height: 1.5">
        Configure a ordem de prioridade dos fundos utilizados nas operações e acompanhe limites e utilização do rank
        ativo.
      </p>
    </div>

    <section>
      <div
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.18em;
          color: var(--accent);
          text-transform: uppercase;
          margin-bottom: 16px;
        "
      >
        Rank ativo
      </div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">OperationFundRankList</div>
    </section>

    <section>
      <div
        style="
          font-size: 10px;
          font-weight: var(--weight-bold);
          letter-spacing: 0.18em;
          color: var(--accent);
          text-transform: uppercase;
          margin-bottom: 16px;
        "
      >
        Edição do rank
      </div>
      <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">OperationFundRankEditor</div>
    </section>
  </div>
</template>
```

### OperationFundRankList

```vue
<script setup lang="ts">
withDefaults(defineProps<{ items: RankItemAtivo[] }>(), {
  items: []
});
</script>

<template>
  <div
    v-if="items.length === 0"
    class="flex flex-col items-center justify-center"
    style="
      gap: 10px;
      padding: 40px 24px;
      text-align: center;
      background: var(--surface-sunken);
      border-radius: var(--radius-lg);
      border: 1px dashed var(--border-default);
    "
  >
    <div style="font-size: var(--text-sm); color: var(--text-muted)">
      Nenhum rank de fundos ativo configurado.
    </div>
  </div>

  <div v-else class="flex flex-col" style="gap: 12px">
    <article
      v-for="item in items"
      :key="`${item.priority}-${item.fundId}`"
      class="flex flex-col"
      :style="{
        padding: '18px 20px',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        borderLeft: item.isCurrent ? '4px solid #16a34a' : '1px solid var(--border-default)',
        opacity: item.isExhausted ? 0.72 : 1,
        gap: '12px',
        transition: 'opacity var(--duration-fast)',
      }"
    >
      <div class="flex flex-wrap items-center justify-between" style="gap: 10px">
        <div class="flex flex-wrap items-center" style="gap: 8px">
          <span
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.08em;
              padding: 4px 10px;
              border-radius: var(--radius-sm);
              background: var(--surface-sunken);
              color: var(--text-muted);
            "
          >
            #{{ item.priority }}
          </span>
          <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ item.fundName }}
          </span>
          <span
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              padding: 3px 8px;
              border-radius: var(--radius-sm);
            "
            :style="typeChipStyle(item.fundType)"
          >
            {{ item.fundType }}
          </span>
          <span
            v-if="item.isCurrent"
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.08em;
              padding: 3px 8px;
              border-radius: var(--radius-sm);
              background: rgba(22, 163, 74, 0.12);
              color: #16a34a;
            "
          >
            Atual
          </span>
          <span
            v-if="item.isExhausted"
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.08em;
              padding: 3px 8px;
              border-radius: var(--radius-sm);
              background: var(--surface-sunken);
              color: var(--text-muted);
            "
          >
            Esgotado
          </span>
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); text-align: right">
          Configurado por {{ item.configuradoPor }} · {{ item.dataConfiguracao }}
        </div>
      </div>

      <div class="flex flex-wrap items-end justify-between" style="gap: 16px">
        <div class="flex flex-wrap" style="gap: 24px">
          <div>
            <div
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.12em;
                color: var(--text-muted);
                text-transform: uppercase;
                margin-bottom: 4px;
              "
            >
              Operado
            </div>
            <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ formatMoney(item.operado) }}
            </div>
          </div>
          <div>
            <div
              style="
                font-size: 10px;
                font-weight: var(--weight-bold);
                letter-spacing: 0.12em;
                color: var(--text-muted);
                text-transform: uppercase;
                margin-bottom: 4px;
              "
            >
              Limite
            </div>
            <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
              {{ formatMoney(item.limite) }}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between" style="margin-bottom: 6px; gap: 8px">
          <span style="font-size: var(--text-xs); color: var(--text-muted)">Utilização</span>
          <span
            style="font-size: var(--text-xs); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums"
            :style="{ color: progressColor(progressPct(item.operado, item.limite)) }"
          >
            {{ progressPct(item.operado, item.limite) }}%
          </span>
        </div>
        <div
          style="
            height: 8px;
            border-radius: 9999px;
            background: var(--surface-sunken);
            overflow: hidden;
          "
        >
          <div
            :style="{
              width: `${progressPct(item.operado, item.limite)}%`,
              height: '100%',
              borderRadius: '9999px',
              background: progressColor(progressPct(item.operado, item.limite)),
              transition: 'width var(--duration-normal)',
            }"
          />
        </div>
      </div>
    </article>
  </div>
</template>
```

### OperationFundRankEditor

```vue
<script setup lang="ts">
import { ArrowUp, ArrowDown, Trash2, Plus, Info } from 'lucide-vue-next';
withDefaults(defineProps<{ activeRank: RankItemAtivo[] }>(), {
  activeRank: []
});
</script>

<template>
  <div
    style="
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      background: var(--surface-card);
      padding: 20px 22px;
    "
  >
    <div class="flex flex-wrap items-center justify-between" style="gap: 12px; margin-bottom: 16px">
      <h2 style="font-size: var(--text-base); font-weight: var(--weight-bold); color: var(--text-strong); margin: 0">
        Edição do rank
      </h2>
      <button
        v-if="activeRank.length > 0"
        type="button"
        class="btn-animated"
        style="
          height: 36px;
          padding: 0 14px;
          font-size: var(--text-xs);
          font-weight: var(--weight-semibold);
          color: var(--gci-base);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          cursor: pointer;
        "
       
      >
        Carregar rank atual
      </button>
    </div>

    <div
      class="flex items-start"
      style="
        gap: 10px;
        padding: 12px 14px;
        margin-bottom: 16px;
        border-radius: var(--radius-lg);
        background: var(--surface-sunken);
        border: 1px solid var(--border-default);
      "
    >
      <Info :size="16" style="color: var(--gci-base); flex-shrink: 0; margin-top: 2px" />
      <p style="margin: 0; font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5">
        A ordem dos itens define a prioridade do rank (o item no topo é prioridade 1). Ao salvar, o rank ativo
        inteiro será substituído pela configuração abaixo.
      </p>
    </div>

    <div
      v-if="editorItems.length === 0"
      style="
        padding: 32px 16px;
        text-align: center;
        font-size: var(--text-sm);
        color: var(--text-muted);
        border: 1px dashed var(--border-default);
        border-radius: var(--radius-lg);
        margin-bottom: 16px;
      "
    >
      Nenhum item adicionado. Clique em 'Adicionar item' para começar.
    </div>

    <div v-else class="flex flex-col" style="gap: 10px; margin-bottom: 16px">
      <div
        v-for="(row, index) in editorItems"
        :key="index"
        class="flex flex-wrap items-center"
        style="
          gap: 10px;
          padding: 12px 14px;
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          background: var(--surface-sunken);
        "
      >
        <span
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.08em;
            padding: 4px 10px;
            border-radius: var(--radius-sm);
            background: var(--surface-card);
            color: var(--text-muted);
            flex-shrink: 0;
          "
        >
          #{{ index + 1 }}
        </span>

        <div class="flex" style="gap: 4px; flex-shrink: 0">
          <button
            type="button"
            aria-label="Mover para cima"
            class="flex items-center justify-center"
            :disabled="index === 0"
            :style="{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--surface-card)',
              cursor: index === 0 ? 'not-allowed' : 'pointer',
              opacity: index === 0 ? 0.45 : 1,
              color: 'var(--text-muted)',
            }"
           
          >
            <ArrowUp :size="14" />
          </button>
          <button
            type="button"
            aria-label="Mover para baixo"
            class="flex items-center justify-center"
            :disabled="index === editorItems.length - 1"
            :style="{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--surface-card)',
              cursor: index === editorItems.length - 1 ? 'not-allowed' : 'pointer',
              opacity: index === editorItems.length - 1 ? 0.45 : 1,
              color: 'var(--text-muted)',
            }"
           
          >
            <ArrowDown :size="14" />
          </button>
        </div>

        <select
          v-model="row.fundId"
          style="
            flex: 1 1 200px;
            min-width: 180px;
            height: 40px;
            padding: 0 12px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            font-size: var(--text-sm);
            color: var(--text-strong);
            cursor: pointer;
          "
        >
          <option value="" disabled>Selecione o fundo</option>
          <option v-for="f in fundOptionsForRow(index)" :key="f.id" :value="f.id">
            {{ fundoLabel(f) }}
          </option>
          <option v-if="row.fundId && !fundOptionsForRow(index).some((f) => f.id === row.fundId)" :value="row.fundId">
            {{ fundoLabel(FUNDOS_DISPONIVEIS.find((f) => f.id === row.fundId)!) }}
          </option>
        </select>

        <input
          v-model="row.limite"
          type="text"
          inputmode="decimal"
          placeholder="Limite (R$)"
          style="
            flex: 0 1 160px;
            min-width: 140px;
            height: 40px;
            padding: 0 12px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            font-size: var(--text-sm);
            color: var(--text-strong);
          "
        />

        <button
          type="button"
          aria-label="Remover item"
          class="flex items-center justify-center"
          style="
            width: 32px;
            height: 32px;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-default);
            background: var(--surface-card);
            cursor: pointer;
            color: var(--action-danger-text-only);
            flex-shrink: 0;
          "
         
        >
          <Trash2 :size="14" />
        </button>
      </div>
    </div>

    <div class="flex flex-wrap items-center" style="gap: 10px">
      <button
        type="button"
        class="flex items-center btn-animated"
        style="
          gap: 8px;
          height: 40px;
          padding: 0 16px;
          font-size: var(--text-xs);
          font-weight: var(--weight-bold);
          letter-spacing: 0.06em;
          color: var(--gci-base);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          cursor: pointer;
        "
       
      >
        <Plus :size="14" />
        Adicionar item
      </button>
      <button
        type="button"
        class="btn-animated"
        :disabled="!canSave"
        :title="saveDisabledReason ?? undefined"
        style="
          height: 40px;
          padding: 0 20px;
          font-size: var(--text-xs);
          font-weight: var(--weight-bold);
          letter-spacing: 0.08em;
          color: #fff;
          background: var(--action-primary-bg);
          border: none;
          border-radius: var(--radius-lg);
          cursor: pointer;
          opacity: 1;
        "
        :style="!canSave ? { opacity: 0.5, cursor: 'not-allowed' } : {}"
       
      >
        Salvar rank
      </button>
    </div>
  </div>
</template>
```

## Taxas dos Veículos

### TaxasVeiculosScreen

```vue
<script setup lang="ts">
import type { Component } from 'vue';
import { Landmark, Briefcase, Shield, Search } from 'lucide-vue-next';
</script>

<template>
  <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">VehicleRateDetailView</div>

  <div v-else class="flex flex-col" style="gap: 24px">
    <div v-if="saveBannerVisible" role="status">
      <div
        style="
          padding: 12px 16px;
          border-radius: var(--radius-lg);
          background: var(--status-success-bg, #ecfdf5);
          border: 1px solid var(--status-success-border, #a7f3d0);
          color: var(--status-success-text, #047857);
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
        "
      >
        Configurações salvas
      </div>
    </div>

    <div class="flex items-start justify-between" style="gap: 16px">
      <div>
        <div
          style="
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: var(--accent);
            font-weight: var(--weight-bold);
            margin-bottom: 6px;
          "
        >
          Workflow Operacional · Solicitações
        </div>
        <h1
          style="
            font-size: 26px;
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.02em;
            line-height: 1.15;
          "
        >
          Taxas dos Veículos
        </h1>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 8px; max-width: 720px; line-height: 1.5">
          Parametrize taxas por tipo de veículo. Clique em um veículo para abrir o detalhe.
        </p>
      </div>
      <button
        type="button"
        class="btn-animated btn-agro"
        style="
          height: 48px;
          padding: 0 28px;
          background: var(--agro-base);
          color: #fff;
          border-radius: var(--radius-lg);
          border: none;
          cursor: pointer;
          font-weight: var(--weight-bold);
          font-size: var(--text-xs);
          letter-spacing: 0.1em;
          box-shadow: 0 10px 24px -8px rgba(242, 125, 38, 0.4);
          flex-shrink: 0;
        "
       
      >
        SALVAR
      </button>
    </div>

    <SegmentedToggle
      :model-value="activeTab"
      :options="TABS"
      variant="brand"
     
    />

    <div class="grid" style="grid-template-columns: 160px 1fr; gap: 12px 16px; max-width: 640px">
      <div>
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.1em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-bottom: 6px;
          "
        >
          ID
        </div>
        <input v-model="filterId" placeholder="Filtrar ID..." :style="inputStyle" />
      </div>
      <div>
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.1em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-bottom: 6px;
          "
        >
          Nome
        </div>
        <div class="relative">
          <Search
            :size="15"
            style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)"
          />
          <input
            v-model="filterNome"
            placeholder="Filtrar por nome..."
            :style="{ ...inputStyle, paddingLeft: '36px' }"
          />
        </div>
      </div>
    </div>

    <div
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        overflow: hidden;
        background: var(--surface-card);
      "
    >
      <div
        class="grid items-center"
        :style="{
          gridTemplateColumns: COLS,
          padding: '12px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }"
      >
        <label class="flex flex-col" style="gap: 4px; cursor: pointer">
          <span class="flex items-center" style="gap: 10px">
            <Checkbox
              :checked="allActiveVisible"
              :indeterminate="selectAllIndeterminate"
             
            />
            <span>Selecionar todos</span>
          </span>
          <span style="padding-left: 26px; font-size: 9px; letter-spacing: 0.08em; opacity: 0.85">Ativo</span>
        </label>
        <div>ID</div>
        <div>Nome</div>
      </div>

      <div
        v-if="filteredVehicles.length === 0"
        style="padding: 32px 20px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
      >
        Nenhum veículo encontrado com os filtros aplicados.
      </div>

      <div
        v-for="v in filteredVehicles"
        :key="v.vehicleId"
        class="grid items-center taxas-row"
        :style="{
          gridTemplateColumns: COLS,
          padding: '14px 20px',
          borderTop: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          transition: 'background var(--duration-fast)',
        }"
       
      >
        <div>
          <Checkbox :checked="v.isActive" />
        </div>
        <div style="font-variant-numeric: tabular-nums; color: var(--text-muted)">{{ v.vehicleId }}</div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ v.vehicleName }}</div>
      </div>
    </div>

    <div
      v-if="saveConfirmOpen"
      class="flex items-center justify-center"
      style="position: relative; width: 100%; min-height: 320px; z-index: 1; background: rgba(15, 23, 42, 0.45); padding: 24px"
    >
      <div
        style="
          width: 100%;
          max-width: 440px;
          background: var(--surface-card);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          padding: 28px;
        "
       
      >
        <h3
          style="
            font-size: var(--text-lg);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            margin-bottom: 10px;
          "
        >
          Deseja salvar as configurações de veículos?
        </h3>
        <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin-bottom: 22px">
          As alterações de ativação e taxas permanecem apenas neste protótipo local (aba
          {{ TAB_LABELS[activeTab] }}).
        </p>
        <div class="flex items-center justify-end" style="gap: 10px">
          <button
            type="button"
            style="
              height: 42px;
              padding: 0 18px;
              background: var(--surface-card);
              color: var(--text-strong);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              cursor: pointer;
              font-weight: var(--weight-bold);
              font-size: var(--text-sm);
            "
           
          >
            Cancelar
          </button>
          <button
            type="button"
            style="
              height: 42px;
              padding: 0 18px;
              background: var(--agro-base);
              color: #fff;
              border: none;
              border-radius: var(--radius-lg);
              cursor: pointer;
              font-weight: var(--weight-bold);
              font-size: var(--text-sm);
            "
           
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.taxas-row:hover {
  background: var(--surface-sunken);
}
</style>
```

### VehicleRateDetailView

```vue
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Component } from 'vue';
import { ArrowLeft, Percent, History } from 'lucide-vue-next';
withDefaults(defineProps<{ vehicle: VehicleSetting; tabLabel: string }>(), {
  vehicle: '',
  tabLabel: 'Label'
});
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
          flex-shrink: 0;
        "
       
      >
        <ArrowLeft :size="20" />
      </button>

      <div style="flex: 1; min-width: 0">
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          Taxas dos Veículos · {{ tabLabel }}
        </div>
        <h2
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
          "
        >
          {{ vehicle.vehicleName }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          ID {{ vehicle.vehicleId }} ·
          {{ vehicle.isActive ? 'Ativo' : 'Inativo' }}
        </p>
      </div>
    </div>

    <div
      v-if="savedBanner"
      style="
        padding: 12px 16px;
        border-radius: var(--radius-lg);
        background: color-mix(in srgb, #16a34a 12%, transparent);
        border: 1px solid color-mix(in srgb, #16a34a 35%, transparent);
        font-size: var(--text-sm);
        color: var(--text-default);
      "
    >
      Taxa salva com sucesso.
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="DETAIL_TABS"
      variant="brand"
     
    />

    <!-- Parametrização -->
    <div
      v-if="tab === 'parametrizacao'"
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        padding: 22px;
      "
    >
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px 20px">
        <div>
          <div :style="labelStyle">Taxa Pré Fixada (%)</div>
          <input
            v-model="preFixedInput"
            type="text"
            inputmode="decimal"
            placeholder="Ex.: 1,85"
            :style="inputStyle"
          />
        </div>
        <div>
          <div :style="labelStyle">Taxa Pós Fixada (%)</div>
          <input
            v-model="postFixedInput"
            type="text"
            inputmode="decimal"
            placeholder="Ex.: 1,5"
            :style="inputStyle"
          />
        </div>
        <div>
          <div :style="labelStyle">Indexador Pós Fixado</div>
          <select v-model="postFixedIndex" :style="inputStyle">
            <option v-for="opt in POST_FIXED_INDEX_OPTS" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
        <div>
          <div :style="labelStyle">Data de vencimento da taxa</div>
          <input v-model="dueAtInput" type="date" :min="minDueDate" :style="inputStyle" />
        </div>
      </div>

      <p
        v-if="formError"
        style="font-size: var(--text-sm); color: var(--danger-base, #c53030); margin-top: 14px; line-height: 1.4"
      >
        {{ formError }}
      </p>

      <div class="flex items-center justify-end" style="margin-top: 20px">
        <button
          type="button"
          style="
            height: 44px;
            padding: 0 22px;
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            border-radius: var(--radius-lg);
            border: none;
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-sm);
          "
         
        >
          {{ primaryActionLabel }}
        </button>
      </div>
    </div>

    <!-- Histórico -->
    <div v-else>
      <div
        v-if="vehicle.history.length === 0"
        style="
          padding: 40px;
          text-align: center;
          font-size: var(--text-sm);
          color: var(--text-muted);
          background: var(--surface-sunken);
          border-radius: var(--radius-xl);
          border: 1px dashed var(--border-default);
        "
      >
        Nenhuma taxa cadastrada para este veículo.
      </div>
      <div
        v-else
        style="
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: var(--surface-card);
        "
      >
        <div
          class="grid"
          :style="{
            gridTemplateColumns: HIST_COLS,
            padding: '12px 20px',
            background: 'var(--surface-sunken)',
            fontSize: '10px',
            fontWeight: 'var(--weight-bold)',
            letterSpacing: '0.12em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }"
        >
          <div>Data</div>
          <div>Vencimento</div>
          <div>Status</div>
          <div>Taxa Pré</div>
          <div>Taxa Pós</div>
        </div>
        <div
          v-for="h in vehicle.history"
          :key="h.id"
          class="grid items-center"
          :style="{
            gridTemplateColumns: HIST_COLS,
            padding: '14px 20px',
            borderTop: '1px solid var(--border-default)',
            fontSize: 'var(--text-sm)',
          }"
        >
          <div style="color: var(--text-default); font-variant-numeric: tabular-nums">{{ h.createdAt }}</div>
          <div style="color: var(--text-default); font-variant-numeric: tabular-nums">{{ h.dueAt }}</div>
          <div>
            <span
              :style="{
                display: 'inline-block',
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '3px 8px',
                borderRadius: '9999px',
                background: `${rateStatusColor(h.status)}18`,
                color: rateStatusColor(h.status),
              }"
            >
              {{ rateStatusLabel(h.status) }}
            </span>
          </div>
          <div style="font-variant-numeric: tabular-nums; color: var(--text-strong)">{{ formatPre(h) }}</div>
          <div style="font-variant-numeric: tabular-nums; color: var(--text-strong)">{{ formatPost(h) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
```

## Validações Config

### ValidacoesConfigScreen

```vue
<script setup lang="ts">
import { ChevronDown, Filter, Pencil, ShieldCheck, SlidersHorizontal, X } from 'lucide-vue-next';
</script>

<template>
  <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ValidationDetailView</div>
  <div v-else class="flex flex-col" style="gap: 24px">
    <div>
      <div
        style="
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--accent);
          font-weight: var(--weight-bold);
          margin-bottom: 6px;
        "
      >
        Workflow Operacional · Solicitações
      </div>
      <h1
        style="
          font-size: 26px;
          font-weight: var(--weight-bold);
          color: var(--text-strong);
          letter-spacing: -0.02em;
          line-height: 1.15;
        "
      >
        Validações
      </h1>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
        {{ items.length }}
        {{ items.length === 1 ? 'validação cadastrada' : 'validações cadastradas' }}
      </p>
    </div>

    <div class="flex items-center justify-end" style="gap: 12px; flex-wrap: wrap">
      <div style="position: relative">
        <button
          ref="filterBtnRef"
          type="button"
          class="flex items-center"
          :style="{
            gap: '8px',
            height: '42px',
            padding: '0 16px',
            cursor: 'pointer',
            background: showFilters || activeFilterCount > 0 ? 'var(--gci-light)' : 'var(--surface-card)',
            border: `1px solid ${showFilters || activeFilterCount > 0 ? 'var(--gci-base)' : 'var(--border-default)'}`,
            borderRadius: 'var(--radius-lg)',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.04em',
            color: showFilters || activeFilterCount > 0 ? 'var(--gci-base)' : 'var(--text-muted)',
            transition: 'all var(--duration-fast)',
          }"
         
        >
          <SlidersHorizontal :size="15" :stroke-width="2" />
          Filtros
          <span
            v-if="activeFilterCount > 0"
            style="
              min-width: 18px;
              height: 18px;
              padding: 0 5px;
              border-radius: 9999px;
              background: var(--gci-base);
              color: #fff;
              font-size: 10px;
              font-weight: var(--weight-bold);
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            {{ activeFilterCount }}
          </span>
          <ChevronDown
            :size="14"
            :style="{
              transform: showFilters ? 'rotate(180deg)' : 'none',
              transition: 'transform var(--duration-base)',
            }"
          />
        </button>

        <template v-if="showFilters">
          <div style="position: relative; width: 100%; min-height: 320px; z-index: 30" />
          <div :style="filterPanelStyle">
            <div class="flex items-center justify-between" style="margin-bottom: 16px">
              <span
                style="
                  font-size: 11px;
                  font-weight: var(--weight-bold);
                  letter-spacing: 0.12em;
                  color: var(--text-muted);
                  text-transform: uppercase;
                "
              >
                Filtros adicionais
              </span>
              <button
                v-if="activeFilterCount > 0 || draft.nome || draft.id || draft.setor"
                type="button"
                class="flex items-center"
                style="
                  gap: 4px;
                  background: none;
                  border: none;
                  cursor: pointer;
                  font-size: var(--text-xs);
                  color: var(--text-muted);
                  font-weight: var(--weight-semibold);
                "
               
              >
                <X :size="12" /> Limpar filtros
              </button>
            </div>

            <div class="flex flex-col" style="gap: 14px">
              <div>
                <div :style="labelStyle">Nome</div>
                <input v-model="draft.nome" placeholder="Buscar por nome" :style="inputStyle" />
                <div
                  v-if="filterErrors.nome"
                  style="font-size: var(--text-xs); color: var(--danger-base, #c53030); margin-top: 6px"
                >
                  {{ filterErrors.nome }}
                </div>
              </div>
              <div>
                <div :style="labelStyle">ID</div>
                <input
                  v-model="draft.id"
                  placeholder="Somente números"
                  inputmode="numeric"
                  :style="inputStyle"
                />
                <div
                  v-if="filterErrors.id"
                  style="font-size: var(--text-xs); color: var(--danger-base, #c53030); margin-top: 6px"
                >
                  {{ filterErrors.id }}
                </div>
              </div>
              <div>
                <div :style="labelStyle">Setor Responsável</div>
                <select v-model="draft.setor" :style="inputStyle">
                  <option value="">Todos</option>
                  <option v-for="s in SETOR_RESPONSAVEL_OPTS" :key="s.value" :value="s.value">
                    {{ s.text }}
                  </option>
                </select>
              </div>
            </div>

            <div class="flex items-center justify-end" style="gap: 10px; margin-top: 18px">
              <button
                type="button"
                style="
                  height: 38px;
                  padding: 0 16px;
                  background: none;
                  border: 1px solid var(--border-default);
                  border-radius: var(--radius-lg);
                  cursor: pointer;
                  color: var(--text-muted);
                  font-weight: var(--weight-semibold);
                  font-size: var(--text-sm);
                "
               
              >
                Limpar
              </button>
              <button
                type="button"
                class="flex items-center"
                style="
                  gap: 6px;
                  height: 38px;
                  padding: 0 18px;
                  background: var(--action-primary-bg);
                  color: #fff;
                  border: none;
                  border-radius: var(--radius-lg);
                  cursor: pointer;
                  font-weight: var(--weight-bold);
                  font-size: var(--text-xs);
                  letter-spacing: 0.06em;
                "
               
              >
                <Filter :size="13" /> FILTRAR
              </button>
            </div>
          </div>
        </template>

<style scoped>
.validacoes-row:hover {
  background: var(--surface-sunken);
}
.validacoes-desc {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
```

### ValidationDetailView

```vue
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { Component } from 'vue';
withDefaults(defineProps<{ item: ValidationItem }>(), {
  item: ''
});
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Header (padrão detalhe Ativo/Solicitação) -->
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--surface-card);
          border: 1px solid var(--border-default);
          cursor: pointer;
          color: var(--text-strong);
          flex-shrink: 0;
        "
       
      >
        <ArrowLeft :size="20" />
      </button>

      <div style="flex: 1; min-width: 0">
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          Validações · Detalhes
        </div>
        <h2
          class="flex items-center"
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            gap: 8px;
            flex-wrap: wrap;
          "
        >
          {{ local.name }}
          <span
            :style="{
              display: 'inline-block',
              padding: '5px 11px',
              borderRadius: '9999px',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.10em',
              color: '#fff',
              background: setorColor(local.responsibleSector),
            }"
          >
            {{ setorLabel(local.responsibleSector) }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          ID {{ local.id }} ·
          {{ isEscopoConfigurado(local) ? escopoLabel(local) : 'Não configurado' }}
        </p>
      </div>

      <button
        type="button"
        class="flex items-center"
        style="
          height: 44px;
          padding: 0 22px;
          background: var(--action-primary-bg);
          color: var(--action-primary-text);
          border: none;
          border-radius: var(--radius-lg);
          cursor: pointer;
          font-weight: var(--weight-bold);
          font-size: var(--text-sm);
          flex-shrink: 0;
        "
       
      >
        Atualizar
      </button>
    </div>

    <div
      v-if="savedBanner"
      style="
        padding: 12px 16px;
        border-radius: var(--radius-lg);
        background: color-mix(in srgb, #16a34a 12%, transparent);
        border: 1px solid color-mix(in srgb, #16a34a 35%, transparent);
        font-size: var(--text-sm);
        color: var(--text-default);
      "
    >
      Validação atualizada com sucesso.
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
     
    />

    <!-- Aba Detalhes -->
    <div
      v-if="tab === 'detalhes'"
      style="
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        background: var(--surface-card);
        padding: 22px;
      "
    >
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
        <div style="grid-column: span 2">
          <div :style="labelStyle">Nome</div>
          <input v-model="local.name" :style="inputStyle" />
          <div
            v-if="errors.name"
            style="font-size: var(--text-xs); color: var(--danger-base, #c53030); margin-top: 6px"
          >
            {{ errors.name }}
          </div>
        </div>
        <div style="grid-column: span 2">
          <div :style="labelStyle">Descrição</div>
          <textarea
            v-model="local.description"
            rows="4"
            style="
              width: 100%;
              padding: 12px;
              background: var(--surface-card);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              outline: none;
              font-size: var(--text-sm);
              color: var(--text-strong);
              resize: vertical;
              min-height: 100px;
            "
          />
          <div
            v-if="errors.description"
            style="font-size: var(--text-xs); color: var(--danger-base, #c53030); margin-top: 6px"
          >
            {{ errors.description }}
          </div>
        </div>
        <div>
          <div :style="labelStyle">Setor Responsável</div>
          <select v-model="local.responsibleSector" :style="inputStyle">
            <option v-for="s in SETOR_RESPONSAVEL_OPTS" :key="s.value" :value="s.value">
              {{ s.text }}
            </option>
          </select>
          <div
            v-if="errors.responsibleSector"
            style="font-size: var(--text-xs); color: var(--danger-base, #c53030); margin-top: 6px"
          >
            {{ errors.responsibleSector }}
          </div>
        </div>
      </div>
      <div style="margin-top: 16px">
        <div style="padding:10px 12px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--text-muted);font-family:ui-monospace,monospace;">ToggleRow</div>
      </div>
    </div>

    <!-- Aba Configurações -->
    <div
      v-else-if="tab === 'configuracoes'"
      class="flex flex-col"
      style="gap: 16px"
    >
      <div
        style="
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          background: var(--surface-card);
          padding: 22px;
        "
      >
        <div class="flex items-end" style="gap: 12px; flex-wrap: wrap">
          <div style="flex: 1; min-width: 240px">
            <div :style="labelStyle">Tipo de Pedido</div>
            <select v-model="newRequestTypeId" :style="inputStyle">
              <option value="">Selecione</option>
              <option v-for="t in TIPO_PEDIDO_OPTS" :key="t.value" :value="t.value">
                {{ t.text }}
              </option>
            </select>
          </div>
          <button
            type="button"
            style="
              height: 40px;
              padding: 0 20px;
              background: var(--surface-sunken);
              color: var(--text-strong);
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              cursor: pointer;
              font-weight: var(--weight-bold);
              font-size: var(--text-sm);
            "
           
          >
            Inserir
          </button>
        </div>
      </div>

      <div
        v-if="local.configs.length === 0"
        style="
          padding: 40px;
          text-align: center;
          font-size: var(--text-sm);
          color: var(--text-muted);
          background: var(--surface-sunken);
          border-radius: var(--radius-xl);
          border: 1px dashed var(--border-default);
        "
      >
        Nenhuma configuração cadastrada.
      </div>
      <div
        v-else
        style="
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: var(--surface-card);
        "
      >
        <div
          class="grid items-center"
          style="
            grid-template-columns: 1fr 0.5fr auto;
            padding: 12px 20px;
            background: var(--surface-sunken);
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.1em;
            color: var(--text-muted);
            text-transform: uppercase;
          "
        >
          <div>Tipo de Pedido</div>
          <div>Qtd. veículos</div>
          <div style="text-align: right">Remover</div>
        </div>
        <div
          v-for="cfg in local.configs"
          :key="cfg.id"
          class="grid items-center"
          style="
            grid-template-columns: 1fr 0.5fr auto;
            padding: 14px 20px;
            border-top: 1px solid var(--border-default);
            font-size: var(--text-sm);
          "
        >
          <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ tipoPedidoLabel(cfg.requestTypeId) }}
          </div>
          <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">
            {{ cfg.vehicleIds.length }}
          </div>
          <div class="flex justify-end">
            <button
              type="button"
              aria-label="Remover configuração"
              class="flex items-center justify-center"
              style="
                width: 32px;
                height: 32px;
                border-radius: var(--radius-md);
                background: none;
                border: 1px solid var(--border-default);
                cursor: pointer;
                color: var(--action-danger-text-only);
              "
             
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Aba Veículos -->
    <div v-else class="flex flex-col" style="gap: 16px">
      <div
        v-if="local.configs.length === 0"
        style="
          padding: 20px 16px;
          border-radius: var(--radius-xl);
          background: color-mix(in srgb, var(--warning-base, #d97706) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--warning-base, #d97706) 35%, transparent);
          font-size: var(--text-sm);
          color: var(--text-default);
          line-height: 1.5;
        "
      >
        Nenhuma configuração cadastrada. Adicione uma configuração na aba Configurações para vincular
        veículos.
      </div>

      <div
        v-else
        class="grid"
        style="
          grid-template-columns: 280px 1fr;
          gap: 20px;
          min-height: 360px;
        "
      >
        <div
          style="
            border: 1px solid var(--border-default);
            border-radius: var(--radius-xl);
            overflow: hidden;
            background: var(--surface-card);
            align-self: start;
          "
        >
          <div
            style="
              padding: 12px 16px;
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              color: var(--text-muted);
              text-transform: uppercase;
              border-bottom: 1px solid var(--border-default);
              background: var(--surface-sunken);
            "
          >
            Configurações
          </div>
          <button
            v-for="cfg in local.configs"
            :key="cfg.id"
            type="button"
            class="flex flex-col"
            style="
              width: 100%;
              padding: 14px 16px;
              text-align: left;
              border: none;
              border-bottom: 1px solid var(--border-default);
              cursor: pointer;
              background: selectedConfigId === cfg.id ? 'var(--surface-selected)' : 'transparent';
            "
           
          >
            <span
              style="
                font-size: var(--text-sm);
                font-weight: var(--weight-semibold);
                color: var(--text-strong);
              "
            >
              {{ tipoPedidoLabel(cfg.requestTypeId) }}
            </span>
            <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px">
              {{ cfg.vehicleIds.length }} veículo(s)
            </span>
          </button>
        </div>

        <div
          class="flex flex-col"
          style="
            gap: 14px;
            min-width: 0;
            border: 1px solid var(--border-default);
            border-radius: var(--radius-xl);
            background: var(--surface-card);
            padding: 20px;
          "
        >
          <div class="flex items-center" style="gap: 6px; flex-wrap: wrap">
            <button
              v-for="ft in FUND_TABS"
              :key="ft.key"
              type="button"
              :style="{
                padding: '6px 12px',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                border: `1px solid ${fundTab === ft.key ? 'var(--gci-base)' : 'var(--border-default)'}`,
                background: fundTab === ft.key ? 'var(--surface-selected)' : 'var(--surface-card)',
                color: fundTab === ft.key ? 'var(--gci-base)' : 'var(--text-muted)',
              }"
             
            >
              {{ ft.label }}
            </button>
          </div>

          <div class="relative" style="background: var(--surface-sunken); border-radius: var(--radius-lg)">
            <Search
              :size="16"
              style="
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--neutral-400);
              "
            />
            <input
              v-model="vehicleSearch"
              placeholder="Buscar por nome..."
              style="
                width: 100%;
                height: 44px;
                padding-left: 44px;
                padding-right: 16px;
                background: transparent;
                border: none;
                outline: none;
                font-size: var(--text-sm);
                color: var(--text-strong);
              "
            />
          </div>

          <div class="flex items-center justify-between" style="gap: 12px; flex-wrap: wrap">
            <span style="font-size: var(--text-sm); color: var(--text-muted)">
              {{ linkedInTabCount }} de {{ vehiclesInTab.length }} selecionados
            </span>
            <button
              type="button"
              style="
                height: 36px;
                padding: 0 14px;
                background: var(--surface-card);
                border: 1px solid var(--border-default);
                border-radius: var(--radius-lg);
                cursor: pointer;
                font-size: var(--text-xs);
                font-weight: var(--weight-bold);
                color: var(--text-strong);
              "
             
            >
              Vincular todos da aba
            </button>
          </div>

          <div
            v-if="vehiclesInTab.length === 0"
            style="padding: 32px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
          >
            Nenhum veículo encontrado.
          </div>
          <div
            v-else
            style="
              border: 1px solid var(--border-default);
              border-radius: var(--radius-lg);
              overflow: hidden;
              max-height: 420px;
              overflow-y: auto;
            "
          >
            <div
              v-for="v in vehiclesInTab"
              :key="v.id"
              class="flex items-center"
              style="
                gap: 12px;
                padding: 12px 14px;
                border-top: 1px solid var(--border-default);
                cursor: pointer;
                background: var(--surface-card);
              "
             
            >
              <Checkbox :checked="isVehicleLinked(v.id)" />
              <div style="min-width: 0">
                <div
                  style="
                    font-size: var(--text-sm);
                    font-weight: var(--weight-medium);
                    color: var(--text-strong);
                  "
                >
                  {{ v.name }}
                </div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px">
                  {{ v.fundType }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

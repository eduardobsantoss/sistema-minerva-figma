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

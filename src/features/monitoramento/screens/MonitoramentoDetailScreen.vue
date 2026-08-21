<script setup lang="ts">
import { computed } from 'vue';
import { ArrowLeft, ChevronRight } from 'lucide-vue-next';
import { Section, Field, CopyButton } from '@/features/solicitacao-operacao/screens/detail-tabs/shared';
import {
  brl,
  formatDateBR,
  tipoClienteLabel,
  tipoClienteTone,
  veiculoTone,
  chipTone,
  toneStyle,
  truncateChip,
  visibleChips,
  type MonitoringPedido,
} from '../data/monitoramentoData';

const props = defineProps<{ pedido: MonitoringPedido }>();
const emit = defineEmits<{
  back: [];
  'open-cessao': [cessaoId: string];
}>();

const tipoTone = computed(() => toneStyle(tipoClienteTone(props.pedido.tipoCliente)));

const utilizacaoPct = computed(() => {
  if (props.pedido.limite <= 0) return 0;
  return Math.round((props.pedido.risco / props.pedido.limite) * 100);
});
</script>

<template>
  <div class="flex flex-col" style="gap: 32px">
    <div class="flex items-center" style="gap: 16px">
      <button
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          Monitoramento · Pedido
        </div>
        <h2 class="flex items-center" style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2; gap: 10px; flex-wrap: wrap">
          {{ pedido.cliente }}
          <span
            class="flex items-center"
            :style="{
              gap: '6px',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.10em',
              padding: '5px 11px',
              borderRadius: '9999px',
              background: tipoTone.bg,
              color: tipoTone.text,
            }"
          >
            <span :style="{ width: '7px', height: '7px', borderRadius: '9999px', background: tipoTone.color }" />
            {{ tipoClienteLabel(pedido.tipoCliente).toUpperCase() }}
          </span>
        </h2>
        <p class="flex items-center" style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px; gap: 6px; font-variant-numeric: tabular-nums">
          {{ pedido.documento }}
          <CopyButton :value="pedido.documento" />
        </p>
      </div>
    </div>

    <div
      class="flex items-center justify-between"
      style="gap: 16px; flex-wrap: wrap; background: var(--gci-base); border-radius: var(--radius-xl); padding: 22px 26px; color: #fff"
    >
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--agro-base); text-transform: uppercase; margin-bottom: 8px">
          Risco
        </div>
        <div style="font-size: 32px; font-weight: var(--weight-bold); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1">
          {{ brl(pedido.risco) }}
        </div>
      </div>
      <div class="flex items-center" style="gap: 28px; flex-wrap: wrap">
        <div>
          <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: rgba(255, 255, 255, 0.6); text-transform: uppercase; margin-bottom: 6px">
            Limite
          </div>
          <div style="font-size: var(--text-md); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">
            {{ brl(pedido.limite) }}
          </div>
        </div>
        <div>
          <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: rgba(255, 255, 255, 0.6); text-transform: uppercase; margin-bottom: 6px">
            Utilização
          </div>
          <div style="font-size: var(--text-md); font-weight: var(--weight-bold); font-variant-numeric: tabular-nums">
            {{ utilizacaoPct }}%
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col" style="gap: 32px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 24px">
    <Section title="Dados do Cliente">
      <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 24px">
        <Field label="Cedente">{{ pedido.cliente }}</Field>
        <Field label="Tipo do Cliente">
          <span
            class="flex items-center"
            :style="{
              gap: '6px',
              width: 'fit-content',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.04em',
              padding: '4px 9px',
              borderRadius: '9999px',
              background: tipoTone.bg,
              color: tipoTone.text,
            }"
          >
            <span :style="{ width: '6px', height: '6px', borderRadius: '9999px', background: tipoTone.color }" />
            {{ tipoClienteLabel(pedido.tipoCliente) }}
          </span>
        </Field>
        <Field label="Gerente">{{ pedido.gerente }}</Field>
        <Field label="CPF/CNPJ">
          <span style="font-variant-numeric: tabular-nums">
            {{ pedido.documento }}
          </span>
        </Field>
      </div>
    </Section>

    <Section :title="`Cessões Realizadas (${pedido.cessoes.length})`">
      <div
        v-if="pedido.cessoes.length === 0"
        style="padding: 24px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); border: 1px solid var(--border-default); border-radius: var(--radius-lg); background: var(--surface-sunken)"
      >
        Nenhuma cessão cadastrada.
      </div>
      <div v-else class="flex flex-col" style="gap: 10px">
        <div
          v-for="c in pedido.cessoes"
          :key="c.id"
          class="cessao-card"
          @click="emit('open-cessao', c.id)"
        >
          <div class="flex items-start justify-between" style="gap: 12px">
            <div style="min-width: 0; flex: 1">
              <div class="flex items-center" style="gap: 8px; flex-wrap: wrap; margin-bottom: 12px">
                <span
                  :style="{
                    fontSize: '9px',
                    fontWeight: 'var(--weight-bold)',
                    letterSpacing: '0.06em',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-sm)',
                    background: toneStyle(veiculoTone(c.veiculo)).bg,
                    color: toneStyle(veiculoTone(c.veiculo)).text,
                    textTransform: 'uppercase',
                  }"
                >
                  {{ c.veiculo }}
                </span>
                <span style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
                  {{ c.nome }}
                </span>
              </div>
              <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px 20px">
                <div>
                  <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
                    Data
                  </div>
                  <div style="font-size: var(--text-sm); color: var(--text-strong); font-variant-numeric: tabular-nums">
                    {{ formatDateBR(c.data) }}
                  </div>
                </div>
                <div>
                  <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
                    Valor
                  </div>
                  <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                    {{ brl(c.valor) }}
                  </div>
                </div>
                <div>
                  <div style="font-size: 9px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
                    Taxa
                  </div>
                  <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                    {{ c.taxa.toFixed(1).replace('.', ',') }}% a.a.
                  </div>
                </div>
              </div>
            </div>
            <ChevronRight :size="18" style="color: var(--text-muted); flex-shrink: 0; margin-top: 4px" />
          </div>
          <div
            v-if="c.detalhes.length > 0"
            class="flex items-center"
            style="gap: 6px; flex-wrap: wrap; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-default)"
          >
            <span
              v-for="chip in visibleChips(c.detalhes).shown"
              :key="chip"
              :style="{
                fontSize: '10px',
                fontWeight: 'var(--weight-bold)',
                padding: '3px 8px',
                borderRadius: '9999px',
                background: toneStyle(chipTone(chip)).bg,
                color: toneStyle(chipTone(chip)).text,
              }"
              :title="chip"
            >
              {{ truncateChip(chip) }}
            </span>
            <span
              v-if="visibleChips(c.detalhes).extra > 0"
              style="font-size: 10px; font-weight: var(--weight-bold); padding: 3px 8px; border-radius: 9999px; background: var(--status-neutral-bg); color: var(--status-neutral-text)"
            >
              +{{ visibleChips(c.detalhes).extra }} mais
            </span>
          </div>
        </div>
      </div>
    </Section>
    </div>
  </div>
</template>

<style scoped>
.cessao-card {
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  background: var(--surface-card);
  padding: 16px;
  cursor: pointer;
  transition: background var(--duration-fast), box-shadow var(--duration-fast), border-color var(--duration-fast);
}
.cessao-card:hover {
  background: var(--surface-sunken);
  border-color: var(--border-strong);
  box-shadow: var(--shadow-sm);
}
</style>

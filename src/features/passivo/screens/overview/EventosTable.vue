<script setup lang="ts">
import { Calendar, ChevronRight } from 'lucide-vue-next';
import { EVENTOS, brl, TONE_B3, type EventoPagamento } from '../../data/passivoData';
import ValidacaoAfBadge from './ValidacaoAfBadge.vue';

const emit = defineEmits<{ openEvent: [evento: EventoPagamento] }>();

const cols = '1fr 1.4fr 1fr 1.2fr 1fr 0.9fr 48px';
</script>

<template>
  <div
    style="
      background: var(--surface-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      overflow: hidden;
    "
  >
    <div
      class="flex items-center"
      style="gap: 16px; padding: 20px; border-bottom: 1px solid var(--border-default)"
    >
      <div
        class="flex items-center justify-center"
        style="
          width: 44px;
          height: 44px;
          border-radius: var(--radius-lg);
          background: var(--surface-sunken);
          color: var(--gci-base);
        "
      >
        <Calendar :size="20" />
      </div>
      <div style="flex: 1">
        <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em">
          Próximos Eventos de Pagamento
        </div>
        <div
          style="
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.14em;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-top: 4px;
          "
        >
          Acompanhamento de liquidação e cronograma
        </div>
      </div>
    </div>

    <div style="overflow-x: auto">
      <div
        class="grid"
        :style="{
          gridTemplateColumns: cols,
          padding: '14px 20px',
          background: 'var(--surface-sunken)',
          fontSize: '10px',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '0.14em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          minWidth: '720px',
        }"
      >
        <div>Cota</div>
        <div>Evento</div>
        <div style="text-align: center">Cronograma</div>
        <div style="text-align: right">Valor Previsto</div>
        <div style="text-align: center">Validação AF</div>
        <div style="text-align: center">B3 Status</div>
        <div />
      </div>

      <div
        v-for="evento in EVENTOS"
        :key="evento.id"
        class="evento-row grid items-center"
        :style="{
          gridTemplateColumns: cols,
          padding: '18px 20px',
          borderTop: '1px solid var(--border-default)',
          cursor: 'pointer',
          minWidth: '720px',
          transition: 'background var(--duration-fast)',
        }"
        @click="emit('openEvent', evento)"
      >
        <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
          {{ evento.cota }}
        </div>
        <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-default)">
          {{ evento.evento }}
        </div>
        <div
          style="
            text-align: center;
            font-size: var(--text-sm);
            font-weight: var(--weight-semibold);
            color: var(--text-muted);
            font-variant-numeric: tabular-nums;
          "
        >
          {{ evento.data }}
        </div>
        <div
          style="
            text-align: right;
            font-size: var(--text-sm);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            font-variant-numeric: tabular-nums;
          "
        >
          {{ evento.valorPrevisto > 0 ? brl(evento.valorPrevisto) : '—' }}
        </div>
        <div style="text-align: center">
          <ValidacaoAfBadge :status="evento.validacaoAF" />
        </div>
        <div
          style="
            text-align: center;
            font-size: 10px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.10em;
            text-transform: uppercase;
          "
          :style="{ color: TONE_B3[evento.b3Status] }"
        >
          {{ evento.b3Status }}
        </div>
        <div class="flex justify-end">
          <ChevronRight
            :size="16"
            class="row-chevron"
            style="color: var(--neutral-300); transition: color var(--duration-fast), transform var(--duration-fast)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.evento-row:hover {
  background: var(--surface-sunken);
}
.evento-row:hover .row-chevron {
  color: var(--gci-base);
  transform: translateX(2px);
}
</style>

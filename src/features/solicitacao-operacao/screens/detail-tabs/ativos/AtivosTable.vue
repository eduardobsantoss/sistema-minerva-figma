<script setup lang="ts">
import { computed } from 'vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import { brl, type ContratoAtivo } from '../../../data/operacaoData';
import {
  TONE_ENTREGA,
  TONE_SIT_PAGAMENTO,
  TONE_SITUACAO,
  TONE_STATUS_ANEXOS,
} from '../../../data/ativoData';

const props = defineProps<{
  ativos: ContratoAtivo[];
  selectedIds: Set<string>;
}>();

const emit = defineEmits<{
  toggle: [id: string];
  toggleAll: [];
  openAtivo: [ativo: ContratoAtivo];
}>();

const allSelected = computed(
  () => props.ativos.length > 0 && props.ativos.every((a) => props.selectedIds.has(a.id)),
);
const someSelected = computed(
  () => props.ativos.some((a) => props.selectedIds.has(a.id)) && !allSelected.value,
);
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
            <Checkbox :checked="allSelected" :indeterminate="someSelected" @change="emit('toggleAll')" />
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
          v-for="a in ativos"
          :key="a.id"
          class="grid items-center row-clickable"
          style="
            grid-template-columns: 40px 90px 120px 80px 90px 70px 100px 120px 1.2fr 1.2fr 100px 100px 110px 90px 100px;
            padding: 12px 16px;
            border-top: 1px solid var(--border-default);
            font-size: var(--text-sm);
            cursor: pointer;
          "
          @click="emit('openAtivo', a)"
        >
          <div class="flex items-center justify-center" @click.stop>
            <Checkbox :checked="selectedIds.has(a.id)" @change="emit('toggle', a.id)" />
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

<script setup lang="ts">
import { reactive } from 'vue';
import { ShieldCheck, X } from 'lucide-vue-next';
import {
  rememberVeiculosApto,
  veiculosAptoFromVinculos,
  type VeiculoApto,
} from '../../data/vinculosStore';

const props = defineProps<{ grupoId: string; grupoNome: string }>();
const emit = defineEmits<{ close: []; confirm: [] }>();

const operacoes = reactive<VeiculoApto[]>(
  veiculosAptoFromVinculos(props.grupoId).map((o) => ({ ...o })),
);

function toggleApto(id: string) {
  const row = operacoes.find((o) => o.id === id);
  if (row) row.apto = !row.apto;
}

function confirmar() {
  rememberVeiculosApto(props.grupoId, operacoes.map((o) => ({ ...o })));
  emit('confirm');
}
</script>

<template>
  <div
    class="flex items-center justify-center"
    style="position: fixed; inset: 0; z-index: 600; background: rgba(15,23,42,0.45); padding: 24px"
    @click.self="emit('close')"
  >
    <div
      style="
        width: 100%;
        max-width: 640px;
        max-height: calc(100vh - 48px);
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div class="flex items-start" style="gap: 14px">
          <div
            class="flex items-center justify-center"
            style="width: 52px; height: 52px; border-radius: 9999px; background: var(--status-success-bg); color: var(--success-base); flex-shrink: 0"
          >
            <ShieldCheck :size="26" />
          </div>
          <div>
            <h3 style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-bottom: 6px">
              Habilitar "{{ grupoNome }}" para operar?
            </h3>
            <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; margin: 0">
              O grupo passará a poder realizar novas operações dentro do limite parametrizado.
            </p>
          </div>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 20px 28px" class="flex flex-col" :style="{ gap: '16px' }">
        <div
          class="flex items-center justify-between"
          style="padding: 0 0 2px"
        >
          <span
            style="
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: var(--text-muted);
            "
          >
            Operações
          </span>
        </div>

        <p style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--action-danger-text-only); margin: 0">
          Caso seja inapto, não será possível iniciar cessões;
        </p>

        <div style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden">
          <div
            class="grid"
            style="
              grid-template-columns: 1fr 140px;
              padding: 12px 16px;
              background: var(--surface-sunken);
              font-size: 10px;
              font-weight: var(--weight-bold);
              letter-spacing: 0.1em;
              color: var(--text-muted);
              text-transform: uppercase;
            "
          >
            <div>Veículo</div>
            <div style="text-align: center">Apto</div>
          </div>
          <div
            v-for="(op, i) in operacoes"
            :key="op.id"
            class="grid items-center"
            :style="{
              gridTemplateColumns: '1fr 140px',
              padding: '10px 16px',
              borderTop: '1px solid var(--border-default)',
              background: i % 2 === 0 ? 'var(--surface-card)' : 'color-mix(in srgb, var(--gci-base) 4%, transparent)',
            }"
          >
            <div style="font-size: var(--text-sm); color: var(--text-strong); font-weight: var(--weight-semibold)">
              {{ op.veiculo }}
            </div>
            <div class="flex justify-center">
              <button
                type="button"
                :aria-checked="op.apto"
                role="switch"
                :title="op.apto ? 'Apto' : 'Inapto'"
                :style="{
                  position: 'relative',
                  width: '44px',
                  height: '24px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  background: op.apto ? 'var(--success-base)' : 'var(--border-strong)',
                  transition: 'background var(--duration-base)',
                  padding: 0,
                }"
                @click="toggleApto(op.id)"
              >
                <span
                  :style="{
                    position: 'absolute',
                    top: '3px',
                    left: op.apto ? '23px' : '3px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '9999px',
                    background: '#fff',
                    transition: 'left var(--duration-base)',
                    boxShadow: 'var(--shadow-xs)',
                  }"
                />
              </button>
            </div>
          </div>
          <div
            v-if="operacoes.length === 0"
            style="padding: 28px; text-align: center; font-size: var(--text-sm); color: var(--text-muted)"
          >
            Nenhum veículo vinculado. Use “Vincular a um veículo” antes de habilitar.
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end" style="gap: 10px; padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          style="height: 42px; padding: 0 18px; background: var(--surface-card); color: var(--text-strong); border: 1px solid var(--border-default); border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          style="height: 42px; padding: 0 18px; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-sm); background: var(--success-base); color: #fff"
          @click="confirmar"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

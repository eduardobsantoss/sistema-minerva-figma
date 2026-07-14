<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import {
  ArrowLeft,
  MoreVertical,
  FileText,
  RefreshCw,
  XCircle,
  Building2,
  User,
  Mail,
} from 'lucide-vue-next';
import {
  brl,
  statusCessaoColor,
  statusCessaoLabel,
  type NotificacaoCessao,
} from '../data/notificacoesCessaoData';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';

const props = defineProps<{ notificacao: NotificacaoCessao }>();
const emit = defineEmits<{
  back: [];
  reenviar: [id: string];
  cancelar: [id: string];
}>();

type Tab = 'detalhes' | 'comprovante';

const TABS = [
  { key: 'detalhes' as const, label: 'Detalhes', icon: FileText },
  { key: 'comprovante' as const, label: 'Comprovante', icon: Mail },
];

const tab = ref<Tab>('detalhes');
const actionMenuOpen = ref(false);
const actionMenuRef = ref<HTMLDivElement | null>(null);
const statusColor = computed(() => statusCessaoColor(props.notificacao.status));

const actions = computed(() => {
  const items: { label: string; icon: typeof RefreshCw; onClick: () => void; danger?: boolean }[] = [];
  if (props.notificacao.status === 'PENDENTE' || props.notificacao.status === 'FALHOU') {
    items.push({
      label: 'Reenviar',
      icon: RefreshCw,
      onClick: () => emit('reenviar', props.notificacao.id),
    });
  }
  if (props.notificacao.status === 'PENDENTE' || props.notificacao.status === 'ENVIADA') {
    items.push({
      label: 'Cancelar',
      icon: XCircle,
      onClick: () => emit('cancelar', props.notificacao.id),
      danger: true,
    });
  }
  return items;
});

function handleClickOutside(e: MouseEvent) {
  if (actionMenuRef.value && !actionMenuRef.value.contains(e.target as Node)) {
    actionMenuOpen.value = false;
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
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
        @click="emit('back')"
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
          Cobrança · Notificação de Cessão
        </div>
        <h2
          class="flex items-center"
          style="
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-strong);
            letter-spacing: -0.01em;
            line-height: 1.2;
            gap: 10px;
            flex-wrap: wrap;
          "
        >
          {{ notificacao.protocolo }}
          <span
            class="flex items-center"
            :style="{
              gap: '6px',
              fontSize: '10px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.1em',
              padding: '5px 11px',
              borderRadius: '9999px',
              background: `color-mix(in srgb, ${statusColor} 14%, transparent)`,
              color: statusColor,
            }"
          >
            <span :style="{ width: '7px', height: '7px', borderRadius: '9999px', background: statusColor }" />
            {{ statusCessaoLabel(notificacao.status).toUpperCase() }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          Título #{{ notificacao.tituloNumero }} · {{ notificacao.veiculoNome }}
        </p>
      </div>

      <div v-if="actions.length" ref="actionMenuRef" style="position: relative; flex-shrink: 0">
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
          @click="actionMenuOpen = !actionMenuOpen"
        >
          <MoreVertical :size="20" />
        </button>
        <div
          v-if="actionMenuOpen"
          class="flex flex-col"
          style="
            position: absolute;
            top: 52px;
            right: 0;
            z-index: 50;
            min-width: 180px;
            background: var(--surface-card);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            padding: 6px;
          "
        >
          <button
            v-for="a in actions"
            :key="a.label"
            class="flex items-center nc-action-item"
            :style="{
              gap: '10px',
              width: '100%',
              padding: '10px 12px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              color: a.danger ? 'var(--action-danger-text-only)' : 'var(--text-default)',
              textAlign: 'left',
            }"
            @click="
              actionMenuOpen = false;
              a.onClick();
            "
          >
            <component :is="a.icon" :size="15" style="flex-shrink: 0" />
            {{ a.label }}
          </button>
        </div>
      </div>
    </div>

    <div
      class="relative overflow-hidden flex items-center"
      style="
        background: var(--gci-base);
        border-radius: var(--radius-xl);
        padding: 28px 32px;
        color: #fff;
        box-shadow: 0 20px 40px -20px rgba(8, 60, 74, 0.4);
        gap: 24px;
        flex-wrap: wrap;
      "
    >
      <div
        style="
          position: absolute;
          top: -100px;
          right: -100px;
          width: 320px;
          height: 320px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.04);
        "
      />
      <div style="flex: 1; position: relative; z-index: 1; min-width: 200px">
        <div
          style="
            font-size: 11px;
            font-weight: var(--weight-bold);
            letter-spacing: 0.18em;
            color: var(--agro-base);
            text-transform: uppercase;
            margin-bottom: 10px;
          "
        >
          Valor da Cessão
        </div>
        <div
          style="
            font-size: 36px;
            font-weight: var(--weight-bold);
            letter-spacing: -0.02em;
            font-variant-numeric: tabular-nums;
            line-height: 1.1;
          "
        >
          {{ brl(notificacao.valorCessao) }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255, 255, 255, 0.65); margin-top: 8px">
          Canal: {{ notificacao.canal }} · Criada em {{ notificacao.dataCriacao }}
          <template v-if="notificacao.dataEnvio"> · Enviada em {{ notificacao.dataEnvio }}</template>
        </div>
      </div>
    </div>

    <SegmentedToggle
      :model-value="tab"
      :options="TABS"
      variant="brand"
      style="align-self: flex-start"
      @update:model-value="tab = $event as Tab"
    />

    <div
      style="
        background: var(--surface-card);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-xl);
        padding: 24px;
      "
    >
      <div v-if="tab === 'detalhes'" class="flex flex-col" style="gap: 28px">
        <section>
          <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.14em; color: var(--accent); text-transform: uppercase; margin-bottom: 14px">
            Dados da notificação
          </div>
          <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 20px">
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                Protocolo
              </div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                {{ notificacao.protocolo }}
              </div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                Título
              </div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                #{{ notificacao.tituloNumero }}
              </div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                Canal
              </div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
                {{ notificacao.canal }}
              </div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                Tentativas
              </div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                {{ notificacao.tentativas }}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.14em; color: var(--accent); text-transform: uppercase; margin-bottom: 14px">
            Destinatário
          </div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ notificacao.destinatario }}
          </div>
        </section>

        <section>
          <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.14em; color: var(--accent); text-transform: uppercase; margin-bottom: 14px">
            Participantes
          </div>
          <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
            <div
              class="flex items-start"
              style="gap: 12px; padding: 16px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-sunken)"
            >
              <div
                class="flex items-center justify-center"
                style="width: 36px; height: 36px; border-radius: var(--radius-md); background: var(--gci-light); color: var(--gci-base); flex-shrink: 0"
              >
                <Building2 :size="16" />
              </div>
              <div>
                <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">
                  Cedente
                </div>
                <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); margin-top: 4px">
                  {{ notificacao.cedente }}
                </div>
                <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
                  {{ notificacao.cedenteCnpj }}
                </div>
              </div>
            </div>
            <div
              class="flex items-start"
              style="gap: 12px; padding: 16px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-sunken)"
            >
              <div
                class="flex items-center justify-center"
                style="width: 36px; height: 36px; border-radius: var(--radius-md); background: var(--agro-light); color: var(--agro-base); flex-shrink: 0"
              >
                <User :size="16" />
              </div>
              <div>
                <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">
                  Sacado
                </div>
                <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); margin-top: 4px">
                  {{ notificacao.sacado }}
                </div>
                <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
                  {{ notificacao.sacadoCnpj }}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div v-else class="flex flex-col" style="gap: 16px">
        <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.14em; color: var(--accent); text-transform: uppercase">
          Comprovante de envio
        </div>
        <div
          v-if="notificacao.comprovanteRef"
          style="padding: 20px; border-radius: var(--radius-lg); border: 1px solid var(--border-default); background: var(--surface-sunken)"
        >
          <div style="font-size: var(--text-xs); color: var(--text-muted)">Referência</div>
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); margin-top: 6px; font-variant-numeric: tabular-nums">
            {{ notificacao.comprovanteRef }}
          </div>
          <div style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 10px">
            Enviado em {{ notificacao.dataEnvio }} via {{ notificacao.canal }} para
            <strong style="color: var(--text-default)">{{ notificacao.destinatario }}</strong>.
          </div>
        </div>
        <div
          v-else
          style="
            padding: 32px;
            text-align: center;
            border-radius: var(--radius-lg);
            border: 1px dashed var(--border-default);
            color: var(--text-muted);
            font-size: var(--text-sm);
          "
        >
          Nenhum comprovante disponível para esta notificação.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nc-action-item:hover {
  background: var(--surface-sunken);
}
</style>

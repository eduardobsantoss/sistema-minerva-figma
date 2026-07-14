<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type Component } from 'vue';
import {
  ArrowLeft,
  MoreVertical,
  FileText,
  BellRing,
  Receipt,
  Handshake,
  Building2,
  User,
  History,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-vue-next';
import {
  brl,
  statusTituloColor,
  statusTituloLabel,
  type Titulo,
} from '../data/titulosData';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';

const props = defineProps<{ titulo: Titulo }>();
const emit = defineEmits<{
  back: [];
  gerarBoleto: [id: string];
  notificar: [id: string];
  negociar: [id: string];
}>();

type Tab = 'detalhes' | 'cobranca';

const TABS = [
  { key: 'detalhes' as const, label: 'Detalhes', icon: FileText },
  { key: 'cobranca' as const, label: 'Cobrança', icon: History },
];

const tab = ref<Tab>('detalhes');
const actionMenuOpen = ref(false);
const actionMenuRef = ref<HTMLDivElement | null>(null);
const statusColor = computed(() => statusTituloColor(props.titulo.status));

const StatusIcon = computed<Component>(() => {
  if (props.titulo.status === 'CONFIRMADO') return CheckCircle2;
  if (props.titulo.status === 'VENCIDO') return AlertTriangle;
  return Clock;
});

const actions = [
  {
    label: 'Gerar boleto',
    icon: Receipt,
    onClick: () => emit('gerarBoleto', props.titulo.id),
  },
  {
    label: 'Notificar',
    icon: BellRing,
    onClick: () => emit('notificar', props.titulo.id),
  },
  {
    label: 'Marcar em negociação',
    icon: Handshake,
    onClick: () => emit('negociar', props.titulo.id),
  },
];

function handleActionClick(action: (typeof actions)[number]) {
  actionMenuOpen.value = false;
  action.onClick();
}

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
          Cobrança · Título
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
          #{{ titulo.numero }}
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
            {{ statusTituloLabel(titulo.status).toUpperCase() }}
          </span>
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ titulo.veiculoNome }} · {{ titulo.veiculoTipo }}
          <template v-if="titulo.classeOuOperacao"> · {{ titulo.classeOuOperacao }}</template>
        </p>
      </div>

      <div ref="actionMenuRef" style="position: relative; flex-shrink: 0">
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
            min-width: 220px;
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
            class="flex items-center detalle-action-item"
            style="
              gap: 10px;
              width: 100%;
              padding: 10px 12px;
              background: transparent;
              border: none;
              cursor: pointer;
              border-radius: var(--radius-md);
              font-size: var(--text-sm);
              color: var(--text-default);
              text-align: left;
            "
            @click="handleActionClick(a)"
          >
            <component :is="a.icon" :size="15" style="color: var(--text-muted); flex-shrink: 0" />
            {{ a.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Value hero -->
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
          Valor Nominal do Título
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
          {{ brl(titulo.vrNominal) }}
        </div>
        <div style="font-size: var(--text-xs); color: rgba(255, 255, 255, 0.65); margin-top: 8px">
          Tipo: {{ titulo.tipo }} · Emissão: {{ titulo.emissao }} · Vencimento: {{ titulo.vencimento }}
        </div>
      </div>
      <div
        class="flex flex-col"
        style="
          position: relative;
          z-index: 1;
          gap: 8px;
          padding: 16px 20px;
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          min-width: 160px;
        "
      >
        <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255, 255, 255, 0.55)">
          Valor em Aberto
        </div>
        <div style="font-size: var(--text-xl); font-weight: 700; font-variant-numeric: tabular-nums">
          {{ brl(titulo.vrAberto) }}
        </div>
        <div
          class="flex items-center"
          style="gap: 6px; font-size: var(--text-xs); color: rgba(255, 255, 255, 0.7)"
        >
          <component :is="StatusIcon" :size="13" />
          {{ titulo.diasAtraso > 0 ? `${titulo.diasAtraso} dias em atraso` : 'Sem atraso' }}
        </div>
      </div>
    </div>

    <!-- Tabs -->
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
      <!-- Detalhes -->
      <div v-if="tab === 'detalhes'" class="flex flex-col" style="gap: 28px">
        <section>
          <div
            style="
              font-size: 10px;
              font-weight: 800;
              letter-spacing: 0.14em;
              color: var(--accent);
              text-transform: uppercase;
              margin-bottom: 14px;
            "
          >
            Informações do Título
          </div>
          <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 20px">
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                Nº Título
              </div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                #{{ titulo.numero }}
              </div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                Tipo de Ativo
              </div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
                {{ titulo.tipo }}
              </div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                Veículo
              </div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
                {{ titulo.veiculoNome }}
              </div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                Classe / Operação
              </div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
                {{ titulo.classeOuOperacao ?? '—' }}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div
            style="
              font-size: 10px;
              font-weight: 800;
              letter-spacing: 0.14em;
              color: var(--accent);
              text-transform: uppercase;
              margin-bottom: 14px;
            "
          >
            Valores
          </div>
          <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 20px">
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                Valor Nominal
              </div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                {{ brl(titulo.vrNominal) }}
              </div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                Valor em Aberto
              </div>
              <div
                :style="{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--weight-bold)',
                  color: titulo.diasAtraso > 0 ? 'var(--danger-base)' : 'var(--text-strong)',
                  fontVariantNumeric: 'tabular-nums',
                }"
              >
                {{ brl(titulo.vrAberto) }}
              </div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                Valor Presente
              </div>
              <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); font-variant-numeric: tabular-nums">
                {{ titulo.vrPresente != null ? brl(titulo.vrPresente) : '—' }}
              </div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                Dias em atraso
              </div>
              <div
                :style="{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--weight-bold)',
                  color: titulo.diasAtraso > 0 ? 'var(--danger-base)' : 'var(--text-strong)',
                  fontVariantNumeric: 'tabular-nums',
                }"
              >
                {{ titulo.diasAtraso }}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div
            style="
              font-size: 10px;
              font-weight: 800;
              letter-spacing: 0.14em;
              color: var(--accent);
              text-transform: uppercase;
              margin-bottom: 14px;
            "
          >
            Datas
          </div>
          <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 20px">
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                Emissão
              </div>
              <div style="font-size: var(--text-sm); color: var(--text-strong); font-variant-numeric: tabular-nums">
                {{ titulo.emissao }}
              </div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px">
                Vencimento
              </div>
              <div style="font-size: var(--text-sm); color: var(--text-strong); font-variant-numeric: tabular-nums">
                {{ titulo.vencimento }}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div
            style="
              font-size: 10px;
              font-weight: 800;
              letter-spacing: 0.14em;
              color: var(--accent);
              text-transform: uppercase;
              margin-bottom: 14px;
            "
          >
            Participantes
          </div>
          <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
            <div
              class="flex items-start"
              style="
                gap: 12px;
                padding: 16px;
                border-radius: var(--radius-lg);
                border: 1px solid var(--border-default);
                background: var(--surface-sunken);
              "
            >
              <div
                class="flex items-center justify-center"
                style="
                  width: 36px;
                  height: 36px;
                  border-radius: var(--radius-md);
                  background: var(--gci-light);
                  color: var(--gci-base);
                  flex-shrink: 0;
                "
              >
                <Building2 :size="16" />
              </div>
              <div>
                <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">
                  Cedente
                </div>
                <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); margin-top: 4px">
                  {{ titulo.cedente }}
                </div>
                <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
                  {{ titulo.cedenteCnpj }}
                </div>
              </div>
            </div>
            <div
              class="flex items-start"
              style="
                gap: 12px;
                padding: 16px;
                border-radius: var(--radius-lg);
                border: 1px solid var(--border-default);
                background: var(--surface-sunken);
              "
            >
              <div
                class="flex items-center justify-center"
                style="
                  width: 36px;
                  height: 36px;
                  border-radius: var(--radius-md);
                  background: var(--agro-light);
                  color: var(--agro-base);
                  flex-shrink: 0;
                "
              >
                <User :size="16" />
              </div>
              <div>
                <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase">
                  Sacado
                </div>
                <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); margin-top: 4px">
                  {{ titulo.sacado }}
                </div>
                <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
                  {{ titulo.sacadoCnpj }}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Cobrança -->
      <div v-else class="flex flex-col" style="gap: 16px">
        <div
          style="
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.14em;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 4px;
          "
        >
          Histórico de cobrança
        </div>
        <div
          style="
            padding: 16px 18px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-default);
            background: var(--surface-sunken);
          "
        >
          <div class="flex items-center" style="gap: 10px; margin-bottom: 6px">
            <BellRing :size="15" style="color: var(--text-muted)" />
            <div style="font-size: var(--text-xs); color: var(--text-muted)">Última notificação</div>
          </div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ titulo.ultimaNotificacaoEm ?? 'Nenhuma notificação enviada' }}
          </div>
        </div>
        <div
          style="
            padding: 16px 18px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-default);
            background: var(--surface-sunken);
          "
        >
          <div class="flex items-center" style="gap: 10px; margin-bottom: 6px">
            <Receipt :size="15" style="color: var(--text-muted)" />
            <div style="font-size: var(--text-xs); color: var(--text-muted)">Boleto gerado em</div>
          </div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ titulo.boletoGeradoEm ?? 'Sem boleto gerado' }}
          </div>
        </div>
        <div
          style="
            padding: 16px 18px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-default);
            background: var(--surface-sunken);
          "
        >
          <div class="flex items-center" style="gap: 10px; margin-bottom: 6px">
            <Handshake :size="15" style="color: var(--text-muted)" />
            <div style="font-size: var(--text-xs); color: var(--text-muted)">Status de atuação</div>
          </div>
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong)">
            {{ statusTituloLabel(titulo.status) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detalle-action-item:hover {
  background: var(--surface-sunken);
}
</style>

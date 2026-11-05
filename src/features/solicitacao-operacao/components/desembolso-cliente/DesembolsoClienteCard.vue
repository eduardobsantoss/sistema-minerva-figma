<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  ReceiptText,
  RefreshCw,
  XCircle,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import { brl, fmtDuracao, slaRatio, type Solicitacao } from '../../data/operacaoData';
import {
  documentosDe,
  etapasPara,
  possuiEtapaBmp,
  type AtividadeDesembolso,
  type EtapaDesembolsoKey,
} from '../../data/desembolsoClienteData';
import DesembolsoStepper from './DesembolsoStepper.vue';

const props = defineProps<{
  solicitacao: Solicitacao;
  concluidas: EtapaDesembolsoKey[];
  atividade: AtividadeDesembolso[];
  /** Mostra vínculo, informações básicas, documentos e atividade. Recolhido, ficam só o resumo e o stepper. */
  expandido?: boolean;
}>();

const emit = defineEmits<{
  'update:expandido': [value: boolean];
  concluir: [key: EtapaDesembolsoKey];
  desfazer: [key: EtapaDesembolsoKey];
  baixar: [arquivo: string];
}>();

const atividadeAberta = ref(false);

/** Mesma cor por tipo de contrato usada no card do Kanban. */
function contratoTone(tipo: string): { bg: string; fg: string } {
  const t = tipo.toUpperCase();
  if (t.includes('CDCA')) return { bg: 'var(--success-light)', fg: 'var(--success-dark)' };
  if (t.includes('CPR') || t.includes('NC')) return { bg: 'var(--warning-light)', fg: 'var(--warning-dark)' };
  return { bg: 'var(--surface-sunken)', fg: 'var(--text-default)' };
}

const s = computed(() => props.solicitacao);
const etapas = computed(() => etapasPara(possuiEtapaBmp(s.value)));
const documentos = computed(() => documentosDe(s.value));
const valido = computed(() => s.value.validacao === 'VALIDO');
const atrasado = computed(() => slaRatio(s.value) > 1);
const barColor = computed(() => (atrasado.value ? 'var(--danger-base)' : 'var(--success-base)'));
const ct = computed(() => contratoTone(s.value.tipoContrato));
const ultima = computed(() => props.atividade[0] ?? null);

const proxima = computed(() => etapas.value[props.concluidas.length] ?? null);
const progresso = computed(() => `${props.concluidas.length} de ${etapas.value.length}`);

const timeCols = computed(() => [
  { icon: Clock as Component, label: 'Total', value: fmtDuracao(s.value.tempoTotalHoras), emphasize: false },
  { icon: RefreshCw as Component, label: 'Etapa', value: fmtDuracao(s.value.tempoEtapaHoras), emphasize: atrasado.value },
]);

const meta = computed(() => [
  { label: 'Veículo', value: s.value.veiculo },
  { label: 'Taxa', value: `${s.value.taxa.toFixed(2).replace('.', ',')}%` },
  { label: 'Grupo', value: s.value.grupoEmpresarial || '—' },
  { label: 'Gerente', value: s.value.gerente },
  { label: 'Atendente', value: s.value.atendente || '—' },
]);
</script>

<template>
  <article class="card">
    <!-- Badges: tipo de contrato + validação | etapa atual -->
    <div class="flex items-center justify-between" style="gap: 8px; flex-wrap: wrap">
      <div class="flex items-center" style="gap: 8px">
        <span class="badge-tipo" :style="{ background: ct.bg, color: ct.fg }">{{ s.tipoContrato }}</span>
        <span
          class="chip"
          :style="{
            background: valido ? 'var(--status-success-bg)' : 'var(--status-danger-bg)',
            color: valido ? 'var(--status-success-text)' : 'var(--status-danger-text)',
          }"
        >
          <CheckCircle2 v-if="valido" :size="10" :stroke-width="2.5" />
          <XCircle v-else :size="10" :stroke-width="2.5" />
          {{ valido ? 'VÁLIDO' : 'INVÁLIDO' }}
        </span>
        <span v-if="!possuiEtapaBmp(s)" class="chip" style="background: var(--status-neutral-bg); color: var(--status-neutral-text)">
          SEM BMP
        </span>
      </div>
      <span
        class="chip chip--lg"
        :style="{
          background: proxima ? 'var(--status-active-bg)' : 'var(--status-success-bg)',
          color: proxima ? 'var(--status-active-text)' : 'var(--status-success-text)',
        }"
      >
        <span class="chip-dot" />
        {{ proxima ? `Aguardando · ${proxima.label}` : 'Etapas concluídas' }}
      </span>
    </div>

    <!-- Cedente + valor -->
    <div class="flex items-start justify-between" style="gap: 16px">
      <div style="min-width: 0">
        <h2 class="cedente">{{ s.cedente }}</h2>
        <div class="id">{{ s.id }}</div>
      </div>
      <div class="flex items-center" style="gap: 12px; flex-shrink: 0">
        <div class="valor">{{ brl(s.valor) }}</div>
        <button
          type="button"
          class="toggle"
          :aria-expanded="expandido"
          :aria-label="expandido ? 'Recolher card' : 'Expandir card'"
          :title="expandido ? 'Recolher' : 'Expandir'"
          @click="emit('update:expandido', !expandido)"
        >
          <ChevronDown
            :size="16"
            :style="{ transform: expandido ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base)' }"
          />
        </button>
      </div>
    </div>

    <!-- Stepper (sempre visível) -->
    <div class="stepper-panel">
      <div class="flex items-center justify-between" style="margin-bottom: 14px">
        <span class="eyebrow" style="margin: 0">Esteira de desembolso</span>
        <span class="progress">{{ progresso }} concluídas</span>
      </div>
      <div class="stepper-scroll">
        <DesembolsoStepper
          :etapas="etapas"
          :concluidas="concluidas"
          @concluir="emit('concluir', $event)"
          @desfazer="emit('desfazer', $event)"
        />
      </div>
    </div>

    <template v-if="expandido">
    <!-- Vínculo (pill) -->
    <div class="vinculo" :style="{ color: s.vinculo ? 'var(--text-default)' : 'var(--text-muted)' }">
      <Building2 :size="13" :stroke-width="2" style="flex-shrink: 0; color: var(--text-muted)" />
      <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{ s.vinculo || 'Sem vínculo' }}</span>
    </div>

    <div class="divider" />

    <!-- Informações básicas | tempo -->
    <div class="info-grid">
      <div class="meta">
        <div v-for="item in meta" :key="item.label" style="min-width: 0">
          <div class="eyebrow">{{ item.label }}</div>
          <div class="meta-value">{{ item.value }}</div>
        </div>
      </div>
      <div class="times">
        <div v-for="tc in timeCols" :key="tc.label" class="flex flex-col" style="gap: 5px">
          <div class="eyebrow flex items-center" style="gap: 5px">
            <component :is="tc.icon" :size="11" :stroke-width="2" /> {{ tc.label }}
          </div>
          <div class="time-value" :style="{ color: tc.emphasize ? 'var(--danger-base)' : 'var(--text-strong)' }">{{ tc.value }}</div>
          <div :style="{ height: '3px', borderRadius: '9999px', background: barColor }" />
        </div>
      </div>
    </div>

    <!-- Documentos -->
    <div class="flex items-center" style="gap: 8px; flex-wrap: wrap">
      <span class="eyebrow" style="margin: 0 4px 0 0">Documentos</span>
      <AdminButton
        v-for="doc in documentos"
        :key="doc.key"
        variant="secondary"
        size="compact"
        :icon="doc.key === 'termo' ? FileText : ReceiptText"
        @click="emit('baixar', doc.arquivo)"
      >
        {{ doc.label }}
      </AdminButton>
    </div>

    <!-- Atividade -->
    <div class="atividade">
      <button type="button" class="atividade-toggle" @click="atividadeAberta = !atividadeAberta">
        <ChevronDown
          :size="14"
          :style="{ transform: atividadeAberta ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base)' }"
        />
        Atividade ({{ atividade.length }})
        <span v-if="!atividadeAberta && ultima" class="atividade-preview">{{ ultima.titulo }}</span>
      </button>
      <ul v-if="atividadeAberta" class="atividade-lista">
        <li v-for="item in atividade" :key="item.id">
          <div class="atividade-quando">{{ item.quando }} · {{ item.autor }}</div>
          <div class="atividade-titulo">{{ item.titulo }}</div>
          <div class="atividade-detalhe">{{ item.detalhe }}</div>
        </li>
      </ul>
    </div>
    </template>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 20px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  transition: box-shadow var(--duration-base), border-color var(--duration-base);
}
.card:hover {
  border-color: rgba(8, 60, 74, 0.25);
  box-shadow: 0 12px 28px -14px rgba(8, 60, 74, 0.18);
}
.badge-tipo {
  font-size: 9px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  white-space: nowrap;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 9999px;
  white-space: nowrap;
}
.chip--lg {
  gap: 6px;
  font-size: 10px;
  padding: 4px 10px;
}
.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: currentColor;
}
.cedente {
  margin: 0;
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
  letter-spacing: -0.01em;
  line-height: 1.25;
}
.id {
  margin-top: 2px;
  font-size: 11px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}
.toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--surface-card);
  color: var(--text-muted);
  cursor: pointer;
  outline: none;
  transition: background var(--duration-base) var(--ease-standard), color var(--duration-base) var(--ease-standard);
}
.toggle:hover {
  background: var(--action-secondary-bg-hover);
  color: var(--text-strong);
}
.toggle:focus-visible {
  box-shadow: var(--focus-ring);
}
.valor {
  flex-shrink: 0;
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
}
.vinculo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  background: var(--surface-sunken);
  font-size: 11px;
}
.divider {
  height: 1px;
  background: var(--border-default);
}
.info-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 24px;
  align-items: start;
}
.meta {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px 20px;
}
.times {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.eyebrow {
  margin-bottom: 4px;
  font-size: 9px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.meta-value {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--text-strong);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.time-value {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  font-variant-numeric: tabular-nums;
}
.stepper-panel {
  padding: 16px 16px 12px;
  background: var(--surface-sunken);
  border-radius: var(--radius-lg);
}
.progress {
  font-size: 11px;
  font-weight: var(--weight-semibold);
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}
.stepper-scroll {
  overflow-x: auto;
  padding-bottom: 4px;
}
.atividade {
  border-top: 1px solid var(--border-default);
  padding-top: 10px;
}
.atividade-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  font-size: 11px;
  font-weight: var(--weight-semibold);
  color: var(--text-muted);
}
.atividade-preview {
  font-weight: var(--weight-regular);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}
.atividade-lista {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.atividade-quando {
  font-size: 11px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}
.atividade-titulo {
  margin-top: 2px;
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--text-strong);
}
.atividade-detalhe {
  margin-top: 2px;
  font-size: var(--text-sm);
  color: var(--text-default);
}

@media (max-width: 900px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>

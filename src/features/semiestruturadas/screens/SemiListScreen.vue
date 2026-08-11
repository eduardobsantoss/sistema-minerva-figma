<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, Briefcase, Wallet, Layers, ShieldCheck } from 'lucide-vue-next';
import { brl, num, type SemiOperacao } from '../data/semiestruturadasData';
import SemiCard from '../components/SemiCard.vue';

const props = defineProps<{ operacoes: SemiOperacao[] }>();
const emit = defineEmits<{ open: [id: string] }>();

const q = ref('');
const focus = ref(false);

const filtered = computed(() =>
  props.operacoes.filter(
    (o) =>
      !q.value ||
      o.nome.toLowerCase().includes(q.value.toLowerCase()) ||
      o.cedente.toLowerCase().includes(q.value.toLowerCase()) ||
      o.tipo.toLowerCase().includes(q.value.toLowerCase()) ||
      o.cedenteCnpj.includes(q.value),
  ),
);

const totalNominal = computed(() => props.operacoes.reduce((s, o) => s + o.valorNominal, 0));
const totalComposicao = computed(() => props.operacoes.reduce((s, o) => s + o.valorComposicao, 0));
const totalAberto = computed(() => props.operacoes.reduce((s, o) => s + o.valorAbertoGarantia, 0));

const kpis = computed(() => [
  {
    label: 'Operações',
    value: num(props.operacoes.length),
    icon: Briefcase,
    tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  },
  {
    label: 'Valor Nominal',
    value: brl(totalNominal.value, true),
    icon: Wallet,
    tone: { bg: 'var(--success-light)', fg: 'var(--success-base)' },
  },
  {
    label: 'Valor Composição',
    value: brl(totalComposicao.value, true),
    icon: Layers,
    tone: { bg: 'var(--agro-light)', fg: 'var(--agro-base)' },
  },
  {
    label: 'Valor Aberto Garantia',
    value: brl(totalAberto.value, true),
    icon: ShieldCheck,
    tone: { bg: '#EEF0FF', fg: '#4F46E5' },
  },
]);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <div
        class="relative"
        :style="{
          flex: 1,
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-xl)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: focus ? 'var(--gci-base)' : 'var(--border-default)',
          boxShadow: focus ? '0 0 0 4px rgba(8,60,74,0.06)' : 'var(--shadow-xs)',
          transition: 'border-color var(--duration-base), box-shadow var(--duration-base)',
        }"
      >
        <Search
          :size="18"
          style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: var(--neutral-400)"
        />
        <input
          v-model="q"
          placeholder="Pesquisar por nome, tipo, cedente ou CNPJ..."
          style="
            width: 100%;
            height: 56px;
            border: none;
            outline: none;
            background: transparent;
            padding-left: 52px;
            padding-right: 160px;
            font-size: var(--text-base);
            color: var(--text-strong);
            border-radius: var(--radius-xl);
          "
          @focus="focus = true"
          @blur="focus = false"
        />
        <button
          style="
            position: absolute;
            right: 8px;
            top: 8px;
            bottom: 8px;
            padding: 0 24px;
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            border-radius: var(--radius-lg);
            border: none;
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.10em;
          "
        >
          PESQUISAR
        </button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
      <div
        v-for="k in kpis"
        :key="k.label"
        class="flex items-center"
        style="gap: 14px; padding: 16px; background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl)"
      >
        <div
          class="flex items-center justify-center"
          :style="{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: k.tone.bg, color: k.tone.fg, flexShrink: 0 }"
        >
          <component :is="k.icon" :size="18" :stroke-width="1.75" />
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
            {{ k.label }}
          </div>
          <div style="font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ k.value }}
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!filtered.length"
      style="padding: 60px; text-align: center; color: var(--text-muted); font-size: var(--text-sm); background: var(--surface-card); border-radius: var(--radius-xl); border: 1px solid var(--border-default)"
    >
      Nenhuma operação semiestruturada encontrada.
    </div>

    <div v-else class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px">
      <SemiCard
        v-for="op in filtered"
        :key="op.id"
        :operacao="op"
        @open="emit('open', $event)"
      />
    </div>
  </div>
</template>

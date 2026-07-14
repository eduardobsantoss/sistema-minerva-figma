<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, Plus, Briefcase, Wallet, AlertCircle, FileStack } from 'lucide-vue-next';
import { brl, num, type Cra } from '../data/craData';
import CraCard from '../components/CraCard.vue';

const props = defineProps<{ cras: Cra[] }>();
const emit = defineEmits<{ open: [id: string]; new: [] }>();

const q = ref('');
const focus = ref(false);

const filtered = computed(() =>
  props.cras.filter(
    (c) =>
      !q.value ||
      c.nome.toLowerCase().includes(q.value.toLowerCase()) ||
      c.cnpj.includes(q.value) ||
      c.cessionaria.toLowerCase().includes(q.value.toLowerCase()),
  ),
);

const allOps = computed(() => props.cras.flatMap((c) => c.operacoes));
const totalCarteira = computed(() => allOps.value.reduce((s, o) => s + (o.carteira?.valor ?? 0), 0));
const totalVencido = computed(() => allOps.value.reduce((s, o) => s + (o.vencido?.valor ?? 0), 0));
const totalTitulos = computed(() => allOps.value.reduce((s, o) => s + (o.carteira?.titulos ?? 0), 0));

const kpis = computed(() => [
  {
    label: 'Total de Carteiras',
    value: String(props.cras.length),
    icon: Briefcase,
    tone: { bg: 'var(--gci-light)', fg: 'var(--gci-base)' },
  },
  {
    label: 'Valor em Carteira',
    value: brl(totalCarteira.value, true),
    icon: Wallet,
    tone: { bg: 'var(--success-light)', fg: 'var(--success-base)' },
  },
  {
    label: 'Valor Vencido',
    value: brl(totalVencido.value, true),
    icon: AlertCircle,
    tone: { bg: 'var(--danger-light)', fg: 'var(--danger-base)' },
  },
  {
    label: 'Total de Títulos',
    value: num(totalTitulos.value),
    icon: FileStack,
    tone: { bg: '#EEF0FF', fg: '#4F46E5' },
  },
]);
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <!-- Barra de pesquisa + ação -->
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
          @focus="focus = true"
          @blur="focus = false"
          placeholder="Pesquisar por nome da operação, cessionária ou CNPJ..."
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
      <button
        class="flex items-center btn-animated btn-agro"
        style="
          gap: 8px;
          height: 56px;
          padding: 0 24px;
          background: var(--agro-base);
          color: #fff;
          border-radius: var(--radius-xl);
          border: none;
          cursor: pointer;
          font-weight: var(--weight-bold);
          font-size: var(--text-xs);
          letter-spacing: 0.10em;
          box-shadow: 0 10px 24px -8px rgba(242, 125, 38, 0.4);
        "
        @click="emit('new')"
      >
        <span
          class="flex items-center justify-center"
          style="width: 22px; height: 22px; border-radius: 9999px; background: rgba(255,255,255,0.20)"
        >
          <Plus :size="14" />
        </span>
        NOVO CRA
      </button>
    </div>

    <!-- KPIs -->
    <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 16px">
      <div
        v-for="k in kpis"
        :key="k.label"
        class="flex items-center"
        style="gap: 16px; background: var(--surface-card); border-width: 1px; border-style: solid; border-color: var(--border-default); border-radius: var(--radius-xl); padding: 20px"
      >
        <div
          class="flex items-center justify-center"
          :style="{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: k.tone.bg, color: k.tone.fg, flexShrink: 0 }"
        >
          <component :is="k.icon" :size="22" :stroke-width="1.75" />
        </div>
        <div>
          <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.14em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px">
            {{ k.label }}
          </div>
          <div style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); font-variant-numeric: tabular-nums">
            {{ k.value }}
          </div>
        </div>
      </div>
    </div>

    <!-- Grid de cards -->
    <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px">
      <CraCard v-for="c in filtered" :key="c.id" :cra="c" @open="emit('open', $event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ArrowLeft } from 'lucide-vue-next';
import TitulosCessaoPanel from '../components/TitulosCessaoPanel.vue';
import {
  CARTORIO_LABEL,
  brl,
  cessaoPorId,
  composicaoTexto,
  corCartorio,
  formatDateBR,
  grupoPorId,
  toneOf,
  veiculoPorId,
} from '../data/gerencialData';

const props = defineProps<{ grupoId: string; cessaoId: string }>();
const emit = defineEmits<{ back: [] }>();

const cessao = computed(() => cessaoPorId(props.cessaoId));
const grupo = computed(() => grupoPorId(props.grupoId));
</script>

<template>
  <div class="flex flex-col" style="gap: 24px">
    <div class="flex items-center" style="gap: 16px">
      <button
        type="button"
        aria-label="Voltar"
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-card); border: 1px solid var(--border-default); cursor: pointer; color: var(--text-strong); flex-shrink: 0"
        @click="emit('back')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <div style="font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.18em; color: var(--accent); text-transform: uppercase; margin-bottom: 4px">
          Pós desembolso · {{ grupo?.nome }}
        </div>
        <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; line-height: 1.2">
          {{ cessao?.nome ?? 'Cessão' }}
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
          {{ veiculoPorId(cessao?.veiculoId ?? '')?.nome }}
          · {{ cessao ? formatDateBR(cessao.data) : '' }}
          · {{ cessao?.tipoCessao }}
        </p>
      </div>
    </div>

    <div v-if="cessao" class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px">
      <div class="ger-stat">
        <dt>Composição</dt>
        <dd v-if="cessao.descontoDuplicata">DESC. DUPLICATA</dd>
        <template v-else>
          <dd>{{ composicaoTexto(cessao.composicaoCodigo) }}</dd>
          <div v-if="cessao.composicaoCodigo === 1 || cessao.composicaoCodigo === 2" class="ger-hint">
            Aberto {{ brl(cessao.valorAberto) }} · excedente {{ brl(cessao.excedenteGarantia) }}
          </div>
        </template>
      </div>
      <div class="ger-stat">
        <dt>Registro cartório</dt>
        <dd v-if="!cessao.temGarantia">Sem garantia</dd>
        <dd v-else-if="cessao.registroCartorio">
          <span class="ger-pill" :style="toneOf(corCartorio(cessao.registroCartorio))">{{ CARTORIO_LABEL[cessao.registroCartorio] }}</span>
        </dd>
        <dd v-else>Sem garantia</dd>
      </div>
      <div class="ger-stat">
        <dt>Registro B3</dt>
        <dd v-if="!cessao.temGarantia">Sem garantia</dd>
        <dd v-else>
          <span class="ger-pill" :style="toneOf(cessao.registroB3 ? 'ok' : 'bad')">
            {{ cessao.registroB3 ? 'Registrado na B3' : 'Sem registro B3' }}
          </span>
        </dd>
      </div>
    </div>

    <TitulosCessaoPanel
      v-if="cessao"
      :cessao="cessao"
      :veiculo-nome="veiculoPorId(cessao.veiculoId)?.nome ?? ''"
      somente-leitura
      embutido
    />
  </div>
</template>

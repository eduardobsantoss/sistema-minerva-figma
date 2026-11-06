<script setup lang="ts">
import { ref } from 'vue';
import { Ban } from 'lucide-vue-next';
import {
  SEVERIDADE_LABEL,
  TIPO_ALERTA_LABEL,
  formatDateBR,
  type LinhaMonitorada,
  type Severidade,
} from '../data/sentinelaData';
import { brl } from '@/features/risco/data/riscoData';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

defineProps<{
  linhas: LinhaMonitorada[];
  bloqueadas: string[];
  tratadas: string[];
}>();

const emit = defineEmits<{
  close: [];
  registrar: [];
  bloquear: [];
}>();

const menuOpen = ref(false);

function chipStyle(severidade: Severidade) {
  if (severidade === 'critico') return { background: 'var(--status-danger-bg)', color: 'var(--status-danger-text)' };
  if (severidade === 'atencao') return { background: 'var(--status-warning-bg)', color: 'var(--status-warning-text)' };
  return { background: 'var(--status-success-bg)', color: 'var(--status-success-text)' };
}
</script>

<template>
  <AdminModal size="md" eyebrow="Sentinela" :title="linhas.length === 1 ? linhas[0].entidade.nome : `${linhas.length} entidades`" @close="emit('close')">
    <div>
      <article
        v-for="linha in linhas"
        :key="linha.entidade.id"
        style="border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: 14px; margin-bottom: 12px"
      >
        <div class="flex items-center justify-between" style="gap: 8px">
          <div style="font-weight: var(--weight-bold); color: var(--text-strong)">{{ linha.entidade.nome }}</div>
          <span :style="{ ...chipStyle(linha.severidade), fontSize: '10px', fontWeight: 'var(--weight-bold)', padding: '3px 8px', borderRadius: 'var(--radius-full)' }">
            {{ SEVERIDADE_LABEL[linha.severidade] }}
          </span>
        </div>
        <p v-if="tratadas.includes(linha.entidade.id)" style="margin: 8px 0 0; font-size: var(--text-xs); color: var(--status-success-text)">
          Tratativa registrada nesta sessão.
        </p>
        <p v-if="bloqueadas.includes(linha.entidade.id)" style="margin: 8px 0 0; font-size: var(--text-xs); color: var(--status-danger-text)">
          Novas operações bloqueadas nesta sessão.
        </p>
        <p v-if="linha.alertas.length === 0" style="margin: 10px 0 0; font-size: var(--text-sm); color: var(--text-muted)">
          Nenhum alerta aberto. Ação sugerida: manter monitoramento.
        </p>
        <section v-for="alerta in linha.alertas" :key="alerta.id" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-default)">
          <div class="flex items-center" style="gap: 8px; flex-wrap: wrap">
            <span :style="{ ...chipStyle(alerta.severidade), fontSize: '10px', fontWeight: 'var(--weight-bold)', padding: '3px 8px', borderRadius: 'var(--radius-full)' }">
              {{ TIPO_ALERTA_LABEL[alerta.tipo] }}
            </span>
            <span style="font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums">
              {{ brl(alerta.exposicao) }} · prazo {{ formatDateBR(alerta.prazo) }}
            </span>
          </div>
          <dl style="margin-top: 10px">
            <div style="margin-bottom: 8px">
              <dt style="font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); font-weight: var(--weight-bold)">O que disparou</dt>
              <dd style="margin: 2px 0 0; font-size: var(--text-sm); color: var(--text-default)">{{ alerta.disparo }}</dd>
            </div>
            <div style="margin-bottom: 8px">
              <dt style="font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); font-weight: var(--weight-bold)">Plano de ação</dt>
              <dd style="margin: 2px 0 0; font-size: var(--text-sm); color: var(--text-default)">{{ alerta.plano }}</dd>
            </div>
            <div style="margin-bottom: 8px">
              <dt style="font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); font-weight: var(--weight-bold)">Responsável</dt>
              <dd style="margin: 2px 0 0; font-size: var(--text-sm); color: var(--text-default)">{{ alerta.responsavel }}</dd>
            </div>
            <div>
              <dt style="font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); font-weight: var(--weight-bold)">Notas</dt>
              <dd style="margin: 2px 0 0; font-size: var(--text-sm); color: var(--text-default)">{{ alerta.notas }}</dd>
            </div>
          </dl>
          <div style="margin-top: 8px; font-size: var(--text-xs); color: var(--text-strong); font-weight: var(--weight-semibold)">
            Ação sugerida: {{ alerta.acaoSugerida }}
          </div>
        </section>
      </article>
    </div>

    <template #footer>
      <div v-if="linhas.length === 1" style="position: relative">
        <AdminButton variant="secondary" size="large" @click="menuOpen = !menuOpen" type="button">Mais ações</AdminButton>
        <div
          v-if="menuOpen"
          style="position: absolute; bottom: calc(100% + 8px); left: 0; min-width: 260px; background: var(--surface-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 6px; z-index: 2"
        >
          <button
            type="button"
            class="sn-focus flex items-center"
            :disabled="bloqueadas.includes(linhas[0].entidade.id)"
            style="gap: 10px; width: 100%; text-align: left; padding: 10px 12px; background: none; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--action-danger-text-only)"
            @click="menuOpen = false; emit('bloquear')"
          >
            <Ban :size="16" />
            Bloquear novas operações
          </button>
        </div>
      </div>
      <span v-else />
      <AdminButton variant="primary" size="large" @click="emit('registrar')" type="button">Registrar tratativa</AdminButton>
    </template>
  </AdminModal>
</template>

<style scoped>
.sn-focus:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}

button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Download, Eye, FileText, X } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';
import type { Titulo } from '../../data/titulosData';
import Section from './Section.vue';

const props = defineProps<{ titulo: Titulo }>();

interface ConfirmacaoItem {
  tipo: string;
  data: string;
  hora: string;
  observacoes: string;
  registradoPor: string;
  resultado: string;
  evidencia?: string;
}

const docRef = computed(() => props.titulo.lastro.replace(/\D/g, '').slice(-6) || props.titulo.numero.slice(-6));

const items = computed<ConfirmacaoItem[]>(() => {
  const sacadoResultado =
    props.titulo.statusConfirmacao === 'CONFIRMADO' ? 'CONFIRMADO' : props.titulo.statusConfirmacao;
  const registroResultado =
    props.titulo.situacaoTitulo === 'VALIDADO' || props.titulo.situacaoTitulo === 'EM_CARTEIRA'
      ? 'CONFIRMADO'
      : 'PENDENTE';

  return [
    {
      tipo: 'Confirmação do Sacado',
      data: props.titulo.emissao,
      hora: '14:32',
      observacoes: `Via portal eletrônico, Documento ${docRef.value} verificado`,
      registradoPor: 'João Beneli',
      resultado: sacadoResultado,
      evidencia: sacadoResultado === 'CONFIRMADO' ? `portal-confirmacao-${props.titulo.numero}.pdf` : undefined,
    },
    {
      tipo: 'Validação de Lastro',
      data: props.titulo.emissao,
      hora: '11:08',
      observacoes: `Via portal eletrônico, Documento ${docRef.value} verificado`,
      registradoPor: 'Marcos Damasceno',
      resultado: props.titulo.situacaoTitulo === 'PENDENTE' ? 'PENDENTE' : 'CONFIRMADO',
      evidencia: `lastro-${props.titulo.lastro}.pdf`,
    },
    {
      tipo: 'Registro Registradora',
      data: props.titulo.emissao,
      hora: '09:45',
      observacoes: `B3 — protocolo #${props.titulo.numero.replace(/\D/g, '').slice(-5)} registrado`,
      registradoPor: 'Sistema B3',
      resultado: registroResultado,
      evidencia: registroResultado === 'CONFIRMADO' ? `registro-b3-${props.titulo.numero}.pdf` : undefined,
    },
  ];
});

const toneMap: Record<string, { bg: string; fg: string }> = {
  CONFIRMADO: { bg: 'var(--success-light)', fg: 'var(--success-dark)' },
  PENDENTE: { bg: 'var(--warning-light)', fg: 'var(--warning-base)' },
  REJEITADO: { bg: 'var(--danger-light)', fg: 'var(--danger-dark)' },
};

function tone(resultado: string) {
  return toneMap[resultado] ?? toneMap.PENDENTE;
}

const evidenciaAberta = ref<ConfirmacaoItem | null>(null);
const { success } = useToast();

function abrirEvidencia(item: ConfirmacaoItem) {
  if (!item.evidencia) return;
  evidenciaAberta.value = item;
}

function baixarEvidencia() {
  const nome = evidenciaAberta.value?.evidencia;
  if (!nome) return;
  success(`Download iniciado: ${nome}`);
}
</script>

<template>
  <Section title="Histórico de Confirmações">
    <div class="flex flex-col" style="gap: 10px">
      <div v-for="(c, i) in items" :key="i" class="conf-row">
        <div class="conf-main">
          <div style="font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ c.tipo }}
          </div>
          <p class="conf-obs">{{ c.observacoes }}</p>
          <div class="conf-meta">
            <span>{{ c.data }}</span>
            <span class="conf-dot" aria-hidden="true">·</span>
            <span>{{ c.hora }}</span>
            <span class="conf-dot" aria-hidden="true">·</span>
            <span>{{ c.registradoPor }}</span>
          </div>
        </div>

        <div class="conf-aside">
          <span
            class="conf-status"
            :style="{
              background: tone(c.resultado).bg,
              color: tone(c.resultado).fg,
            }"
          >
            {{ c.resultado }}
          </span>
          <button
            v-if="c.evidencia"
            type="button"
            class="conf-ev-btn"
            @click="abrirEvidencia(c)"
          >
            <Eye :size="14" />
            Ver evidência
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="evidenciaAberta?.evidencia"
      class="conf-ev-overlay"
      @click.self="evidenciaAberta = null"
    >
      <div class="conf-ev-dialog" role="dialog" aria-labelledby="evidencia-titulo">
        <div class="flex items-start justify-between" style="gap: 12px">
          <div class="flex items-center" style="gap: 10px; min-width: 0">
            <div class="conf-ev-icon">
              <FileText :size="20" />
            </div>
            <div style="min-width: 0">
              <h3 id="evidencia-titulo" class="conf-ev-title">{{ evidenciaAberta.evidencia }}</h3>
              <p class="conf-ev-sub">
                {{ evidenciaAberta.tipo }} · {{ evidenciaAberta.data }} às {{ evidenciaAberta.hora }}
              </p>
            </div>
          </div>
          <button type="button" class="conf-ev-close" aria-label="Fechar" @click="evidenciaAberta = null">
            <X :size="18" />
          </button>
        </div>

        <p class="conf-ev-obs">{{ evidenciaAberta.observacoes }}</p>
        <p class="conf-ev-by">Registrado por {{ evidenciaAberta.registradoPor }}</p>

        <div class="conf-ev-preview">
          <FileText :size="32" style="color: var(--text-muted); opacity: 0.5" />
          <span>Pré-visualização da evidência (mock)</span>
        </div>

        <div class="conf-ev-actions">
          <button type="button" class="conf-ev-secondary" @click="evidenciaAberta = null">Fechar</button>
          <button type="button" class="conf-ev-primary" @click="baixarEvidencia">
            <Download :size="15" />
            Baixar
          </button>
        </div>
      </div>
    </div>
  </Section>
</template>

<style scoped>
.conf-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  background: var(--surface-sunken);
  border-radius: var(--radius-lg);
}
.conf-main {
  flex: 1;
  min-width: 0;
}
.conf-obs {
  margin: 6px 0 0;
  font-size: var(--text-sm);
  color: var(--text-default);
  line-height: 1.45;
}
.conf-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: var(--text-xs);
  color: var(--text-muted);
}
.conf-dot {
  opacity: 0.65;
}
.conf-aside {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.conf-status {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  padding: 5px 10px;
  border-radius: 9999px;
  white-space: nowrap;
}
.conf-ev-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  background: var(--surface-card);
  color: var(--text-strong);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  white-space: nowrap;
  transition: background var(--duration-fast) var(--ease-standard);
}
.conf-ev-btn:hover {
  background: var(--surface-sunken);
}
.conf-ev-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(8, 60, 74, 0.55);
  backdrop-filter: blur(8px);
}
.conf-ev-dialog {
  width: 100%;
  max-width: 520px;
  background: var(--surface-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: 22px 24px;
}
.conf-ev-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-bg);
  color: var(--accent);
  flex-shrink: 0;
}
.conf-ev-title {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
  word-break: break-all;
}
.conf-ev-sub {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-top: 2px;
}
.conf-ev-close {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--radius-lg);
  background: var(--surface-sunken);
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.conf-ev-obs {
  margin: 16px 0 4px;
  font-size: var(--text-sm);
  color: var(--text-default);
  line-height: 1.45;
}
.conf-ev-by {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin: 0 0 16px;
}
.conf-ev-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 140px;
  border: 1px dashed var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--surface-sunken);
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-bottom: 16px;
}
.conf-ev-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.conf-ev-secondary,
.conf-ev-primary {
  height: 40px;
  padding: 0 16px;
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.conf-ev-secondary {
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  color: var(--text-strong);
}
.conf-ev-primary {
  background: var(--action-primary-bg);
  color: var(--action-primary-text);
  border: none;
}
</style>

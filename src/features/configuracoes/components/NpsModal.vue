<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowLeft } from 'lucide-vue-next';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

export interface NpsSubmitPayload {
  nota: number;
  justificativa: string;
}

const emit = defineEmits<{
  close: [];
  submit: [payload: NpsSubmitPayload];
}>();

const MAX_JUSTIFICATIVA = 500;
const NOTAS = Array.from({ length: 11 }, (_, i) => i);

type Faixa = 'baixa' | 'media' | 'alta';

interface FaixaInfo {
  pergunta: string;
  placeholder: string;
}

const FAIXAS: Record<Faixa, FaixaInfo> = {
  baixa: {
    pergunta: 'O que está dificultando o seu uso do sistema?',
    placeholder: 'Conte quais telas ou fluxos são difíceis, confusos ou lentos…',
  },
  media: {
    pergunta: 'O que poderia deixar o sistema mais fácil de usar?',
    placeholder: 'Conte o que poderia ser melhorado na sua rotina de trabalho…',
  },
  alta: {
    pergunta: 'O que mais facilita o seu uso do sistema?',
    placeholder: 'Conte o que funciona bem e deve ser mantido…',
  },
};

function faixaDe(nota: number): Faixa {
  if (nota <= 6) return 'baixa';
  if (nota <= 8) return 'media';
  return 'alta';
}

/** Degradê vermelho → verde por nota (hover e seleção), com cor de texto definida por contraste. */
const CORES_NOTA: { bg: string; fg: string }[] = [
  { bg: '#C52026', fg: '#fff' }, // 0
  { bg: '#D42027', fg: '#fff' }, // 1
  { bg: '#F26522', fg: '#fff' }, // 2
  { bg: '#F7931E', fg: '#000' }, // 3
  { bg: '#FBB040', fg: '#000' }, // 4
  { bg: '#FFCC00', fg: '#000' }, // 5
  { bg: '#CDDC39', fg: '#000' }, // 6
  { bg: '#8BC34A', fg: '#000' }, // 7
  { bg: '#4CAF50', fg: '#fff' }, // 8
  { bg: '#2E7D32', fg: '#fff' }, // 9
  { bg: '#1B5E20', fg: '#fff' }, // 10
];

function notaVars(valor: number) {
  return { '--nota-bg': CORES_NOTA[valor].bg, '--nota-fg': CORES_NOTA[valor].fg };
}

const step = ref<1 | 2>(1);
const nota = ref<number | null>(null);
const justificativa = ref('');
const tentouEnviar = ref(false);

const faixa = computed(() => (nota.value === null ? null : FAIXAS[faixaDe(nota.value)]));
const justificativaVazia = computed(() => justificativa.value.trim().length === 0);
const mostrarErro = computed(() => tentouEnviar.value && justificativaVazia.value);

function selecionar(valor: number) {
  nota.value = valor;
}

function continuar() {
  if (nota.value === null) return;
  step.value = 2;
}

function voltar() {
  step.value = 1;
  tentouEnviar.value = false;
}

function enviar() {
  tentouEnviar.value = true;
  if (nota.value === null || justificativaVazia.value) return;
  emit('submit', { nota: nota.value, justificativa: justificativa.value.trim() });
}
</script>

<template>
  <AdminModal size="sm" eyebrow="Configurações" :title="step === 1 ? 'Como está a usabilidade do sistema?' : (faixa?.pergunta ?? '')" subtitle="Em uma escala de 0 a 10, como você avalia a facilidade de uso do Minerva no seu dia a dia de trabalho?" @close="emit('close')">
    <div v-if="step === 1" style="padding: 24px 28px; overflow-y: auto">
      <div class="notas" role="radiogroup" aria-label="Nota de 0 a 10">
        <AdminButton variant="secondary" size="large" v-for="valor in NOTAS" :key="valor" type="button" @click="selecionar(valor)">{{ valor }}</AdminButton>
      </div>
      <div class="flex items-center justify-between" style="margin-top: 10px">
        <span class="hint">0 · Muito difícil de usar</span>
        <span class="hint">10 · Muito fácil de usar</span>
      </div>
    </div>
    <div v-else style="padding: 24px 28px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px">
      <div class="flex items-center" style="gap: 10px">
        <span class="hint">Nota atribuída: <strong style="color: var(--text-strong)">{{ nota }}</strong></span>
        <button type="button" class="link" @click="voltar">
          <ArrowLeft :size="14" /> Alterar nota
        </button>
      </div>

      <label class="field">
        <span class="label">Justifique a nota atribuída</span>
        <textarea
          v-model="justificativa"
          class="input"
          rows="5"
          :maxlength="MAX_JUSTIFICATIVA"
          :placeholder="faixa?.placeholder"
          :aria-invalid="mostrarErro"
          :style="mostrarErro ? { borderColor: 'var(--danger-base)' } : undefined"
        />
        <div class="flex items-center justify-between">
          <span v-if="mostrarErro" style="font-size: var(--text-xs); color: var(--danger-base)">
            A justificativa é obrigatória.
          </span>
          <span v-else />
          <span class="hint">{{ justificativa.length }}/{{ MAX_JUSTIFICATIVA }}</span>
        </div>
      </label>
    </div>

    <template #footer>
      <AdminButton variant="ghost" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
      <div class="flex items-center" style="gap: 12px">
        <AdminButton variant="primary" size="large" v-if="step === 1" :disabled="nota === null" @click="continuar" type="button">Continuar</AdminButton>
        <AdminButton variant="primary" size="large" v-else @click="enviar" type="button">Enviar avaliação</AdminButton>

      </div>
    </template>
  </AdminModal>
</template>

<style scoped>
.eyebrow {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--accent);
  font-weight: var(--weight-bold);
}
.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  background: var(--surface-sunken);
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.notas {
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  gap: 6px;
}
.nota {
  height: 44px;
  min-width: 0;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  color: var(--text-strong);
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
  cursor: pointer;
  transition:
    background var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard);
}
.nota:hover,
.nota[aria-checked='true'] {
  background: var(--nota-bg);
  border-color: var(--nota-bg);
  color: var(--nota-fg);
}
.nota[aria-checked='true'] {
  box-shadow: 0 0 0 3px var(--surface-card), 0 0 0 5px var(--nota-bg);
}
.hint {
  font-size: var(--text-xs);
  color: var(--text-muted);
}
.link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--gci-base);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
}
.link:hover {
  text-decoration: underline;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.input {
  width: 100%;
  padding: 12px 14px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  font-family: inherit;
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--text-strong);
  resize: vertical;
}
.secondary,
.primary {
  height: 40px;
  padding: 0 18px;
  border-radius: var(--radius-lg);
  font-weight: var(--weight-bold);
  font-size: var(--text-sm);
  cursor: pointer;
}
.secondary {
  background: var(--surface-card);
  color: var(--text-strong);
  border: 1px solid var(--border-default);
}
.primary {
  background: var(--action-primary-bg);
  color: var(--action-primary-text);
  border: none;
}
.primary:hover:not(:disabled) {
  background: var(--action-primary-bg-hover);
}
.primary:disabled {
  background: var(--neutral-200);
  color: var(--text-disabled);
  cursor: not-allowed;
}
button:focus-visible,
textarea:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
textarea:focus {
  border-color: var(--border-focus);
}

@media (max-width: 520px) {
  .notas {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>

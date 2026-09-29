<script setup lang="ts">
import { computed, ref } from 'vue';
import { X } from 'lucide-vue-next';

const emit = defineEmits<{ close: [] }>();

type Alvo = 'titulo' | 'notificacao';

const alvo = ref<Alvo | null>(null);
const situacao = ref('');

const opcoes = [
  { key: 'titulo' as const, label: 'Alterar situação do título' },
  { key: 'notificacao' as const, label: 'Alterar situação de notificação' },
];

const situacoesTitulo = [
  'PENDENTE',
  'VALIDADO',
  'REJEITADO',
  'EM CARTEIRA',
  'BAIXA PARCIAL',
  'LIQUIDADO',
  'TEMPORARIO',
  'BAIXA POR SUBSTITUIÇÃO',
  'BAIXA MANUAL',
  'ANÁLISE DOCUMENTAL',
  'BAIXA POR EXCLUSÃO',
];

const situacoesNotificacao = [
  'PENDENTE',
  'NOTIFICADO EMAIL',
  'NOTIFICADO SMS',
  'NOTIFICADO AR',
  'NOTIFICADO PESSOALMENTE',
  'ISENTO',
  'EMAIL ENVIADO',
  'EMAIL REJEITADO',
  'EMAIL ABERTO',
];

const lista = computed(() => (alvo.value === 'notificacao' ? situacoesNotificacao : situacoesTitulo));
const titulo = computed(() =>
  alvo.value === 'notificacao' ? 'Alterar situação de notificação' : alvo.value === 'titulo' ? 'Alterar situação do título' : 'Alterar situação',
);
const subtitulo = computed(() => {
  if (alvo.value === 'notificacao') return 'Selecione a nova situação de notificação';
  if (alvo.value === 'titulo') return 'Selecione a nova situação do título';
  return 'Escolha a situação que deseja alterar';
});

function escolher(key: Alvo) {
  alvo.value = key;
  situacao.value = '';
}

function voltar() {
  alvo.value = null;
  situacao.value = '';
}
</script>

<template>
  <div
    class="flex items-center justify-center"
    style="position: fixed; inset: 0; z-index: 500; background: rgba(8, 60, 74, 0.55); backdrop-filter: blur(8px); padding: 32px"
  >
    <div
      style="width: 100%; max-width: 480px; background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); overflow: hidden"
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            {{ titulo }}
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            {{ subtitulo }}
          </p>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted); flex-shrink: 0"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <template v-if="!alvo">
        <div class="flex flex-col" style="gap: 8px; padding: 24px 28px 20px">
          <button
            v-for="opcao in opcoes"
            :key="opcao.key"
            type="button"
            class="lote-choice"
            @click="escolher(opcao.key)"
          >
            {{ opcao.label }}
          </button>
        </div>

        <div class="flex items-center justify-end" style="padding: 0 22px 20px">
          <button type="button" class="lote-secondary" @click="emit('close')">Cancelar</button>
        </div>
      </template>

      <template v-else>
        <div style="padding: 20px 22px">
          <label class="lote-field">
            <span class="lote-label">Nova situação</span>
            <select v-model="situacao" class="lote-input" :data-empty="situacao === ''">
              <option value="" disabled>Selecione nova situação</option>
              <option v-for="item in lista" :key="item" :value="item">{{ item }}</option>
            </select>
          </label>
        </div>

        <div class="flex items-center justify-end" style="gap: 10px; padding: 0 22px 20px">
          <button type="button" class="lote-secondary" @click="voltar">Cancelar</button>
          <button type="button" class="lote-primary" :disabled="!situacao" @click="situacao && emit('close')">
            Salvar
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.lote-choice,
.lote-secondary {
  height: 40px;
  border-radius: var(--radius-lg);
  font-weight: var(--weight-bold);
  font-size: var(--text-sm);
  cursor: pointer;
}
.lote-choice {
  width: 100%;
  padding: 0 14px;
  background: var(--action-secondary-bg);
  color: var(--action-secondary-text);
  border: 1px solid var(--action-secondary-border);
  text-align: left;
}
.lote-choice:hover {
  background: var(--action-secondary-bg-hover);
}
.lote-secondary {
  padding: 0 18px;
  background: var(--surface-card);
  color: var(--text-strong);
  border: 1px solid var(--border-default);
}
.lote-primary {
  height: 40px;
  padding: 0 18px;
  border: none;
  border-radius: var(--radius-lg);
  background: var(--action-primary-bg);
  color: var(--action-primary-text);
  font-weight: var(--weight-bold);
  font-size: var(--text-sm);
  cursor: pointer;
}
.lote-primary:disabled {
  background: var(--neutral-200);
  color: var(--text-disabled);
  cursor: not-allowed;
}
.lote-primary:not(:disabled):hover {
  background: var(--action-primary-bg-hover);
}
.lote-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.lote-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.14em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.lote-input {
  width: 100%;
  height: 40px;
  padding: 0 14px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  color: var(--text-strong);
}
.lote-input[data-empty='true'] {
  color: var(--text-muted);
}
button:focus-visible,
select:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>

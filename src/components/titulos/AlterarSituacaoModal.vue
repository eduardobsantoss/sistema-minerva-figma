<script setup lang="ts">
import { computed, ref } from 'vue';

import AdminSelect from '@/components/ui/AdminSelect.vue';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const props = withDefaults(defineProps<{ quantidade?: number }>(), { quantidade: 1 });
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

const rotuloConfirmar = computed(() => {
  if (alvo.value === 'notificacao') {
    return props.quantidade === 1
      ? 'Alterar situação de notificação'
      : 'Alterar situações de notificação';
  }
  return props.quantidade === 1 ? 'Alterar situação do título' : 'Alterar situação dos títulos';
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
  <AdminModal size="sm" eyebrow="Títulos" :title="titulo" :subtitle="subtitulo" :footer-align="alvo ? 'between' : 'end'" @close="emit('close')">
    <div v-if="!alvo" class="flex flex-col" style="gap: 8px">
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
    <label v-else class="lote-field">
      <span class="lote-label">Nova situação</span>
      <AdminSelect v-model="situacao" placeholder="Selecione nova situação" :options="[...lista.map((item) => ({ value: item, label: item }))]" />
    </label>

    <template #footer>
      <AdminButton v-if="!alvo" variant="secondary" size="large" @click="emit('close')">Cancelar</AdminButton>
      <template v-else>
        <AdminButton variant="ghost" size="large" @click="voltar">Cancelar</AdminButton>
        <AdminButton size="large" :disabled="!situacao" @click="situacao && emit('close')">{{ rotuloConfirmar }}</AdminButton>
      </template>
    </template>
  </AdminModal>
</template>

<style scoped>
.lote-choice {
  height: 40px;
  border-radius: var(--radius-lg);
  font-weight: var(--weight-bold);
  font-size: var(--text-sm);
  cursor: pointer;
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
.lote-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.lote-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-transform: uppercase;
}
button:focus-visible,
select:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>

<script setup lang="ts">
import { ref, type Component } from 'vue';
import { FileDown, FilePlus, FileX, RefreshCw } from 'lucide-vue-next';
import Alert from '@/components/feedback/Alert.vue';
import type { TituloSelecionado } from './types';
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

const props = defineProps<{ titulos: TituloSelecionado[] }>();

export type AcaoCerc = 'registrar' | 'atualizar' | 'baixa-registro' | 'desregistro';

const emit = defineEmits<{
  close: [];
  prosseguir: [acao: AcaoCerc, elegiveis: TituloSelecionado[], fora: TituloSelecionado[]];
}>();

const opcoes: { key: AcaoCerc; label: string; icon: Component; regra: string }[] = [
  {
    key: 'registrar',
    label: 'Registrar títulos',
    icon: FilePlus,
    regra:
      'Para registrar na CERC, todos os títulos precisam estar com registro Pendente ou Erro no processamento e situação Validado ou Em carteira.',
  },
  {
    key: 'atualizar',
    label: 'Atualizar registros',
    icon: RefreshCw,
    regra:
      'Para atualizar na CERC, todos os títulos precisam estar com registro Processando, Processando o desregistro ou Processando a conclusão.',
  },
  {
    key: 'baixa-registro',
    label: 'Baixar registro dos títulos',
    icon: FileDown,
    regra:
      'Para baixar na CERC, todos os títulos precisam estar com registro Registrado ou Erro no processamento.',
  },
  {
    key: 'desregistro',
    label: 'Desregistrar títulos',
    icon: FileX,
    regra:
      'Para desregistrar na CERC, todos os títulos precisam estar com registro Registrado ou Erro no processamento.',
  },
];

const bloqueada = ref<AcaoCerc | null>(null);

function atende(titulo: TituloSelecionado, acao: AcaoCerc) {
  if (!titulo.registro) return true;
  const registro = titulo.registro;
  const situacao = (titulo.situacao ?? '').toLowerCase();
  if (acao === 'registrar') {
    const registroOk = registro === 'Pendente' || registro === 'Erro no processamento';
    const situacaoOk = situacao === 'validado' || situacao === 'em carteira';
    return registroOk && situacaoOk;
  }
  if (acao === 'atualizar') {
    return (
      registro === 'Processando' ||
      registro === 'Processando o desregistro' ||
      registro === 'Processando a conclusão'
    );
  }
  return registro === 'Registrado' || registro === 'Erro no processamento';
}

function classificar(acao: AcaoCerc) {
  const elegiveis: TituloSelecionado[] = [];
  const fora: TituloSelecionado[] = [];
  for (const titulo of props.titulos) {
    if (atende(titulo, acao)) elegiveis.push(titulo);
    else fora.push(titulo);
  }
  return { elegiveis, fora };
}

function mensagem(acao: AcaoCerc) {
  const opcao = opcoes.find((item) => item.key === acao);
  const { fora } = classificar(acao);
  const lastros = fora.map((titulo) => titulo.lastro || titulo.numero).join(', ');
  return `${opcao?.regra ?? ''} Lastros fora da regra: ${lastros}.`;
}

function escolher(acao: AcaoCerc) {
  const { elegiveis, fora } = classificar(acao);
  if (elegiveis.length === 0) {
    bloqueada.value = acao;
    return;
  }
  emit('prosseguir', acao, elegiveis, fora);
}
</script>

<template>
  <AdminModal size="sm" eyebrow="Títulos" title="Ações CERC" subtitle="Selecione a ação de registro na CERC" footer-align="end" @close="emit('close')">
    <div class="flex flex-col" style="gap: 12px">
      <div v-for="opcao in opcoes" :key="opcao.key" class="flex flex-col" style="gap: 8px">
        <button type="button" class="lote-choice" @click="escolher(opcao.key)">
          <component :is="opcao.icon" :size="16" />
          {{ opcao.label }}
        </button>
        <Alert
          v-if="bloqueada === opcao.key"
          type="error"
          title="Nenhum título elegível"
          :message="mensagem(opcao.key)"
          :dismissible="false"
        />
      </div>
    </div>

    <template #footer>
      <AdminButton variant="secondary" size="large" @click="emit('close')" type="button">Cancelar</AdminButton>
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
}
.lote-choice {
  display: flex;
  align-items: center;
  gap: 10px;
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
button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>

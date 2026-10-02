<script setup lang="ts">
import { ref, type Component } from 'vue';
import { FileDown, FilePlus, FileX, RefreshCw, X } from 'lucide-vue-next';
import Alert from '@/components/feedback/Alert.vue';
import type { TituloSelecionado } from './types';

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
  <div
    class="flex items-center justify-center"
    style="position: fixed; inset: 0; z-index: 500; background: rgba(8, 60, 74, 0.55); backdrop-filter: blur(8px); padding: 32px"
  >
    <div
      style="width: 100%; max-width: 560px; background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); overflow: hidden"
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Ações CERC
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Selecione a ação de registro na CERC
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

      <div class="flex flex-col" style="gap: 12px; padding: 24px 28px">
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

      <div class="lote-footer lote-footer--single">
        <button type="button" class="lote-secondary" @click="emit('close')">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lote-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 0 28px 24px;
}
.lote-footer--single {
  justify-content: flex-start;
}
.lote-choice,
.lote-secondary {
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
.lote-secondary {
  padding: 0 18px;
  background: var(--surface-card);
  color: var(--text-strong);
  border: 1px solid var(--border-default);
}
button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>

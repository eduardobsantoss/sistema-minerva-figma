<script setup lang="ts">
import { ref } from 'vue';
import { X, Building2, Handshake } from 'lucide-vue-next';
import type { Component } from 'vue';
import type { Solicitacao } from '../../data/operacaoData';
import {
  CREDORA_PADRAO_OPTS_NC_CCB,
  CREDORAS_PADRAO,
  emptyPessoaMinuta,
  type PessoaMinuta,
} from '../../data/minutaData';
import MinutaStepper from './minuta/MinutaStepper.vue';
import CredoraStep from './minuta/CredoraStep.vue';
import EndossatarioStep from './minuta/EndossatarioStep.vue';

defineProps<{ solicitacao: Solicitacao }>();
const emit = defineEmits<{ close: []; confirm: [] }>();

const STEPS: { key: string; label: string; icon: Component }[] = [
  { key: 'endossante', label: 'Endossante', icon: Building2 },
  { key: 'endossatario', label: 'Endossatário', icon: Handshake },
];

const step = ref(0);

function clonePadrao(key: string): PessoaMinuta {
  const data = CREDORAS_PADRAO[key];
  return data ? (JSON.parse(JSON.stringify(data)) as PessoaMinuta) : emptyPessoaMinuta('JURIDICA');
}

const endossantePadrao = ref('BMP');
const endossante = ref<PessoaMinuta>(clonePadrao('BMP'));
const endossanteDoc = ref('');
const endossanteContato = ref('');
const endossanteEndereco = ref('');
const endossanteRep = ref('');

const endossatarioPadrao = ref('Ceres Securitizadora');
const endossatario = ref<PessoaMinuta>(clonePadrao('Ceres Securitizadora'));
const endossatarioDoc = ref('');
const endossatarioContato = ref('');
const endossatarioEndereco = ref('');
const endossatarioRep = ref('');

function gerar() {
  emit('confirm');
  emit('close');
}
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      z-index: 400;
      background: rgba(8, 60, 74, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    "
    @click.self="emit('close')"
  >
    <div
      style="
        width: 100%;
        max-width: 960px;
        max-height: calc(100vh - 64px);
        background: var(--surface-card);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Gerar Termo de Endosso
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            CCB · {{ solicitacao.id }}
          </p>
        </div>
        <button
          aria-label="Fechar"
          class="flex items-center justify-center"
          style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--surface-sunken); border: none; cursor: pointer; color: var(--text-muted)"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <MinutaStepper :steps="STEPS" :current="step" @select="step = $event" />

      <div style="flex: 1; overflow-y: auto; padding: 24px 28px">
        <CredoraStep
          v-if="step === 0"
          v-model:credora-padrao="endossantePadrao"
          v-model:form="endossante"
          v-model:doc-busca="endossanteDoc"
          v-model:contato="endossanteContato"
          v-model:endereco="endossanteEndereco"
          v-model:representante="endossanteRep"
          :padrao-options="CREDORA_PADRAO_OPTS_NC_CCB"
        />
        <EndossatarioStep
          v-else
          v-model:endossatario-padrao="endossatarioPadrao"
          v-model:form="endossatario"
          v-model:doc-busca="endossatarioDoc"
          v-model:contato="endossatarioContato"
          v-model:endereco="endossatarioEndereco"
          v-model:representante="endossatarioRep"
        />
      </div>

      <div class="flex items-center justify-between" style="padding: 16px 28px; border-top: 1px solid var(--border-default)">
        <button
          v-if="step === 0"
          type="button"
          style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-weight: var(--weight-semibold); font-size: var(--text-sm)"
          @click="emit('close')"
        >
          Cancelar
        </button>
        <button
          v-else
          type="button"
          style="background: none; border: none; cursor: pointer; color: var(--gci-base); font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
          @click="step = 0"
        >
          VOLTAR
        </button>

        <button
          v-if="step === 0"
          type="button"
          class="btn-animated btn-primary"
          style="
            height: 44px;
            padding: 0 24px;
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.08em;
          "
          @click="step = 1"
        >
          PRÓXIMO
        </button>
        <button
          v-else
          type="button"
          class="btn-animated btn-primary"
          style="
            height: 44px;
            padding: 0 24px;
            background: var(--action-primary-bg);
            color: var(--action-primary-text);
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            font-weight: var(--weight-bold);
            font-size: var(--text-xs);
            letter-spacing: 0.08em;
          "
          @click="gerar"
        >
          GERAR
        </button>
      </div>
    </div>
  </div>
</template>

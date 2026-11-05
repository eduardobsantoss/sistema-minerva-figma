<script setup lang="ts">
import { ref } from 'vue';
import { Building2, Handshake } from 'lucide-vue-next';
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
import AdminButton from '@/components/ui/AdminButton.vue';
import AdminModal from '@/components/ui/AdminModal.vue';

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
  <AdminModal size="lg" eyebrow="Solicitação" title="Gerar Termo de Endosso" :subtitle="`CCB · ${solicitacao.id}`" @close="emit('close')">
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

    <template #footer>
      <AdminButton variant="ghost" size="large" v-if="step === 0" @click="emit('close')" type="button">Cancelar</AdminButton>
      <AdminButton variant="ghost" size="large" v-else @click="step = 0" type="button">Voltar</AdminButton>
      <div class="flex items-center" style="gap: 12px">

        <AdminButton variant="primary" size="large" v-if="step === 0" @click="step = 1" type="button">Próximo</AdminButton>
        <AdminButton variant="primary" size="large" v-else @click="gerar" type="button">Gerar</AdminButton>

      </div>
    </template>
  </AdminModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PosCockpit from './PosCockpit.vue';
import PosClienteScreen from './PosClienteScreen.vue';
import PosCessaoScreen from './PosCessaoScreen.vue';
import { RECORTE_POS_INICIAL, type RecortePos } from '../data/gerencialData';

const clienteId = ref<string | null>(null);
const cessaoId = ref<string | null>(null);
const recorte = ref<RecortePos>({ ...RECORTE_POS_INICIAL });

function abrir(payload: { grupoId: string; recorte: RecortePos }) {
  recorte.value = payload.recorte;
  clienteId.value = payload.grupoId;
  cessaoId.value = null;
}
</script>

<template>
  <PosCockpit v-show="!clienteId" @open="abrir" />
  <PosCessaoScreen
    v-if="clienteId && cessaoId"
    :grupo-id="clienteId"
    :cessao-id="cessaoId"
    @back="cessaoId = null"
  />
  <PosClienteScreen
    v-else-if="clienteId"
    :grupo-id="clienteId"
    :recorte="recorte"
    @back="clienteId = null"
    @open-cessao="cessaoId = $event"
  />
</template>

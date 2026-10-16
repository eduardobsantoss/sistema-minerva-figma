<script setup lang="ts">
import { computed, ref } from 'vue';
import GerencialCockpit from './GerencialCockpit.vue';
import GrupoGerencialScreen from './GrupoGerencialScreen.vue';
import TitulosCessaoPanel from '../components/TitulosCessaoPanel.vue';
import { RECORTE_GERENCIAL_INICIAL, cessaoPorId, veiculoPorId, type RecorteGerencial } from '../data/gerencialData';

const grupoId = ref<string | null>(null);
const cessaoId = ref<string | null>(null);
const recorte = ref<RecorteGerencial>({ ...RECORTE_GERENCIAL_INICIAL });
const cessaoAtual = computed(() => (cessaoId.value ? cessaoPorId(cessaoId.value) : undefined));

function abrir(payload: { grupoId: string; recorte: RecorteGerencial }) {
  recorte.value = payload.recorte;
  grupoId.value = payload.grupoId;
  cessaoId.value = null;
}
</script>

<template>
  <TitulosCessaoPanel
    v-if="cessaoAtual"
    :cessao="cessaoAtual"
    :veiculo-nome="veiculoPorId(cessaoAtual.veiculoId)?.nome ?? ''"
    @close="cessaoId = null"
  />
  <GrupoGerencialScreen
    v-else-if="grupoId"
    :grupo-id="grupoId"
    :recorte="recorte"
    @back="grupoId = null"
    @open-cessao="cessaoId = $event"
  />
  <GerencialCockpit v-else @open="abrir" />
</template>

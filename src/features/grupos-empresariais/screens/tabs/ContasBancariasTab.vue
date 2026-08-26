<script setup lang="ts">
import { reactive } from 'vue';
import { Star, Trash2 } from 'lucide-vue-next';
import FormField from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/FormField.vue';
import SelectField from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/SelectField.vue';
import StepGrid from '@/features/solicitacao-operacao/components/modals/adicionar-contrato/StepGrid.vue';
import { BANCO_GRUPO_OPTS, type ContaBancariaGrupo } from '../../data/gruposCadastroData';

const props = defineProps<{ contas: ContaBancariaGrupo[] }>();
const emit = defineEmits<{
  add: [conta: ContaBancariaGrupo];
  remove: [id: string];
  setPrincipal: [id: string];
}>();

const draft = reactive({
  banco: BANCO_GRUPO_OPTS[0] ?? '',
  agencia: '',
  conta: '',
  titular: '',
});

function cadastrar() {
  if (!draft.banco || !draft.agencia.trim() || !draft.conta.trim() || !draft.titular.trim()) return;
  emit('add', {
    id: `cc-${Date.now()}`,
    banco: draft.banco,
    agencia: draft.agencia.trim(),
    conta: draft.conta.trim(),
    titular: draft.titular.trim(),
    principal: props.contas.length === 0,
  });
  draft.agencia = '';
  draft.conta = '';
  draft.titular = '';
}

function excluir(id: string) {
  if (!window.confirm('Excluir esta conta bancária?')) return;
  emit('remove', id);
}
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--surface-card); padding: 20px">
      <StepGrid>
        <SelectField v-model="draft.banco" label="Banco" :options="[...BANCO_GRUPO_OPTS]" :span="4" />
        <FormField v-model="draft.agencia" label="Agência" :span="2" />
        <FormField v-model="draft.conta" label="Conta" :span="3" />
        <FormField v-model="draft.titular" label="Titularidade da conta bancária" :span="3" />
      </StepGrid>
      <div class="flex justify-end" style="margin-top: 14px">
        <button
          type="button"
          style="height: 40px; padding: 0 18px; background: var(--action-primary-bg); color: #fff; border: none; border-radius: var(--radius-lg); cursor: pointer; font-weight: var(--weight-bold); font-size: var(--text-xs); letter-spacing: 0.08em"
          @click="cadastrar"
        >
          CADASTRAR
        </button>
      </div>
    </div>

    <div
      v-if="contas.length === 0"
      style="padding: 40px; text-align: center; font-size: var(--text-sm); color: var(--text-muted); background: var(--surface-sunken); border-radius: var(--radius-xl); border: 1px dashed var(--border-default)"
    >
      Nenhuma conta bancária cadastrada.
    </div>
    <div
      v-else
      style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden; background: var(--surface-card)"
    >
      <div class="grid items-center" style="grid-template-columns: auto 1.4fr 0.8fr 0.9fr 1.4fr auto; padding: 12px 20px; background: var(--surface-sunken); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: 0.10em; color: var(--text-muted); text-transform: uppercase">
        <div>Principal</div>
        <div>Nome</div>
        <div>Agência</div>
        <div>Número</div>
        <div>Titularidade</div>
        <div style="text-align: right">Ação</div>
      </div>
      <div
        v-for="c in contas"
        :key="c.id"
        class="grid items-center"
        style="grid-template-columns: auto 1.4fr 0.8fr 0.9fr 1.4fr auto; padding: 14px 20px; border-top: 1px solid var(--border-default); font-size: var(--text-sm)"
      >
        <div>
          <button
            type="button"
            :aria-label="c.principal ? 'Conta principal' : 'Definir como principal'"
            class="flex items-center justify-center"
            :style="{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: c.principal ? 'var(--agro-base)' : 'var(--text-muted)',
            }"
            @click="emit('setPrincipal', c.id)"
          >
            <Star :size="16" :fill="c.principal ? 'currentColor' : 'none'" />
          </button>
        </div>
        <div style="font-weight: var(--weight-semibold); color: var(--text-strong)">{{ c.banco }}</div>
        <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">{{ c.agencia }}</div>
        <div style="font-variant-numeric: tabular-nums; color: var(--text-default)">{{ c.conta }}</div>
        <div style="color: var(--text-default)">{{ c.titular }}</div>
        <div class="flex justify-end">
          <button type="button" aria-label="Excluir conta" class="flex items-center justify-center" style="width: 32px; height: 32px; border-radius: var(--radius-md); background: none; border: 1px solid var(--border-default); cursor: pointer; color: var(--action-danger-text-only)" @click="excluir(c.id)">
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

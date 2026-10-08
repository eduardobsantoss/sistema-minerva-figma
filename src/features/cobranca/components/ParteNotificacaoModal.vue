<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { Plus, Star, Trash2, X } from 'lucide-vue-next';
import SegmentedToggle from '@/components/ui/SegmentedToggle.vue';
import ToggleRow from '@/features/risco/screens/detail-tabs/shared/ToggleRow.vue';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue';
import { useToast } from '@/composables/useToast';
import {
  DDI_OPTS,
  usePartesNotificacao,
  type ContatoSacado,
  type ParteNotificacao,
} from '../composables/usePartesNotificacao';

const props = withDefaults(
  defineProps<{
    parte: ParteNotificacao;
    nome: string;
    documento: string;
    /** Operação da cessão aberta, destacada na lista. */
    operacaoId?: string;
    initialTab?: 'notificacoes' | 'contatos';
  }>(),
  { initialTab: 'notificacoes' },
);
const emit = defineEmits<{ close: [] }>();

const toast = useToast();
const store = usePartesNotificacao();

const ehCedente = computed(() => props.parte === 'cedente');
const tab = ref<'notificacoes' | 'contatos'>(ehCedente.value ? 'notificacoes' : props.initialTab);

const operacoes = computed(() => store.operacoesDe(props.parte, props.documento));
const contatos = computed(() => store.contatosDe(props.documento));

const tabOptions = computed(() => [
  { key: 'notificacoes', label: 'Notificações' },
  { key: 'contatos', label: `Contatos (${contatos.value.length})` },
]);

const COLUNAS = computed(() =>
  ehCedente.value
    ? [
        { campo: 'cessao' as const, label: 'Notificação de cessão' },
        { campo: 'cobranca' as const, label: 'Notificação de cobrança' },
      ]
    : [{ campo: 'cessao' as const, label: 'Notificação de cessão' }],
);

function todasAtivas(campo: 'cessao' | 'cobranca') {
  return operacoes.value.length > 0 && operacoes.value.every((o) => o[campo]);
}

function alternarTodas(campo: 'cessao' | 'cobranca', label: string) {
  const ativar = !todasAtivas(campo);
  store.definirTodas(props.parte, props.documento, campo, ativar);
  toast.success(`${label} ${ativar ? 'ativada' : 'desativada'} em todas as operações de ${props.nome}`);
}

function alterar(operacaoId: string, campo: 'cessao' | 'cobranca', label: string, ativa: boolean) {
  const op = store.definirNotificacao(props.parte, props.documento, operacaoId, campo, ativa);
  if (!op) return;
  toast.success(`${label} ${op[campo] ? 'ativada' : 'desativada'} em ${op.nome}`);
}

/* Contatos */
const form = ref({ nome: '', email: '', ddi: '+55', telefone: '' });
const tentouAdicionar = ref(false);
const removendo = ref<ContatoSacado | null>(null);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const erros = computed(() => {
  const f = form.value;
  const e: { nome?: string; email?: string; contato?: string } = {};
  if (!f.nome.trim()) e.nome = 'Informe o nome do contato.';
  if (f.email.trim() && !EMAIL_RE.test(f.email.trim())) e.email = 'Informe um e-mail válido.';
  if (!f.email.trim() && !f.telefone.trim()) e.contato = 'Informe ao menos um e-mail ou um telefone.';
  return e;
});
const formValido = computed(() => Object.keys(erros.value).length === 0);

function adicionar() {
  tentouAdicionar.value = true;
  if (!formValido.value) return;
  const f = form.value;
  const contato = store.adicionarContato(props.documento, {
    nome: f.nome.trim(),
    email: f.email.trim(),
    ddi: f.ddi,
    telefone: f.telefone.trim(),
  });
  toast.success(
    contato.principal
      ? `${contato.nome} adicionado como contato principal`
      : `${contato.nome} adicionado aos contatos`,
  );
  form.value = { nome: '', email: '', ddi: '+55', telefone: '' };
  tentouAdicionar.value = false;
}

function definirPrincipal(c: ContatoSacado) {
  store.definirPrincipal(props.documento, c.id);
  toast.success(`${c.nome} agora é o contato principal`);
}

function confirmarRemocao() {
  const c = removendo.value;
  removendo.value = null;
  if (!c) return;
  store.removerContato(props.documento, c.id);
  toast.success(`${c.nome} removido dos contatos`);
}

function telefoneCompleto(c: ContatoSacado) {
  return c.telefone ? `${c.ddi} ${c.telefone}` : '';
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && !removendo.value) emit('close');
}
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
  <div
    class="flex items-center justify-center"
    style="position: fixed; inset: 0; z-index: 500; background: rgba(8, 60, 74, 0.55); backdrop-filter: blur(8px); padding: 24px"
  >
    <div
      role="dialog"
      aria-modal="true"
      :aria-label="ehCedente ? 'Notificações do cedente' : 'Notificações e contatos do sacado'"
      class="pn-shell"
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px 18px; gap: 16px">
        <div style="min-width: 0">
          <div class="pn-eyebrow">{{ ehCedente ? 'Cedente' : 'Sacado' }}</div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong); margin-top: 4px">
            {{ nome }}
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 2px; font-variant-numeric: tabular-nums">
            {{ documento }}
          </p>
        </div>
        <button type="button" class="pn-close" aria-label="Fechar" @click="emit('close')">
          <X :size="18" />
        </button>
      </div>

      <div v-if="!ehCedente" style="padding: 0 28px 16px">
        <SegmentedToggle
          style="width: fit-content"
          :options="tabOptions"
          :model-value="tab"
          variant="brand"
          @update:model-value="tab = $event as 'notificacoes' | 'contatos'"
        />
      </div>

      <div class="pn-body">
        <!-- Notificações -->
        <template v-if="tab === 'notificacoes'">
          <p class="pn-help">
            Defina, por operação, quais notificações {{ ehCedente ? 'o cedente' : 'o sacado' }} recebe. Cada alteração é
            salva automaticamente.
          </p>

          <div class="pn-section-title">Todas as operações</div>
          <div class="pn-toggles">
            <ToggleRow
              v-for="col in COLUNAS"
              :key="col.campo"
              :label="col.label"
              :hint="`${operacoes.filter((o) => o[col.campo]).length} de ${operacoes.length} operações ativas`"
              :on="todasAtivas(col.campo)"
              @toggle="alternarTodas(col.campo, col.label)"
            />
          </div>

          <div class="pn-section-title" style="margin-top: 22px">Por operação</div>
          <ul class="pn-ops" :aria-label="`Notificações por operação de ${nome}`">
            <li v-for="op in operacoes" :key="op.id" class="pn-op">
              <div class="flex items-center" style="gap: 10px; flex-wrap: wrap">
                <span class="pn-op-name">{{ op.nome }}</span>
                <span v-if="op.id === operacaoId" class="pn-op-tag">Operação desta cessão</span>
              </div>
              <div class="pn-toggles">
                <ToggleRow
                  v-for="col in COLUNAS"
                  :key="col.campo"
                  :label="col.label"
                  :on="op[col.campo]"
                  @toggle="alterar(op.id, col.campo, col.label, !op[col.campo])"
                />
              </div>
            </li>
            <li v-if="!operacoes.length" class="pn-empty">Nenhuma operação vinculada.</li>
          </ul>
        </template>

        <!-- Contatos -->
        <template v-else>
          <p class="pn-help">
            O contato principal recebe as notificações do sacado. Cada alteração é salva automaticamente.
          </p>

          <ul class="pn-contatos" aria-label="Contatos cadastrados">
            <li v-for="c in contatos" :key="c.id" class="pn-contato">
              <div style="min-width: 0; flex: 1 1 220px">
                <div class="flex items-center" style="gap: 8px; flex-wrap: wrap">
                  <span class="pn-op-name">{{ c.nome }}</span>
                  <span v-if="c.principal" class="pn-badge">
                    <Star :size="11" :stroke-width="2.5" aria-hidden="true" /> Contato principal
                  </span>
                </div>
                <div class="pn-contato-info">
                  <span>{{ c.email || 'Sem e-mail' }}</span>
                  <span aria-hidden="true">·</span>
                  <span>{{ telefoneCompleto(c) || 'Sem telefone' }}</span>
                </div>
              </div>
              <div class="flex items-center" style="gap: 8px; flex-wrap: wrap">
                <button v-if="!c.principal" type="button" class="pn-btn" @click="definirPrincipal(c)">
                  <Star :size="14" aria-hidden="true" /> Definir como principal
                </button>
                <button type="button" class="pn-btn pn-btn-danger" @click="removendo = c">
                  <Trash2 :size="14" aria-hidden="true" /> Remover
                </button>
              </div>
            </li>
            <li v-if="!contatos.length" class="pn-empty">
              Nenhum contato cadastrado. Adicione o primeiro abaixo e ele será o contato principal.
            </li>
          </ul>

          <form class="pn-form" novalidate @submit.prevent="adicionar">
            <h3 class="pn-form-title">Novo contato</h3>
            <div class="pn-form-grid">
              <label class="pn-field">
                <span class="pn-label">Nome</span>
                <input v-model="form.nome" class="pn-input" type="text" placeholder="Ex.: Financeiro" autocomplete="off" />
                <span v-if="tentouAdicionar && erros.nome" class="pn-error">{{ erros.nome }}</span>
              </label>
              <label class="pn-field">
                <span class="pn-label">E-mail</span>
                <input v-model="form.email" class="pn-input" type="email" placeholder="contato@empresa.com.br" autocomplete="off" />
                <span v-if="(tentouAdicionar || form.email) && erros.email" class="pn-error">{{ erros.email }}</span>
              </label>
              <label class="pn-field">
                <span class="pn-label">País (DDI)</span>
                <select v-model="form.ddi" class="pn-input">
                  <option v-for="d in DDI_OPTS" :key="d.value" :value="d.value">{{ d.label }}</option>
                </select>
              </label>
              <label class="pn-field">
                <span class="pn-label">Telefone</span>
                <input v-model="form.telefone" class="pn-input" type="tel" placeholder="(11) 99999-0000" autocomplete="off" />
              </label>
            </div>
            <div v-if="tentouAdicionar && erros.contato" class="pn-error" style="margin-top: 8px">{{ erros.contato }}</div>
            <div class="flex justify-end" style="margin-top: 14px">
              <button type="submit" class="pn-primary"><Plus :size="16" aria-hidden="true" /> Adicionar contato</button>
            </div>
          </form>
        </template>
      </div>

      <div class="pn-footer">
        <button type="button" class="pn-secondary" @click="emit('close')">Fechar</button>
      </div>
    </div>

    <ConfirmDeleteModal
      v-if="removendo"
      :title="`Remover ${removendo.nome}?`"
      :description="
        removendo.principal && contatos.length > 1
          ? 'Este é o contato principal. O próximo contato da lista passa a ser o principal.'
          : 'O contato deixa de receber notificações do sacado.'
      "
      @close="removendo = null"
      @confirm="confirmarRemocao"
    />
  </div>
</template>

<style scoped>
.pn-shell {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 780px;
  max-height: calc(100vh - 48px);
  background: var(--surface-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}
.pn-eyebrow {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.pn-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background: var(--surface-sunken);
  border: none;
  border-radius: var(--radius-lg);
  color: var(--text-muted);
  cursor: pointer;
}
.pn-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 4px 28px 20px;
  border-top: 1px solid var(--border-default);
  padding-top: 18px;
}
.pn-help {
  margin: 0 0 14px;
  font-size: var(--text-sm);
  color: var(--text-muted);
  line-height: 1.5;
}
.pn-section-title {
  margin-bottom: 10px;
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.pn-toggles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 10px;
}
.pn-ops {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pn-op {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
}
.pn-op-name {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
  overflow-wrap: anywhere;
}
.pn-op-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: var(--weight-bold);
  color: var(--text-default);
  background: var(--surface-sunken);
  border: 1px solid var(--border-default);
}
.pn-empty {
  padding: 18px 16px;
  font-size: var(--text-sm);
  color: var(--text-muted);
}
.pn-contatos {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pn-contato {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
}
.pn-contato-info {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
  font-size: var(--text-xs);
  color: var(--text-muted);
  overflow-wrap: anywhere;
}
.pn-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: var(--weight-bold);
  color: var(--success-base);
  background: color-mix(in srgb, var(--success-base) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--success-base) 28%, transparent);
}
.pn-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  color: var(--text-strong);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
}
.pn-btn:hover {
  background: var(--surface-sunken);
}
.pn-btn-danger {
  color: var(--danger-base);
}
.pn-form {
  margin-top: 20px;
  padding: 16px;
  background: var(--surface-sunken);
  border-radius: var(--radius-lg);
}
.pn-form-title {
  margin: 0 0 12px;
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--text-strong);
}
.pn-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
@media (max-width: 640px) {
  .pn-form-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
.pn-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.pn-label {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.14em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.pn-input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  color: var(--text-strong);
  font-family: inherit;
}
.pn-error {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--danger-base);
}
.pn-footer {
  display: flex;
  justify-content: flex-end;
  padding: 14px 28px 20px;
  border-top: 1px solid var(--border-default);
}
.pn-secondary,
.pn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 18px;
  border-radius: var(--radius-lg);
  font-weight: var(--weight-bold);
  font-size: var(--text-sm);
  cursor: pointer;
}
.pn-secondary {
  background: var(--surface-card);
  color: var(--text-strong);
  border: 1px solid var(--border-default);
}
.pn-primary {
  background: var(--action-primary-bg);
  color: var(--action-primary-text);
  border: none;
}
.pn-primary:hover {
  background: var(--action-primary-bg-hover);
}
input:focus-visible,
select:focus-visible,
button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>

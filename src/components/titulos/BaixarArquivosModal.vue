<script setup lang="ts">
import { ref } from 'vue';
import { X } from 'lucide-vue-next';

const emit = defineEmits<{ close: [] }>();

const tiposArquivo = ['Boletos', 'Garantias', 'Duplicata', 'Canhoto de Nota', 'Notificação de Cessão'];

const tipoArquivo = ref('');
const enviarSacado = ref(false);
const mensagem = ref('');
</script>

<template>
  <div
    class="flex items-center justify-center"
    style="position: fixed; inset: 0; z-index: 500; background: rgba(8, 60, 74, 0.55); backdrop-filter: blur(8px); padding: 32px"
  >
    <div
      style="width: 100%; max-width: 520px; background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); overflow: hidden"
      @click.stop
    >
      <div class="flex items-start justify-between" style="padding: 24px 28px; border-bottom: 1px solid var(--border-default)">
        <div>
          <h2 style="font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-strong)">
            Baixar arquivos
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px">
            Tipo de arquivo e envio para o sacado
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

      <div class="flex flex-col" style="gap: 16px; padding: 20px 22px">
        <label class="lote-field">
          <span class="lote-label">Tipo de arquivo</span>
          <select v-model="tipoArquivo" class="lote-input" :data-empty="tipoArquivo === ''">
            <option value="" disabled>Selecione</option>
            <option v-for="tipo in tiposArquivo" :key="tipo" :value="tipo">{{ tipo }}</option>
          </select>
        </label>

        <button type="button" class="lote-switch" @click="enviarSacado = !enviarSacado">
          <span>Enviar para o sacado</span>
          <span class="lote-switch-track" :data-on="enviarSacado">
            <span class="lote-switch-knob" />
          </span>
        </button>

        <label class="lote-field">
          <span class="lote-label">Mensagem personalizada</span>
          <textarea
            v-model="mensagem"
            rows="4"
            placeholder="Opcional. Essa mensagem vai no corpo do e-mail."
            class="lote-input"
            style="height: auto; padding: 12px 14px; resize: vertical; font-family: inherit"
          />
        </label>
      </div>

      <div class="lote-footer">
        <button type="button" class="lote-secondary" @click="emit('close')">Cancelar</button>
        <button type="button" class="lote-primary" @click="emit('close')">Baixar arquivos</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
.lote-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--surface-card);
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--text-default);
  text-align: left;
}
.lote-switch-track {
  width: 44px;
  height: 24px;
  border-radius: 9999px;
  background: var(--border-default);
  position: relative;
  flex-shrink: 0;
}
.lote-switch-track[data-on='true'] {
  background: var(--success-base);
}
.lote-switch-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
  transition: left var(--duration-base);
}
.lote-switch-track[data-on='true'] .lote-switch-knob {
  left: 23px;
}
.lote-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 0 22px 20px;
}
.lote-secondary,
.lote-primary {
  height: 40px;
  padding: 0 18px;
  border-radius: var(--radius-lg);
  font-weight: var(--weight-bold);
  font-size: var(--text-sm);
  cursor: pointer;
}
.lote-secondary {
  background: var(--surface-card);
  color: var(--text-strong);
  border: 1px solid var(--border-default);
}
.lote-primary {
  background: var(--action-primary-bg);
  color: var(--action-primary-text);
  border: none;
}
.lote-primary:hover {
  background: var(--action-primary-bg-hover);
}
button:focus-visible,
select:focus-visible,
textarea:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>

import type { Ref } from 'vue';
import { useToast } from '@/composables/useToast';
import type { Titulo } from '../data/titulosData';

function todayBR() {
  return new Date().toLocaleDateString('pt-BR');
}

function plural(n: number, singular: string, pluralText: string) {
  return n === 1 ? singular : pluralText;
}

/** Ações sobre títulos compartilhadas pelas abas de Títulos, Cessão e Títulos aptos para boletar. */
export function useTitulosActions(list: Ref<Titulo[]>) {
  const { success } = useToast();

  function patch(ids: string[], change: (t: Titulo) => Titulo) {
    const set = new Set(ids);
    list.value = list.value.map((t) => (set.has(t.id) ? change(t) : t));
  }

  function gerarBoleto(id: string) {
    patch([id], (t) => ({ ...t, boletoGeradoEm: todayBR() }));
    success('Boleto gerado (mock)');
  }

  function gerarBoletos(ids: string[]) {
    patch(ids, (t) => ({ ...t, boletoGeradoEm: todayBR() }));
    success(`${ids.length} ${plural(ids.length, 'boleto gerado', 'boletos gerados')} (mock)`);
  }

  function notificar(id: string) {
    patch([id], (t) => ({ ...t, ultimaNotificacaoEm: todayBR(), statusNotificacao: 'NOTIFICADO' }));
    success('Notificação enviada (mock)');
  }

  function notificarLote(ids: string[]) {
    patch(ids, (t) => ({ ...t, ultimaNotificacaoEm: todayBR(), statusNotificacao: 'NOTIFICADO' }));
    success(`Notificações disparadas para ${ids.length} ${plural(ids.length, 'título', 'títulos')} (mock)`);
  }

  function confirmar(id: string) {
    patch([id], (t) => ({ ...t, statusConfirmacao: 'CONFIRMADO' }));
    success('Ativo confirmado (mock)');
  }

  function negociar(id: string) {
    patch([id], (t) => ({ ...t, emNegociacao: true }));
    success('Negociação sinalizada');
  }

  function inserirObservacao(ids: string[], texto: string) {
    patch(ids, (t) => ({
      ...t,
      observacoesCobranca: [...(t.observacoesCobranca ?? []), { texto, data: todayBR() }],
    }));
    success(`Observação inserida em ${ids.length} ${plural(ids.length, 'título', 'títulos')}`);
  }

  return { gerarBoleto, gerarBoletos, notificar, notificarLote, confirmar, negociar, inserirObservacao };
}

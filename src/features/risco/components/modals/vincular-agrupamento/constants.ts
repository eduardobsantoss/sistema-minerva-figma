import type { FiltroTipo } from './TransferPanel.vue';

export const FILTRO_OPTS: { key: FiltroTipo; label: string }[] = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'CRA', label: 'CRAs' },
  { key: 'FIDC', label: 'FIDCs' },
];

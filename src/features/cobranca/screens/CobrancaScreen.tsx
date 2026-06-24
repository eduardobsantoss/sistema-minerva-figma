import { useState } from 'react';
import { notificacoes as initialData, type Notificacao } from '../data/cobrancaData';
import { CobrancaListScreen } from './CobrancaListScreen';
import { NovaNotificacaoModal, type NewNotificacaoData } from '../components/NovaNotificacaoModal';

function buildNotificacaoFromForm(data: NewNotificacaoData): Notificacao {
  return {
    id: `notif-${Date.now()}`,
    nome: data.nome || 'Nova Régua',
    metodos: data.metodos,
    intervalosAVencer: data.intervalosAVencer,
    intervalosVencidos: data.intervalosVencidos,
    veiculos: data.veiculos,
    status: 'Ativa',
  };
}

export function CobrancaScreen() {
  const [list, setList] = useState<Notificacao[]>(initialData);
  const [creating, setCreating] = useState(false);

  const handleCreate = (data: NewNotificacaoData) => {
    setList((prev) => [...prev, buildNotificacaoFromForm(data)]);
    setCreating(false);
  };

  const handleToggleStatus = (id: string) => {
    setList((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, status: n.status === 'Ativa' ? 'Inativa' : 'Ativa' }
          : n,
      ),
    );
  };

  return (
    <>
      <CobrancaListScreen
        notificacoes={list}
        onNew={() => setCreating(true)}
        onEdit={() => {
          // Edit opens the create modal pre-filled (future enhancement)
          setCreating(true);
        }}
        onToggleStatus={handleToggleStatus}
      />
      {creating && (
        <NovaNotificacaoModal onClose={() => setCreating(false)} onCreate={handleCreate} />
      )}
    </>
  );
}

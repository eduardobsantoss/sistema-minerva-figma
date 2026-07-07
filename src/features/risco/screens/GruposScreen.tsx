import { useState } from 'react';
import { GruposListScreen } from './GruposListScreen';
import { GrupoDetailScreen } from './GrupoDetailScreen';
import { GRUPOS_SEED } from '../data/riscoData';

type Route = { level: 'list' } | { level: 'detail'; grupoId: string };

export function GruposScreen() {
  const [route, setRoute] = useState<Route>({ level: 'list' });

  if (route.level === 'list') {
    return <GruposListScreen onOpen={(grupoId) => setRoute({ level: 'detail', grupoId })} />;
  }

  const grupo = GRUPOS_SEED.find((g) => g.id === route.grupoId);
  if (!grupo) return <GruposListScreen onOpen={(grupoId) => setRoute({ level: 'detail', grupoId })} />;

  return <GrupoDetailScreen grupo={grupo} onBack={() => setRoute({ level: 'list' })} />;
}

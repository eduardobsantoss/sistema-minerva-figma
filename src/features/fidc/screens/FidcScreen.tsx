import { useState } from 'react';
import { FidcListScreen } from './FidcListScreen';
import { FidcDetailScreen } from './FidcDetailScreen';
import { ClassDetailScreen } from './ClassDetailScreen';
import { TitleDetailScreen } from './TitleDetailScreen';
import { CreateClassModal } from '../components/CreateClassModal';
import { CreateFidcModal, type NewFidcData } from '../components/CreateFidcModal';
import { fidcs as initialFidcs, type Fidc } from '../data/fidcsData';

type Route =
  | { level: 'list' }
  | { level: 'fidc'; fidcId: string }
  | { level: 'class'; fidcId: string; classId: string }
  | { level: 'title'; fidcId: string; classId: string; titleId: string };

function buildFidcFromForm(data: NewFidcData): Fidc {
  return {
    id: `fidc-${Date.now()}`,
    name: data.razaoSocial || data.nomeFantasia || 'NOVO FIDC',
    cnpj: data.cnpj || '—',
    category: 'MULTICLASSE',
    status: 'EM ANDAMENTO',
    carteira: { valor: 0, titulos: 0 },
    vencido: { valor: 0, titulos: 0 },
    vencendoHoje: 0,
    vencendoMes: 0,
    confirmacaoPct: 0,
    pl: 0,
    plRef: 'R$ 0',
    plRefAgo: 'R$ 0',
    carteiraSummaryTitles: 0,
    classes: [],
  };
}

export function FidcScreen() {
  const [route, setRoute] = useState<Route>({ level: 'list' });
  const [creating, setCreating] = useState(false);
  const [creatingFidc, setCreatingFidc] = useState(false);
  const [fidcList, setFidcList] = useState<Fidc[]>(initialFidcs);

  const handleCreateFidc = (data: NewFidcData) => {
    setFidcList((prev) => [...prev, buildFidcFromForm(data)]);
    setCreatingFidc(false);
  };

  if (route.level === 'list') {
    return (
      <>
        <FidcListScreen
          fidcs={fidcList}
          onOpen={(fidcId) => setRoute({ level: 'fidc', fidcId })}
          onNew={() => setCreatingFidc(true)}
        />
        {creatingFidc && (
          <CreateFidcModal
            onClose={() => setCreatingFidc(false)}
            onCreate={handleCreateFidc}
          />
        )}
      </>
    );
  }

  const fidc = fidcList.find((f) => f.id === route.fidcId);
  if (!fidc) return null;

  if (route.level === 'fidc') {
    return (
      <>
        <FidcDetailScreen
          fidc={fidc}
          onBack={() => setRoute({ level: 'list' })}
          onOpenClass={(classId) =>
            setRoute({ level: 'class', fidcId: fidc.id, classId })
          }
          onOpenTitle={(classId, titleId) =>
            setRoute({ level: 'title', fidcId: fidc.id, classId, titleId })
          }
          onCreateClass={() => setCreating(true)}
        />
        {creating && <CreateClassModal onClose={() => setCreating(false)} />}
      </>
    );
  }

  const klass = fidc.classes.find((c) => c.id === route.classId);
  if (!klass) return null;

  if (route.level === 'class') {
    return (
      <ClassDetailScreen
        fidc={fidc}
        klass={klass}
        onBack={() => setRoute({ level: 'fidc', fidcId: fidc.id })}
        onOpenTitle={(titleId) =>
          setRoute({ level: 'title', fidcId: fidc.id, classId: klass.id, titleId })
        }
      />
    );
  }

  const title = klass.titulos.find((t) => t.id === route.titleId);
  if (!title) return null;

  return (
    <TitleDetailScreen
      fidc={fidc}
      klass={klass}
      title={title}
      onBack={() =>
        setRoute({ level: 'class', fidcId: fidc.id, classId: klass.id })
      }
    />
  );
}

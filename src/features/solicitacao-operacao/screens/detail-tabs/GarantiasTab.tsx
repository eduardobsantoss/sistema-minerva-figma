import { Plus, ShieldCheck } from 'lucide-react';
import { detalheSolicitacao } from '../../data/operacaoData';
import { Section, EmptyState, GhostButton } from './shared';

export function GarantiasTab({ det }: { det: ReturnType<typeof detalheSolicitacao> }) {
  return (
    <Section title="Garantias" action={<GhostButton icon={Plus}>Adicionar garantia</GhostButton>}>
      {det.garantias.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="Nenhuma garantia cadastrada" hint="Adicione garantias reais ou fidejussórias para fortalecer a operação." />
      ) : null}
    </Section>
  );
}

import { Plus, Banknote, ArrowRightLeft, Layers } from 'lucide-react';
import {
  brl, esteiraLabel, detalheSolicitacao,
  type Solicitacao, type ParteTipo,
} from '../../data/operacaoData';
import { CopyButton, Section, Field, Card, EmptyState, GhostButton } from './shared';

const parteTone: Record<ParteTipo, { bg: string; fg: string }> = {
  AVA:  { bg: 'var(--gci-light)',       fg: 'var(--gci-base)' },
  ITA:  { bg: 'var(--status-active-bg)', fg: '#2563EB' },
  SOC:  { bg: 'var(--success-light)',   fg: 'var(--success-dark)' },
  REP:  { bg: 'var(--warning-light)',   fg: 'var(--warning-dark)' },
  CON:  { bg: 'var(--status-active-bg)', fg: '#7C3AED' },
  PROC: { bg: 'var(--gci-light)',       fg: 'var(--gci-base)' },
};
const PARTE_LEGENDA: Record<ParteTipo, string> = {
  AVA: 'Avalista', ITA: 'Interveniente', SOC: 'Sócio', REP: 'Representante',
  CON: 'Cônjuge', PROC: 'Procurador',
};

/** Defaults de exibição quando o mock não trouxe os campos opcionais. */
function display(s: Solicitacao) {
  return {
    unidadeNegocio: s.unidadeNegocio ?? 'Ceres Investimentos',
    documento: s.documento ?? '07.366.063/0001-05',
    banco: s.banco ?? '341 - Itaú Unibanco S.A.',
    agencia: s.agencia ?? '1475-0',
    conta: s.conta ?? '43810-5',
    tipoTaxa: s.tipoTaxa ?? 'Pré-fixado',
    frequencia: s.frequencia ?? 'Mensal',
    fee: s.fee ?? 2,
    valorFee: s.valorFee ?? s.valor * 0.02,
    percSeguro: s.percSeguro ?? 0,
    valorSeguro: s.valorSeguro ?? 0,
    quitacaoVencidos: s.quitacaoVencidos ?? false,
  };
}

export function DadosGeraisTab({
  s, det, onAddParte,
}: {
  s: Solicitacao;
  det: ReturnType<typeof detalheSolicitacao>;
  onAddParte: () => void;
}) {
  const d = display(s);
  return (
    <div className="flex flex-col" style={{ gap: 32 }}>
      {/* Valor em destaque */}
      <div className="flex items-center justify-between" style={{ gap: 16, flexWrap: 'wrap', background: 'var(--gci-base)', borderRadius: 'var(--radius-xl)', padding: '22px 26px', color: '#fff' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.18em', color: 'var(--agro-base)', textTransform: 'uppercase', marginBottom: 8 }}>
            Valor da Operação (Nominal)
          </div>
          <div style={{ fontSize: 32, fontWeight: 'var(--weight-bold)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
            {brl(s.valor)}
          </div>
        </div>
        <div className="flex items-center" style={{ gap: 28, flexWrap: 'wrap' }}>
          <HeroMeta label="Taxa" value={`${s.taxa.toFixed(2).replace('.', ',')}%`} />
          <HeroMeta label="FEE" value={`${d.fee}%`} />
          <HeroMeta label="Valor FEE" value={brl(d.valorFee)} />
        </div>
      </div>

      <Section title="Identificação">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          <Field label="Tipo de Operação" value={s.tipoContrato} />
          <Field label="Unidade de Negócio" value={d.unidadeNegocio} />
          <Field label="Veículo" value={s.veiculo || '—'} />
          <Field label="Grupo Empresarial" value={s.grupoEmpresarial} />
          <Field label="Documento" value={<span className="flex items-center" style={{ gap: 6 }}>{d.documento}<CopyButton value={d.documento} /></span>} />
          <Field label="Gerente" value={s.gerente} />
        </div>
      </Section>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card title="Dados Bancários" icon={Banknote}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            <Field label="Banco" value={d.banco} />
            <Field label="Agência" value={d.agencia} />
            <Field label="Conta" value={d.conta} />
          </div>
        </Card>
        <Card title="Configuração" icon={ArrowRightLeft}>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <Field label="Esteira" value={esteiraLabel(s.esteira)} />
            <Field label="Quitação de Vencidos" value={d.quitacaoVencidos ? 'Sim' : 'Não'} />
          </div>
        </Card>
      </div>

      <Section title="Condições Financeiras">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          <Field label="Tipo de Taxa" value={d.tipoTaxa} />
          <Field label="Frequência" value={d.frequencia} />
          <Field label="Taxa de Operação" value={`${s.taxa.toFixed(2).replace('.', ',')}%`} />
          <Field label="FEE" value={`${d.fee}%`} />
          <Field label="Valor FEE" value={brl(d.valorFee)} />
          <Field label="% Seguro Prestamista" value={`${d.percSeguro}%`} />
          <Field label="Valor Seguro Prestamista" value={brl(d.valorSeguro)} />
        </div>
      </Section>

      <Section title="Agrupamento de Limites">
        {det.limites.length === 0 ? (
          <EmptyState icon={Layers} title="Nenhum limite agrupado" hint="Os agrupamentos de limite aparecerão aqui quando vinculados a esta solicitação." />
        ) : null}
      </Section>

      <Section title="Partes Relacionadas" action={<GhostButton icon={Plus} onClick={onAddParte}>Nova parte</GhostButton>}>
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div className="grid" style={{ gridTemplateColumns: '1.6fr 1.1fr 1.4fr 1fr 0.9fr', padding: '12px 16px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            <div>Nome</div><div>Documento</div><div>E-mail</div><div>Telefone</div><div>Tipo</div>
          </div>
          {det.partes.map((p, i) => (
            <div key={`${p.documento}-${i}`} className="grid items-center" style={{ gridTemplateColumns: '1.6fr 1.1fr 1.4fr 1fr 0.9fr', padding: '12px 16px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }}>
              <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{p.nome}</div>
              <div style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{p.documento}</div>
              <div style={{ color: 'var(--text-default)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.email}</div>
              <div style={{ color: 'var(--text-default)', fontVariantNumeric: 'tabular-nums' }}>{p.telefone}</div>
              <div className="flex items-center" style={{ gap: 4, flexWrap: 'wrap' }}>
                {p.tipos.map((t) => (
                  <span key={t} title={PARTE_LEGENDA[t]} style={{ fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em', padding: '3px 7px', borderRadius: 'var(--radius-sm)', background: parteTone[t].bg, color: parteTone[t].fg }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center" style={{ gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
          {(Object.keys(PARTE_LEGENDA) as ParteTipo[]).map((t) => (
            <span key={t} className="flex items-center" style={{ gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: 9, fontWeight: 'var(--weight-bold)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', background: parteTone[t].bg, color: parteTone[t].fg }}>{t}</span>
              {PARTE_LEGENDA[t]}
            </span>
          ))}
        </div>
      </Section>
    </div>
  );
}

function HeroMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-bold)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

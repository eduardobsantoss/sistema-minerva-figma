import { useState } from 'react';
import {
  Wallet, CalendarClock, ChevronDown, ChevronUp, Undo2, Calculator, Pencil, type LucideIcon,
} from 'lucide-react';
import {
  brl, TIPO_PAGAMENTO_OPTS,
  type Title, type DetalhePagamentos, type PagamentoTitulo, type StatusParcela, type ParcelaCronograma,
} from '../../data/fidcsData';
import { SimularValorizacaoModal } from '../../components/modals/SimularValorizacaoModal';
import { EditarParcelasModal } from '../../components/modals/EditarParcelasModal';
import { EstornoPagamentoModal } from '../../components/modals/EstornoPagamentoModal';

interface Props {
  title: Title;
  det: DetalhePagamentos;
  setDet: React.Dispatch<React.SetStateAction<DetalhePagamentos>>;
}

const STATUS_TONE: Record<StatusParcela, { bg: string; fg: string; label: string }> = {
  PAGO:                 { bg: 'var(--success-light)', fg: 'var(--success-dark)', label: 'Pago' },
  PAGO_PARCIAL_VENCIDO: { bg: 'var(--danger-light)',  fg: 'var(--danger-dark)',  label: 'Pago Parcial (Vencido)' },
  DESCONHECIDO:         { bg: 'var(--neutral-100)',   fg: 'var(--text-muted)',   label: 'Desconhecido' },
};

const emptyForm = {
  valorAmortizacao: '', dataPagamento: '', tipoPagamento: '',
  jurosMoratorio: '', multa: '', jurosRemuneratorio: '',
  transferenciaParcial: false, observacao: '',
};

export function PagamentosTab({ title, det, setDet }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [showSimular, setShowSimular] = useState(false);
  const [showEditarParcelas, setShowEditarParcelas] = useState(false);
  const [estornoAlvo, setEstornoAlvo] = useState<number | null>(null);
  const [configOpen, setConfigOpen] = useState(false);

  const totalPago = det.pagamentos.filter((p) => !p.estornado).reduce((acc, p) => acc + p.valorAmortizacao, 0);
  const valorEmAberto = Math.max(title.vrNominal - totalPago, 0);

  const canSalvar = form.valorAmortizacao.trim() !== '' && form.dataPagamento.trim() !== '' && form.tipoPagamento.trim() !== '';

  const handleSalvar = () => {
    if (!canSalvar) return;
    const novo: PagamentoTitulo = {
      data: form.dataPagamento,
      valorAmortizacao: Number(form.valorAmortizacao) || 0,
      tipoPagamento: form.tipoPagamento as PagamentoTitulo['tipoPagamento'],
      jurosRemuneratorio: Number(form.jurosRemuneratorio) || 0,
      jurosMoratorio: Number(form.jurosMoratorio) || 0,
      multa: Number(form.multa) || 0,
      desconto: 0,
      observacao: form.observacao || undefined,
    };
    setDet((prev) => ({ ...prev, pagamentos: [novo, ...prev.pagamentos] }));
    setForm(emptyForm);
  };

  const handleEstorno = (justificativa: string) => {
    if (estornoAlvo === null) return;
    setDet((prev) => ({
      ...prev,
      pagamentos: prev.pagamentos.map((p, i) =>
        i === estornoAlvo ? { ...p, estornado: true, justificativaEstorno: justificativa } : p,
      ),
    }));
    setEstornoAlvo(null);
  };

  return (
    <div className="flex flex-col" style={{ gap: 28 }}>
      {/* Header context */}
      <div className="flex items-center justify-end" style={{ gap: 32, flexWrap: 'wrap' }}>
        <HeaderStat label="Valor em aberto" value={brl(valorEmAberto)} />
        <HeaderStat label="Juros remuneratórios em aberto" value={brl(det.jurosRemuneratorioAberto)} />
      </div>

      {/* Registrar Pagamento — sempre visível (mesmo padrão do compositor da Ata de Deliberação) */}
      <Section title="Registrar Pagamento">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <FormField label="Valor de amortização" placeholder="R$ 0,00" value={form.valorAmortizacao} onChange={(e) => setForm((p) => ({ ...p, valorAmortizacao: e.target.value }))} />
          <FormField label="Data de pagamento" placeholder="dd/mm/aaaa" value={form.dataPagamento} onChange={(e) => setForm((p) => ({ ...p, dataPagamento: e.target.value }))} />
          <SelectField label="Tipo de pagamento" options={TIPO_PAGAMENTO_OPTS} placeholder="Selecione" value={form.tipoPagamento} onChange={(v) => setForm((p) => ({ ...p, tipoPagamento: v }))} />
          <FormField label="Juros moratório" placeholder="R$ 0,00" value={form.jurosMoratorio} onChange={(e) => setForm((p) => ({ ...p, jurosMoratorio: e.target.value }))} />
          <FormField label="Multa" placeholder="R$ 0,00" value={form.multa} onChange={(e) => setForm((p) => ({ ...p, multa: e.target.value }))} />
          <FormField label="Juros remuneratório" placeholder="R$ 0,00" value={form.jurosRemuneratorio} onChange={(e) => setForm((p) => ({ ...p, jurosRemuneratorio: e.target.value }))} />
          <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'flex-end' }}>
            <ToggleRow label="Transferência parcial" on={form.transferenciaParcial} onToggle={() => setForm((p) => ({ ...p, transferenciaParcial: !p.transferenciaParcial }))} />
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <FormField label="Observação" placeholder="—" value={form.observacao} onChange={(e) => setForm((p) => ({ ...p, observacao: e.target.value }))} />
        </div>
        <div className="flex items-center justify-end" style={{ marginTop: 16 }}>
          <button
            onClick={handleSalvar}
            disabled={!canSalvar}
            style={{
              height: 42, padding: '0 24px', border: 'none', borderRadius: 'var(--radius-lg)',
              cursor: canSalvar ? 'pointer' : 'not-allowed',
              fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em',
              background: canSalvar ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
              color: canSalvar ? '#fff' : 'var(--text-disabled)',
              transition: 'background var(--duration-base)',
            }}
          >
            SALVAR
          </button>
        </div>
      </Section>

      {/* Histórico de Pagamentos */}
      <Section title="Histórico de Pagamentos">
        {det.pagamentos.length === 0 ? (
          <EmptyState icon={Wallet} title="Nenhum pagamento registrado" hint="Use o formulário acima para registrar baixas manuais deste título." />
        ) : (
          <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div className="grid" style={{ gridTemplateColumns: '0.9fr 1fr 1.3fr 1.1fr 1fr 0.8fr 0.8fr 0.6fr', padding: '10px 16px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <div>Data</div><div>Val. Amortização</div><div>Tipo pagamento</div><div>Val. Juros Rem.</div><div>Val. Juros Mor.</div><div>Val. Multa</div><div>Val. Desconto</div><div style={{ textAlign: 'right' }}>Estornar</div>
            </div>
            {det.pagamentos.map((p, i) => (
              <div
                key={i}
                className="grid items-center"
                style={{
                  gridTemplateColumns: '0.9fr 1fr 1.3fr 1.1fr 1fr 0.8fr 0.8fr 0.6fr', padding: '12px 16px',
                  borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)',
                  opacity: p.estornado ? 0.5 : 1,
                }}
              >
                <div style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{p.data}</div>
                <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums', textDecoration: p.estornado ? 'line-through' : 'none' }}>{brl(p.valorAmortizacao)}</div>
                <div style={{ color: 'var(--text-default)' }}>{p.tipoPagamento}</div>
                <div style={{ fontVariantNumeric: 'tabular-nums' }}>{brl(p.jurosRemuneratorio)}</div>
                <div style={{ fontVariantNumeric: 'tabular-nums' }}>{brl(p.jurosMoratorio)}</div>
                <div style={{ fontVariantNumeric: 'tabular-nums' }}>{brl(p.multa)}</div>
                <div style={{ fontVariantNumeric: 'tabular-nums' }}>{brl(p.desconto)}</div>
                <div className="flex justify-end">
                  <button
                    aria-label="Estornar pagamento"
                    title={p.estornado ? 'Pagamento já estornado' : 'Estornar pagamento'}
                    disabled={p.estornado}
                    onClick={() => setEstornoAlvo(i)}
                    className="flex items-center justify-center"
                    style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'none', border: '1px solid var(--border-default)', cursor: p.estornado ? 'not-allowed' : 'pointer', color: p.estornado ? 'var(--text-disabled)' : 'var(--action-danger-text-only)' }}
                  >
                    <Undo2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Configuração do Título — somente leitura */}
      <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <button
          onClick={() => setConfigOpen((v) => !v)}
          className="flex items-center justify-between"
          style={{ width: '100%', padding: '14px 18px', background: 'var(--surface-sunken)', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}
        >
          Configuração do Título — {det.configuracao.tipoCalculo}
          {configOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {configOpen && (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, padding: 20 }}>
            <Field label="Emissão" value={title.emissao} />
            <Field label="Valor Emissão" value={brl(det.configuracao.valorEmissao)} />
            <Field label="Vencimento final" value={det.configuracao.vencimentoFinal} />
            <Field label="Taxa" value={det.configuracao.taxa} />
            <Field label="Frequência da taxa" value={det.configuracao.frequenciaTaxa} />
            <Field label="Tipo de capitalização" value={det.configuracao.tipoCapitalizacao} />
            <Field label="Base de dias para cálculo" value={det.configuracao.baseDias} />
            <Field label="Fluxo de amortização" value={det.configuracao.fluxoAmortizacao} />
            <Field label="Fluxo de juros" value={det.configuracao.fluxoJuros} />
          </div>
        )}
      </div>

      {/* Cronograma de Pagamentos */}
      <Section
        title="Cronograma de Pagamentos"
        action={
          <div className="flex items-center" style={{ gap: 10 }}>
            <GhostButton icon={Calculator} onClick={() => setShowSimular(true)}>Simular valorização</GhostButton>
            <GhostButton icon={Pencil} onClick={() => setShowEditarParcelas(true)}>Editar parcelas</GhostButton>
          </div>
        }
      >
        {det.cronograma.length === 0 ? (
          <EmptyState icon={CalendarClock} title="Nenhum pagamento esperado encontrado" hint="O cronograma será exibido aqui assim que houver parcelas programadas para este título." />
        ) : (
          <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1.3fr 1.2fr 1.2fr', padding: '10px 16px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <div>Vencimento</div><div>Status</div><div>Total Esperado (PMT)</div><div style={{ textAlign: 'right' }}>Em Aberto</div>
            </div>
            {det.cronograma.map((c, i) => {
              const tone = STATUS_TONE[c.status];
              return (
                <div key={i} className="grid items-center" style={{ gridTemplateColumns: '1fr 1.3fr 1.2fr 1.2fr', padding: '12px 16px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }}>
                  <div style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{c.vencimento}</div>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.06em', padding: '4px 10px', borderRadius: '9999px', background: tone.bg, color: tone.fg, textTransform: 'uppercase' }}>{tone.label}</span>
                  </div>
                  <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{brl(c.totalEsperado)}</div>
                  <div style={{ textAlign: 'right', fontWeight: 'var(--weight-bold)', color: c.emAberto > 0 ? 'var(--warning-dark)' : 'var(--success-dark)', fontVariantNumeric: 'tabular-nums' }}>{brl(c.emAberto)}</div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {showSimular && (
        <SimularValorizacaoModal
          title={title}
          cronograma={det.cronograma}
          onClose={() => setShowSimular(false)}
        />
      )}

      {showEditarParcelas && (
        <EditarParcelasModal
          cronograma={det.cronograma}
          onClose={() => setShowEditarParcelas(false)}
          onUpdate={(cronograma: ParcelaCronograma[]) => {
            setDet((prev) => ({ ...prev, cronograma }));
            setShowEditarParcelas(false);
          }}
        />
      )}

      {estornoAlvo !== null && (
        <EstornoPagamentoModal
          pagamento={det.pagamentos[estornoAlvo]}
          onClose={() => setEstornoAlvo(null)}
          onConfirm={handleEstorno}
        />
      )}
    </div>
  );
}

/* ─── Primitivas locais (padrão replicado dos demais arquivos) ────── */

function HeaderStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 16, gap: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase' }}>{title}</div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{value}</div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, hint }: { icon: LucideIcon; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center" style={{ gap: 10, padding: '48px 24px', textAlign: 'center', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-default)' }}>
      <Icon size={30} strokeWidth={1.5} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-default)' }}>{title}</div>
      {hint && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', maxWidth: 360 }}>{hint}</div>}
    </div>
  );
}

function GhostButton({ icon: Icon, onClick, children }: { icon: LucideIcon; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex items-center" style={{ gap: 8, height: 38, padding: '0 16px', background: 'var(--surface-card)', color: 'var(--text-strong)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em' }}>
      <Icon size={15} />{children}
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
      {children}
    </div>
  );
}

function Input({ style, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...rest}
      style={{
        width: '100%', height: 40, padding: '0 14px',
        background: 'var(--surface-card)', border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)', outline: 'none',
        fontSize: 'var(--text-sm)', color: 'var(--text-strong)',
        ...style,
      }}
    />
  );
}

function FormField({ label, placeholder, value, onChange }: {
  label: string; placeholder?: string; value?: string; onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <Input placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}

function SelectField({ label, options, placeholder, value, onChange }: {
  label?: string; options: string[]; placeholder?: string; value?: string; onChange?: (v: string) => void;
}) {
  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        style={{
          width: '100%', height: 40, padding: '0 36px 0 14px',
          background: 'var(--surface-card)', border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)', outline: 'none', cursor: 'pointer',
          fontSize: 'var(--text-sm)', color: value ? 'var(--text-strong)' : 'var(--text-muted)',
          appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
        }}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function ToggleRow({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      className="flex items-center justify-between"
      style={{
        width: '100%', padding: '10px 16px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
        border: `1px solid ${on ? 'var(--success-base)' : 'var(--border-default)'}`,
        background: on ? 'var(--success-light)' : 'var(--surface-card)',
        transition: 'all var(--duration-base)',
      }}
    >
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{label}: {on ? 'Sim' : 'Não'}</span>
      <div style={{ position: 'relative', width: 40, height: 22, borderRadius: '9999px', background: on ? 'var(--success-base)' : 'var(--border-strong)', transition: 'background var(--duration-base)', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 16, height: 16, borderRadius: '9999px', background: '#fff', transition: 'left var(--duration-base)', boxShadow: 'var(--shadow-xs)' }} />
      </div>
    </div>
  );
}

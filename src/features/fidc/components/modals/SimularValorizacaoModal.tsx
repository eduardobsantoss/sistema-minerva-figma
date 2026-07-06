import { useState } from 'react';
import { X, Calculator, Download } from 'lucide-react';
import { brl, type Title, type ParcelaCronograma } from '../../data/fidcsData';

interface Props {
  title: Title;
  cronograma: ParcelaCronograma[];
  onClose: () => void;
}

interface LinhaSimulacao {
  data: string;
  saldoDevedor: number;
  juros: number;
  jurosAcumulado: number;
  valorPresente: number;
  amortizacaoPaga: number;
  jurosPago: number;
  valorPago: number;
  fatorCdi: number;
  fatorTaxa: number;
  fatorTotal: number;
}

function simular(title: Title, cronograma: ParcelaCronograma[]): LinhaSimulacao[] {
  let saldo = title.vrNominal;
  let jurosAcumulado = 0;
  let amortPaga = 0;
  let jurosPago = 0;
  return cronograma.map((c, i) => {
    jurosAcumulado += c.juros;
    saldo = Math.max(saldo - c.amortizacao, 0);
    amortPaga += c.amortizacao;
    jurosPago += c.juros;
    const fatorCdi = 1 + 0.0002 * (i + 1);
    const fatorTaxa = 1 + 0.00035 * (i + 1);
    return {
      data: c.vencimento,
      saldoDevedor: saldo,
      juros: c.juros,
      jurosAcumulado,
      valorPresente: saldo + jurosAcumulado,
      amortizacaoPaga: amortPaga,
      jurosPago,
      valorPago: c.amortizacao + c.juros,
      fatorCdi,
      fatorTaxa,
      fatorTotal: fatorCdi * fatorTaxa,
    };
  });
}

export function SimularValorizacaoModal({ title, cronograma, onClose }: Props) {
  const [dataSimular, setDataSimular] = useState('');
  const [cenarioSimulado, setCenarioSimulado] = useState(false);
  const [linhas, setLinhas] = useState<LinhaSimulacao[] | null>(null);

  const handleSimular = () => setLinhas(simular(title, cronograma));

  const totalJuros = linhas?.at(-1)?.jurosPago ?? 0;
  const totalPago = linhas ? linhas.reduce((acc, l) => acc + l.valorPago, 0) : 0;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(8,60,74,0.55)', backdropFilter: 'blur(8px)',
        zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 32, animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)',
          width: '100%', maxWidth: 1120, height: '86vh',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between" style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-default)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>
              Simular Valorização
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
              Título #{title.numero} · projeção de saldo devedor e juros acumulados
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex items-center justify-center"
            style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', background: 'var(--surface-card)', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          <div className="flex flex-col" style={{ gap: 24 }}>
            <div className="grid items-end" style={{ gridTemplateColumns: '1fr 1fr auto auto', gap: 14 }}>
              <div>
                <FieldLabel>Data para simular</FieldLabel>
                <input
                  type="text" placeholder="dd/mm/aaaa" value={dataSimular} onChange={(e) => setDataSimular(e.target.value)}
                  style={{ width: '100%', height: 40, padding: '0 14px', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }}
                />
              </div>
              <ToggleRow label="Cenário simulado" on={cenarioSimulado} onToggle={() => setCenarioSimulado((v) => !v)} />
              <button
                onClick={handleSimular}
                className="flex items-center"
                style={{ gap: 8, height: 40, padding: '0 20px', background: 'var(--action-primary-bg)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em' }}
              >
                <Calculator size={15} /> SIMULAR
              </button>
              <button
                className="flex items-center"
                style={{ gap: 8, height: 40, padding: '0 18px', background: 'var(--surface-card)', color: 'var(--text-strong)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em' }}
              >
                <Download size={14} /> GERAR CSV
              </button>
            </div>

            {!linhas ? (
              <div className="flex flex-col items-center justify-center" style={{ gap: 10, padding: '48px 24px', textAlign: 'center', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-default)' }}>
                <Calculator size={30} strokeWidth={1.5} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-default)' }}>Nenhuma simulação gerada</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', maxWidth: 360 }}>Informe a data desejada e clique em "Simular" para projetar a valorização do título.</div>
              </div>
            ) : (
              <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <div style={{ minWidth: 1180 }}>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(11, 1fr)', padding: '10px 14px', background: 'var(--surface-sunken)', fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      <div>Data</div><div>Saldo devedor</div><div>Juros</div><div>Juros acum.</div><div>Valor presente</div><div>Amort. paga</div><div>Juros pago</div><div>Valor pago</div><div>Fator CDI</div><div>Fator taxa</div><div>Fator total</div>
                    </div>
                    {linhas.map((l, i) => (
                      <div key={i} className="grid items-center" style={{ gridTemplateColumns: 'repeat(11, 1fr)', padding: '10px 14px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums' }}>
                        <div style={{ color: 'var(--text-muted)' }}>{l.data}</div>
                        <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{brl(l.saldoDevedor)}</div>
                        <div>{brl(l.juros)}</div>
                        <div>{brl(l.jurosAcumulado)}</div>
                        <div>{brl(l.valorPresente)}</div>
                        <div>{brl(l.amortizacaoPaga)}</div>
                        <div>{brl(l.jurosPago)}</div>
                        <div style={{ fontWeight: 'var(--weight-semibold)' }}>{brl(l.valorPago)}</div>
                        <div>{l.fatorCdi.toFixed(6)}</div>
                        <div>{l.fatorTaxa.toFixed(6)}</div>
                        <div>{l.fatorTotal.toFixed(6)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', padding: '14px 20px', borderTop: '1px solid var(--border-default)', background: 'var(--surface-sunken)' }}>
                  <FooterTotal label="Amortização Paga" value={brl(linhas.at(-1)?.amortizacaoPaga ?? 0)} />
                  <FooterTotal label="Juros Pago" value={brl(totalJuros)} />
                  <FooterTotal label="Valor Total Pago" value={brl(totalPago)} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end" style={{ gap: 12, padding: '16px 32px', borderTop: '1px solid var(--border-default)', background: 'var(--surface-card)' }}>
          <button
            onClick={onClose}
            style={{ height: 44, padding: '0 20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)' }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Primitivas locais ────────────────────────────────────────────── */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
      {children}
    </div>
  );
}

function FooterTotal({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 9, fontWeight: 'var(--weight-bold)', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

function ToggleRow({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      className="flex items-center justify-between"
      style={{
        gap: 12, height: 40, padding: '0 14px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
        border: `1px solid ${on ? 'var(--success-base)' : 'var(--border-default)'}`,
        background: on ? 'var(--success-light)' : 'var(--surface-card)',
        transition: 'all var(--duration-base)',
      }}
    >
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{label}</span>
      <div style={{ position: 'relative', width: 36, height: 20, borderRadius: '9999px', background: on ? 'var(--success-base)' : 'var(--border-strong)', transition: 'background var(--duration-base)', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 3, left: on ? 19 : 3, width: 14, height: 14, borderRadius: '9999px', background: '#fff', transition: 'left var(--duration-base)', boxShadow: 'var(--shadow-xs)' }} />
      </div>
    </div>
  );
}

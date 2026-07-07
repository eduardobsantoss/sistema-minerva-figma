import { useMemo, useState } from 'react';
import { ArrowLeft, FileSpreadsheet, ChevronRight, Download, ClipboardCheck } from 'lucide-react';
import {
  GRUPOS_SEED, GERENTES_SEED, STATUS_GRUPO_RELATORIO_OPTS, STATUS_PARECER_RELATORIO_OPTS,
  parecerLabel, parecerColor, statusOperacaoColor,
} from '../data/riscoData';

type ReportKey = 'parecer-credito';

interface ReportDef {
  key: ReportKey;
  title: string;
  description: string;
}

const REPORTS: ReportDef[] = [
  {
    key: 'parecer-credito',
    title: 'Relatório de Parecer de Crédito',
    description: 'Situação do parecer de crédito por grupo empresarial, filtrável por status do grupo, gerente e vencimento do parecer.',
  },
];

interface Filters {
  nomeGrupo: string;
  statusGrupo: string;
  gerente: string;
  statusParecer: string;
}

const EMPTY_FILTERS: Filters = { nomeGrupo: '', statusGrupo: '', gerente: '', statusParecer: '' };

function toCsv(rows: { nome: string; documento: string; statusGrupo: string; gerente: string; parecer: string }[]): string {
  const header = ['Nome do Grupo', 'Documento', 'Status do Grupo', 'Gerente', 'Status do Parecer'];
  const lines = rows.map((r) => [r.nome, r.documento, r.statusGrupo, r.gerente, r.parecer].map((v) => `"${v.replace(/"/g, '""')}"`).join(';'));
  return [header.join(';'), ...lines].join('\n');
}

export function RelatoriosScreen() {
  const [selected, setSelected] = useState<ReportKey | null>(null);
  const [draft, setDraft] = useState<Filters>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<Filters | null>(null);

  const results = useMemo(() => {
    if (!applied) return [];
    return GRUPOS_SEED.filter((g) => {
      if (applied.nomeGrupo && !g.nome.toLowerCase().includes(applied.nomeGrupo.toLowerCase())) return false;
      if (applied.statusGrupo && g.statusOperacao !== applied.statusGrupo) return false;
      if (applied.gerente && g.gerente !== applied.gerente) return false;
      if (applied.statusParecer === 'Vencido' && g.parecerCredito !== 'EXPIRADO') return false;
      if (applied.statusParecer === 'A vencer' && !(g.parecerCredito === 'CONFORME' || g.parecerCredito === 'EXPIRANDO')) return false;
      return true;
    });
  }, [applied]);

  const handleGerar = () => setApplied(draft);

  const handleExportCsv = () => {
    const csv = toCsv(results.map((g) => ({
      nome: g.nome, documento: g.documento, statusGrupo: g.statusOperacao, gerente: g.gerente, parecer: parecerLabel(g.parecerCredito),
    })));
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-parecer-de-credito.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!selected) {
    return (
      <div className="flex flex-col" style={{ gap: 24 }}>
        <div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--accent)', fontWeight: 'var(--weight-bold)', marginBottom: 6 }}>
            Risco
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Relatórios
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
            Selecione um relatório para configurar filtros e exportar.
          </p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {REPORTS.map((r) => (
            <button
              key={r.key}
              onClick={() => { setSelected(r.key); setDraft(EMPTY_FILTERS); setApplied(null); }}
              className="flex flex-col"
              style={{ gap: 14, textAlign: 'left', padding: 22, background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', cursor: 'pointer', transition: 'border-color var(--duration-base)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
            >
              <div className="flex items-center justify-center" style={{ width: 42, height: 42, borderRadius: 'var(--radius-lg)', background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                <ClipboardCheck size={20} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', marginBottom: 6 }}>{r.title}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.5 }}>{r.description}</div>
              </div>
              <div className="flex items-center" style={{ gap: 4, fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: 'var(--accent)', marginTop: 'auto' }}>
                Configurar e exportar <ChevronRight size={14} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const report = REPORTS.find((r) => r.key === selected)!;

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      <div className="flex items-center" style={{ gap: 16 }}>
        <button onClick={() => setSelected(null)} aria-label="Voltar" className="flex items-center justify-center" style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', border: '1px solid var(--border-default)', cursor: 'pointer', color: 'var(--text-strong)', flexShrink: 0 }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--accent)', fontWeight: 'var(--weight-bold)', marginBottom: 4 }}>
            Relatórios · Risco
          </div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>{report.title}</h2>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', background: 'var(--surface-card)', padding: 22 }}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <FilterField label="Nome do grupo">
            <Input placeholder="Buscar por nome" value={draft.nomeGrupo} onChange={(e) => setDraft({ ...draft, nomeGrupo: e.target.value })} />
          </FilterField>
          <FilterField label="Status do grupo">
            <Select value={draft.statusGrupo} onChange={(e) => setDraft({ ...draft, statusGrupo: e.target.value })} options={[...STATUS_GRUPO_RELATORIO_OPTS]} placeholder="Todos" />
          </FilterField>
          <FilterField label="Gerente">
            <Select value={draft.gerente} onChange={(e) => setDraft({ ...draft, gerente: e.target.value })} options={GERENTES_SEED} placeholder="Todos" />
          </FilterField>
          <FilterField label="Status do parecer">
            <Select value={draft.statusParecer} onChange={(e) => setDraft({ ...draft, statusParecer: e.target.value })} options={[...STATUS_PARECER_RELATORIO_OPTS]} placeholder="Todos" />
          </FilterField>
        </div>
        <div className="flex items-center justify-end" style={{ gap: 10, marginTop: 18 }}>
          <button
            onClick={handleGerar}
            className="flex items-center"
            style={{ gap: 8, height: 42, padding: '0 20px', background: 'var(--action-primary-bg)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em' }}
          >
            <FileSpreadsheet size={15} /> GERAR RELATÓRIO
          </button>
        </div>
      </div>

      {/* Resultado */}
      {applied && (
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', background: 'var(--surface-card)', overflow: 'hidden' }}>
          <div className="flex items-center justify-between" style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-default)' }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>
              {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
            </span>
            <button
              onClick={handleExportCsv}
              disabled={results.length === 0}
              className="flex items-center"
              style={{ gap: 6, height: 34, padding: '0 14px', background: 'none', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', cursor: results.length === 0 ? 'not-allowed' : 'pointer', color: results.length === 0 ? 'var(--text-disabled)' : 'var(--text-default)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)' }}
            >
              <Download size={13} /> EXPORTAR CSV
            </button>
          </div>

          {results.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
              Nenhum grupo encontrado para os filtros selecionados.
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '10px 20px', background: 'var(--surface-sunken)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <div>Nome do Grupo</div><div>Documento</div><div>Status do Grupo</div><div>Gerente</div><div>Parecer de Crédito</div>
            </div>
          )}
          {results.map((g) => (
            <div key={g.id} className="grid items-center" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '12px 20px', borderTop: '1px solid var(--border-default)', fontSize: 'var(--text-sm)' }}>
              <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{g.nome}</div>
              <div style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-muted)' }}>{g.documento}</div>
              <div style={{ color: statusOperacaoColor(g.statusOperacao), fontWeight: 'var(--weight-semibold)' }}>{g.statusOperacao}</div>
              <div style={{ color: 'var(--text-default)' }}>{g.gerente}</div>
              <div style={{ color: parecerColor(g.parecerCredito), fontWeight: 'var(--weight-semibold)' }}>{parecerLabel(g.parecerCredito)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.10em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{ width: '100%', height: 38, padding: '0 12px', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }}
    />
  );
}

function Select({ value, onChange, options, placeholder }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[]; placeholder: string }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{ width: '100%', height: 38, padding: '0 12px', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

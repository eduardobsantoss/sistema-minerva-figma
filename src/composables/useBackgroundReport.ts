import { useToast } from '@/composables/useToast';

export interface ReportFile {
  blob: Blob;
  filename: string;
}

export interface EnqueueReportOptions {
  reportName: string;
  /** Ignorado na demonstração — nenhum arquivo é montado nem baixado. */
  buildFile?: () => ReportFile;
  delayMs?: number;
}

const DEFAULT_DELAY_MS = 2500;

const GENERATING_MESSAGE =
  'O relatório está sendo gerado em segundo plano. Você pode continuar usando o sistema normalmente e será avisado quando estiver pronto.';

export function useBackgroundReport() {
  const { info, success } = useToast();

  function enqueueReport(opts: EnqueueReportOptions) {
    info(GENERATING_MESSAGE);

    window.setTimeout(() => {
      success(
        `O relatório “${opts.reportName}” foi concluído (demonstração). Em produção, o download seria disponibilizado aqui.`,
      );
    }, opts.delayMs ?? DEFAULT_DELAY_MS);
  }

  return { enqueueReport };
}

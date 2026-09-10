import { useToast } from '@/composables/useToast';

export interface ReportFile {
  blob: Blob;
  filename: string;
}

export interface EnqueueReportOptions {
  reportName: string;
  buildFile: () => ReportFile;
  delayMs?: number;
}

const DEFAULT_DELAY_MS = 2500;

const GENERATING_MESSAGE =
  'O relatório está sendo gerado em segundo plano. Você pode continuar usando o sistema normalmente e será avisado quando o download estiver pronto.';

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function useBackgroundReport() {
  const { info, success } = useToast();

  function enqueueReport(opts: EnqueueReportOptions) {
    const file = opts.buildFile();

    info(GENERATING_MESSAGE);

    window.setTimeout(() => {
      success({
        message: `O relatório “${opts.reportName}” está pronto para download.`,
        duration: null,
        action: {
          label: 'Download',
          onClick: () => downloadBlob(file.blob, file.filename),
        },
      });
    }, opts.delayMs ?? DEFAULT_DELAY_MS);
  }

  return { enqueueReport };
}

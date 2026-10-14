export function readToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function chartBaseOptions() {
  const muted = readToken('--text-muted');
  const strong = readToken('--text-strong');
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: muted,
          boxWidth: 10,
          boxHeight: 10,
          font: { family: 'Inter', size: 11 },
        },
      },
      tooltip: {
        backgroundColor: strong,
        titleColor: readToken('--surface-page'),
        bodyColor: readToken('--surface-page'),
        padding: 12,
        cornerRadius: 8,
      },
    },
  };
}

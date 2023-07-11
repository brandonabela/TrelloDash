export class ChartOptions {
  static getChartOptions(): object {
    const isLargeScreen = window.innerWidth >= 1600;

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: isLargeScreen ? 'right' : 'bottom',
          labels: {
            font: {
              size: isLargeScreen ? 16 : 12,
            },
          },
        }
      }
    };
  }
}

export class Pagination {
  private static readonly PAGE_WINDOW_SIZE = 5;

  public static getMaxPage(pageEntries: number, totalEntries: number): number {
    return Math.ceil(totalEntries / pageEntries);
  }

  public static getPageWindow(pageIndex: number, pageEntries: number, totalEntries: number): number[] {
    const maxPage = Pagination.getMaxPage(pageEntries, totalEntries);
    const pageWindow: number[] = [];

    let pageStart = Math.max(pageIndex - Math.floor(Pagination.PAGE_WINDOW_SIZE / 2), 1);
    const pageEnd = Math.min(pageStart + Pagination.PAGE_WINDOW_SIZE - 1, maxPage);

    if (pageEnd === maxPage) {
      pageStart = Math.max(pageEnd - Pagination.PAGE_WINDOW_SIZE + 1, 1);
    }

    for (let i = pageStart; i <= pageEnd; i++) {
      pageWindow.push(i);
    }

    return pageWindow;
  }
}

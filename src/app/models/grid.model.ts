export class Grid {
  public cells: Array<Array<number>> = [];

  public constructor(cells: Array<Array<number>>) {
    this.cells = cells;
  }

  public flatten(): Array<number> {
    const cells: Array<number> = [];
    for (let i: number = 0; i < this.cells.length; i++) {
      for (let j: number = 0; j < this.cells[i].length; j++) {
        cells.push((this.cells[i][j] / 255) * 2 - 1); // Map it between -1 and 1.  -1 being originally 0 and 1 being originally 255.
      }
    }
    return cells;
  }
}

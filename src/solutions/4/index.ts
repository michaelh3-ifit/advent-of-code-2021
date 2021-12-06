import { ISolution } from "../solution";
import { processFile } from "../utils/file-reader";

class Board {
  private grid: number[][] = [];
  private map: { [num: number]: { x: number; y: number; marked: boolean } } =
    {};
  constructor(data: string[]) {
    for (let y = 0; y < data.length; y++) {
      const row: number[] = [];
      for (let i = 0; i < data[y].length; i += 3) {
        row.push(Number(data[y].slice(i, i + 2)));
      }
      this.grid.push(row);
      for (let x = 0; x < row.length; x++) {
        this.map[row[x]] = { x, y, marked: false };
      }
    }
  }
  markNumber(num: number): boolean {
    if (this.map[num]) {
      this.map[num].marked = true;
      const isBingo = this.isBingo(num);
      this._hasWon = this._hasWon || isBingo;
      return isBingo;
    }
    return false;
  }
  private _hasWon = false;
  public get HasWon(): boolean {
    return this._hasWon;
  }
  private isBingo(num: number): boolean {
    const { x, y } = this.map[num];
    return (
      this.grid[y].find((val) => !this.map[val].marked) === undefined ||
      this.grid.find((row) => !this.map[row[x]].marked) === undefined
    );
  }
  getUnmarkedSum(): number {
    return Object.keys(this.map).reduce((acc, val) => {
      return acc + (!this.map[Number(val)].marked ? Number(val) : 0);
    }, 0);
  }
}
function assert(value: unknown): asserts value {
  if (value === undefined || value === null) {
    throw new Error("Value must not be undefeined or null");
  }
}

export default class Solution implements ISolution {
  private loadData(data: string[]): {
    boards: Board[];
    calledNumbers: number[];
  } {
    const calledRow = data.shift();
    assert(calledRow);
    const calledNumbers: number[] = calledRow
      .split(",")
      .map((val) => Number(val));
    data.shift(); // remove blank line
    const boards: Board[] = [];
    for (let i = 0; i < data.length; i += 6) {
      boards.push(new Board(data.slice(i, i + 5)));
    }
    return { boards, calledNumbers };
  }
  async GetSolutionA(inputFile: string): Promise<string> {
    const data: string[] = [];
    await processFile(inputFile, (line) => {
      data.push(line);
    });
    const { boards, calledNumbers } = this.loadData(data);

    for (const num of calledNumbers) {
      for (const board of boards) {
        if (board.markNumber(num)) {
          return (board.getUnmarkedSum() * num).toString();
        }
      }
    }
    throw Error("Bingo not found!?");
  }
  async GetSolutionB(inputFile: string): Promise<string> {
    const data: string[] = [];
    await processFile(inputFile, (line) => {
      data.push(line);
    });
    const { boards, calledNumbers } = this.loadData(data);
    let bingoCount = 0;
    for (const num of calledNumbers) {
      for (const board of boards) {
        if (!board.HasWon && board.markNumber(num)) {
          bingoCount++;
          if (bingoCount === boards.length) {
            return (board.getUnmarkedSum() * num).toString();
          }
        }
      }
    }
    throw Error("Bingo not found!?");
  }
}

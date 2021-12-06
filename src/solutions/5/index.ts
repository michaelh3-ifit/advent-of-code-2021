import { ISolution } from "../solution";
import { processFile } from "../utils/file-reader";

interface IPoint {
  x: number;
  y: number;
}
class LineSegment {
  public start: IPoint;
  public end: IPoint;
  public GetIntersectedSquares(): IPoint[] {
    const result: IPoint[] = [{ ...this.start }];
    let { x, y } = { ...this.start };
    while (x !== this.end.x || y !== this.end.y) {
      const deltaX = this.end.x - x;
      const deltaY = this.end.y - y;
      if (deltaX) {
        x = x + deltaX / Math.abs(deltaX);
      }
      if (deltaY) {
        y = y + deltaY / Math.abs(deltaY);
      }
      result.push({ x, y });
    }
    return result;
  }
  constructor(line: string) {
    const coordsToIPoint = (coords: string): IPoint => {
      const [x, y] = coords.split(",").map(Number);
      return { x, y };
    };
    [this.start, this.end] = line.split(" -> ").map(coordsToIPoint);
  }
}
export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
    return this.internalGetSolution(inputFile, true);
  }
  async GetSolutionB(inputFile: string): Promise<string> {
    return this.internalGetSolution(inputFile, false);
  }

  async internalGetSolution(
    inputFile: string,
    excludeDiagonal: boolean
  ): Promise<string> {
    const grid: number[][] = [];
    let count = 0;
    await processFile(inputFile, (line) => {
      const lineSegment = new LineSegment(line);
      if (
        lineSegment.end.x !== lineSegment.start.x &&
        lineSegment.end.y !== lineSegment.start.y &&
        excludeDiagonal
      ) {
        return;
      }
      for (const square of lineSegment.GetIntersectedSquares()) {
        if (!grid[square.y]) {
          grid[square.y] = [];
        }
        if (!grid[square.y][square.x]) {
          grid[square.y][square.x] = 0;
        }
        grid[square.y][square.x]++;
        if (grid[square.y][square.x] === 2) {
          count++;
        }
      }
    });
    return count.toString();
  }
}

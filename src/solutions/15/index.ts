import { ISolution } from "../solution";
import { processFile } from "../utils/file-reader";

// eslint-disable-next-line @typescript-eslint/naming-convention
interface Vector {
  x: number;
  y: number;
}

export default class Solution implements ISolution {
  private getNeighbors(vector: Vector, grid: number[][]): Vector[] {
    const { x, y } = vector;
    const result: Vector[] = [];
    if (x > 0) {
      result.push({ x: x - 1, y });
    }
    if (x < grid[0].length - 1) {
      result.push({ x: x + 1, y });
    }
    if (y > 0) {
      result.push({ x, y: y - 1 });
    }
    if (y < grid.length - 1) {
      result.push({ x, y: y + 1 });
    }
    return result;
  }
  async GetSolutionA(inputFile: string): Promise<string> {
    const grid: number[][] = [];
    await processFile(inputFile, (line) => {
      grid.push(line.split("").map(Number));
    });
    const start: Vector = { x: 0, y: 0 };
    const end: Vector = { x: grid[0].length - 1, y: grid.length -1 };
    const distanceArray: { vector: Vector; distance: number }[] = [
      { vector: start, distance: 0 },
    ];
    const distanceMap: { vector: Vector; distance: number }[][] = Array.from(
      { length: grid.length },
      () => Array.from({ length: grid[0].length })
    );
    const visited: boolean[][] = Array.from({ length: grid.length }, () =>
      Array.from({ length: grid[0].length }, () => false)
    );

    for (let i = 0; i < grid.length * grid[0].length; i++) {
      // get next vector
      const dummyVal = { distance: Number.MAX_VALUE, vector: { x: -1, y: -1 } };
      const next = distanceArray.reduce(
        (acc, curr) => (visited[curr.vector.y][curr.vector.x] || acc.distance < curr.distance ? acc : curr), dummyVal
      );
      visited[next.vector.y][next.vector.x] = true;
      for (const neighbor of this.getNeighbors(next.vector, grid)) {
        const calcDistance = next.distance + grid[neighbor.y][neighbor.x];
        if (distanceMap[neighbor.y][neighbor.x]) {
          distanceMap[neighbor.y][neighbor.x].distance = Math.min(distanceMap[neighbor.y][neighbor.x].distance, calcDistance);
        } else {
          distanceMap[neighbor.y][neighbor.x] = { vector: neighbor, distance: calcDistance };
          distanceArray.push(distanceMap[neighbor.y][neighbor.x]);
        }
      }
    }
    return distanceMap[end.y][end.x].distance.toString();
  }
  async GetSolutionB(inputFile: string): Promise<string> {
    const data: string[] = [];
    await processFile(inputFile, (line) => {
      data.push(line);
    });
    return "";
  }
}

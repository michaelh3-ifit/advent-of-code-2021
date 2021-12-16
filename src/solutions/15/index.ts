import { ISolution } from "../solution";
import { processFile } from "../utils/file-reader";

// eslint-disable-next-line @typescript-eslint/naming-convention
interface Vector {
  x: number;
  y: number;
}
interface INode<T> {
  next: INode<T> | null;
  value: T;
}
class SortedLinkedList<T> {
  private head: INode<T> | null = null;
  constructor(private readonly comparer: (a: T, b: T) => number, ...initialValues: T[]) {
    initialValues.forEach((val) => this.AddItem(val));
  }

  public AddItem(item: T): void {
    const newNode: INode<T> = {
      value: item,
      next: null,
    };
    if (!this.head || this.comparer(newNode.value, this.head.value) < 1) {
      newNode.next = this.head;
      this.head = newNode;
      return;
    }
    let curr = this.head;
    while (curr.next) {
      if (this.comparer(newNode.value, curr.next.value) < 1) {
        newNode.next = curr.next;
        curr.next = newNode;
        return;
      }
      curr = curr.next;
    }
    curr.next = newNode;
  }
  public Pop(): T | null {
    const value = this.head?.value || null;
    this.head = this.head?.next || null;
    return value;
  }
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
  private findShortestPathCost(start: Vector, end: Vector, grid: number[][]): number {
    const distanceArray: SortedLinkedList<{
      vector: Vector;
      distance: number;
    }> = new SortedLinkedList((a, b) => a.distance - b.distance, {
      vector: start,
      distance: 0,
    });
    const distanceMap: { vector: Vector; distance: number }[][] = Array.from(
      { length: grid.length },
      () => Array.from({ length: grid[0].length })
    );
    const visited: boolean[][] = Array.from({ length: grid.length }, () =>
      Array.from({ length: grid[0].length }, () => false)
    );

    for (let i = 0; i < grid.length * grid[0].length; i++) {
      const next = distanceArray.Pop();
      if (!next) throw "Sanity Check!";

      visited[next.vector.y][next.vector.x] = true;
      for (const neighbor of this.getNeighbors(next.vector, grid)) {
        const calcDistance = next.distance + grid[neighbor.y][neighbor.x];
        if (distanceMap[neighbor.y][neighbor.x]) {
          distanceMap[neighbor.y][neighbor.x].distance = Math.min(distanceMap[neighbor.y][neighbor.x].distance, calcDistance);
        } else {
          distanceMap[neighbor.y][neighbor.x] = { vector: neighbor, distance: calcDistance };
          distanceArray.AddItem(distanceMap[neighbor.y][neighbor.x]);
        }
      }
    }
    return distanceMap[end.y][end.x].distance;
  }
  async GetSolutionA(inputFile: string): Promise<string> {
    const grid: number[][] = [];
    await processFile(inputFile, (line) => {
      grid.push(line.split("").map(Number));
    });
    const start: Vector = { x: 0, y: 0 };
    const end: Vector = { x: grid[0].length - 1, y: grid.length - 1 };
    return this.findShortestPathCost(start, end, grid).toString();
  }
  async GetSolutionB(inputFile: string): Promise<string> {
    const grid: number[][] = [];
    await processFile(inputFile, (line) => {
      grid.push(line.split("").map(Number));
    });
    const initialHeight = grid.length;
    const initialWidth = grid[0].length;
    for (let y = 0; y < initialHeight; y++) {
      for (let x = 0; x < initialWidth; x++) {
        for (let xMulti = 1; xMulti <= 4; xMulti++) {
          grid[y][x + xMulti * initialWidth] = ((grid[y][x] + xMulti) % 9) || 9;
        }
      }
      for (let yMulti = 1; yMulti <= 4; yMulti++) {
        grid[y + yMulti * initialHeight] = grid[y].map(
          (val) => (val + yMulti) % 9 || 9
        );
      }
    }
    const start: Vector = { x: 0, y: 0 };
    const end: Vector = { x: grid[0].length - 1, y: grid.length - 1 };
    return this.findShortestPathCost(start, end, grid).toString();
  }
}

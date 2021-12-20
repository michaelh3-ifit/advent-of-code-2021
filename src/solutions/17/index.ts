import { ISolution } from "../solution";
import { processFile } from "../utils/file-reader";

const inputRegex = /x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/;
export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
    let input: string;
    await processFile(inputFile, (line) => {
      input = line;
    });
    const miny = Number(inputRegex.exec(input!)![3]);
    let y = miny;
    let dy = miny;
    for (; dy < 0; y -= dy++) {
      // noop
    }
    return y.toString();
  }
  private testVelocity(
    velocity: { dx: number, dy: number },
    target: { minX: number; maxX: number; minY: number; maxY: number }
  ): boolean {
    let dx = velocity.dx;
    let dy = velocity.dy;
    let currX = 0;
    let currY = 0;
    while (currX <= target.maxX && currY >= target.minY) {
      currX += dx--;
      currY += dy--;
      dx = Math.max(dx, 0);
      if (currX >= target.minX && currX <= target.maxX && currY >= target.minY && currY <= target.maxY) {
        return true;
      }
    }
    return false;
  }
  async GetSolutionB(inputFile: string): Promise<string> {
    let input: string;
    await processFile(inputFile, (line) => {
      input = line;
    });
    const inputData = inputRegex.exec(input!)!.slice(1).map(Number);
    const target = {
      minX: inputData[0],
      maxX: inputData[1],
      minY: inputData[2],
      maxY: inputData[3],
    };

    let minDx = 0;
    for (let x = target.minX; x > 0; x -= minDx++) {
      // noop
    }
    minDx--;
    const maxDx = target.maxX;
    const minDy = target.minY;
    let maxDy = target.minY;
    for (let y = target.minY; y > 0 || maxDy < 0; y -= maxDy++) {
      // noop
    }
    let count = 0;
    for (let dx = minDx; dx <= maxDx; dx++) {
      for (let dy = minDy; dy <= maxDy; dy++) {
        if (this.testVelocity({ dx, dy }, target)) count++;
      }
    }
    return count.toString();
  }
}

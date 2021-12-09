import { ISolution } from "../solution";
import { processFile } from "../utils/file-reader";

export default class Solution implements ISolution {
  private getNodesFactory = (width: number, height: number) => {
    return (x: number, y: number) => {
      const result: { x: number; y: number }[] = [];
      if (x !== 0) {
        result.push({ x: x - 1, y });
      }
      if (x !== width - 1) {
        result.push({ x: x + 1, y });
      }
      if (y !== 0) {
        result.push({ x, y: y - 1 });
      }
      if (y !== height - 1) {
        result.push({ x, y: y + 1 });
      }
      return result;
    };
  };
  async GetSolutionA(inputFile: string): Promise<string> {
    const data: number[][] = [];
    await processFile(inputFile, (line) => {
      data.push(line.split("").map(Number));
    });
    let riskLevels = 0;
    const width = data[0].length;
    const height = data.length;
    const getNodes = this.getNodesFactory(width, height);
    for (let iy = 0; iy < height; iy++) {
      for (let ix = 0; ix < width; ix++) {
        const curr = data[iy][ix];
        const nodes = getNodes(ix, iy);
        if (!nodes.find((value) => data[value.y][value.x] < curr)) {
          riskLevels += 1 + curr;
        }
      }
    }
    return riskLevels.toString();
  }
  async GetSolutionB(inputFile: string): Promise<string> {
    const data: number[][] = [];
    await processFile(inputFile, (line) => {
      data.push(line.split("").map(Number));
    });
    const lowPoints: { x: number; y: number; size: number }[] = [];
    const width = data[0].length;
    const height = data.length;
    const getNodes = this.getNodesFactory(width, height);
    // get lowpoints

    for (let iy = 0; iy < height; iy++) {
      for (let ix = 0; ix < width; ix++) {
        const curr = data[iy][ix];
        const nodes = getNodes(ix, iy);
        if (!nodes.find((value) => data[value.y][value.x] < curr)) {
          lowPoints.push({ x: ix, y: iy, size: 0 });
        }
      }
    }
    const getKey = (point: { x: number; y: number }): string =>
      `${point.x}-${point.y}`;
    for (const basin of lowPoints) {
      const visited: { [key: string]: boolean } = {};
      visited[getKey(basin)] = true;
      const toVisit: { x: number; y: number }[] = [basin];
      while (toVisit.length) {
        const curr = toVisit.pop();
        basin.size++;
        const nodes = getNodes(curr!.x, curr!.y);
        const nodesToAdd = nodes.filter(
          (node) => !visited[getKey(node)] && data[node.y][node.x] !== 9
        );
        for (const node of nodesToAdd) {
          visited[getKey(node)] = true;
        }
        toVisit.push(...nodesToAdd);
      }
    }
    return lowPoints
      .sort((a, b) => b.size - a.size)
      .slice(0, 3)
      .reduce((acc, curr) => acc * curr.size, 1)
      .toString();
  }
}

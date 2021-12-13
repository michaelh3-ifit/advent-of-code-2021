import { ISolution } from "../solution";
import { processFile } from "../utils/file-reader";

class Path extends Array<string> {
  constructor(...items: string[]) {
    super(...items);
  }
  clone(...itemsToAppend: string[]): Path {
    const copy = new Path(...this, ...itemsToAppend);
    copy.VisitedSmallCaveTwice = this.VisitedSmallCaveTwice;
    return copy;
  }
  public VisitedSmallCaveTwice = false;
}
export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
    const data: { [name: string]: string[] } = {};
    await processFile(inputFile, (line) => {
      const nodes = line.split("-");
      if (!data[nodes[0]]) {
        data[nodes[0]] = [];
      }
      data[nodes[0]].push(nodes[1]);
      if (!data[nodes[1]]) {
        data[nodes[1]] = [];
      }
      data[nodes[1]].push(nodes[0]);
    });

    const successfulPaths: string[][] = [];
    const paths: string[][] = data["start"].map((node) => ["start", node]);

    while (paths.length) {
      const path = paths.pop();
      if (!path) {
        throw new Error("Bullshit");
      }
      if (path[path.length - 1] === "end") {
        successfulPaths.push(path);
      } else {
        for (const node of data[path[path.length - 1]]) {
          if (node.toUpperCase() === node || !path.includes(node)) {
            paths.push([...path, node]);
          }
        }
      }
    }
    return successfulPaths.length.toString();
  }
  async GetSolutionB(inputFile: string): Promise<string> {
    const nodeMap: { [name: string]: string[] } = {};
    await processFile(inputFile, (line) => {
      const nodes = line.split("-");
      if (!nodeMap[nodes[0]]) {
        nodeMap[nodes[0]] = [];
      }
      nodeMap[nodes[0]].push(nodes[1]);
      if (!nodeMap[nodes[1]]) {
        nodeMap[nodes[1]] = [];
      }
      nodeMap[nodes[1]].push(nodes[0]);
    });

    const successfulPaths: string[][] = [];
    const potentialPaths: Path[] = nodeMap["start"].map(
      (node) => new Path("start", node)
    );

    while (potentialPaths.length) {
      const currPath = potentialPaths.pop();
      if (!currPath) {
        throw new Error("Bullshit");
      }
      if (currPath[currPath.length - 1] === "end") {
        successfulPaths.push(currPath);
        continue;
      }

      // Go through the tail node's edges and see if we can move to them
      for (const node of nodeMap[currPath[currPath.length - 1]]) {
        if (node === "start") {
          continue;
        }

        // If it's a 'Big cave' we can always visit it or if it's
        // a small cave and we haven't visited it yet, visit it
        if (node.toUpperCase() === node || !currPath.includes(node)) {
          potentialPaths.push(currPath.clone(node));
          continue;
        }

        // If it's a small cave but we've visited it already, but haven't used our 'visit a small cave twice' flag, add it and set flag
        if (!currPath.VisitedSmallCaveTwice) {
          const newPath = currPath.clone(node);
          newPath.VisitedSmallCaveTwice = true;
          potentialPaths.push(newPath);
          continue;
        }
      }
    }
    return successfulPaths.length.toString();
  }
}

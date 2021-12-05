import { ISolution } from "../solution";
import { processFile } from "../utils/file-reader";

export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
    const data: { x: number, y: number }[] = [];
    const folds: string[] = [];
    await processFile(inputFile, (line) => {
      if (line.includes(",")) {
        const point = line.split(",").map(Number);
        data.push({ x: point[0], y: point[1] });
        return;
      }
      if (line.includes("=")) {
        folds.push(line);
      }
    });

    const maxX = data.reduce((acc, curr) => acc = Math.max(acc, curr.x), 0);
    const maxY = data.reduce((acc, curr) => acc = Math.max(acc, curr.y), 0);
    const grid: boolean[][] = new Array(maxY + 1);
    for (let i = 0; i < grid.length; i++) {
      grid[i] = new Array(maxY + 1).fill(false);
    }
    for (const point of data) {
      grid[point.y][point.x] = true;
    }

    const fold = folds[0];
    const foldLine = Number(fold.substring(fold.indexOf("=") + 1));
    const foldTarget = fold.includes("x=") ? "x" : "y";
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i][foldTarget] > foldLine) {
        grid[data[i].y][data[i].x] = false;
        data[i][foldTarget] = foldLine - (data[i][foldTarget] - foldLine);
        if (grid[data[i].y][data[i].x]) {
          data.splice(i, 1);
        } else {
          grid[data[i].y][data[i].x] = true;
        }
      }
    }
    if (foldTarget === "y") {
      grid.splice(foldLine);
    } else {
      grid.forEach((row) => row.splice(foldLine));
    }

    return data.length.toString();
  }
  async GetSolutionB(inputFile: string): Promise<string> {

    const data: { x: number, y: number }[] = [];
    const folds: string[] = [];
    await processFile(inputFile, (line) => {
      if (line.includes(",")) {
        const point = line.split(",").map(Number);
        data.push({ x: point[0], y: point[1] });
        return;
      }
      if (line.includes("=")) {
        folds.push(line);
      }
    });

    const maxX = data.reduce((acc, curr) => acc = Math.max(acc, curr.x), 0);
    const maxY = data.reduce((acc, curr) => acc = Math.max(acc, curr.y), 0);
    const grid: boolean[][] = new Array(maxY + 1);
    for (let i = 0; i < grid.length; i++) {
      grid[i] = new Array(maxX + 1).fill(false);
    }
    for (const point of data) {
      grid[point.y][point.x] = true;
    }

    for (const fold of folds) {
      const foldLine = Number(fold.substring(fold.indexOf("=") + 1));
      const foldTarget = fold.includes("x=") ? "x" : "y";
      for (let i = data.length - 1; i >= 0; i--) {
        if (data[i][foldTarget] > foldLine) {
          grid[data[i].y][data[i].x] = false;
          data[i][foldTarget] = foldLine - (data[i][foldTarget] - foldLine);
          if (grid[data[i].y][data[i].x]) {
            data.splice(i, 1);
          } else {
            grid[data[i].y][data[i].x] = true;
          }
        }
      }
      if (foldTarget === "y") {
        grid.splice(foldLine);
      } else {
        grid.forEach((row) => row.splice(foldLine));
      }
    }

    console.log(grid.map((row) => row.map((spot) => spot ? "#" : ".").join("")).join("\n"));
    return "";
  }
}

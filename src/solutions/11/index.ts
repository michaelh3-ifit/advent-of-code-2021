import { EventEmitter } from "events";
import { ISolution } from "../solution";
import { processFile } from "../utils/file-reader";

class Octopus extends EventEmitter {
  private adjacentOctopi: Octopus[] = [];
  private mostRecentStepId = -1;
  constructor(private powerLevel: number) {
    super();
  }
  public get PowerLevel(): number {
    return this.powerLevel;
  }
  public IncreasePower(stepId: number): void {
    if (this.powerLevel === 0 && this.mostRecentStepId === stepId) {
      return;
    }
    this.mostRecentStepId = stepId;
    this.powerLevel++;
    if (this.powerLevel > 9) {
      this.powerLevel = 0;
      this.emit("Flash", { stepId });
    }
  }
  public AddNeighbor(octopus: Octopus): void {
    if (!this.adjacentOctopi.includes(octopus)) {
      this.adjacentOctopi.push(octopus);
      octopus.on("Flash", (args) => this.IncreasePower(args.stepId));
    }
  }
}

export default class Solution implements ISolution {
  private printGrid(grid: Octopus[][], step: number): void {
    console.log(`========== STEP ${step} ==========`);
    console.log(
      grid
        .map((row) => row.map((octopus) => octopus.PowerLevel).join(""))
        .join("\n")
    );
  }

  private wireupNeightbors(grid: Octopus[][]): void {
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        for (let adjY = y - 1; adjY <= y + 1; adjY++) {
          if (adjY < 0 || adjY >= grid.length) {
            continue; // If the row we're on is outside the grid, skip it
          }
          for (let adjX = x - 1; adjX <= x + 1; adjX++) {
            if (adjX < 0 || adjX >= grid[adjY].length) {
              // if we're outside the bounds of the row, skip this iteration
              continue;
            }
            if (y !== adjY || x !== adjX) {
              grid[y][x].AddNeighbor(grid[adjY][adjX]);
            }
          }
        }
      }
    }
  }

  async GetSolutionA(inputFile: string): Promise<string> {
    const grid: Octopus[][] = [];

    let flashCount = 0;
    const onFlash = (): number => flashCount++;

    await processFile(inputFile, (line) => {
      grid.push(
        line.split("").map((num) => {
          const newOctopus = new Octopus(Number(num));
          newOctopus.on("Flash", onFlash);
          return newOctopus;
        })
      );
    });

    this.wireupNeightbors(grid);

    const TARGET_STEPS = 100;
    for (let step = 0; step < TARGET_STEPS; step++) {
      grid.forEach((row) =>
        row.forEach((octopus) => octopus.IncreasePower(step))
      );
    }

    return flashCount.toString();
  }

  async GetSolutionB(inputFile: string): Promise<string> {
    const grid: Octopus[][] = [];

    const flashCount: { [stepId: number]: number } = {};
    const onFlash = (event: { stepId: number }): void => {
      if (!flashCount[event.stepId]) {
        flashCount[event.stepId] = 0;
      }
      flashCount[event.stepId]++;
    };

    await processFile(inputFile, (line) => {
      grid.push(
        line.split("").map((num) => {
          const newOctopus = new Octopus(Number(num));
          newOctopus.on("Flash", onFlash);
          return newOctopus;
        })
      );
    });

    this.wireupNeightbors(grid);

    const TARGET_STEPS = Number.MAX_SAFE_INTEGER;
    for (let step = 0; step < TARGET_STEPS; step++) {
      grid.forEach((row) =>
        row.forEach((octopus) => octopus.IncreasePower(step))
      );
      if (flashCount[step] === grid.length * grid[0].length) {
        return (step + 1).toString();
      }
    }
    return "Error";
  }
}

import { ISolution } from "../solution";
import { processFile } from "../utils/file-reader";
interface ILocationA {
  depth: number;
  position: number;
}
interface ILocationB extends ILocationA {
  aim: number;
}
export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
    let location: ILocationA = {
      depth: 0,
      position: 0,
    };
    await processFile(inputFile, (line) => {
      location = this.parseCommandA(line, location);
    });

    return (location.depth * location.position).toString();
  }
  parseCommandA(commandInput: string, location: ILocationA): ILocationA {
    const result = { ...location };
    const split = commandInput.split(" ");
    const command = split[0];
    const amount = Number(split[1]);
    switch (command) {
      case "forward":
        result.position += amount;
        break;
      case "down":
        result.depth += amount;
        break;
      case "up":
        result.depth -= amount;
        break;
      default:
        break;
    }
    return result;
  }

  async GetSolutionB(inputFile: string): Promise<string> {
    let location: ILocationB = {
      depth: 0,
      position: 0,
      aim: 0,
    };
    await processFile(inputFile, (line) => {
      location = this.parseCommandB(line, location);
    });

    return (location.depth * location.position).toString();
  }
  parseCommandB(commandInput: string, location: ILocationB): ILocationB {
    const result = { ...location };
    const split = commandInput.split(" ");
    const command = split[0];
    const amount = Number(split[1]);
    switch (command) {
      case "forward":
        result.position += amount;
        result.depth += result.aim * amount;
        break;
      case "down":
        result.aim += amount;
        break;
      case "up":
        result.aim -= amount;
        break;
      default:
        break;
    }
    return result;
  }
}

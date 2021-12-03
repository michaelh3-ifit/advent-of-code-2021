import { ISolution } from "../solution";
import { processFile } from "../utils/file-reader";

export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
    const data = [];
    await processFile(inputFile, (line) => {
      data.push(line);
    });
    return "";
  }
  async GetSolutionB(inputFile: string): Promise<string> {
    const data = [];
    await processFile(inputFile, (line) => {
      data.push(line);
    });
    return "";
  }
}
